import React from 'react';
import { TrendingUp, Clock, Target, Award } from 'lucide-react';
import { useStudyData } from '../hooks/useStudyData';

const AnalyticsView: React.FC = () => {
  const { getAnalytics, sessions, subjects } = useStudyData();
  const analytics = getAnalytics();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const totalStudyTime = analytics.dailyStudyTime.reduce((total, day) => total + day.minutes, 0);
  const averageDailyTime = Math.round(totalStudyTime / 7);
  const mostStudiedSubject = analytics.subjectBreakdown.reduce(
    (max, subject) => subject.minutes > max.minutes ? subject : max,
    { subject: 'None', minutes: 0, color: '#6B7280' }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Study Analytics</h1>
        <div className="text-sm text-gray-600">
          Last 7 days
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Study Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatTime(totalStudyTime)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Average</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatTime(averageDailyTime)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
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
              <Award className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Study Time Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Study Time
          </h3>
          <div className="space-y-3">
            {analytics.dailyStudyTime.map((day, index) => {
              const maxTime = Math.max(...analytics.dailyStudyTime.map(d => d.minutes));
              const percentage = maxTime > 0 ? (day.minutes / maxTime) * 100 : 0;
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('en', { weekday: 'short' });
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 text-sm text-gray-600 font-medium">
                    {dayName}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div 
                      className="bg-blue-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${percentage}%` }}
                    >
                      {day.minutes > 0 && (
                        <span className="text-xs text-white font-medium">
                          {formatTime(day.minutes)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Subject Breakdown
          </h3>
          <div className="space-y-4">
            {analytics.subjectBreakdown.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No study data available yet
              </div>
            ) : (
              analytics.subjectBreakdown
                .sort((a, b) => b.minutes - a.minutes)
                .map((subject, index) => {
                  const totalTime = analytics.subjectBreakdown.reduce((sum, s) => sum + s.minutes, 0);
                  const percentage = totalTime > 0 ? (subject.minutes / totalTime) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        ></div>
                        <div>
                          <p className="font-medium text-gray-900">{subject.subject}</p>
                          <p className="text-sm text-gray-500">
                            {formatTime(subject.minutes)} ({Math.round(percentage)}%)
                          </p>
                        </div>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: subject.color
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Goal Progress
          </h3>
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${(totalStudyTime / analytics.weeklyGoal) * 100}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round((totalStudyTime / analytics.weeklyGoal) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              {formatTime(totalStudyTime)} of {formatTime(analytics.weeklyGoal)} weekly goal
            </p>
          </div>
        </div>

        {/* Most Studied Subject */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Subject
          </h3>
          <div className="text-center py-4">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: `${mostStudiedSubject.color}20` }}
            >
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: mostStudiedSubject.color }}
              ></div>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-1">
              {mostStudiedSubject.subject}
            </h4>
            <p className="text-gray-600">
              {formatTime(mostStudiedSubject.minutes)} this week
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;