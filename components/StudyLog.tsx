import React, { useState, useMemo } from 'react';
import { StudySession } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface StudyLogProps {
  sessions: StudySession[];
  addSession: (session: Omit<StudySession, 'id'>) => void;
  deleteSession: (id: string) => void;
}

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const StudyLog: React.FC<StudyLogProps> = ({ sessions, addSession, deleteSession }) => {
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    activityName: '',
    duration: '',
    description: '',
  });

  const selectedDaySessions = useMemo(() => {
    return sessions.filter(s => s.date === selectedDate).sort((a,b) => a.id.localeCompare(b.id));
  }, [sessions, selectedDate]);

  const handleAddActivity = () => {
    if (newActivity.activityName && newActivity.duration) {
      addSession({
        date: selectedDate,
        activityName: newActivity.activityName,
        duration: parseInt(newActivity.duration, 10),
        description: newActivity.description,
      });
      setNewActivity({ activityName: '', duration: '', description: '' });
      setIsModalOpen(false);
    }
  };
  
  const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('fa-IR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
      });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">گزارش مطالعاتی</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">انتخاب تاریخ</h2>
        <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border rounded-lg w-full md:w-auto focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
            <div>
                 <h2 className="text-xl font-semibold">فعالیت‌های مطالعاتی</h2>
                 <p className="text-gray-500">{formatDate(selectedDate)}</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors">
                <PlusIcon className="w-5 h-5 ml-2" />
                افزودن فعالیت جدید
            </button>
        </div>
        
        <div className="overflow-x-auto">
          {selectedDaySessions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام فعالیت</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مدت زمان (دقیقه)</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">توضیحات</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {selectedDaySessions.map(session => (
                        <tr key={session.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.activityName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.duration}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.description || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onClick={() => deleteSession(session.id)} className="text-red-600 hover:text-red-900">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-8">هنوز فعالیتی برای این روز اضافه نشده است.</p>
          )}
        </div>
      </div>
      
      {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                  <h2 className="text-2xl font-bold mb-6">افزودن فعالیت جدید</h2>
                  <div className="space-y-4">
                      <input type="text" placeholder="نام فعالیت" value={newActivity.activityName} onChange={(e) => setNewActivity({...newActivity, activityName: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                      <input type="number" placeholder="مدت زمان (دقیقه)" value={newActivity.duration} onChange={(e) => setNewActivity({...newActivity, duration: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                      <textarea placeholder="توضیحات (اختیاری)" value={newActivity.description} onChange={(e) => setNewActivity({...newActivity, description: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-24"></textarea>
                  </div>
                  <div className="mt-6 flex justify-end space-x-2 space-x-reverse">
                      <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">انصراف</button>
                      <button onClick={handleAddActivity} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">ذخیره</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default StudyLog;