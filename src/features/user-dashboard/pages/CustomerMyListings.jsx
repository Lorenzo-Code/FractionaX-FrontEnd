import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { smartFetch } from '../../../shared/utils/secureApiClient';
import useAuth from '../../../shared/hooks/useAuth';
import {
  Plus,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Edit3,
  Eye,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  Share2,
  Download,
  MoreVertical,
  Filter,
  Search,
  Loader2,
  X,
  ArrowRight,
  ArrowLeft,
  FileText,
  Upload,
  Sparkles,
  Save,
  Send
} from 'lucide-react';

// Step Components for Upload Process
import PropertyTypeStep from '../components/upload/PropertyTypeStep';
import DealInfoStep from '../components/upload/DealInfoStep';
import DocumentUploadStep from '../components/upload/DocumentUploadStep';
import EnrichmentStep from '../components/upload/EnrichmentStep';
import ReviewPublishStep from '../components/upload/ReviewPublishStep';

const CustomerMyListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [listingData, setListingData] = useState(null);
  
  // Fetch user's listings
  useEffect(() => {
    fetchMyListings();
  }, []);
  
  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const response = await smartFetch('/api/listings/my-listings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      
      const data = await response.json();
      setListings(data.listings || []);
    } catch (err) {
      console.error('Fetch listings error:', err);
      setError('Failed to load your listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    const num = Number(amount);
    if (num >= 1000000000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(num / 1000000000) + 'B';
    } else if (num >= 1000000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(num / 1000000) + 'M';
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    }
  };
  
  const getStatusBadge = (status) => {
    const badges = {
      'Draft': { color: 'bg-yellow-100 text-yellow-800', icon: Edit3 },
      'Published': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Under Review': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'Expired': { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      'Syndicated': { color: 'bg-purple-100 text-purple-800', icon: Share2 }
    };
    
    const badge = badges[status] || badges['Draft'];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status || 'Draft'}
      </span>
    );
  };
  
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.marketing?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.propertyType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         listing.status?.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });
  
  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await smartFetch(`/api/listings/${listingId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }
      
      setListings(listings.filter(l => l._id !== listingId));
    } catch (err) {
      console.error('Delete listing error:', err);
      setError('Failed to delete listing. Please try again.');
    }
  };
  
  // Upload Modal Handlers
  const openUploadModal = () => {
    setShowUploadModal(true);
    setUploadStep(1);
    setListingData(null);
    setUploadError(null);
    setUploadSuccess(null);
  };
  
  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadStep(1);
    setListingData(null);
    setUploadError(null);
    setUploadSuccess(null);
  };
  
  // Upload Step Definitions
  const uploadSteps = [
    { id: 1, title: 'Property Type', icon: Building2, description: 'Select property category' },
    { id: 2, title: 'Deal Info', icon: FileText, description: 'Enter property details' },
    { id: 3, title: 'Documents', icon: Upload, description: 'Upload files & photos' },
    { id: 4, title: 'Auto-Enrich', icon: Sparkles, description: 'CoreLogic data pull' },
    { id: 5, title: 'Review & Publish', icon: Eye, description: 'Final review & publish' }
  ];
  
  const getUploadStepStatus = (stepId) => {
    if (stepId < uploadStep) return 'completed';
    if (stepId === uploadStep) return 'current';
    return 'pending';
  };
  
  // Step 1: Create listing with property type
  const handleCreateListing = async (propertyTypeData) => {
    setUploadLoading(true);
    setUploadError(null);
    
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
      setUploadStep(2);
      setUploadSuccess('Listing created successfully! Continue with deal information.');
      
    } catch (err) {
      console.error('Create listing error:', err);
      setUploadError(err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  // Step 2: Update deal information
  const handleUpdateDealInfo = async (dealInfoData) => {
    if (!listingData?.id) return;
    
    setUploadLoading(true);
    setUploadError(null);
    
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
      setUploadStep(3);
      setUploadSuccess('Deal information saved! Upload your documents next.');
      
    } catch (err) {
      console.error('Update deal info error:', err);
      setUploadError(err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  // Step 3: Upload documents
  const handleUploadDocuments = async (documentsData) => {
    if (!listingData?.id) return;
    
    setUploadLoading(true);
    setUploadError(null);
    
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
      setUploadStep(4);
      setUploadSuccess(`Documents uploaded successfully! ${data.uploadedFiles.photos} photos, ${data.uploadedFiles.financials} financial docs.`);
      
    } catch (err) {
      console.error('Document upload error:', err);
      setUploadError(err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  // Step 4: Trigger enrichment
  const handleTriggerEnrichment = async () => {
    if (!listingData?.id) return;
    
    setUploadLoading(true);
    setUploadError(null);
    
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
      setUploadStep(5);
      setUploadSuccess('Property data enriched with CoreLogic information!');
      
    } catch (err) {
      console.error('Enrichment error:', err);
      setUploadError(err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  // Step 5: Publish listing
  const handlePublishListing = async (action, marketingUpdates = null) => {
    if (!listingData?.id) return;
    
    setUploadLoading(true);
    setUploadError(null);
    
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
        setUploadSuccess('🎉 Listing published successfully! It\'s now live on the marketplace.');
        // Refresh listings and close modal after success
        setTimeout(() => {
          fetchMyListings();
          closeUploadModal();
        }, 2000);
      } else {
        setUploadSuccess('Draft saved successfully. You can continue editing later.');
        setTimeout(() => {
          fetchMyListings();
          closeUploadModal();
        }, 1500);
      }
      
    } catch (err) {
      console.error('Publish listing error:', err);
      setUploadError(err.message);
    } finally {
      setUploadLoading(false);
    }
  };
  
  // Upload step navigation
  const handleUploadNext = () => {
    if (uploadStep < 5) {
      setUploadStep(uploadStep + 1);
    }
  };

  const handleUploadPrevious = () => {
    if (uploadStep > 1) {
      setUploadStep(uploadStep - 1);
    }
  };
  
  // Access control
  if (user && !['broker', 'admin'].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            Broker privileges are required to view property listings.
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Mobile-friendly Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Property Listings</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage your property listings, track performance, and control syndication settings.
              </p>
            </div>
            
            <button
              onClick={openUploadModal}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">New Listing</span>
              <span className="sm:hidden">Add Listing</span>
            </button>
          </div>
        </div>
        
        {/* Mobile-friendly Filters & Search */}
        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
          <div className="space-y-4">
            {/* Search and filter row */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="sm:flex-shrink-0">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="under review">Under Review</option>
                  <option value="syndicated">Syndicated</option>
                </select>
              </div>
            </div>
            
            {/* Results count */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {filteredListings.length} of {listings.length} listings
              </div>
              {filteredListings.length !== listings.length && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Error Message */}
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
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading your listings...</span>
          </div>
        )}
        
        {/* Listings Grid */}
        {!loading && (
          <>
            {filteredListings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {listings.length === 0 ? 'No listings yet' : 'No matching listings'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {listings.length === 0 
                    ? 'Create your first property listing to get started.'
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
                {listings.length === 0 && (
                  <button
                    onClick={openUploadModal}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Listing
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredListings.map((listing) => (
                  <div key={listing._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        {/* Left Section: Property Info */}
                        <div className="flex-1 lg:flex lg:items-center lg:space-x-6">
                          {/* Property Image/Icon */}
                          <div className="hidden lg:flex w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg items-center justify-center flex-shrink-0">
                            <Building2 className="w-8 h-8 text-white" />
                          </div>
                          
                          {/* Property Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3 lg:mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                  {listing.marketing?.title || `${listing.propertyType} Investment Opportunity`}
                                </h3>
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                  <MapPin className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{listing.address?.city || 'Location TBD'}, {listing.address?.state || '--'}</span>
                                </div>
                              </div>
                              
                              <div className="ml-4 flex-shrink-0">
                                {getStatusBadge(listing.status)}
                              </div>
                            </div>
                            
                            {/* Property Metrics - Clean Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Property Type</div>
                                <div className="font-medium text-gray-900">{listing.propertyType}</div>
                              </div>
                              
                              <div>
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Asking Price</div>
                                <div className="font-semibold text-green-700">
                                  {listing.dealInfo?.askingPrice ? formatCurrency(listing.dealInfo.askingPrice) : 'TBD'}
                                </div>
                              </div>
                              
                              {listing.dealInfo?.capRate && (
                                <div>
                                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Cap Rate</div>
                                  <div className="font-medium text-blue-700">
                                    {listing.dealInfo.capRate.toFixed(1)}%
                                  </div>
                                </div>
                              )}
                              
                              <div>
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created</div>
                                <div className="font-medium text-gray-700">
                                  {new Date(listing.createdAt).toLocaleDateString(undefined, { 
                                    month: 'short', 
                                    day: 'numeric'
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right Section: Actions */}
                        <div className="mt-6 lg:mt-0 lg:ml-6 flex-shrink-0">
                          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-0 lg:space-y-2 xl:space-y-0 xl:space-x-3">
                            <button
                              onClick={() => navigate(`/dashboard/edit-listing/${listing._id}`)}
                              className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit Listing
                            </button>
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => window.open(`/property/${listing._id}`, '_blank')}
                                className="flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                title="View listing"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="ml-2 sm:hidden lg:inline xl:hidden 2xl:inline">View</span>
                              </button>
                              
                              <button
                                onClick={() => handleDeleteListing(listing._id)}
                                className="flex items-center justify-center px-4 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                                title="Delete listing"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="ml-2 sm:hidden lg:inline xl:hidden 2xl:inline">Delete</span>
                              </button>
                            </div>
                          </div>
                          
                          {/* Listing ID */}
                          <div className="mt-3 lg:mt-2">
                            <div className="text-xs text-gray-500 font-mono">
                              ID: {listing.listingId}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional Info Bar (for published listings) */}
                      {listing.status === 'Published' && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                            {listing.analytics?.views !== undefined && (
                              <div className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {listing.analytics.views} views
                              </div>
                            )}
                            
                            {listing.publishedAt && (
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Published {new Date(listing.publishedAt).toLocaleDateString()}
                              </div>
                            )}
                            
                            <div className="flex items-center">
                              <Share2 className="w-3 h-3 mr-1" />
                              Syndicated to external platforms
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Upload Listing Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeUploadModal}></div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              
              <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Upload Property Listing</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Create a professional property listing in 5 simple steps
                    </p>
                  </div>
                  <button
                    onClick={closeUploadModal}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-between relative">
                    {uploadSteps.map((step, index) => {
                      const status = getUploadStepStatus(step.id);
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
                          
                          {index < uploadSteps.length - 1 && (
                            <div 
                              className={`absolute top-5 left-1/2 w-full h-0.5 ${
                                step.id < uploadStep ? 'bg-green-500' : 'bg-gray-300'
                              }`} 
                              style={{ zIndex: -1 }} 
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Upload Alerts */}
                {uploadError && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <p className="text-sm text-red-700">{uploadError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-green-800">Success</h3>
                        <p className="text-sm text-green-700">{uploadSuccess}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step Content */}
                <div className="bg-gray-50 rounded-lg p-6 min-h-96">
                  {uploadStep === 1 && (
                    <PropertyTypeStep
                      onNext={handleCreateListing}
                      loading={uploadLoading}
                    />
                  )}
                  
                  {uploadStep === 2 && (
                    <DealInfoStep
                      listingData={listingData}
                      onNext={handleUpdateDealInfo}
                      onPrevious={handleUploadPrevious}
                      loading={uploadLoading}
                    />
                  )}
                  
                  {uploadStep === 3 && (
                    <DocumentUploadStep
                      listingData={listingData}
                      onNext={handleUploadDocuments}
                      onPrevious={handleUploadPrevious}
                      loading={uploadLoading}
                    />
                  )}
                  
                  {uploadStep === 4 && (
                    <EnrichmentStep
                      listingData={listingData}
                      onNext={handleTriggerEnrichment}
                      onPrevious={handleUploadPrevious}
                      loading={uploadLoading}
                    />
                  )}
                  
                  {uploadStep === 5 && (
                    <ReviewPublishStep
                      listingData={listingData}
                      onPublish={handlePublishListing}
                      onPrevious={handleUploadPrevious}
                      loading={uploadLoading}
                    />
                  )}
                </div>
                
                {/* Modal Footer */}
                <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
                  <div>
                    Step {uploadStep} of {uploadSteps.length}
                  </div>
                  <div>
                    Questions? Contact{' '}
                    <a href="mailto:brokers@fractionax.io" className="text-blue-600 hover:text-blue-700">
                      brokers@fractionax.io
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerMyListings;
