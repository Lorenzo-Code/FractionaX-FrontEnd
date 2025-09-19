import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Send,
  Save,
  Eye,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Edit3,
  Download,
  Share2,
  Building2,
  DollarSign,
  MapPin,
  FileText,
  Image,
  Loader2,
  Globe,
  Database
} from 'lucide-react';

const ReviewPublishStep = ({ listingData, onPublish, onPrevious, loading }) => {
  const [marketingEdits, setMarketingEdits] = useState({
    title: listingData?.marketing?.title || '',
    description: listingData?.marketing?.description || '',
    highlights: listingData?.marketing?.highlights || [],
    keyFeatures: ['', '', ''],
    investmentHighlights: ['', '', '']
  });

  const [isEditing, setIsEditing] = useState(false);
  const [publishOption, setPublishOption] = useState('publish'); // publish, save_draft
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleMarketingChange = (field, value) => {
    setMarketingEdits(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleArrayChange = (field, index, value) => {
    setMarketingEdits(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
    setHasUnsavedChanges(true);
  };

  const handlePublish = (action = 'publish') => {
    // Always pass the current marketing data (edited or original)
    const currentMarketing = getCurrentMarketingData();
    const updates = {
      marketing: {
        title: currentMarketing.title,
        description: currentMarketing.description,
        highlights: currentMarketing.highlights || [],
        keyFeatures: marketingEdits.keyFeatures.filter(f => f.trim() !== ''),
        investmentHighlights: marketingEdits.investmentHighlights.filter(h => h.trim() !== '')
      }
    };
    onPublish(action, updates);
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    
    const num = Number(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatCurrencyCompact = (amount) => {
    if (!amount) return { display: 'N/A', full: 'N/A' };
    
    const num = Number(amount);
    const full = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
    
    let display;
    if (num >= 1000000000) {
      display = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(num / 1000000000) + 'B';
    } else if (num >= 1000000) {
      display = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(num / 1000000) + 'M';
    } else {
      display = full;
    }
    
    return { display, full };
  };

  const formatPercentage = (value) => {
    if (!value) return 'N/A';
    return `${value.toFixed(1)}%`;
  };

  // Get current marketing data (either edited or original)
  const getCurrentMarketingData = () => {
    if (hasUnsavedChanges) {
      return marketingEdits;
    }
    return listingData?.marketing || {
      title: '',
      description: ''
    };
  };

  // Validation check
  const isReadyToPublish = () => {
    const currentMarketing = getCurrentMarketingData();
    return listingData?.dealInfo?.askingPrice && 
           listingData?.address?.street && 
           currentMarketing?.title &&
           currentMarketing?.description;
  };

  const getValidationIssues = () => {
    const issues = [];
    const currentMarketing = getCurrentMarketingData();
    if (!listingData?.dealInfo?.askingPrice) issues.push('Asking price is required');
    if (!listingData?.address?.street) issues.push('Property address is required');
    if (!currentMarketing?.title) issues.push('Marketing title is required');
    if (!currentMarketing?.description) issues.push('Marketing description is required');
    return issues;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Step 5: Review & Publish</h2>
        <p className="text-gray-600">
          Review your listing details and publish to make it live on the marketplace and available for syndication.
        </p>
      </div>

      {/* Validation Issues */}
      {!isReadyToPublish() && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-2">Cannot Publish - Issues Found</h3>
              <ul className="text-sm text-red-700 space-y-1">
                {getValidationIssues().map((issue, index) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
              <p className="text-sm text-red-700 mt-2">
                Please go back and complete the required fields before publishing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Listing Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Property Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                Property Information
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit Marketing
                  {hasUnsavedChanges && (
                    <span className="ml-1 w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes"></span>
                  )}
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Property Type</div>
                <div className="font-medium text-gray-900">
                  {listingData?.propertyType}
                  {listingData?.subPropertyType && ` - ${listingData.subPropertyType}`}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Listing Title</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={marketingEdits.title}
                    onChange={(e) => handleMarketingChange('title', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={200}
                  />
                ) : (
                  <div className="font-medium text-gray-900">{getCurrentMarketingData()?.title}</div>
                )}
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Description</div>
                {isEditing ? (
                  <textarea
                    value={marketingEdits.description}
                    onChange={(e) => handleMarketingChange('description', e.target.value)}
                    rows={4}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={2000}
                  />
                ) : (
                  <div className="text-gray-900">{getCurrentMarketingData()?.description}</div>
                )}
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Financial Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-1">Asking Price</div>
                <div className="text-xl font-bold text-gray-900 break-words" 
                     title={formatCurrencyCompact(listingData?.dealInfo?.askingPrice).full}>
                  {formatCurrencyCompact(listingData?.dealInfo?.askingPrice).display}
                </div>
              </div>
              
              {listingData?.dealInfo?.noi && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 mb-1">NOI</div>
                  <div className="text-xl font-bold text-green-700 break-words"
                       title={formatCurrencyCompact(listingData.dealInfo.noi).full}>
                    {formatCurrencyCompact(listingData.dealInfo.noi).display}
                  </div>
                </div>
              )}
              
              {listingData?.dealInfo?.capRate && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 mb-1">Cap Rate</div>
                  <div className="text-xl font-bold text-blue-700">
                    {formatPercentage(listingData.dealInfo.capRate)}
                  </div>
                </div>
              )}
              
              {listingData?.pricePerSquareFoot && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 mb-1">Price/SF</div>
                  <div className="text-xl font-bold text-purple-700 break-words"
                       title={formatCurrencyCompact(listingData.pricePerSquareFoot).full}>
                    {formatCurrencyCompact(listingData.pricePerSquareFoot).display}
                  </div>
                </div>
              )}
            </div>
            
            {/* Additional Financial Metrics Row */}
            {(listingData?.dealInfo?.grossIncome || listingData?.dealInfo?.operatingExpenses || listingData?.dealInfo?.occupancyRate) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
                {listingData?.dealInfo?.grossIncome && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 mb-1">Gross Income</div>
                    <div className="text-lg font-semibold text-gray-900 break-words"
                         title={formatCurrencyCompact(listingData.dealInfo.grossIncome).full}>
                      {formatCurrencyCompact(listingData.dealInfo.grossIncome).display}
                    </div>
                  </div>
                )}
                
                {listingData?.dealInfo?.operatingExpenses && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 mb-1">Operating Expenses</div>
                    <div className="text-lg font-semibold text-red-700 break-words"
                         title={formatCurrencyCompact(listingData.dealInfo.operatingExpenses).full}>
                      {formatCurrencyCompact(listingData.dealInfo.operatingExpenses).display}
                    </div>
                  </div>
                )}
                
                {listingData?.dealInfo?.occupancyRate && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 mb-1">Occupancy Rate</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatPercentage(listingData.dealInfo.occupancyRate)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-600" />
              Property Details
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Address</div>
                <div className="font-medium text-gray-900">{listingData?.fullAddress}</div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {listingData?.dealInfo?.squareFootage && (
                  <div>
                    <div className="text-sm text-gray-600">Square Footage</div>
                    <div className="font-medium text-gray-900">
                      {listingData.dealInfo.squareFootage.toLocaleString()} SF
                    </div>
                  </div>
                )}
                
                {listingData?.dealInfo?.yearBuilt && (
                  <div>
                    <div className="text-sm text-gray-600">Year Built</div>
                    <div className="font-medium text-gray-900">{listingData.dealInfo.yearBuilt}</div>
                  </div>
                )}
                
                {listingData?.dealInfo?.totalUnits && (
                  <div>
                    <div className="text-sm text-gray-600">Total Units</div>
                    <div className="font-medium text-gray-900">{listingData.dealInfo.totalUnits}</div>
                  </div>
                )}
                
                {listingData?.dealInfo?.occupancyRate && (
                  <div>
                    <div className="text-sm text-gray-600">Occupancy</div>
                    <div className="font-medium text-gray-900">
                      {formatPercentage(listingData.dealInfo.occupancyRate)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Marketing Highlights */}
          {isEditing && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Enhanced Marketing</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Features (Optional)
                  </label>
                  {marketingEdits.keyFeatures.map((feature, index) => (
                    <input
                      key={index}
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange('keyFeatures', index, e.target.value)}
                      placeholder={`Key feature ${index + 1}`}
                      className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Highlights (Optional)
                  </label>
                  {marketingEdits.investmentHighlights.map((highlight, index) => (
                    <input
                      key={index}
                      type="text"
                      value={highlight}
                      onChange={(e) => handleArrayChange('investmentHighlights', index, e.target.value)}
                      placeholder={`Investment highlight ${index + 1}`}
                      className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  onClick={() => {
                    // Reset to original values on cancel
                    setMarketingEdits({
                      title: listingData?.marketing?.title || '',
                      description: listingData?.marketing?.description || '',
                      highlights: listingData?.marketing?.highlights || [],
                      keyFeatures: ['', '', ''],
                      investmentHighlights: ['', '', '']
                    });
                    setHasUnsavedChanges(false);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    // Keep hasUnsavedChanges true so validation uses the edited values
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Upload Summary & Syndication */}
        <div className="space-y-6">
          {/* Upload Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Property Type:</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Deal Information:</span>
                {listingData?.dealInfo?.askingPrice ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Documents:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {/* Count uploaded documents */}
                    {listingData?.documents ? 
                      Object.values(listingData.documents).flat().filter(Boolean).length || 0 
                      : 0} files
                  </span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Enrichment:</span>
                {listingData?.enrichmentData ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-300" />
                )}
              </div>
            </div>
          </div>

          {/* Syndication Preview */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Share2 className="w-5 h-5 mr-2 text-purple-600" />
              Syndication Ready
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Once published, your listing will automatically generate syndication exports for:
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Database className="w-4 h-4 text-blue-500 mr-2" />
                <span>JSON Export (Buildout, Apto)</span>
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-green-500 mr-2" />
                <span>XML Export (MLS, LoopNet)</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 text-purple-500 mr-2" />
                <span>API Access (Real-time)</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-700 font-medium mb-1">Export URLs Available After Publishing</div>
              <div className="text-xs text-blue-600">
                Structured data feeds will be automatically generated for integration with major CRE platforms.
              </div>
            </div>
          </div>

          {/* Broker Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Broker Information</h3>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Company:</span>
                <div className="font-medium text-gray-900">{listingData?.brokerCompany}</div>
              </div>
              
              {listingData?.brokerContact?.name && (
                <div>
                  <span className="text-gray-600">Contact:</span>
                  <div className="font-medium text-gray-900">{listingData.brokerContact.name}</div>
                </div>
              )}
              
              {listingData?.brokerContact?.email && (
                <div>
                  <span className="text-gray-600">Email:</span>
                  <div className="font-medium text-gray-900">{listingData.brokerContact.email}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Publish Actions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Publish Options</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="radio"
              id="publish"
              name="publishOption"
              value="publish"
              checked={publishOption === 'publish'}
              onChange={(e) => setPublishOption(e.target.value)}
              disabled={!isReadyToPublish()}
              className="mt-1"
            />
            <div>
              <label htmlFor="publish" className={`font-medium ${!isReadyToPublish() ? 'text-gray-400' : 'text-gray-900'}`}>
                Publish Listing
              </label>
              <p className="text-sm text-gray-600">
                Make your listing live on the marketplace and available for syndication to external platforms.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <input
              type="radio"
              id="save_draft"
              name="publishOption"
              value="save_draft"
              checked={publishOption === 'save_draft'}
              onChange={(e) => setPublishOption(e.target.value)}
              className="mt-1"
            />
            <div>
              <label htmlFor="save_draft" className="font-medium text-gray-900">
                Save as Draft
              </label>
              <p className="text-sm text-gray-600">
                Save your progress and continue editing later. The listing will not be public.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrevious}
          disabled={loading}
          className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Enrichment
        </button>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => handlePublish('save_draft')}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handlePublish('publish')}
            disabled={loading || !isReadyToPublish()}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Publish Listing
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPublishStep;