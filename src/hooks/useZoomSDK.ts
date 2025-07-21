'use client';

import { useEffect, useState, useCallback } from 'react';

export type ZoomSDKStatus = 'idle' | 'loading' | 'ready' | 'joining' | 'joined' | 'error';

export interface UseZoomSDKOptions {
  onJoined?: () => void;
  onLeft?: () => void;
  onError?: (error: string) => void;
}

export interface ZoomMeetingParams {
  meetingId: string;
  signature: string;
  sdkKey: string;
  password?: string;
  userName?: string;
}

declare global {
  interface Window {
    zoomSDKManager: any;
  }
}

export function useZoomSDK(options: UseZoomSDKOptions = {}) {
  const [status, setStatus] = useState<ZoomSDKStatus>('idle');
  const [error, setError] = useState<string>('');
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  const { onJoined, onLeft, onError } = options;

  // Initialize SDK Manager
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Check if SDK manager is already loaded
        if (window.zoomSDKManager) {
          setIsSDKLoaded(true);
          setStatus('ready');
          return;
        }

        setStatus('loading');

        // Load the SDK manager script
        const script = document.createElement('script');
        script.src = '/zoom-sdk-manager.js';
        script.async = true;

        script.onload = () => {
          setIsSDKLoaded(true);
          setStatus('ready');
        };

        script.onerror = () => {
          setError('Failed to load Zoom SDK Manager');
          setStatus('error');
          onError?.('Failed to load Zoom SDK Manager');
        };

        document.head.appendChild(script);

        // Cleanup function
        return () => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        };
      } catch (error) {
        console.error('Error initializing SDK:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setStatus('error');
        onError?.(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    initializeSDK();
  }, [onError]);

  // Set up event listeners
  useEffect(() => {
    if (!isSDKLoaded || !window.zoomSDKManager) return;

    const manager = window.zoomSDKManager;

    const handleJoined = (data: any) => {
      setStatus('joined');
      onJoined?.();
    };

    const handleLeft = () => {
      setStatus('ready');
      onLeft?.();
    };

    const handleError = (errorMessage: string) => {
      setError(errorMessage);
      setStatus('error');
      onError?.(errorMessage);
    };

    const handleJoining = () => {
      setStatus('joining');
      setError('');
    };

    const handleSDKReady = () => {
      setStatus('ready');
      setError('');
    };

    // Add event listeners
    manager.on('joined', handleJoined);
    manager.on('left', handleLeft);
    manager.on('error', handleError);
    manager.on('joining', handleJoining);
    manager.on('sdkReady', handleSDKReady);

    // Cleanup
    return () => {
      manager.off('joined', handleJoined);
      manager.off('left', handleLeft);
      manager.off('error', handleError);
      manager.off('joining', handleJoining);
      manager.off('sdkReady', handleSDKReady);
    };
  }, [isSDKLoaded, onJoined, onLeft, onError]);

  const joinMeeting = useCallback(async (params: ZoomMeetingParams) => {
    if (!window.zoomSDKManager) {
      throw new Error('Zoom SDK Manager not loaded');
    }

    try {
      await window.zoomSDKManager.joinMeeting(params);
    } catch (error) {
      console.error('Failed to join meeting:', error);
      throw error;
    }
  }, []);

  const leaveMeeting = useCallback(() => {
    if (window.zoomSDKManager) {
      window.zoomSDKManager.leaveMeeting();
    }
  }, []);

  const getSDKStatus = useCallback(() => {
    if (window.zoomSDKManager) {
      return window.zoomSDKManager.getStatus();
    }
    return null;
  }, []);

  return {
    status,
    error,
    isSDKLoaded,
    joinMeeting,
    leaveMeeting,
    getSDKStatus,
  };
}
