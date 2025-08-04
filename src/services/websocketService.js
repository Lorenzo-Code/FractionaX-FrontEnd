import io from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 seconds
  }

  connect() {
    if (this.socket && this.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
          withCredentials: true,
          transports: ['websocket', 'polling'],
          timeout: 10000,
          forceNew: true
        });

        this.socket.on('connect', () => {
          console.log('🔌 WebSocket connected:', this.socket.id);
          this.connected = true;
          this.reconnectAttempts = 0;
          
          // Join admin room for analytics updates
          this.socket.emit('join-admin');
          
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('🔌 WebSocket disconnected:', reason);
          this.connected = false;
          
          // Attempt to reconnect if disconnection was unexpected
          if (reason === 'io server disconnect') {
            // Server initiated disconnect, don't reconnect
            return;
          }
          
          this.attemptReconnect();
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ WebSocket connection error:', error);
          this.connected = false;
          reject(error);
          this.attemptReconnect();
        });

        // Listen for analytics updates
        this.socket.on('analytics-update', (data) => {
          console.log('📊 Received analytics update:', data);
          this.notifyListeners('analytics-update', data);
        });

        // Listen for user activity updates
        this.socket.on('user-activity', (data) => {
          console.log('👤 Received user activity update:', data);
          this.notifyListeners('user-activity', data);
        });

        // Listen for real-time alerts
        this.socket.on('alert', (data) => {
          console.log('🚨 Received alert:', data);
          this.notifyListeners('alert', data);
        });

        // Set connection timeout
        setTimeout(() => {
          if (!this.connected) {
            reject(new Error('Connection timeout'));
          }
        }, 10000);

      } catch (error) {
        console.error('❌ Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('❌ Reconnection failed:', error);
      });
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.listeners.clear();
    }
  }

  // Subscribe to events
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return unsubscribe function
    return () => {
      if (this.listeners.has(event)) {
        this.listeners.get(event).delete(callback);
        if (this.listeners.get(event).size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  // Remove event listener
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
      if (this.listeners.get(event).size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  // Notify all listeners for an event
  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Emit events to server
  emit(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Cannot emit event: WebSocket not connected');
    }
  }

  // Get connection status
  isConnected() {
    return this.connected;
  }

  // Get socket ID
  getSocketId() {
    return this.socket?.id || null;
  }

  // Manually trigger analytics update (for testing)
  triggerAnalyticsUpdate() {
    return fetch('/api/admin/test/trigger-analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include'
    }).then(response => response.json());
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
