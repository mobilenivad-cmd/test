import React, { useState, useCallback } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { PlanItem } from '../types';
import { SparklesIcon, ClockIcon } from './icons';

const Planner: React.FC = () => {
    const [subjects, setSubjects] = useState('');
    const [hours, setHours] = useState('');
    const [plan, setPlan] = useState<PlanItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGeneratePlan = useCallback(async () => {
        if (!subjects || !hours) {
            setError('لطفاً هم دروس و هم ساعات مطالعه را وارد کنید.');
            return;
        }
        setError('');
        setIsLoading(true);
        setPlan([]); // Clear previous plan
        const generatedPlan = await generateStudyPlan(subjects, hours);
        setPlan(generatedPlan);
        setIsLoading(false);
    }, [subjects, hours]);

    const timeSlots = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800">برنامه‌ریزی هوشمند</h1>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">ایجاد برنامه روزانه با کمک AI</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label htmlFor="subjects" className="block text-sm font-medium text-gray-700 mb-1">دروس</label>
                        <input
                            id="subjects"
                            type="text"
                            value={subjects}
                            onChange={(e) => setSubjects(e.target.value)}
                            placeholder="مثال: ریاضی، فیزیک، ادبیات"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                         <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">ساعت مطالعه روزانه</label>
                        <input
                            id="hours"
                            type="number"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            placeholder="مثال: 8"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={handleGeneratePlan}
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors disabled:bg-blue-300"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                           <>
                            <SparklesIcon className="w-5 h-5 ml-2" />
                            <span>ایجاد برنامه</span>
                           </>
                        )}
                    </button>
                </div>
                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md flex-grow overflow-hidden flex flex-col">
                <h2 className="text-xl font-semibold mb-4">جدول زمانی امروز</h2>
                <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                    {isLoading ? (
                         <div className="flex items-center justify-center h-full">
                           <div className="flex items-center space-x-2 space-x-reverse text-gray-500">
                                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <span>در حال ساخت برنامه هوشمند...</span>
                            </div>
                         </div>
                    ) : plan.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>برنامه‌ای ایجاد نشده است. اطلاعات بالا را تکمیل و دکمه ایجاد را بزنید.</p>
                        </div>
                    ) : (
                        <div className="relative">
                            {timeSlots.map(time => (
                                <div key={time} className="flex h-16 border-t border-gray-100">
                                    <span className="text-xs text-gray-400 -mt-2 ml-4">{time}</span>
                                </div>
                            ))}
                            {plan.map((item, index) => {
                                 const [hour, minute] = item.time.split(':').map(Number);
                                 const top = (hour * 60 + minute) / 60 * 4; // 4rem (h-16) per hour
                                 const height = (item.duration / 60 * 4) - 0.25; // Subtract a bit for padding
                                 const isBreak = item.subject.toLowerCase().includes('استراحت');

                                return (
                                    <div
                                        key={index}
                                        className={`absolute right-0 w-[calc(100%-3rem)] p-2 rounded-lg text-white shadow-md flex flex-col justify-center ${isBreak ? 'bg-green-500' : 'bg-indigo-500'}`}
                                        style={{ top: `${top}rem`, height: `${height}rem` }}
                                    >
                                        <p className="font-bold text-sm">{item.subject}</p>
                                        <div className="flex items-center text-xs opacity-80 mt-1">
                                            <ClockIcon className="w-3 h-3 ml-1" />
                                            <span>{item.duration} دقیقه</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Planner;