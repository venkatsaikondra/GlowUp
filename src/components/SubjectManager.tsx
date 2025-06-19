import React, { useState } from 'react';
import { Plus, Edit3, Trash2, BookOpen, ExternalLink, FileText } from 'lucide-react';
import { useStudyData } from '../hooks/useStudyData';
import { Subject } from '../types';
import SubjectForm from './SubjectForm';

const SubjectManager: React.FC = () => {
  const { subjects, sessions, deleteSubject } = useStudyData();
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleDeleteSubject = (subjectId: string) => {
    const sessionsCount = sessions.filter(s => s.subject === subjectId).length;
    const message = sessionsCount > 0 
      ? `Are you sure you want to delete this subject? This will also delete ${sessionsCount} associated study sessions.`
      : 'Are you sure you want to delete this subject?';
    
    if (window.confirm(message)) {
      deleteSubject(subjectId);
    }
  };

  const getSubjectStats = (subjectId: string) => {
    const subjectSessions = sessions.filter(s => s.subject === subjectId);
    const completedSessions = subjectSessions.filter(s => s.completed);
    const totalStudyTime = completedSessions.reduce((total, session) => total + session.duration, 0);
    const completionRate = subjectSessions.length > 0 
      ? (completedSessions.length / subjectSessions.length) * 100 
      : 0;

    return {
      totalSessions: subjectSessions.length,
      completedSessions: completedSessions.length,
      totalStudyTime,
      completionRate,
    };
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Subject Manager</h1>
        <button
          onClick={() => {
            setEditingSubject(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No subjects yet
          </h3>
          <p className="text-gray-600 mb-4">
            Add your first subject to start organizing your study sessions.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add Subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const stats = getSubjectStats(subject.id);
            
            return (
              <div key={subject.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${subject.color}20` }}
                    >
                      <BookOpen 
                        className="w-6 h-6" 
                        style={{ color: subject.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                      {subject.description && (
                        <p className="text-sm text-gray-600 mt-1">{subject.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditSubject(subject)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Study Time</span>
                    <span className="font-medium text-gray-900">
                      {formatTime(stats.totalStudyTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sessions Completed</span>
                    <span className="font-medium text-gray-900">
                      {stats.completedSessions}/{stats.totalSessions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium text-gray-900">
                      {Math.round(stats.completionRate)}%
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900">{Math.round(stats.completionRate)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${stats.completionRate}%`,
                        backgroundColor: subject.color
                      }}
                    ></div>
                  </div>
                </div>

                {subject.resources && subject.resources.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Resources</h4>
                    <div className="space-y-1">
                      {subject.resources.slice(0, 3).map((resource) => (
                        <div key={resource.id} className="flex items-center space-x-2 text-sm">
                          {resource.type === 'pdf' && <FileText className="w-3 h-3 text-red-500" />}
                          {resource.type === 'video' && <ExternalLink className="w-3 h-3 text-blue-500" />}
                          {resource.type === 'link' && <ExternalLink className="w-3 h-3 text-green-500" />}
                          {resource.type === 'note' && <FileText className="w-3 h-3 text-gray-500" />}
                          <a 
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-blue-600 transition-colors duration-200 truncate"
                          >
                            {resource.title}
                          </a>
                        </div>
                      ))}
                      {subject.resources.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{subject.resources.length - 3} more resources
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <SubjectForm
          subject={editingSubject}
          onClose={() => {
            setShowForm(false);
            setEditingSubject(null);
          }}
        />
      )}
    </div>
  );
};

export default SubjectManager;