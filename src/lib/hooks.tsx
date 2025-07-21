/**
 * React Hooks for MindfullConnect SDK
 * Provides React-specific hooks for easy integration
 */

import { useState, useEffect, useCallback, useContext, createContext, ReactNode } from 'react';
import { MindfullConnectSDK, CounselorProfile, Session, RecentSession, APIResponse } from './sdk';

// SDK Context
const SDKContext = createContext<MindfullConnectSDK | null>(null);

// SDK Provider Component
interface SDKProviderProps {
  children: ReactNode;
  config?: any;
}

export function SDKProvider({ children, config }: SDKProviderProps) {
  const sdk = new MindfullConnectSDK(config);
  return <SDKContext.Provider value={sdk}>{children}</SDKContext.Provider>;
}

// Hook to use SDK
export function useSDK(): MindfullConnectSDK {
  const sdk = useContext(SDKContext);
  if (!sdk) {
    throw new Error('useSDK must be used within SDKProvider');
  }
  return sdk;
}

// Generic async hook
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function useAsync<T>(
  asyncFunction: () => Promise<APIResponse<T>>,
  dependencies: any[] = []
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await asyncFunction();
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

// Counselor Profile Hook
export function useCounselorProfile() {
  const sdk = useSDK();
  return useAsync(() => sdk.counselor.getProfile());
}

// Recent Sessions Hook
export function useRecentSessions() {
  const sdk = useSDK();
  return useAsync(() => sdk.counselor.getRecentSessions());
}

// Counselor Sessions Hook
export function useCounselorSessions() {
  const sdk = useSDK();
  return useAsync(() => sdk.counselor.getSessions());
}

// Patient Sessions Hook
export function usePatientSessions() {
  const sdk = useSDK();
  return useAsync(() => sdk.sessions.getMySessions());
}

// Availability Hook
export function useAvailability(weekStart: string) {
  const sdk = useSDK();
  return useAsync(() => sdk.availability.getWeekAvailability(weekStart), [weekStart]);
}

// Available Slots Hook
export function useAvailableSlots(counselorId: string, date: string) {
  const sdk = useSDK();
  return useAsync(
    () => sdk.sessions.getAvailableSlots(counselorId, date),
    [counselorId, date]
  );
}

// Session Management Hook
export function useSessionManager() {
  const sdk = useSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async (sessionData: {
    counselorId: string;
    date: string;
    time: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sdk.sessions.create(sessionData);
      if (!response.success) {
        setError(response.error || 'Failed to create session');
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId: string, status: Session['status']) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sdk.sessions.updateStatus(sessionId, status);
      if (!response.success) {
        setError(response.error || 'Failed to update session');
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelSession = async (sessionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sdk.sessions.cancel(sessionId);
      if (!response.success) {
        setError(response.error || 'Failed to cancel session');
        return false;
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSession,
    updateSessionStatus,
    cancelSession,
    loading,
    error,
  };
}

// Zoom Management Hook
export function useZoomManager() {
  const sdk = useSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMeeting = async (sessionData: { sessionId: string; topic: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sdk.zoom.createMeeting(sessionData);
      if (!response.success) {
        setError(response.error || 'Failed to create Zoom meeting');
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSDKSignature = async (meetingNumber: string, role: number = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sdk.zoom.getSDKSignature(meetingNumber, role);
      if (!response.success) {
        setError(response.error || 'Failed to get SDK signature');
        return null;
      }
      return response.data?.signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createMeeting,
    getSDKSignature,
    loading,
    error,
  };
}

// Authentication Hook
export function useAuth() {
  const sdk = useSDK();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sdk.auth.login(email, password);
      if (!response.success) {
        setError(response.error || 'Login failed');
        return false;
      }
      
      if (response.data?.user) {
        setUser(response.data.user);
        if (response.data.token) {
          sdk.setAuthToken(response.data.token);
        }
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await sdk.auth.logout();
      setUser(null);
      sdk.setAuthToken('');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    fullName: string;
    email: string;
    password: string;
    role: 'patient' | 'counselor';
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sdk.auth.register(userData);
      if (!response.success) {
        setError(response.error || 'Registration failed');
        return false;
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    login,
    logout,
    register,
    loading,
    error,
  };
}

// Profile Management Hook
export function useProfileManager() {
  const sdk = useSDK();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (profileData: Partial<CounselorProfile>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await sdk.counselor.updateProfile(profileData);
      if (!response.success) {
        setError(response.error || 'Failed to update profile');
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error,
  };
}
