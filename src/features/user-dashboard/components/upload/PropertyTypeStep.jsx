import React, { useState } from 'react';
import { 
  Building2, 
  Car, 
  Hotel, 
  Factory, 
  ShoppingBag, 
  Home,
  Trees,
  Stethoscope,
  Utensils,
  Warehouse,
  MapPin,
  ArrowRight,
  Loader2
} from 'lucide-react';

const PropertyTypeStep = ({ onNext, loading }) => {
  const [selectedType, setSelectedType] = useState('');
  const [subType, setSubType] = useState('');
  const [brokerCompany, setBrokerCompany] = useState('');
  const [brokerContact, setBrokerContact] = useState({
    name: '',
    email: '',
    phone: '',
    license: ''
  });

  // Property type definitions with icons and subtypes
  const propertyTypes = [
    {
      id: 'Multifamily',
      name: 'Multifamily',
      icon: Building2,
      color: 'bg-blue-500',
      description: 'Apartment complexes, condos, townhomes',
      subtypes: ['Garden Style', 'High Rise', 'Mid Rise', 'Townhome', 'Condo Complex']
    },
    {
      id: 'Hotel',
      name: 'Hotel',
      icon: Hotel,
      color: 'bg-purple-500',
      description: 'Hotels, motels, resorts, extended stay',
      subtypes: ['Full Service', 'Limited Service', 'Extended Stay', 'Resort', 'Motel']
    },
    {
      id: 'Retail',
      name: 'Retail',
      icon: ShoppingBag,
      color: 'bg-green-500',
      description: 'Shopping centers, standalone retail',
      subtypes: ['Shopping Center', 'Strip Mall', 'Standalone', 'Outlet Mall', 'Department Store']
    },
    {
      id: 'Office Building',
      name: 'Office Building',
      icon: Building2,
      color: 'bg-indigo-500',
      description: 'Office buildings, business parks',
      subtypes: ['Class A', 'Class B', 'Class C', 'Medical Office', 'Business Park']
    },
    {
      id: 'Industrial',
      name: 'Industrial',
      icon: Factory,
      color: 'bg-gray-500',
      description: 'Warehouses, manufacturing, distribution',
      subtypes: ['Warehouse', 'Manufacturing', 'Distribution', 'Flex Space', 'Research & Development']
    },
    {
      id: 'Gas Station',
      name: 'Gas Station',
      icon: Car,
      color: 'bg-red-500',
      description: 'Gas stations, convenience stores',
      subtypes: ['Gas Station', 'Gas + Convenience', 'Truck Stop', 'Car Wash + Gas']
    },
    {
      id: 'Car Wash',
      name: 'Car Wash',
      icon: Car,
      color: 'bg-cyan-500',
      description: 'Car washes, auto services',
      subtypes: ['Automatic', 'Self Service', 'Full Service', 'Express Wash', 'Auto Detail']
    },
    {
      id: 'Restaurant',
      name: 'Restaurant',
      icon: Utensils,
      color: 'bg-orange-500',
      description: 'Restaurants, fast food, dining',
      subtypes: ['Fast Food', 'Casual Dining', 'Fine Dining', 'Fast Casual', 'Drive-Thru']
    },
    {
      id: 'Medical',
      name: 'Medical',
      icon: Stethoscope,
      color: 'bg-pink-500',
      description: 'Medical facilities, clinics',
      subtypes: ['Medical Office', 'Clinic', 'Urgent Care', 'Specialty Medical', 'Dental Office']
    },
    {
      id: 'Self Storage',
      name: 'Self Storage',
      icon: Warehouse,
      color: 'bg-yellow-500',
      description: 'Storage facilities, mini storage',
      subtypes: ['Climate Controlled', 'Traditional', 'Drive-Up', 'Boat/RV Storage', 'Wine Storage']
    },
    {
      id: 'Mobile Home Park',
      name: 'Mobile Home Park',
      icon: Home,
      color: 'bg-emerald-500',
      description: 'Mobile home communities, RV parks',
      subtypes: ['Mobile Home Park', 'RV Park', 'Manufactured Housing', 'Age-Restricted', 'Resort-Style']
    },
    {
      id: 'Land',
      name: 'Land',
      icon: Trees,
      color: 'bg-green-600',
      description: 'Development land, raw land',
      subtypes: ['Development Land', 'Raw Land', 'Agricultural', 'Commercial Land', 'Residential Land']
    },
    {
      id: 'Mixed Use',
      name: 'Mixed Use',
      icon: MapPin,
      color: 'bg-violet-500',
      description: 'Mixed use developments',
      subtypes: ['Retail/Office', 'Retail/Residential', 'Office/Residential', 'Multi-Component']
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedType || !brokerCompany) {
      return;
    }

    const data = {
      propertyType: selectedType,
      subPropertyType: subType,
      brokerCompany,
      brokerContact: {
        name: brokerContact.name || undefined,
        email: brokerContact.email || undefined,
        phone: brokerContact.phone || undefined,
        license: brokerContact.license || undefined
      }
    };

    onNext(data);
  };

  const selectedTypeData = propertyTypes.find(type => type.id === selectedType);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Step 1: Property Type</h2>
        <p className="text-gray-600">
          Select the property type that best describes your listing. This helps us provide relevant forms and market data.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Property Type *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setSelectedType(type.id);
                    setSubType(''); // Reset subtype when changing main type
                  }}
                  className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`${type.color} p-2 rounded-lg mr-3 shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                        {type.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {type.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Property Type */}
        {selectedType && selectedTypeData?.subtypes && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Subtype (Optional)
            </label>
            <select
              value={subType}
              onChange={(e) => setSubType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a subtype...</option>
              {selectedTypeData.subtypes.map((subtype) => (
                <option key={subtype} value={subtype}>
                  {subtype}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Broker Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Broker Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Broker Company *
              </label>
              <input
                type="text"
                value={brokerCompany}
                onChange={(e) => setBrokerCompany(e.target.value)}
                placeholder="e.g., XYZ Commercial Real Estate"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Name (Optional)
              </label>
              <input
                type="text"
                value={brokerContact.name}
                onChange={(e) => setBrokerContact({...brokerContact, name: e.target.value})}
                placeholder="Leave blank to use your account name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email (Optional)
              </label>
              <input
                type="email"
                value={brokerContact.email}
                onChange={(e) => setBrokerContact({...brokerContact, email: e.target.value})}
                placeholder="Leave blank to use your account email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={brokerContact.phone}
                onChange={(e) => setBrokerContact({...brokerContact, phone: e.target.value})}
                placeholder="(555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number (Optional)
              </label>
              <input
                type="text"
                value={brokerContact.license}
                onChange={(e) => setBrokerContact({...brokerContact, license: e.target.value})}
                placeholder="License #"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={!selectedType || !brokerCompany || loading}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Listing...
              </>
            ) : (
              <>
                Continue to Deal Info
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyTypeStep;