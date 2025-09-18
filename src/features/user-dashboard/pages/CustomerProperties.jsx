import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  TrendingUp,
  Eye,
  Filter,
  Search,
  Grid3x3,
  List,
  Calendar,
  Download,
  MoreVertical,
  Star,
  Users
} from 'lucide-react';

const CustomerProperties = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Mock property data
  const properties = [
    {
      id: 1,
      name: "Luxury Downtown Condo",
      address: "1234 Oak Street, Austin, TX 78704",
      type: "Residential",
      status: "Active",
      investment: 15000,
      currentValue: 18500,
      monthlyIncome: 185.50,
      occupancy: 95,
      tenants: 2,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      yearBuilt: 2018,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      lastUpdate: "2024-01-15",
      roi: 23.33,
      appreciation: 12.5,
      expenses: 45.30
    },
    {
      id: 2,
      name: "Suburban Family Home",
      address: "5678 Elm Drive, Dallas, TX 75201",
      type: "Residential",
      status: "Active",
      investment: 25000,
      currentValue: 28200,
      monthlyIncome: 295.00,
      occupancy: 100,
      tenants: 1,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2100,
      yearBuilt: 2015,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
      lastUpdate: "2024-01-14",
      roi: 12.80,
      appreciation: 8.9,
      expenses: 78.50
    },
    {
      id: 3,
      name: "Modern Office Complex",
      address: "9012 Business Blvd, Houston, TX 77002",
      type: "Commercial",
      status: "Active",
      investment: 35000,
      currentValue: 42500,
      monthlyIncome: 445.75,
      occupancy: 88,
      tenants: 5,
      floors: 3,
      sqft: 5200,
      yearBuilt: 2020,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      lastUpdate: "2024-01-13",
      roi: 21.43,
      appreciation: 15.2,
      expenses: 125.00
    },
    {
      id: 4,
      name: "Riverside Apartment Complex",
      address: "3456 River View, San Antonio, TX 78205",
      type: "Multi-Family",
      status: "Maintenance",
      investment: 45000,
      currentValue: 48900,
      monthlyIncome: 356.25,
      occupancy: 80,
      tenants: 12,
      units: 15,
      sqft: 8500,
      yearBuilt: 2012,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      lastUpdate: "2024-01-12",
      roi: 8.67,
      appreciation: 6.1,
      expenses: 189.75
    }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesType = filterType === 'all' || property.type.toLowerCase() === filterType.toLowerCase();
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            property.status === 'Active' ? 'bg-green-100 text-green-800' :
            property.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {property.status}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <button className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100">
            <Star size={14} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.name}</h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin size={14} className="mr-1" />
            {property.address}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-600">Investment</p>
            <p className="font-semibold">${property.investment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Current Value</p>
            <p className="font-semibold text-green-600">${property.currentValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Monthly Income</p>
            <p className="font-semibold text-purple-600">${property.monthlyIncome}</p>
          </div>
          <div>
            <p className="text-gray-600">ROI</p>
            <p className="font-semibold text-blue-600">{property.roi}%</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {property.bedrooms && (
              <span>{property.bedrooms} bed</span>
            )}
            {property.bathrooms && (
              <span>{property.bathrooms} bath</span>
            )}
            <span>{property.sqft.toLocaleString()} sq ft</span>
          </div>
          <div className="flex items-center text-sm">
            <Users size={14} className="mr-1 text-gray-400" />
            <span className="text-gray-600">{property.occupancy}% occupied</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={() => setSelectedProperty(property)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <MoreVertical size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  const PropertyListItem = ({ property }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-6">
        <img 
          src={property.image} 
          alt={property.name}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              property.status === 'Active' ? 'bg-green-100 text-green-800' :
              property.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {property.status}
            </span>
          </div>
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin size={14} className="mr-1" />
            {property.address}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Investment</p>
              <p className="font-semibold">${property.investment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Value</p>
              <p className="font-semibold text-green-600">${property.currentValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Income</p>
              <p className="font-semibold text-purple-600">${property.monthlyIncome}</p>
            </div>
            <div>
              <p className="text-gray-600">ROI</p>
              <p className="font-semibold text-blue-600">{property.roi}%</p>
            </div>
            <div>
              <p className="text-gray-600">Occupancy</p>
              <p className="font-semibold">{property.occupancy}%</p>
            </div>
            <div className="flex items-end space-x-2">
              <button 
                onClick={() => setSelectedProperty(property)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-600">Manage your real estate portfolio</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Download size={16} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Investment</p>
              <p className="text-2xl font-bold text-gray-900">
                ${properties.reduce((sum, p) => sum + p.investment, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${properties.reduce((sum, p) => sum + p.currentValue, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-gray-900">
                ${properties.reduce((sum, p) => sum + p.monthlyIncome, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="multi-family">Multi-Family</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map(property => (
            <PropertyListItem key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedProperty.name}</h2>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={selectedProperty.image} 
                    alt={selectedProperty.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Property Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Type</p>
                          <p className="font-medium">{selectedProperty.type}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Year Built</p>
                          <p className="font-medium">{selectedProperty.yearBuilt}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Square Feet</p>
                          <p className="font-medium">{selectedProperty.sqft.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tenants</p>
                          <p className="font-medium">{selectedProperty.tenants}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                      <p className="text-gray-600 text-sm flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {selectedProperty.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Financial Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Investment</p>
                        <p className="text-xl font-bold">${selectedProperty.investment.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Current Value</p>
                        <p className="text-xl font-bold text-green-600">${selectedProperty.currentValue.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Monthly Income</p>
                        <p className="text-xl font-bold text-purple-600">${selectedProperty.monthlyIncome}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">ROI</p>
                        <p className="text-xl font-bold text-blue-600">{selectedProperty.roi}%</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Occupancy Rate</span>
                        <span className="font-medium">{selectedProperty.occupancy}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Appreciation</span>
                        <span className="font-medium text-green-600">+{selectedProperty.appreciation}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Monthly Expenses</span>
                        <span className="font-medium">${selectedProperty.expenses}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Net Income</span>
                        <span className="font-medium">${(selectedProperty.monthlyIncome - selectedProperty.expenses).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                      Manage Property
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
                      View Reports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProperties;
