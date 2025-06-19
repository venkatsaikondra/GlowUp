import React from 'react';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { useStudyData } from '../hooks/useStudyData';
import { format, isToday, startOfWeek, endOfWeek } from 'date-fns';

const Dashboard: React.FC = () => {
  const { sessions, subjects, getAnalytics } = useStudyData();
  const analytics = getAnalytics();

  const todaySessions = sessions.filter(session => 
    isToday(new Date(session.startTime))
  );
  
  const todayCompletedTime = todaySessions
    .filter(session => session.completed)
    .reduce((total, session) => total + session.duration, 0);

  const todayScheduledTime = todaySessions
    .reduce((total, session) => total + session.duration, 0);

  const weeklyStudyTime = analytics.dailyStudyTime
    .reduce((total, day) => total + day.minutes, 0);

  const upcomingSessions = sessions
    .filter(session => {
      const sessionStart = new Date(session.startTime);
      const now = new Date();
      return sessionStart > now && !session.completed;
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Study Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatTime(todayCompletedTime)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span>of {formatTime(todayScheduledTime)} scheduled</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weekly Progress</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatTime(weeklyStudyTime)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, (weeklyStudyTime / analytics.weeklyGoal) * 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round((weeklyStudyTime / analytics.weeklyGoal) * 100)}% of weekly goal
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round(analytics.completionRate)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Streak</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analytics.streakDays} days
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Sessions
          </h3>
          <div className="space-y-3">
            {upcomingSessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No upcoming sessions scheduled
              </p>
            ) : (
              upcomingSessions.map(session => {
                const subject = subjects.find(s => s.id === session.subject);
                return (
                  <div key={session.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: subject?.color || '#6B7280' }}
                    ></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{session.title}</p>
                      <p className="text-sm text-gray-500">
                        {subject?.name} • {format(new Date(session.startTime), 'h:mm a')} - {format(new Date(session.endTime), 'h:mm a')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.priority === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : session.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {session.priority}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Subject Progress */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Subject Progress
          </h3>
          <div className="space-y-4">
            {subjects.slice(0, 4).map(subject => {
              const subjectSessions = sessions.filter(s => s.subject === subject.id);
              const completedSessions = subjectSessions.filter(s => s.completed).length;
              const totalSessions = subjectSessions.length;
              const progress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

              return (
                <div key={subject.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">{subject.name}</p>
                      <p className="text-sm text-gray-500">
                        {completedSessions}/{totalSessions} sessions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {Math.round(progress)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;