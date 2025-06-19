import { useState, useEffect, useCallback } from 'react';
import { StudySession, Subject, Analytics, Settings } from '../types';
import { useLocalStorage } from './useLocalStorage';

const defaultSettings: Settings = {
  pomodoroSettings: {
    studyDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  },
  notifications: {
    enabled: true,
    studyReminders: true,
    breakReminders: true,
    dailySummary: true,
  },
  theme: 'light',
  timeFormat: '12h',
};

const defaultSubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    color: '#3B82F6',
    description: 'Calculus and Linear Algebra',
    totalStudyTime: 0,
    completedSessions: 0,
    totalSessions: 0,
    progress: 0,
    resources: [],
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Physics',
    color: '#10B981',
    description: 'Quantum Mechanics and Thermodynamics',
    totalStudyTime: 0,
    completedSessions: 0,
    totalSessions: 0,
    progress: 0,
    resources: [],
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Chemistry',
    color: '#F59E0B',
    description: 'Organic and Inorganic Chemistry',
    totalStudyTime: 0,
    completedSessions: 0,
    totalSessions: 0,
    progress: 0,
    resources: [],
    createdAt: new Date(),
  },
];

export function useStudyData() {
  const [sessions, setSessions] = useLocalStorage<StudySession[]>('studySessions', []);
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('subjects', defaultSubjects);
  const [settings, setSettings] = useLocalStorage<Settings>('settings', defaultSettings);

  const addSession = useCallback((session: Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSession: StudySession = {
      ...session,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSessions(prev => [...prev, newSession]);
  }, [setSessions]);

  const updateSession = useCallback((id: string, updates: Partial<StudySession>) => {
    setSessions(prev => prev.map(session => 
      session.id === id 
        ? { ...session, ...updates, updatedAt: new Date() }
        : session
    ));
  }, [setSessions]);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  }, [setSessions]);

  const addSubject = useCallback((subject: Omit<Subject, 'id' | 'createdAt'>) => {
    const newSubject: Subject = {
      ...subject,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setSubjects(prev => [...prev, newSubject]);
  }, [setSubjects]);

  const updateSubject = useCallback((id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === id ? { ...subject, ...updates } : subject
    ));
  }, [setSubjects]);

  const deleteSubject = useCallback((id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
    setSessions(prev => prev.filter(session => session.subject !== id));
  }, [setSubjects, setSessions]);

  const getAnalytics = useCallback((): Analytics => {
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyStudyTime = last7Days.map(date => {
      const daysSessions = sessions.filter(session => {
        const sessionDate = new Date(session.startTime).toISOString().split('T')[0];
        return sessionDate === date && session.completed;
      });
      const minutes = daysSessions.reduce((total, session) => total + session.duration, 0);
      return { date, minutes };
    });

    const subjectBreakdown = subjects.map(subject => {
      const subjectSessions = sessions.filter(session => 
        session.subject === subject.id && session.completed
      );
      const minutes = subjectSessions.reduce((total, session) => total + session.duration, 0);
      return { subject: subject.name, minutes, color: subject.color };
    });

    const completedSessions = sessions.filter(session => session.completed).length;
    const totalSessions = sessions.length;
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

    return {
      dailyStudyTime,
      subjectBreakdown,
      weeklyGoal: 1200, // 20 hours per week
      completionRate,
      streakDays: 5, // This would be calculated based on consecutive study days
    };
  }, [sessions, subjects]);

  return {
    sessions,
    subjects,
    settings,
    addSession,
    updateSession,
    deleteSession,
    addSubject,
    updateSubject,
    deleteSubject,
    setSettings,
    getAnalytics,
  };
}