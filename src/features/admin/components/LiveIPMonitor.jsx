import React, { useState, useEffect, useRef } from 'react';
import securityApiService from '../services/securityApiService';
import {
  FaGlobe, FaMapMarkerAlt, FaShieldAlt, FaBan, FaExclamationTriangle,
  FaEye, FaHistory, FaDownload, FaFilter, FaSync, FaPlay, FaPause,
  FaWifi, FaServer, FaUserShield, FaSkullCrossbones, FaFlag,
  FaClock, FaChartLine, FaNetworkWired
} from 'react-icons/fa';

const LiveIPMonitor = ({ isActive = false, onIPThreatDetected }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [ipFeed, setIpFeed] = useState([]);
  const [suspiciousIPs, setSuspiciousIPs] = useState([]);
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [geoData, setGeoData] = useState({});
  const [threatIntel, setThreatIntel] = useState({});
  const [stats, setStats] = useState({
    totalIPs: 0,
    uniqueIPs: 0,
    suspiciousCount: 0,
    blockedCount: 0,
    countriesCount: 0
  });
  
  // Filter and display options
  const [filterLevel, setFilterLevel] = useState('all'); // all, suspicious, blocked, new
  const [autoBlock, setAutoBlock] = useState(false);
  const [maxFeedSize, setMaxFeedSize] = useState(500); // Increased from 100 to 500
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds
  
  const intervalRef = useRef(null);
  const feedContainerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      loadInitialData();
    }
    return () => {
      stopMonitoring();
    };
  }, [isActive]);

  useEffect(() => {
    if (isRunning && isActive) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
    return () => stopMonitoring();
  }, [isRunning, isActive, refreshInterval]);

  const loadInitialData = async () => {
    try {
      console.log('🔄 Loading real IP monitoring data from backend...');
      
      const [blocked, liveActivity] = await Promise.all([
        securityApiService.getBlockedIPs(),
        securityApiService.getLiveIPData(maxFeedSize)
      ]);
      
      console.log('✅ Loaded blocked IPs:', blocked);
      console.log('✅ Loaded live IP activity:', liveActivity);
      
      setBlockedIPs(blocked?.blockedIPs || blocked || []);
      
      // Initialize with recent IP activity data
      if (liveActivity?.activities || liveActivity) {
        const activities = liveActivity.activities || liveActivity || [];
        const formattedActivities = activities.map(activity => ({
          ip: activity.ipAddress || activity.ip,
          country: activity.location?.country || activity.country || 'Unknown',
          city: activity.location?.city || activity.city || 'Unknown',
          userAgent: activity.userAgent || 'Unknown',
          action: activity.action || activity.type || 'Unknown',
          timestamp: activity.timestamp || new Date().toISOString(),
          riskScore: activity.riskScore || calculateRiskScore(activity),
          isBlocked: (blocked?.blockedIPs || blocked || []).includes(activity.ipAddress || activity.ip),
          isSuspicious: (activity.riskScore || 0) > 50,
          requestCount: activity.requestCount || 1,
          userId: activity.userId || null
        }));
        
        setIpFeed(formattedActivities.slice(0, maxFeedSize));
      }
      
      updateStats();
    } catch (error) {
      console.error('Failed to load initial IP data:', error);
      // Fallback to empty arrays if API fails
      setBlockedIPs([]);
      setIpFeed([]);
    }
  };

  const startMonitoring = () => {
    if (intervalRef.current) return;
    
    console.log('🔴 Starting live IP monitoring...');
    
    intervalRef.current = setInterval(async () => {
      try {
        await fetchLiveIPData();
      } catch (error) {
        console.error('Live IP monitoring error:', error);
      }
    }, refreshInterval);
  };

  const stopMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('⏹️ Stopped live IP monitoring');
    }
  };

  const fetchLiveIPData = async () => {
    try {
      console.log('🔄 Fetching real-time IP data from backend...');
      
      // Get fresh live IP data from the backend
      const liveData = await securityApiService.getLiveIPData(20); // Get last 20 activities
      console.log('✅ Received live IP data:', liveData);
      
      // Format backend data to match component structure
      const activities = liveData?.activities || liveData || [];
      const formattedData = activities.map(activity => ({
        ip: activity.ipAddress || activity.ip,
        country: activity.location?.country || activity.country || 'Unknown',
        city: activity.location?.city || activity.city || 'Unknown', 
        userAgent: activity.userAgent || 'Unknown',
        action: activity.action || activity.type || 'Unknown',
        timestamp: activity.timestamp || new Date().toISOString(),
        riskScore: activity.riskScore || calculateRiskScore(activity),
        isBlocked: blockedIPs.includes(activity.ipAddress || activity.ip),
        isSuspicious: (activity.riskScore || 0) > 50,
        requestCount: activity.requestCount || 1,
        userId: activity.userId || null
      }));
      
      // Filter out entries we already have in the feed
      const newIPs = formattedData.filter(ip => !ipFeed.find(existing => 
        existing.ip === ip.ip && Math.abs(new Date(existing.timestamp) - new Date(ip.timestamp)) < 1000 // Within 1 second
      ));
      
      if (newIPs.length > 0) {
        console.log(`📊 Adding ${newIPs.length} new IP activities to feed`);
        
        setIpFeed(prev => {
          const updated = [...newIPs, ...prev].slice(0, maxFeedSize);
          
          // Auto-scroll to show new entries
          if (feedContainerRef.current) {
            feedContainerRef.current.scrollTop = 0;
          }
          
          return updated;
        });
        
        // Process threats and suspicious activity
        await processIPThreats(newIPs);
        updateStats();
      } else {
        console.log('📊 No new IP activities since last fetch');
      }
    } catch (error) {
      console.error('❌ Failed to fetch live IP data:', error);
    }
  };

  // Helper function to calculate risk score for activities that don't have one
  const calculateRiskScore = (activity) => {
    let riskScore = 0;
    
    // Base risk factors
    const ip = activity.ipAddress || activity.ip;
    const country = activity.location?.country || activity.country;
    const action = activity.action || activity.type;
    
    // Risk factor: Suspicious countries (commonly used for attacks)
    const suspiciousCountries = ['CN', 'RU', 'KP', 'IR', 'PK'];
    if (suspiciousCountries.includes(country)) {
      riskScore += 25;
    }
    
    // Risk factor: High-risk actions
    const highRiskActions = ['login', 'failed_login', 'admin_action', 'password_reset'];
    if (highRiskActions.includes(action)) {
      riskScore += 15;
    }
    
    // Risk factor: Unusual time (late night/early morning)
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      riskScore += 10;
    }
    
    // Risk factor: Multiple requests
    if ((activity.requestCount || 1) > 10) {
      riskScore += 20;
    }
    
    // Risk factor: New IP (not seen before)
    if (!geoData[ip]) {
      riskScore += 15;
    }
    
    // Cap the risk score at 100
    return Math.min(riskScore, 100);
  };

  const processIPThreats = async (newIPs) => {
    const suspicious = [];
    
    for (const ipData of newIPs) {
      // Check for suspicious patterns
      if (ipData.riskScore > 50 || ipData.isSuspicious) {
        suspicious.push({
          ...ipData,
          reason: ipData.riskScore > 75 ? 'High risk score' : 'Suspicious activity pattern',
          detectedAt: new Date().toISOString()
        });
        
        // Trigger callback for threat detection
        if (onIPThreatDetected) {
          onIPThreatDetected(ipData);
        }
        
        // Auto-block if enabled and score is very high
        if (autoBlock && ipData.riskScore > 75) {
          await blockIP(ipData.ip, 'Auto-blocked: High threat score');
        }
      }
    }
    
    if (suspicious.length > 0) {
      setSuspiciousIPs(prev => [...suspicious, ...prev].slice(0, 50));
    }
  };

  const blockIP = async (ip, reason = 'Manual block') => {
    try {
      await securityApiService.blockIP(ip, reason);
      
      setBlockedIPs(prev => [...prev, ip]);
      setIpFeed(prev => prev.map(entry => 
        entry.ip === ip ? { ...entry, isBlocked: true, blockReason: reason } : entry
      ));
      
      updateStats();
      console.log(`🚫 Blocked IP: ${ip} - ${reason}`);
    } catch (error) {
      console.error('Failed to block IP:', error);
      alert('Failed to block IP: ' + error.message);
    }
  };

  const unblockIP = async (ip) => {
    try {
      await securityApiService.unblockIP(ip);
      
      setBlockedIPs(prev => prev.filter(blockedIP => blockedIP !== ip));
      setIpFeed(prev => prev.map(entry => 
        entry.ip === ip ? { ...entry, isBlocked: false, blockReason: null } : entry
      ));
      
      updateStats();
      console.log(`✅ Unblocked IP: ${ip}`);
    } catch (error) {
      console.error('Failed to unblock IP:', error);
      alert('Failed to unblock IP: ' + error.message);
    }
  };

  const updateStats = () => {
    const uniqueIPs = [...new Set(ipFeed.map(entry => entry.ip))];
    const countries = [...new Set(ipFeed.map(entry => entry.country))];
    
    setStats({
      totalIPs: ipFeed.length,
      uniqueIPs: uniqueIPs.length,
      suspiciousCount: suspiciousIPs.length,
      blockedCount: blockedIPs.length,
      countriesCount: countries.length
    });
  };

  const exportIPData = () => {
    const exportData = {
      feed: ipFeed,
      suspicious: suspiciousIPs,
      blocked: blockedIPs,
      stats,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip-monitor-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFilteredFeed = () => {
    return ipFeed.filter(entry => {
      switch (filterLevel) {
        case 'suspicious':
          return entry.isSuspicious;
        case 'blocked':
          return entry.isBlocked;
        case 'new':
          return !geoData[entry.ip] || 
                 (new Date() - new Date(geoData[entry.ip].firstSeen)) < 3600000; // 1 hour
        default:
          return true;
      }
    });
  };

  const getRiskColor = (score) => {
    if (score >= 75) return 'text-red-600 bg-red-100';
    if (score >= 50) return 'text-orange-600 bg-orange-100';
    if (score >= 25) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  if (!isActive) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FaNetworkWired className="mx-auto text-4xl mb-4" />
        <p>Live IP Monitor is disabled</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-semibold flex items-center">
            <FaGlobe className="mr-2 text-blue-600" />
            Live IP Address Monitor
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isRunning ? 'Live' : 'Stopped'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
            className="px-3 py-1 text-sm border rounded"
            disabled={isRunning}
          >
            <option value={1000}>1s</option>
            <option value={5000}>5s</option>
            <option value={10000}>10s</option>
            <option value={30000}>30s</option>
          </select>
          
          <button
            onClick={exportIPData}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            <FaDownload className="inline mr-1" /> Export
          </button>
          
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded text-white ${
              isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRunning ? <FaPause className="inline mr-1" /> : <FaPlay className="inline mr-1" />}
            {isRunning ? 'Stop' : 'Start'} Monitor
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total IPs</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalIPs}</p>
            </div>
            <FaGlobe className="text-blue-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Unique IPs</p>
              <p className="text-2xl font-bold text-green-900">{stats.uniqueIPs}</p>
            </div>
            <FaNetworkWired className="text-green-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Suspicious</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.suspiciousCount}</p>
            </div>
            <FaExclamationTriangle className="text-yellow-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Blocked</p>
              <p className="text-2xl font-bold text-red-900">{stats.blockedCount}</p>
            </div>
            <FaBan className="text-red-500 text-xl" />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Countries</p>
              <p className="text-2xl font-bold text-purple-900">{stats.countriesCount}</p>
            </div>
            <FaFlag className="text-purple-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="all">All IPs</option>
              <option value="suspicious">Suspicious Only</option>
              <option value="blocked">Blocked Only</option>
              <option value="new">New IPs</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Max entries:</label>
            <select
              value={maxFeedSize}
              onChange={(e) => setMaxFeedSize(parseInt(e.target.value))}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Auto-block high risk:</label>
          <input
            type="checkbox"
            checked={autoBlock}
            onChange={(e) => setAutoBlock(e.target.checked)}
            className="rounded"
          />
        </div>
      </div>

      {/* Live Feed */}
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b bg-gray-50">
          <h4 className="font-semibold text-gray-900">
            Live IP Feed ({getFilteredFeed().length} entries)
          </h4>
        </div>
        
        <div 
          ref={feedContainerRef}
          className="max-h-96 overflow-y-auto"
        >
          {getFilteredFeed().length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FaWifi className="mx-auto text-3xl mb-2" />
              <p>No IP activity to display</p>
              <p className="text-sm">Start monitoring to see live data</p>
            </div>
          ) : (
            <div className="divide-y">
              {getFilteredFeed().map((entry, index) => (
                <div key={`${entry.ip}-${entry.timestamp}`} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-sm font-medium">{entry.ip}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {entry.country}
                        </span>
                        {entry.isSuspicious && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center">
                            <FaExclamationTriangle className="mr-1" />
                            Suspicious
                          </span>
                        )}
                        {entry.isBlocked && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded flex items-center">
                            <FaBan className="mr-1" />
                            Blocked
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span><FaMapMarkerAlt className="inline mr-1" />{entry.city}</span>
                        <span><FaClock className="inline mr-1" />{new Date(entry.timestamp).toLocaleTimeString()}</span>
                        <span>Action: {entry.action}</span>
                        <span>Requests: {entry.requestCount}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getRiskColor(entry.riskScore)}`}>
                        Risk: {entry.riskScore}
                      </span>
                      
                      <div className="flex space-x-1">
                        {!entry.isBlocked ? (
                          <button
                            onClick={() => blockIP(entry.ip)}
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            title="Block IP"
                          >
                            <FaBan />
                          </button>
                        ) : (
                          <button
                            onClick={() => unblockIP(entry.ip)}
                            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                            title="Unblock IP"
                          >
                            <FaShieldAlt />
                          </button>
                        )}
                        
                        <button
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveIPMonitor;
