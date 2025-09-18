import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

/**
 * CLIP ID Integration Monitoring Dashboard
 * 
 * This component helps monitor CLIP ID integration status across all backend APIs.
 * It should be used during development to ensure backend APIs are providing CLIP IDs.
 * 
 * Usage: Add to a development/admin page to monitor CLIP ID integration progress
 */
const ClipIdMonitoringDashboard = () => {
  const [apiStatus, setApiStatus] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // APIs to monitor for CLIP ID integration
  const monitoredApis = [
    {
      name: 'Multifamily Discovery',
      endpoint: '/api/properties/multifamily-discovery/search',
      description: 'Properties from multifamily discovery engine'
    },
    {
      name: 'Main Properties',
      endpoint: '/api/properties',
      description: 'Main property lookup endpoint'
    },
    {
      name: 'Commercial Multi-Source',
      endpoint: '/api/commercial/multi-source',
      description: 'LoopNet, Crexi, Auction properties'
    },
    {
      name: 'Suggested Deals',
      endpoint: '/api/suggested',
      description: 'AI-suggested property deals'
    },
    {
      name: 'Featured Properties',
      endpoint: '/api/featured-property',
      description: 'Curated featured properties'
    }
  ];

  const checkApiClipIdStatus = async (api) => {
    try {
      const response = await fetch(api.endpoint);
      const data = await response.json();
      
      let properties = [];
      
      // Extract properties from different response formats
      if (data.properties) {
        properties = data.properties;
      } else if (data.data?.properties) {
        properties = data.data.properties;
      } else if (data.data && Array.isArray(data.data)) {
        properties = data.data;
      } else if (Array.isArray(data)) {
        properties = data;
      }
      
      if (properties.length === 0) {
        return {
          status: 'no_data',
          message: 'No properties returned',
          coverage: 0,
          total: 0,
          withClipId: 0,
          withoutClipId: 0
        };
      }
      
      const propertiesWithClipId = properties.filter(p => p.coreLogicClipId || p.clipId);
      const propertiesWithoutClipId = properties.filter(p => !(p.coreLogicClipId || p.clipId));
      const coverage = (propertiesWithClipId.length / properties.length) * 100;
      
      return {
        status: coverage === 100 ? 'complete' : coverage > 0 ? 'partial' : 'missing',
        message: coverage === 100 ? 'All properties have CLIP IDs' : 
                coverage > 0 ? `${coverage.toFixed(1)}% properties have CLIP IDs` : 
                'No properties have CLIP IDs',
        coverage,
        total: properties.length,
        withClipId: propertiesWithClipId.length,
        withoutClipId: propertiesWithoutClipId.length,
        sampleProperties: properties.slice(0, 3).map(p => ({
          id: p.id,
          clipId: p.coreLogicClipId || p.clipId,
          hasClipId: Boolean(p.coreLogicClipId || p.clipId)
        }))
      };
    } catch (error) {
      return {
        status: 'error',
        message: `API Error: ${error.message}`,
        coverage: 0,
        total: 0,
        withClipId: 0,
        withoutClipId: 0
      };
    }
  };

  const refreshAllApis = async () => {
    setIsRefreshing(true);
    const results = {};
    
    for (const api of monitoredApis) {
      console.log(`🔍 Checking CLIP ID status for ${api.name}...`);
      results[api.name] = await checkApiClipIdStatus(api);
      await new Promise(resolve => setTimeout(resolve, 500)); // Avoid overwhelming APIs
    }
    
    setApiStatus(results);
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  useEffect(() => {
    refreshAllApis();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <FiAlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'missing':
      case 'error':
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FiAlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'partial':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'missing':
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const overallStatus = Object.values(apiStatus);
  const completeCount = overallStatus.filter(s => s.status === 'complete').length;
  const totalApis = monitoredApis.length;
  const overallProgress = totalApis > 0 ? (completeCount / totalApis) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CLIP ID Integration Monitor</h2>
          <p className="text-gray-600 mt-1">
            Monitoring backend API CLIP ID integration status
          </p>
        </div>
        <button
          onClick={refreshAllApis}
          disabled={isRefreshing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiRefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Checking...' : 'Refresh All'}
        </button>
      </div>

      {/* Overall Progress */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Overall Integration Progress</h3>
          <span className="text-2xl font-bold text-blue-600">
            {overallProgress.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completeCount} of {totalApis} APIs fully integrated with CLIP IDs
        </p>
        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* API Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {monitoredApis.map((api) => {
          const status = apiStatus[api.name];
          
          return (
            <div
              key={api.name}
              className={`border rounded-lg p-4 ${
                status ? getStatusColor(status.status) : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">{api.name}</h4>
                {status && getStatusIcon(status.status)}
              </div>
              
              <p className="text-xs mb-3 opacity-75">
                {api.description}
              </p>
              
              {status ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    {status.message}
                  </div>
                  
                  {status.total > 0 && (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="font-medium">Total</div>
                        <div>{status.total}</div>
                      </div>
                      <div>
                        <div className="font-medium">With CLIP</div>
                        <div className="text-green-600">{status.withClipId}</div>
                      </div>
                      <div>
                        <div className="font-medium">Missing</div>
                        <div className="text-red-600">{status.withoutClipId}</div>
                      </div>
                    </div>
                  )}
                  
                  {status.coverage > 0 && (
                    <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                      <div 
                        className="bg-current h-2 rounded-full transition-all duration-300"
                        style={{ width: `${status.coverage}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-400">
                  {isRefreshing ? 'Checking...' : 'Not checked yet'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Next Steps */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Next Steps for Backend Team</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Implement CoreLogic CLIP ID service in backend</li>
          <li>Add CLIP ID lookup to all property API endpoints</li>
          <li>Ensure 100% CLIP ID coverage before sending data to frontend</li>
          <li>Implement caching to optimize performance</li>
          <li>Test with high-volume property requests</li>
        </ul>
      </div>
    </div>
  );
};

export default ClipIdMonitoringDashboard;