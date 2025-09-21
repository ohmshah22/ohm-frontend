import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { useRouter, useSegments } from 'expo-router';
import { authService, UserProfile, PatientProfile, HealthWorkerProfile } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<UserProfile>, role: 'patient' | 'health_worker') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<{ user: User; needsProfileSetup: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  getHealthWorkers: () => Promise<HealthWorkerProfile[]>;
  getAssignedPatients: (healthWorkerId: string) => Promise<PatientProfile[]>;
  assignPatientToHealthWorker: (patientId: string, healthWorkerId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const profile = await authService.getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle routing based on authentication state
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth' || segments[0] === 'role-selection' || segments[0] === 'profile-setup';
    const inTabsGroup = segments[0] === '(tabs)';
    
    console.log('Auth routing check:', { user: !!user, loading, segments, inAuthGroup, inTabsGroup });
    
    if (!user && !inAuthGroup) {
      // User is not authenticated and not in auth screens, redirect to main page
      console.log('Redirecting to main page - no user');
      router.replace('/');
    } else if (user && inAuthGroup) {
      // User is authenticated but in auth screens, redirect to home
      console.log('Redirecting to home - user authenticated');
      router.replace('/home');
    }
  }, [user, loading, segments]);

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>, role: 'patient' | 'health_worker') => {
    try {
      const { user, profile } = await authService.signUp(email, password, userData, role);
      setUser(user);
      setUserProfile(profile);
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const user = await authService.signIn(email, password);
      setUser(user);
      
      if (user) {
        const profile = await authService.getUserProfile(user.uid);
        setUserProfile(profile);
      }
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await authService.signInWithGoogle();
      setUser(result.user);
      
      if (!result.needsProfileSetup) {
        const profile = await authService.getUserProfile(result.user.uid);
        setUserProfile(profile);
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOutUser();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await authService.updateUserProfile(user.uid, updates);
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      throw error;
    }
  };

  const getHealthWorkers = async () => {
    return await authService.getHealthWorkers();
  };

  const getAssignedPatients = async (healthWorkerId: string) => {
    return await authService.getAssignedPatients(healthWorkerId);
  };

  const assignPatientToHealthWorker = async (patientId: string, healthWorkerId: string) => {
    return await authService.assignPatientToHealthWorker(patientId, healthWorkerId);
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    getHealthWorkers,
    getAssignedPatients,
    assignPatientToHealthWorker,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
