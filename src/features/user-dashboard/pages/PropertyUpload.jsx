import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { smartFetch } from '../../../shared/utils/secureApiClient';
import useAuth from '../../../shared/hooks/useAuth';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  Building2,
  FileText,
  Upload,
  Sparkles,
  Eye,
  AlertCircle,
  Save,
  Send
} from 'lucide-react';

// Step Components
import PropertyTypeStep from '../components/upload/PropertyTypeStep';
import DealInfoStep from '../components/upload/DealInfoStep';
import DocumentUploadStep from '../components/upload/DocumentUploadStep';
import EnrichmentStep from '../components/upload/EnrichmentStep';
import ReviewPublishStep from '../components/upload/ReviewPublishStep';

const PropertyUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [listingData, setListingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Step definitions
  const steps = [
    { id: 1, title: 'Property Type', icon: Building2, description: 'Select property category' },
    { id: 2, title: 'Deal Info', icon: FileText, description: 'Enter property details' },
    { id: 3, title: 'Documents', icon: Upload, description: 'Upload files & photos' },
    { id: 4, title: 'Auto-Enrich', icon: Sparkles, description: 'CoreLogic data pull' },
    { id: 5, title: 'Review & Publish', icon: Eye, description: 'Final review & publish' }
  ];

  // Check if user has broker access
  useEffect(() => {
    if (user && !['broker', 'admin'].includes(user.role)) {
      setError('Access denied. Broker privileges required to create listings.');
      setTimeout(() => navigate('/dashboard'), 3000);
    }
  }, [user, navigate]);

  // Step 1: Create listing with property type
  const handleCreateListing = async (propertyTypeData) => {
    setLoading(true);
    setError(null);
    
    // Debug authentication state
    const token = localStorage.getItem('access_token');
    console.log('🔐 Auth Debug:', {
      user: user,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 50) + '...' : 'None',
      userRole: user?.role,
      isAuthenticated: !!user
    });
    
    if (!user) {
      throw new Error('User not authenticated. Please log in.');
    }
    
    if (!['broker', 'admin'].includes(user.role)) {
      throw new Error('Access denied. Broker privileges required to create listings.');
    }
    
    try {
      const response = await smartFetch('/api/listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyTypeData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to create listing');
      }

      const data = await response.json();
      setListingData(data.listing);
      setCurrentStep(2);
      setSuccess('Listing created successfully! Continue with deal information.');
      
    } catch (err) {
      console.error('Create listing error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Update deal information
  const handleUpdateDealInfo = async (dealInfoData) => {
    if (!listingData?.id) return;
    
    setLoading(true);
    setError(null);
    
    // Debug the data being sent
    console.log('🔍 Deal Info Debug:', {
      listingId: listingData.id,
      dealInfoData: dealInfoData,
      requiredFields: {
        hasAskingPrice: !!dealInfoData.askingPrice,
        hasAddress: !!dealInfoData.address,
        addressComplete: !!(dealInfoData.address?.street && dealInfoData.address?.city && dealInfoData.address?.state && dealInfoData.address?.zipCode)
      }
    });
    
    try {
      const response = await smartFetch(`/api/listings/${listingData.id}/deal-info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealInfoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to update deal information');
      }

      const data = await response.json();
      setListingData({ ...listingData, ...data.listing });
      setCurrentStep(3);
      setSuccess('Deal information saved! Upload your documents next.');
      
    } catch (err) {
      console.error('Update deal info error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Upload documents
  const handleUploadDocuments = async (documentsData) => {
    if (!listingData?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // Append files
      if (documentsData.offeringMemorandum) {
        formData.append('offeringMemorandum', documentsData.offeringMemorandum);
      }
      
      if (documentsData.financials) {
        documentsData.financials.forEach(file => {
          formData.append('financials', file);
        });
        
        // Append financial types
        documentsData.financialTypes.forEach(type => {
          formData.append('financialTypes', type);
        });
      }
      
      if (documentsData.photos) {
        documentsData.photos.forEach(file => {
          formData.append('photos', file);
        });
        
        // Append photo descriptions
        documentsData.photoDescriptions.forEach(desc => {
          formData.append('photoDescriptions', desc);
        });
      }
      
      if (documentsData.additionalDocs) {
        documentsData.additionalDocs.forEach(file => {
          formData.append('additionalDocs', file);
        });
      }

      const response = await smartFetch(`/api/listings/${listingData.id}/documents`, {
        method: 'POST',
        body: formData // No Content-Type header for FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to upload documents');
      }

      const data = await response.json();
      setCurrentStep(4);
      setSuccess(`Documents uploaded successfully! ${data.uploadedFiles.photos} photos, ${data.uploadedFiles.financials} financial docs.`);
      
    } catch (err) {
      console.error('Document upload error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Trigger enrichment
  const handleTriggerEnrichment = async () => {
    if (!listingData?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await smartFetch(`/api/listings/${listingData.id}/enrich`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to enrich property data');
      }

      const data = await response.json();
      setListingData({ ...listingData, enrichmentData: data.enrichmentData });
      setCurrentStep(5);
      setSuccess('Property data enriched with CoreLogic information!');
      
    } catch (err) {
      console.error('Enrichment error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 5: Publish listing
  const handlePublishListing = async (action, marketingUpdates = null) => {
    if (!listingData?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await smartFetch(`/api/listings/${listingData.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, marketingUpdates })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to publish listing');
      }

      const data = await response.json();
      
      if (action === 'publish') {
        setSuccess('🎉 Listing published successfully! It\'s now live on the marketplace.');
        setTimeout(() => navigate('/dashboard/my-listings'), 3000);
      } else {
        setSuccess('Draft saved successfully. You can continue editing later.');
      }
      
    } catch (err) {
      console.error('Publish listing error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  // Access control check
  if (user && !['broker', 'admin'].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            Broker privileges are required to create property listings.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Mobile-friendly Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Upload Property Listing</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Create a professional property listing in 5 simple steps. Your listing will be syndicated to major commercial real estate platforms.
          </p>
        </div>

        {/* Mobile-friendly Progress Steps */}
        <div className="mb-6 sm:mb-8">
          {/* Desktop Progress Steps */}
          <div className="hidden sm:flex items-center justify-between relative">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex flex-col items-center flex-1 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    status === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : status === 'current'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-500'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : status === 'current' ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-sm font-medium ${
                      status === 'current' ? 'text-blue-600' : 
                      status === 'completed' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-400 hidden lg:block">{step.description}</div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div 
                      className={`absolute top-5 left-1/2 w-full h-0.5 ${
                        step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
                      }`} 
                      style={{ zIndex: -1 }} 
                    />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Mobile Progress Steps */}
          <div className="sm:hidden">
            <div className="flex items-center mb-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-600">
                {currentStep} of {steps.length}
              </span>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 mb-1">
                Step {currentStep}: {steps[currentStep - 1]?.title}
              </div>
              <div className="text-sm text-gray-600">
                {steps[currentStep - 1]?.description}
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          {currentStep === 1 && (
            <PropertyTypeStep
              onNext={handleCreateListing}
              loading={loading}
            />
          )}
          
          {currentStep === 2 && (
            <DealInfoStep
              listingData={listingData}
              onNext={handleUpdateDealInfo}
              onPrevious={handlePrevious}
              loading={loading}
            />
          )}
          
          {currentStep === 3 && (
            <DocumentUploadStep
              listingData={listingData}
              onNext={handleUploadDocuments}
              onPrevious={handlePrevious}
              loading={loading}
            />
          )}
          
          {currentStep === 4 && (
            <EnrichmentStep
              listingData={listingData}
              onNext={handleTriggerEnrichment}
              onPrevious={handlePrevious}
              loading={loading}
            />
          )}
          
          {currentStep === 5 && (
            <ReviewPublishStep
              listingData={listingData}
              onPublish={handlePublishListing}
              onPrevious={handlePrevious}
              loading={loading}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Questions? Contact our broker support team at{' '}
            <a href="mailto:brokers@fractionax.io" className="text-blue-600 hover:text-blue-700">
              brokers@fractionax.io
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyUpload;