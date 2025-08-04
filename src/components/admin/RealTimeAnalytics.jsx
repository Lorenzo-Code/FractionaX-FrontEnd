import React, { useState, useEffect } from 'react';
import { useWebSocket, useRealTimeAnalytics } from '../../hooks/useWebSocket';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Users, 
  UserCheck, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const RealTimeAnalytics = () => {
  const { 
    connected, 
    analyticsData, 
    connectionError, 
    lastUpdate, 
    connect, 
    disconnect, 
    triggerAnalyticsUpdate, 
    socketId 
  } = useWebSocket();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await triggerAnalyticsUpdate();
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const formatTime = (date) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getConnectionBadge = () => {
    if (connected) {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          <Wifi className="w-3 h-3 mr-1" />
          Connected
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <WifiOff className="w-3 h-3 mr-1" />
          Disconnected
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Real-Time Analytics
            </div>
            <div className="flex items-center gap-2">
              {getConnectionBadge()}
              <Button
                onClick={handleRefresh}
                disabled={!connected || isRefreshing}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Connection Status</p>
              <div className="flex items-center gap-2">
                {connected ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${connected ? 'text-green-600' : 'text-red-600'}`}>
                  {connected ? 'Live Connection' : 'Disconnected'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Socket ID</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {socketId || 'N/A'}
              </code>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Last Update</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {formatTime(lastUpdate)}
                </span>
              </div>
            </div>
          </div>

          {connectionError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Connection Error: {connectionError}
                <Button 
                  onClick={connect} 
                  size="sm" 
                  variant="outline" 
                  className="ml-2"
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Real-Time Analytics Data */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.overview?.totalUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Active: {analyticsData.overview?.activeUsers || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.overview?.verifiedUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.overview?.conversionRate || 0}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Users Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.overview?.newUsersToday || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                This week: {analyticsData.overview?.newUsersThisWeek || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activity Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.overview?.activityRate || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                User engagement
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Real-Time Session Stats */}
      {analyticsData?.realTimeStats && (
        <Card>
          <CardHeader>
            <CardTitle>Live Session Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analyticsData.realTimeStats.onlineUsers}
                </div>
                <p className="text-sm text-blue-600">Online Users</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analyticsData.realTimeStats.activeSessions}
                </div>
                <p className="text-sm text-green-600">Active Sessions</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {analyticsData.realTimeStats.averageSessionDuration}
                </div>
                <p className="text-sm text-purple-600">Avg Session</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity Feed */}
      {analyticsData?.recentActivity && analyticsData.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-lg">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {activity.user} • {formatTime(new Date(activity.timestamp))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && analyticsData && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(analyticsData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeAnalytics;
