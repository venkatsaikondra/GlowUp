import React, { useState } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Edit3, 
  Trash2,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { useStudyData } from '../hooks/useStudyData';
import { StudySession } from '../types';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import ScheduleForm from './ScheduleForm';

const ScheduleView: React.FC = () => {
  const { sessions, subjects, updateSession, deleteSession } = useStudyData();
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');

  const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  const handleCompleteSession = (sessionId: string, completed: boolean) => {
    updateSession(sessionId, { completed });
  };

  const handleEditSession = (session: StudySession) => {
    setEditingSession(session);
    setShowForm(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      deleteSession(sessionId);
    }
  };

  const getSessionsForDay = (date: Date) => {
    return sessions
      .filter(session => isSameDay(new Date(session.startTime), date))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  const SessionCard: React.FC<{ session: StudySession }> = ({ session }) => {
    const subject = subjects.find(s => s.id === session.subject);
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);

    return (
      <div className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
        session.completed 
          ? 'bg-green-50 border-green-200' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <button
                onClick={() => handleCompleteSession(session.id, !session.completed)}
                className={`transition-colors duration-200 ${
                  session.completed 
                    ? 'text-green-600 hover:text-green-700' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {session.completed ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </button>
              <h4 className={`font-medium ${
                session.completed ? 'text-green-800 line-through' : 'text-gray-900'
              }`}>
                {session.title}
              </h4>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: subject?.color || '#6B7280' }}
              ></div>
              <span>{subject?.name || 'Unknown Subject'}</span>
              <span>•</span>
              <Clock className="w-3 h-3" />
              <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
            </div>
            {session.notes && (
              <p className="text-sm text-gray-600 mt-2">{session.notes}</p>
            )}
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              session.priority === 'high' 
                ? 'bg-red-100 text-red-700'
                : session.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {session.priority}
            </span>
            <button
              onClick={() => handleEditSession(session)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteSession(session.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Study Schedule</h1>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'week' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
          </div>
          <button
            onClick={() => {
              setEditingSession(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Session</span>
          </button>
        </div>
      </div>

      {viewMode === 'week' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
            {weekDays.map((day, index) => (
              <div 
                key={index}
                className={`p-4 text-center border-r border-gray-200 last:border-r-0 ${
                  isToday(day) ? 'bg-blue-50' : ''
                }`}
              >
                <div className={`text-sm font-medium ${
                  isToday(day) ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {format(day, 'EEE')}
                </div>
                <div className={`text-lg font-semibold mt-1 ${
                  isToday(day) ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0 min-h-96">
            {weekDays.map((day, index) => {
              const daySessions = getSessionsForDay(day);
              return (
                <div 
                  key={index}
                  className="p-2 border-r border-gray-200 last:border-r-0 space-y-2"
                >
                  {daySessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No study sessions yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first study session to get started with your learning journey.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Create Session
              </button>
            </div>
          ) : (
            sessions
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .map(session => (
                <SessionCard key={session.id} session={session} />
              ))
          )}
        </div>
      )}

      {showForm && (
        <ScheduleForm
          session={editingSession}
          onClose={() => {
            setShowForm(false);
            setEditingSession(null);
          }}
        />
      )}
    </div>
  );
};

export default ScheduleView;