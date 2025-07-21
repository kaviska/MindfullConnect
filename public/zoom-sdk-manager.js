/**
 * Vanilla JavaScript Zoom SDK Manager
 * Isolated from React to avoid conflicts
 */

class ZoomSDKManager {
  constructor() {
    this.isInitialized = false;
    this.isJoined = false;
    this.currentMeetingId = null;
    this.eventListeners = new Map();
  }

  // Event system for communication with React
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const callbacks = this.eventListeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  async loadSDK() {
    return new Promise((resolve, reject) => {
      if (typeof ZoomMtg !== 'undefined') {
        resolve();
        return;
      }

      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://source.zoom.us/3.13.2/css/bootstrap.css';
      document.head.appendChild(link);

      const link2 = document.createElement('link');
      link2.rel = 'stylesheet';
      link2.href = 'https://source.zoom.us/3.13.2/css/react-select.css';
      document.head.appendChild(link2);

      // Load scripts sequentially
      const scripts = [
        'https://source.zoom.us/3.13.2/lib/vendor/react.min.js',
        'https://source.zoom.us/3.13.2/lib/vendor/react-dom.min.js',
        'https://source.zoom.us/3.13.2/lib/vendor/redux.min.js',
        'https://source.zoom.us/3.13.2/lib/vendor/redux-thunk.min.js',
        'https://source.zoom.us/3.13.2/lib/vendor/lodash.min.js',
        'https://source.zoom.us/zoom-meeting-3.13.2.min.js'
      ];

      let loadedCount = 0;

      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      const loadNext = async () => {
        if (loadedCount >= scripts.length) {
          resolve();
          return;
        }

        try {
          await loadScript(scripts[loadedCount]);
          loadedCount++;
          loadNext();
        } catch (error) {
          reject(error);
        }
      };

      loadNext();
    });
  }

  async initialize() {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    try {
      console.log('Loading Zoom SDK...');
      await this.loadSDK();
      
      console.log('Initializing Zoom SDK...');
      
      // Wait for ZoomMtg to be available
      if (typeof ZoomMtg === 'undefined') {
        throw new Error('ZoomMtg not loaded');
      }

      ZoomMtg.setZoomJSLib('https://source.zoom.us/3.13.2/lib', '/av');
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareWebSDK();
      ZoomMtg.i18n.load('en-US');

      return new Promise((resolve, reject) => {
        ZoomMtg.init({
          leaveUrl: window.location.origin + '/counsellor/sessions',
          isSupportAV: true,
          patchJsMedia: true,
          success: () => {
            console.log('Zoom SDK initialized successfully');
            this.isInitialized = true;
            this.emit('sdkReady');
            resolve();
          },
          error: (error) => {
            console.error('Zoom SDK initialization failed:', error);
            this.emit('error', `SDK initialization failed: ${error.errorCode} - ${error.reason}`);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Failed to load Zoom SDK:', error);
      this.emit('error', `Failed to load SDK: ${error.message}`);
      throw error;
    }
  }

  async joinMeeting({ meetingId, signature, sdkKey, password = '', userName = 'Guest' }) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('Joining meeting with parameters:', { 
        meetingId, 
        signature: signature.substring(0, 20) + '...', // Log partial signature for security
        sdkKey, 
        password: password ? '[REDACTED]' : '[EMPTY]',
        userName 
      });
      
      this.currentMeetingId = meetingId;
      this.emit('joining', { meetingId });

      return new Promise((resolve, reject) => {
        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetingId,
          userName: userName,
          sdkKey: sdkKey,
          userEmail: '',
          passWord: password,
          success: () => {
            console.log('Successfully joined Zoom meeting');
            this.isJoined = true;
            this.emit('joined', { meetingId });
            resolve();
          },
          error: (error) => {
            console.error('Failed to join meeting:', error);
            let errorMessage = `Failed to join meeting: ${error.errorCode} - ${error.reason}`;
            
            // Provide specific guidance for common errors
            if (error.reason && error.reason.includes('Invalid signature')) {
              errorMessage += '\n\nPossible causes:\n- Signature has expired\n- SDK key mismatch\n- Clock synchronization issue';
            }
            
            this.emit('error', errorMessage);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error in joinMeeting:', error);
      this.emit('error', error.message);
      throw error;
    }
  }

  leaveMeeting() {
    if (this.isJoined && typeof ZoomMtg !== 'undefined') {
      try {
        ZoomMtg.leave();
        this.isJoined = false;
        this.currentMeetingId = null;
        this.emit('left');
      } catch (error) {
        console.error('Error leaving meeting:', error);
        this.emit('error', `Error leaving meeting: ${error.message}`);
      }
    }
  }

  // Get current status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isJoined: this.isJoined,
      currentMeetingId: this.currentMeetingId
    };
  }
}

// Create global instance
window.zoomSDKManager = new ZoomSDKManager();

console.log('Zoom SDK Manager loaded');
