import React, { useState, useMemo } from 'react';
import {
  Map,
  MapPin,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Filter,
  Layers,
  Maximize2,
  Minimize2,
  Info,
  Target,
  Activity,
  Building,
  Home,
  Store,
  Zap,
  Eye,
  Calendar
} from 'lucide-react';

const PropertyPerformanceHeatmap = ({ portfolioData, marketData }) => {
  const [mapView, setMapView] = useState('performance'); // performance, value, growth
  const [timeframe, setTimeframe] = useState('1Y');
  const [filterType, setFilterType] = useState('all');
  const [showClusters, setShowClusters] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock property data with geographic coordinates and performance metrics
  const mockPropertyData = {
    properties: [
      {
        id: 1,
        name: "Luxury Downtown Condo",
        address: "123 Main St, Austin, TX",
        coordinates: [30.2672, -97.7431],
        propertyType: "Residential",
        investment: 15000,
        currentValue: 18500,
        returns: 3500,
        returnRate: 23.33,
        monthlyIncome: 185.50,
        occupancyRate: 95,
        appreciation: 18.2,
        marketTrend: "up",
        riskLevel: "Medium",
        lastUpdated: "2024-08-25"
      },
      {
        id: 2,
        name: "Suburban Family Home",
        address: "456 Oak Ave, Dallas, TX",
        coordinates: [32.7767, -96.7970],
        propertyType: "Residential",
        investment: 25000,
        currentValue: 28200,
        returns: 3200,
        returnRate: 12.80,
        monthlyIncome: 295.00,
        occupancyRate: 100,
        appreciation: 10.5,
        marketTrend: "stable",
        riskLevel: "Low",
        lastUpdated: "2024-08-24"
      },
      {
        id: 3,
        name: "Modern Office Complex",
        address: "789 Business Blvd, Houston, TX",
        coordinates: [29.7604, -95.3698],
        propertyType: "Commercial",
        investment: 35000,
        currentValue: 42500,
        returns: 7500,
        returnRate: 21.43,
        monthlyIncome: 445.75,
        occupancyRate: 85,
        appreciation: 15.8,
        marketTrend: "up",
        riskLevel: "High",
        lastUpdated: "2024-08-25"
      },
      {
        id: 4,
        name: "Retail Shopping Center",
        address: "321 Commerce Dr, Miami, FL",
        coordinates: [25.7617, -80.1918],
        propertyType: "Retail",
        investment: 20000,
        currentValue: 22550,
        returns: 2550,
        returnRate: 12.75,
        monthlyIncome: 156.25,
        occupancyRate: 78,
        appreciation: 8.3,
        marketTrend: "down",
        riskLevel: "Medium",
        lastUpdated: "2024-08-23"
      },
      {
        id: 5,
        name: "Industrial Warehouse",
        address: "555 Industry Way, Phoenix, AZ",
        coordinates: [33.4484, -112.0740],
        propertyType: "Industrial",
        investment: 45000,
        currentValue: 52000,
        returns: 7000,
        returnRate: 15.56,
        monthlyIncome: 520.00,
        occupancyRate: 100,
        appreciation: 12.1,
        marketTrend: "up",
        riskLevel: "Low",
        lastUpdated: "2024-08-25"
      }
    ],
    marketData: {
      regions: {
        'TX': { avgReturn: 17.2, marketHealth: 85, trend: 'up' },
        'FL': { avgReturn: 11.8, marketHealth: 72, trend: 'stable' },
        'AZ': { avgReturn: 14.3, marketHealth: 78, trend: 'up' }
      },
      heatmapData: [
        { lat: 30.2672, lng: -97.7431, intensity: 0.9, value: 23.33 },
        { lat: 32.7767, lng: -96.7970, intensity: 0.6, value: 12.80 },
        { lat: 29.7604, lng: -95.3698, intensity: 0.8, value: 21.43 },
        { lat: 25.7617, lng: -80.1918, intensity: 0.5, value: 12.75 },
        { lat: 33.4484, lng: -112.0740, intensity: 0.7, value: 15.56 }
      ]
    }
  };

  const data = portfolioData || mockPropertyData;
  const properties = data.properties || [];

  // Filter properties based on type
  const filteredProperties = useMemo(() => {
    if (filterType === 'all') return properties;
    return properties.filter(prop => prop.propertyType.toLowerCase() === filterType.toLowerCase());
  }, [properties, filterType]);

  // Calculate performance clusters
  const performanceClusters = useMemo(() => {
    const clusters = {};
    filteredProperties.forEach(prop => {
      const state = prop.address.split(', ')[1];
      if (!clusters[state]) {
        clusters[state] = {
          properties: [],
          avgReturn: 0,
          totalValue: 0,
          coordinates: prop.coordinates
        };
      }
      clusters[state].properties.push(prop);
    });

    // Calculate cluster averages
    Object.keys(clusters).forEach(state => {
      const cluster = clusters[state];
      cluster.avgReturn = cluster.properties.reduce((sum, p) => sum + p.returnRate, 0) / cluster.properties.length;
      cluster.totalValue = cluster.properties.reduce((sum, p) => sum + p.currentValue, 0);
    });

    return clusters;
  }, [filteredProperties]);

  // Get property performance color
  const getPerformanceColor = (returnRate) => {
    if (returnRate >= 20) return 'text-green-600 bg-green-100';
    if (returnRate >= 15) return 'text-blue-600 bg-blue-100';
    if (returnRate >= 10) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPropertyIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'residential': return Home;
      case 'commercial': return Building;
      case 'retail': return Store;
      case 'industrial': return Activity;
      default: return MapPin;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-yellow-600" />;
    }
  };

  const viewOptions = [
    { id: 'performance', name: 'Performance', icon: TrendingUp },
    { id: 'value', name: 'Property Value', icon: DollarSign },
    { id: 'growth', name: 'Growth Rate', icon: BarChart3 }
  ];

  const typeFilters = [
    { id: 'all', name: 'All Properties' },
    { id: 'residential', name: 'Residential' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'retail', name: 'Retail' },
    { id: 'industrial', name: 'Industrial' }
  ];

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 bg-white z-50 p-6' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Map className="w-6 h-6 mr-2 text-blue-600" />
            Property Performance Map
          </h2>
          <p className="text-gray-600">Geographic visualization of your real estate portfolio performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {viewOptions.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setMapView(id)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    mapView === id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon size={14} />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {typeFilters.map(filter => (
                  <option key={filter.id} value={filter.id}>{filter.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1M">1 Month</option>
                <option value="3M">3 Months</option>
                <option value="6M">6 Months</option>
                <option value="1Y">1 Year</option>
              </select>
            </div>

            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showClusters}
                onChange={(e) => setShowClusters(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Show Clusters</span>
            </label>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className={`bg-white rounded-xl shadow-sm border overflow-hidden ${isFullscreen ? 'flex-1' : 'h-96'}`}>
        {/* Mock Map Interface */}
        <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 300">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Property Markers */}
          {filteredProperties.map((property) => {
            const IconComponent = getPropertyIcon(property.propertyType);
            const performanceColor = getPerformanceColor(property.returnRate);
            
            return (
              <div
                key={property.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${(property.coordinates[1] + 120) * 2}px`,
                  top: `${(40 - property.coordinates[0]) * 5 + 50}px`
                }}
                onClick={() => setSelectedProperty(property)}
              >
                <div className={`p-2 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform ${performanceColor}`}>
                  <IconComponent size={16} />
                </div>
                
                {/* Performance Badge */}
                <div className="absolute -top-2 -right-2 bg-white rounded-full px-1 py-0.5 text-xs font-bold shadow-sm border">
                  {property.returnRate.toFixed(1)}%
                </div>
              </div>
            );
          })}

          {/* Cluster Indicators */}
          {showClusters && Object.entries(performanceClusters).map(([state, cluster]) => (
            <div
              key={state}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(cluster.coordinates[1] + 120) * 2 + 40}px`,
                top: `${(40 - cluster.coordinates[0]) * 5 + 20}px`
              }}
            >
              <div className="bg-blue-600 text-white rounded-full p-2 text-xs font-bold shadow-lg">
                {state}
              </div>
            </div>
          ))}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Performance Scale</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-xs text-gray-600">20%+ Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-xs text-gray-600">15-20% Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span className="text-xs text-gray-600">10-15% Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-xs text-gray-600">Below 10%</span>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg border">
            <div className="flex flex-col space-y-2">
              <button className="p-2 hover:bg-gray-50 rounded text-gray-600">
                <Target size={16} />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded text-gray-600">
                <Zap size={16} />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded text-gray-600">
                <Eye size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Panel */}
      {selectedProperty && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedProperty.name}</h3>
              <p className="text-gray-600">{selectedProperty.address}</p>
            </div>
            <button
              onClick={() => setSelectedProperty(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {selectedProperty.returnRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Return Rate</div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${selectedProperty.currentValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Current Value</div>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ${selectedProperty.monthlyIncome.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Monthly Income</div>
            </div>

            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {selectedProperty.occupancyRate}%
              </div>
              <div className="text-sm text-gray-600">Occupancy Rate</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getTrendIcon(selectedProperty.marketTrend)}
              <span className="text-sm text-gray-600">Market Trend: {selectedProperty.marketTrend}</span>
            </div>
            <div className="text-sm text-gray-500">
              Updated: {selectedProperty.lastUpdated}
            </div>
          </div>
        </div>
      )}

      {/* Regional Performance Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(performanceClusters).map(([state, cluster]) => (
            <div key={state} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{state}</h4>
                <span className="text-sm text-gray-600">{cluster.properties.length} properties</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Return</span>
                  <span className={`text-sm font-semibold ${cluster.avgReturn >= 15 ? 'text-green-600' : cluster.avgReturn >= 10 ? 'text-blue-600' : 'text-yellow-600'}`}>
                    {cluster.avgReturn.toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Value</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${cluster.totalValue.toLocaleString()}
                  </span>
                </div>
                
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div 
                    className={`h-full rounded-full ${cluster.avgReturn >= 15 ? 'bg-green-500' : cluster.avgReturn >= 10 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                    style={{ width: `${Math.min(100, cluster.avgReturn * 5)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Note */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Interactive Map Integration</h4>
            <p className="text-sm text-blue-700 mt-1">
              This mockup shows the layout and functionality. In production, this would integrate with mapping services 
              like Google Maps, Mapbox, or Leaflet to display actual geographic data with clustering, heat layers, 
              and interactive property markers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPerformanceHeatmap;
