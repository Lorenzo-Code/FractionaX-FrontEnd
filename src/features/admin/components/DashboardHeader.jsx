import React from 'react';

const DashboardHeader = ({
  lastUpdated,
  protocolsLastUpdated,
  protocolInfoLastUpdated,
  isUpdatingProtocolInfo,
  selectedTimeRange,
  timeRangeOptions,
  onRefreshAnalytics,
  onUpdateProtocolInfo,
  onTimeRangeChange
}) => {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">💡 Analytics Dashboard</h2>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Analytics Last Updated: {lastUpdated.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Protocols Config Updated: {protocolsLastUpdated.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Protocol Info Updated: {protocolInfoLastUpdated.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">Time Range:</label>
          <select 
            value={selectedTimeRange} 
            onChange={onTimeRangeChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button 
            onClick={onRefreshAnalytics}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            🔄 Refresh Analytics
          </button>

          <button 
            onClick={onUpdateProtocolInfo}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors flex items-center"
            disabled={isUpdatingProtocolInfo}
          >
            {isUpdatingProtocolInfo ? ( 
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> 
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> 
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> 
              </svg> 
            ) : ( 
              '🔄' 
            )}
            {isUpdatingProtocolInfo ? 'Updating...' : 'Update Protocol Info'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
