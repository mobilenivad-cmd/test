import React, { useState, useCallback } from 'react';
import { View, StudySession, Note } from './types';
import { DashboardIcon, CalendarIcon, ChartIcon, TestIcon, ClockIcon, SparklesIcon, BrainIcon } from './components/icons';
import Dashboard from './components/Dashboard';
import StudyLog from './components/StudyLog';
import AICounselor from './components/AICounselor';
import Progress from './components/Progress';
import Exams from './components/Exams';
import Planner from './components/Planner';
import Pomodoro from './components/Pomodoro';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-right text-base transition-all duration-200 rounded-lg ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
    }`}
  >
    {icon}
    <span className="mr-4">{label}</span>
  </button>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const addStudySession = (session: Omit<StudySession, 'id'>) => {
    setStudySessions(prev => [...prev, { ...session, id: Date.now().toString() }]);
  };
  
  const deleteStudySession = (id: string) => {
    setStudySessions(prev => prev.filter(session => session.id !== id));
  }

  const addNote = (content: string) => {
      if (content.trim()) {
          setNotes(prev => [...prev, { id: Date.now().toString(), content, createdAt: new Date().toISOString() }]);
      }
  };

  const deleteNote = (id: string) => {
      setNotes(prev => prev.filter(note => note.id !== id));
  };
  
  const renderView = useCallback(() => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard studySessions={studySessions} notes={notes} addNote={addNote} deleteNote={deleteNote} />;
      case View.StudyLog:
        return <StudyLog sessions={studySessions} addSession={addStudySession} deleteSession={deleteStudySession} />;
      case View.Planner:
        return <Planner />;
      case View.Progress:
        return <Progress />;
      case View.Exams:
        return <Exams />;
      case View.Pomodoro:
        return <Pomodoro />;
      case View.AICounselor:
        return <AICounselor />;
      default:
        return <Dashboard studySessions={studySessions} notes={notes} addNote={addNote} deleteNote={deleteNote}/>;
    }
  }, [currentView, studySessions, notes]);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg p-4 flex flex-col">
        <div className="flex items-center mb-8 px-2">
           <BrainIcon className="w-8 h-8 text-blue-600"/>
           <h1 className="text-xl font-bold text-gray-800 mr-2">مشاور هوشمند</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <NavItem icon={<DashboardIcon />} label="داشبورد" isActive={currentView === View.Dashboard} onClick={() => setCurrentView(View.Dashboard)} />
          <NavItem icon={<CalendarIcon />} label="گزارش مطالعاتی" isActive={currentView === View.StudyLog} onClick={() => setCurrentView(View.StudyLog)} />
          <NavItem icon={<CalendarIcon className="w-6 h-6 transform -scale-x-100" />} label="برنامه‌ریزی" isActive={currentView === View.Planner} onClick={() => setCurrentView(View.Planner)} />
          <NavItem icon={<ClockIcon />} label="تکنیک پومودورو" isActive={currentView === View.Pomodoro} onClick={() => setCurrentView(View.Pomodoro)} />
          <NavItem icon={<ChartIcon />} label="پیشرفت و دورنما" isActive={currentView === View.Progress} onClick={() => setCurrentView(View.Progress)} />
          <NavItem icon={<TestIcon />} label="آزمون‌ها" isActive={currentView === View.Exams} onClick={() => setCurrentView(View.Exams)} />
        </nav>
        <div className="mt-auto">
           <button
            onClick={() => setCurrentView(View.AICounselor)}
            className={`flex items-center w-full px-4 py-3 text-right text-base transition-all duration-200 rounded-lg ${
                currentView === View.AICounselor
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700'
            }`}
          >
            <SparklesIcon />
            <span className="mr-4 font-semibold">گفتگو با مشاور</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;