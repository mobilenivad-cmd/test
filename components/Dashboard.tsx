import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StudySession, Note } from '../types';
import { getStudyTip } from '../services/geminiService';
import { ClockIcon, PlusIcon, TrashIcon, RefreshIcon } from './icons';

interface DashboardProps {
  studySessions: StudySession[];
  notes: Note[];
  addNote: (content: string) => void;
  deleteNote: (id: string) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-xl shadow-md flex items-center space-x-4 space-x-reverse">
        <div className="bg-blue-100 text-blue-600 rounded-full p-3">
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ studySessions, notes, addNote, deleteNote }) => {
    const [counselorTip, setCounselorTip] = useState<string>("");
    const [isLoadingTip, setIsLoadingTip] = useState(true);
    const [newNote, setNewNote] = useState('');

    const fetchTip = useCallback(async () => {
        setIsLoadingTip(true);
        const tip = await getStudyTip();
        setCounselorTip(tip);
        setIsLoadingTip(false);
    }, []);

    useEffect(() => {
        fetchTip();
    }, [fetchTip]);

    const stats = useMemo(() => {
        const totalMinutes = studySessions.reduce((acc, s) => acc + s.duration, 0);
        const totalHours = (totalMinutes / 60).toFixed(1);
        const today = new Date().toISOString().split('T')[0];
        const studyDays = new Set(studySessions.map(s => s.date));
        const dailyAverage = studyDays.size > 0 ? (totalMinutes / studyDays.size / 60).toFixed(1) : '0';
        
        // rudimentary consistency score
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        });
        const consistentDays = last7Days.filter(d => studyDays.has(d)).length;
        const consistency = studyDays.size > 0 ? ((consistentDays / 7) * 100).toFixed(0) : '0';

        return {
            totalHours,
            dailyAverage,
            missions: studySessions.length,
            consistency
        };
    }, [studySessions]);

    const handleAddNote = () => {
        addNote(newNote);
        setNewNote('');
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">داشبورد هوش مصنوعی</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="مجموع مطالعه" value={`${stats.totalHours} ساعت`} icon={<ClockIcon className="w-6 h-6"/>} />
                <StatCard title="میانگین روزانه" value={`${stats.dailyAverage} ساعت`} icon={<ClockIcon className="w-6 h-6"/>} />
                <StatCard title="مأموریت‌های انجام شده" value={`${stats.missions}`} icon={<ClockIcon className="w-6 h-6"/>} />
                <StatCard title="استمرار" value={`% ${stats.consistency}`} icon={<ClockIcon className="w-6 h-6"/>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">برنامه امروز</h2>
                    <div className="text-center text-gray-500 py-8">
                        <p>برنامه‌ای برای امروز تعریف نشده است.</p>
                        <p className="text-sm mt-2">برای ایجاد برنامه به بخش «برنامه‌ریزی» بروید.</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">نکتهٔ مشاور</h2>
                        <button 
                            onClick={fetchTip} 
                            disabled={isLoadingTip}
                            className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-wait transition-colors"
                            aria-label="دریافت نکته جدید"
                        >
                            <RefreshIcon className={`w-5 h-5 ${isLoadingTip ? 'animate-spin' : ''}`}/>
                        </button>
                    </div>
                    <div className="text-gray-600 bg-yellow-50 border-r-4 border-yellow-400 p-4 rounded-lg min-h-[6rem] flex items-center justify-center">
                         {isLoadingTip ? (
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                            </div>
                        ) : (
                            <p>{counselorTip}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">یادداشت‌ها</h2>
                <div className="flex space-x-2 space-x-reverse mb-4">
                    <input 
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                        placeholder="یادداشت جدید..."
                        className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button onClick={handleAddNote} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                        <PlusIcon className="w-5 h-5 ml-1" />
                        افزودن
                    </button>
                </div>
                <div className="space-y-2">
                    {notes.length > 0 ? (
                        notes.map(note => (
                            <div key={note.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-700">{note.content}</p>
                                <button onClick={() => deleteNote(note.id)} className="text-gray-400 hover:text-red-500">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">یادداشتی وجود ندارد.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;