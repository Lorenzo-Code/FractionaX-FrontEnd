import { useState, useEffect, useCallback, useRef } from 'react';
import websocketService from '../../services/websocketService';

export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const retryTimeoutRef = useRef(null);

  const connect = useCallback(async () => {
    try {
      setConnectionError(null);
      await websocketService.connect();
      setConnected(true);
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setConnectionError(error.message);
      setConnected(false);
      
      // Retry connection after 5 seconds
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      retryTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    }
  }, []);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setConnected(false);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  const triggerAnalyticsUpdate = useCallback(async () => {
    try {
      const response = await websocketService.triggerAnalyticsUpdate();
      console.log('Analytics update triggered:', response);
      return response;
    } catch (error) {
      console.error('Failed to trigger analytics update:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    // Subscribe to analytics updates
    const unsubscribeAnalytics = websocketService.on('analytics-update', (data) => {
      setAnalyticsData(data);
      setLastUpdate(new Date());
    });

    // Subscribe to connection status changes
    const checkConnection = () => {
      setConnected(websocketService.isConnected());
    };

    const intervalId = setInterval(checkConnection, 1000);

    return () => {
      unsubscribeAnalytics();
      clearInterval(intervalId);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    connected,
    analyticsData,
    connectionError,
    lastUpdate,
    connect,
    disconnect,
    triggerAnalyticsUpdate,
    socketId: websocketService.getSocketId()
  };
};

export const useRealTimeAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to analytics updates
    const unsubscribe = websocketService.on('analytics-update', (analyticsData) => {
      setData(analyticsData);
      setLoading(false);
      setError(null);
    });

    // Initial connection
    const initConnection = async () => {
      try {
        setLoading(true);
        await websocketService.connect();
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    initConnection();

    return () => {
      unsubscribe();
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await websocketService.triggerAnalyticsUpdate();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    refresh,
    connected: websocketService.isConnected()
  };
};

export const useRealTimeAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [newAlertCount, setNewAlertCount] = useState(0);

  useEffect(() => {
    const unsubscribe = websocketService.on('alert', (alertData) => {
      setAlerts(prev => [alertData, ...prev.slice(0, 9)]); // Keep only last 10 alerts
      setNewAlertCount(prev => prev + 1);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const clearNewAlerts = useCallback(() => {
    setNewAlertCount(0);
  }, []);

  const removeAlert = useCallback((index) => {
    setAlerts(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    alerts,
    newAlertCount,
    clearNewAlerts,
    removeAlert
  };
};

export default useWebSocket;
