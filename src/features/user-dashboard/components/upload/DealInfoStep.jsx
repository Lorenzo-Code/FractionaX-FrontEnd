import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  DollarSign, 
  MapPin,
  Building,
  Users,
  Calculator,
  Loader2,
  Info
} from 'lucide-react';

const DealInfoStep = ({ listingData, onNext, onPrevious, loading }) => {
  const [formData, setFormData] = useState({
    // Financial Information
    askingPrice: '',
    noi: '',
    capRate: '',
    grossIncome: '',
    operatingExpenses: '',
    
    // Property Details
    squareFootage: '',
    lotSize: '',
    yearBuilt: '',
    totalUnits: '',
    occupancyRate: '',
    
    // Address Information
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      county: ''
    },
    
    // Marketing Information
    title: '',
    description: '',
    highlights: ['', '', ''],
    
    // Tenant Information (for multifamily/office)
    tenants: []
  });

  const [errors, setErrors] = useState({});
  const [autoCalculate, setAutoCalculate] = useState(true);

  // Auto-calculate cap rate when NOI and asking price are provided
  useEffect(() => {
    if (autoCalculate && formData.noi && formData.askingPrice) {
      const calculatedCapRate = ((parseFloat(formData.noi) / parseFloat(formData.askingPrice)) * 100).toFixed(2);
      if (!isNaN(calculatedCapRate)) {
        setFormData(prev => ({ ...prev, capRate: calculatedCapRate }));
      }
    }
  }, [formData.noi, formData.askingPrice, autoCalculate]);

  // Auto-calculate NOI when gross income and operating expenses are provided
  useEffect(() => {
    if (formData.grossIncome && formData.operatingExpenses) {
      const calculatedNOI = (parseFloat(formData.grossIncome) - parseFloat(formData.operatingExpenses)).toFixed(0);
      if (!isNaN(calculatedNOI) && calculatedNOI >= 0) {
        setFormData(prev => ({ ...prev, noi: calculatedNOI }));
      }
    }
  }, [formData.grossIncome, formData.operatingExpenses]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
    if (errors[`address.${field}`]) {
      setErrors(prev => ({ ...prev, [`address.${field}`]: null }));
    }
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData(prev => ({ ...prev, highlights: newHighlights }));
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    const number = parseFloat(value.replace(/[^0-9.-]+/g, ''));
    return number.toLocaleString();
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.askingPrice) newErrors.askingPrice = 'Asking price is required';
    if (!formData.address.street) newErrors['address.street'] = 'Street address is required';
    if (!formData.address.city) newErrors['address.city'] = 'City is required';
    if (!formData.address.state) newErrors['address.state'] = 'State is required';
    if (!formData.address.zipCode) newErrors['address.zipCode'] = 'ZIP code is required';
    if (!formData.title) newErrors.title = 'Property title is required';
    if (!formData.description) newErrors.description = 'Property description is required';

    // Validation logic
    if (formData.askingPrice && isNaN(parseFloat(formData.askingPrice.replace(/[^0-9.-]+/g, '')))) {
      newErrors.askingPrice = 'Please enter a valid price';
    }
    
    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.address.zipCode)) {
      newErrors['address.zipCode'] = 'Please enter a valid ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert string numbers to actual numbers for API
    const submitData = {
      ...formData,
      askingPrice: parseFloat(formData.askingPrice.replace(/[^0-9.-]+/g, '')),
      noi: formData.noi ? parseFloat(formData.noi.replace(/[^0-9.-]+/g, '')) : undefined,
      capRate: formData.capRate ? parseFloat(formData.capRate) : undefined,
      grossIncome: formData.grossIncome ? parseFloat(formData.grossIncome.replace(/[^0-9.-]+/g, '')) : undefined,
      operatingExpenses: formData.operatingExpenses ? parseFloat(formData.operatingExpenses.replace(/[^0-9.-]+/g, '')) : undefined,
      squareFootage: formData.squareFootage ? parseInt(formData.squareFootage.replace(/[^0-9]+/g, '')) : undefined,
      lotSize: formData.lotSize ? parseFloat(formData.lotSize) : undefined,
      yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
      totalUnits: formData.totalUnits ? parseInt(formData.totalUnits) : undefined,
      occupancyRate: formData.occupancyRate ? parseFloat(formData.occupancyRate) : undefined,
      highlights: formData.highlights.filter(h => h.trim() !== '')
    };

    onNext(submitData);
  };

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Step 2: Deal Information</h2>
        <p className="text-gray-600">
          Enter the property details, pricing, and location. We'll auto-calculate key metrics like cap rate and NOI when possible.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Financial Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Financial Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asking Price *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="text"
                  value={formData.askingPrice}
                  onChange={(e) => handleInputChange('askingPrice', e.target.value)}
                  onBlur={(e) => handleInputChange('askingPrice', formatCurrency(e.target.value))}
                  placeholder="2,500,000"
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.askingPrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.askingPrice && <p className="text-red-600 text-sm mt-1">{errors.askingPrice}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Net Operating Income (NOI)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="text"
                  value={formData.noi}
                  onChange={(e) => handleInputChange('noi', e.target.value)}
                  onBlur={(e) => handleInputChange('noi', formatCurrency(e.target.value))}
                  placeholder="250,000"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cap Rate
                <span className="text-xs text-gray-500 ml-1">(Auto-calculated)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={formData.capRate}
                  onChange={(e) => {
                    setAutoCalculate(false);
                    handleInputChange('capRate', e.target.value);
                  }}
                  placeholder="10.00"
                  className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gross Income
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="text"
                  value={formData.grossIncome}
                  onChange={(e) => handleInputChange('grossIncome', e.target.value)}
                  onBlur={(e) => handleInputChange('grossIncome', formatCurrency(e.target.value))}
                  placeholder="350,000"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operating Expenses
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="text"
                  value={formData.operatingExpenses}
                  onChange={(e) => handleInputChange('operatingExpenses', e.target.value)}
                  onBlur={(e) => handleInputChange('operatingExpenses', formatCurrency(e.target.value))}
                  placeholder="100,000"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-600" />
            Property Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Square Footage
              </label>
              <input
                type="text"
                value={formData.squareFootage}
                onChange={(e) => handleInputChange('squareFootage', e.target.value.replace(/[^0-9,]/g, ''))}
                placeholder="50,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lot Size (acres)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.lotSize}
                onChange={(e) => handleInputChange('lotSize', e.target.value)}
                placeholder="2.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year Built
              </label>
              <input
                type="number"
                min="1800"
                max={new Date().getFullYear() + 2}
                value={formData.yearBuilt}
                onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                placeholder="2015"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* For multifamily properties */}
            {listingData?.propertyType === 'Multifamily' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Units
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalUnits}
                    onChange={(e) => handleInputChange('totalUnits', e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occupancy Rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.occupancyRate}
                      onChange={(e) => handleInputChange('occupancyRate', e.target.value)}
                      placeholder="95.0"
                      className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-red-600" />
            Property Address
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="123 Main Street"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors['address.street'] ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors['address.street'] && <p className="text-red-600 text-sm mt-1">{errors['address.street']}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="Atlanta"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['address.city'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors['address.city'] && <p className="text-red-600 text-sm mt-1">{errors['address.city']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['address.state'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">State</option>
                  {usStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors['address.state'] && <p className="text-red-600 text-sm mt-1">{errors['address.state']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  placeholder="30309"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['address.zipCode'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors['address.zipCode'] && <p className="text-red-600 text-sm mt-1">{errors['address.zipCode']}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                County (Optional)
              </label>
              <input
                type="text"
                value={formData.address.county}
                onChange={(e) => handleAddressChange('county', e.target.value)}
                placeholder="Fulton County"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Marketing Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-purple-600" />
            Marketing Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Prime Commercial Property - High ROI Investment Opportunity"
                maxLength={200}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <div className="text-right text-xs text-gray-500 mt-1">{formData.title.length}/200</div>
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the property, its features, location benefits, and investment highlights..."
                rows={4}
                maxLength={2000}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <div className="text-right text-xs text-gray-500 mt-1">{formData.description.length}/2000</div>
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Highlights (Optional)
              </label>
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    placeholder={`Highlight ${index + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Property Type
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue to Documents
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DealInfoStep;