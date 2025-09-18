import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  TrendingUp, 
  Users, 
  Building, 
  DollarSign, 
  Settings,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Upload,
  Download,
  RefreshCw,
  Eye,
  Star,
  AlertTriangle,
  CheckCircle,
  Activity,
  Clock,
  Zap,
  ToggleLeft,
  ToggleRight,
  Mail,
  Briefcase,
  MapPin,
  Phone,
  Globe
} from 'lucide-react';
import { useHomepageData } from '../../../hooks/useHomepageData';
import { useFrontendPagesAdmin } from '../../../hooks/useFrontendPagesAdmin';

const HomepageAdmin = () => {
  const {
    data,
    marketStats,
    communityStats,
    protocolStats,
    featuredProperty,
    testimonials,
    heroSection,
    socialProof,
    platformSettings,
    updateMarketStats,
    updateCommunityStats,
    updateFeaturedProperty,
    updateTestimonials,
    updatePlatformSettings,
    addTestimonial,
    removeTestimonial,
    refreshData,
    exportData,
    importData,
    clearData,
    loading,
    error,
    hasAdminAccess,
    
    // Live data controls
    toggleAutoRefresh,
    setRefreshInterval,
    toggleSectionOverride,
    resetAllOverrides,
    forceLiveDataUpdate,
    fetchOverrideStatus,
    getOverrideStatus,
    getAutoRefreshStatus
  } = useHomepageData();

  // Frontend pages admin hook
  const {
    pagesData,
    loading: pagesLoading,
    error: pagesError,
    saving: pagesSaving,
    updatePageContent,
    addJobPosition,
    removeJobPosition,
    updateJobPosition,
    addSocialLink,
    removeSocialLink,
    exportPagesData,
    importPagesData,
    refreshAllPages
  } = useFrontendPagesAdmin();

  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get section from URL or default to 'market'
  const sectionFromUrl = searchParams.get('section') || 'market';
  const [activeSection, setActiveSection] = useState(sectionFromUrl);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
    featured: false
  });
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Local state for forms
  const [localMarketStats, setLocalMarketStats] = useState(marketStats);
  const [localCommunityStats, setLocalCommunityStats] = useState(communityStats);
  const [localProtocolStats, setLocalProtocolStats] = useState(protocolStats);
  const [localFeaturedProperty, setLocalFeaturedProperty] = useState(featuredProperty);
  const [localPlatformSettings, setLocalPlatformSettings] = useState(platformSettings);
  const [saving, setSaving] = useState(false);
  
  // Local state for frontend pages
  const [localContactData, setLocalContactData] = useState(pagesData.contact || {});
  const [localCareersData, setLocalCareersData] = useState(pagesData.careers || {});
  const [showAddJob, setShowAddJob] = useState(false);
  const [showAddSocialLink, setShowAddSocialLink] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    experience: '',
    description: '',
    requirements: [],
    salary: ''
  });
  const [newSocialLink, setNewSocialLink] = useState({
    platform: '',
    url: '',
    icon: ''
  });
  
  // Live data control states
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshIntervalState] = useState(30);
  const [overrideStatuses, setOverrideStatuses] = useState({});

  // Update local state when data changes
  useEffect(() => {
    setLocalMarketStats(marketStats);
    setLocalCommunityStats(communityStats);
    setLocalProtocolStats(protocolStats);
    setLocalFeaturedProperty(featuredProperty);
    setLocalPlatformSettings(platformSettings);
    
    // Update live data control states
    const autoRefreshStatus = getAutoRefreshStatus();
    setAutoRefreshEnabled(autoRefreshStatus.enabled);
    setRefreshIntervalState(autoRefreshStatus.interval);
    setOverrideStatuses(getOverrideStatus());
  }, [marketStats, communityStats, protocolStats, featuredProperty, platformSettings, getAutoRefreshStatus, getOverrideStatus]);
  
  // Update local pages data when pagesData changes
  useEffect(() => {
    setLocalContactData(pagesData.contact || {});
    setLocalCareersData(pagesData.careers || {});
  }, [pagesData]);

  // Sync activeSection with URL parameter
  useEffect(() => {
    const urlSection = searchParams.get('section');
    if (urlSection && urlSection !== activeSection) {
      setActiveSection(urlSection);
    }
  }, [searchParams, activeSection]);

  // Handle section navigation
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setSearchParams({ section: sectionId });
  };

  // Save status helper
  const showSaveStatus = (message, type = 'success') => {
    setSaveStatus({ message, type });
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // Handle save functions (async)
  const handleSaveMarketStats = async () => {
    try {
      setSaving(true);
      const success = await updateMarketStats(localMarketStats);
      showSaveStatus(success ? 'Market stats updated!' : 'Failed to update market stats', success ? 'success' : 'error');
    } catch (err) {
      showSaveStatus('Error updating market stats: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCommunityStats = async () => {
    try {
      setSaving(true);
      const success = await updateCommunityStats(localCommunityStats);
      showSaveStatus(success ? 'Community stats updated!' : 'Failed to update community stats', success ? 'success' : 'error');
    } catch (err) {
      showSaveStatus('Error updating community stats: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFeaturedProperty = async () => {
    try {
      setSaving(true);
      const success = await updateFeaturedProperty(localFeaturedProperty);
      showSaveStatus(success ? 'Featured property updated!' : 'Failed to update featured property', success ? 'success' : 'error');
    } catch (err) {
      showSaveStatus('Error updating featured property: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePlatformSettings = async () => {
    try {
      setSaving(true);
      const success = await updatePlatformSettings(localPlatformSettings);
      showSaveStatus(success ? 'Platform settings updated!' : 'Failed to update platform settings', success ? 'success' : 'error');
    } catch (err) {
      showSaveStatus('Error updating platform settings: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.content) {
      showSaveStatus('Name and content are required', 'error');
      return;
    }

    try {
      setSaving(true);
      const newItem = await addTestimonial({
        name: newTestimonial.name,
        role: newTestimonial.role,
        content: newTestimonial.content,
        rating: newTestimonial.rating,
        featured: newTestimonial.featured || false,
        avatar: newTestimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()
      });

      if (newItem) {
        setNewTestimonial({ name: '', role: '', content: '', rating: 5, featured: false });
        setShowAddTestimonial(false);
        showSaveStatus('Testimonial added successfully!');
      } else {
        showSaveStatus('Failed to add testimonial', 'error');
      }
    } catch (err) {
      showSaveStatus('Error adding testimonial: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      setSaving(true);
      const exportedData = await exportData();
      
      if (exportedData) {
        const blob = new Blob([JSON.stringify(exportedData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fractionax-homepage-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showSaveStatus('Data exported successfully!');
      } else {
        showSaveStatus('No data to export', 'error');
      }
    } catch (error) {
      showSaveStatus('Failed to export data: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setSaving(true);
        const importedData = JSON.parse(e.target.result);
        const success = await importData(importedData.data || importedData);
        showSaveStatus(success ? 'Data imported successfully!' : 'Failed to import data', success ? 'success' : 'error');
      } catch (error) {
        showSaveStatus('Invalid file format: ' + error.message, 'error');
      } finally {
        setSaving(false);
      }
    };
    reader.readAsText(file);
  };

  const handleRefreshData = async () => {
    try {
      setSaving(true);
      const refreshedData = await refreshData();
      if (refreshedData) {
        showSaveStatus('Live data refreshed successfully!');
      } else {
        showSaveStatus('Failed to refresh data', 'error');
      }
    } catch (err) {
      showSaveStatus('Error refreshing data: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'live-data', name: 'Live Data Controls', icon: Activity },
    { id: 'market', name: 'Market Stats', icon: TrendingUp },
    { id: 'community', name: 'Community Stats', icon: Users },
    { id: 'protocol', name: 'Protocol Stats', icon: DollarSign },
    { id: 'featured', name: 'Featured Property', icon: Building },
    { id: 'testimonials', name: 'Testimonials', icon: Star },
    { id: 'contact', name: 'Contact Page', icon: Mail },
    { id: 'careers', name: 'Careers Page', icon: Briefcase },
    { id: 'settings', name: 'Platform Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Homepage Management</h1>
              <p className="text-gray-600">Manage market stats, featured content, and testimonials</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Refresh Data Button */}
            <button
              onClick={handleRefreshData}
              disabled={saving || loading}
              className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
              Refresh Live Data
            </button>
            
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
              id="import-data"
              disabled={saving || loading}
            />
            <label
              htmlFor="import-data"
              className={`flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
                saving || loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="w-4 h-4" />
              Import Data
            </label>
            
            <button
              onClick={handleExportData}
              disabled={saving || loading}
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Save Status */}
        <AnimatePresence>
          {saveStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-4 p-3 rounded-lg flex items-center gap-2 max-w-7xl mx-auto ${
                saveStatus.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {saveStatus.type === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              {saveStatus.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {section.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <AnimatePresence mode="wait">
              {/* Live Data Controls Section */}
              {activeSection === 'live-data' && (
                <motion.div
                  key="live-data"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Live Data Management</h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        autoRefreshEnabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {autoRefreshEnabled ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
                      </span>
                    </div>
                  </div>

                  {/* Auto-Refresh Controls */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Auto-Refresh Settings
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-700">Enable Auto-Refresh</span>
                        <button
                          onClick={() => {
                            const newEnabled = !autoRefreshEnabled;
                            setAutoRefreshEnabled(newEnabled);
                            toggleAutoRefresh(newEnabled);
                            showSaveStatus(`Auto-refresh ${newEnabled ? 'enabled' : 'disabled'}`);
                          }}
                          className="flex items-center"
                        >
                          {autoRefreshEnabled ? (
                            <ToggleRight className="w-8 h-8 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-gray-400" />
                          )}
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          Refresh Interval (seconds)
                        </label>
                        <select
                          value={refreshInterval}
                          onChange={(e) => {
                            const newInterval = parseInt(e.target.value);
                            setRefreshIntervalState(newInterval);
                            setRefreshInterval(newInterval);
                            showSaveStatus(`Refresh interval set to ${newInterval} seconds`);
                          }}
                          className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={10}>10 seconds</option>
                          <option value={30}>30 seconds</option>
                          <option value={60}>1 minute</option>
                          <option value={120}>2 minutes</option>
                          <option value={300}>5 minutes</option>
                        </select>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={async () => {
                            try {
                              setSaving(true);
                              await forceLiveDataUpdate();
                              showSaveStatus('Live data updated manually!');
                            } catch (error) {
                              showSaveStatus('Failed to update live data: ' + error.message, 'error');
                            } finally {
                              setSaving(false);
                            }
                          }}
                          disabled={saving}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Zap className="w-4 h-4" />
                          Force Update Now
                        </button>
                        
                        <button
                          onClick={async () => {
                            try {
                              setSaving(true);
                              const backendOverrides = await fetchOverrideStatus();
                              if (backendOverrides) {
                                setOverrideStatuses(backendOverrides);
                                showSaveStatus('Synced override status from backend!');
                              } else {
                                showSaveStatus('Failed to sync with backend', 'error');
                              }
                            } catch (error) {
                              showSaveStatus('Failed to sync with backend: ' + error.message, 'error');
                            } finally {
                              setSaving(false);
                            }
                          }}
                          disabled={saving}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
                          Sync Backend
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section Override Controls */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Section Override Controls
                    </h3>
                    
                    <div className="space-y-4">
                      {Object.entries({
                        marketStats: 'Market Statistics',
                        communityStats: 'Community Statistics', 
                        featuredProperty: 'Featured Property',
                        testimonials: 'Testimonials'
                      }).map(([sectionKey, sectionName]) => (
                        <div key={sectionKey} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">{sectionName}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              overrideStatuses[sectionKey] 
                                ? 'bg-orange-100 text-orange-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {overrideStatuses[sectionKey] ? 'Manual' : 'Live'}
                            </span>
                          </div>
                          
                          <button
                            onClick={async () => {
                              const newOverrideState = !overrideStatuses[sectionKey];
                              await toggleSectionOverride(sectionKey, newOverrideState);
                              setOverrideStatuses(prev => ({
                                ...prev,
                                [sectionKey]: newOverrideState
                              }));
                              showSaveStatus(`${sectionName} set to ${newOverrideState ? 'manual' : 'live'} mode`);
                            }}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              overrideStatuses[sectionKey]
                                ? 'bg-green-100 hover:bg-green-200 text-green-700'
                                : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                            }`}
                          >
                            Switch to {overrideStatuses[sectionKey] ? 'Live' : 'Manual'}
                          </button>
                        </div>
                      ))}
                      
                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={async () => {
                            await resetAllOverrides();
                            setOverrideStatuses(getOverrideStatus());
                            showSaveStatus('All sections reset to live mode!');
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Reset All to Live Mode
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Protocol Stats Note */}
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      <strong>Note:</strong> Protocol statistics are always fetched live from blockchain data and cannot be overridden manually.
                    </p>
                  </div>
                </motion.div>
              )}
              
              {/* Market Stats Section */}
              {activeSection === 'market' && (
                <motion.div
                  key="market"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-900">Market Statistics</h2>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        overrideStatuses.marketStats 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {overrideStatuses.marketStats ? '📝 Manual' : '🔴 Live'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSectionOverride('marketStats', !overrideStatuses.marketStats)}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {overrideStatuses.marketStats ? 'Switch to Live' : 'Switch to Manual'}
                      </button>
                      <button
                        onClick={handleSaveMarketStats}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Volume ($)
                      </label>
                      <input
                        type="number"
                        value={localMarketStats.totalVolume || ''}
                        onChange={(e) => setLocalMarketStats({
                          ...localMarketStats,
                          totalVolume: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Listings
                      </label>
                      <input
                        type="number"
                        value={localMarketStats.totalListings || ''}
                        onChange={(e) => setLocalMarketStats({
                          ...localMarketStats,
                          totalListings: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Investors
                      </label>
                      <input
                        type="number"
                        value={localMarketStats.totalInvestors || ''}
                        onChange={(e) => setLocalMarketStats({
                          ...localMarketStats,
                          totalInvestors: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Properties
                      </label>
                      <input
                        type="number"
                        value={localMarketStats.totalProperties || ''}
                        onChange={(e) => setLocalMarketStats({
                          ...localMarketStats,
                          totalProperties: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Average ROI (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={localMarketStats.averageRoi || ''}
                        onChange={(e) => setLocalMarketStats({
                          ...localMarketStats,
                          averageRoi: parseFloat(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Market Cap ($)
                      </label>
                      <input
                        type="number"
                        value={localMarketStats.marketCap || ''}
                        onChange={(e) => setLocalMarketStats({
                          ...localMarketStats,
                          marketCap: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Protocol Stats Section */}
              {activeSection === 'protocol' && (
                <motion.div
                  key="protocol"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Protocol Statistics</h2>
                    <button
                      onClick={async () => {
                        try {
                          setSaving(true);
                          // For now, we'll use updateMarketStats to save protocol stats
                          // In the future, we should have a dedicated updateProtocolStats method
                          showSaveStatus('Protocol stats are read-only for now', 'info');
                        } catch (err) {
                          showSaveStatus('Error: ' + err.message, 'error');
                        } finally {
                          setSaving(false);
                        }
                      }}
                      disabled={true}
                      className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors opacity-50 cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      Read Only
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Value Locked ($)
                      </label>
                      <input
                        type="number"
                        value={localProtocolStats.totalValueLocked || ''}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction Volume (24h) ($)
                      </label>
                      <input
                        type="number"
                        value={localProtocolStats.transactionVolume24h || ''}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Active Contracts
                      </label>
                      <input
                        type="number"
                        value={localProtocolStats.activeContracts || ''}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Tokens Issued
                      </label>
                      <input
                        type="number"
                        value={localProtocolStats.totalTokens || ''}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> Protocol statistics are automatically updated from blockchain data and cannot be manually edited.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Community Stats Section */}
              {activeSection === 'community' && (
                <motion.div
                  key="community"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-900">Community Statistics</h2>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        overrideStatuses.communityStats 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {overrideStatuses.communityStats ? '📝 Manual' : '🔴 Live'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSectionOverride('communityStats', !overrideStatuses.communityStats)}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {overrideStatuses.communityStats ? 'Switch to Live' : 'Switch to Manual'}
                      </button>
                      <button
                        onClick={handleSaveCommunityStats}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Active Investors
                      </label>
                      <input
                        type="number"
                        value={localCommunityStats.activeInvestors || ''}
                        onChange={(e) => setLocalCommunityStats({
                          ...localCommunityStats,
                          activeInvestors: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Invested ($)
                      </label>
                      <input
                        type="number"
                        value={localCommunityStats.totalInvested || ''}
                        onChange={(e) => setLocalCommunityStats({
                          ...localCommunityStats,
                          totalInvested: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Properties Funded
                      </label>
                      <input
                        type="number"
                        value={localCommunityStats.propertiesFunded || ''}
                        onChange={(e) => setLocalCommunityStats({
                          ...localCommunityStats,
                          propertiesFunded: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Average Annual Return (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={localCommunityStats.avgAnnualReturn || ''}
                        onChange={(e) => setLocalCommunityStats({
                          ...localCommunityStats,
                          avgAnnualReturn: parseFloat(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Featured Property Section */}
              {activeSection === 'featured' && (
                <motion.div
                  key="featured"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-900">Featured Property</h2>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        overrideStatuses.featuredProperty 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {overrideStatuses.featuredProperty ? '📝 Manual' : '🔴 Live'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSectionOverride('featuredProperty', !overrideStatuses.featuredProperty)}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {overrideStatuses.featuredProperty ? 'Switch to Live' : 'Switch to Manual'}
                      </button>
                      <button
                        onClick={handleSaveFeaturedProperty}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Title
                      </label>
                      <input
                        type="text"
                        value={localFeaturedProperty.title || ''}
                        onChange={(e) => setLocalFeaturedProperty({
                          ...localFeaturedProperty,
                          title: e.target.value
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={localFeaturedProperty.address || ''}
                        onChange={(e) => setLocalFeaturedProperty({
                          ...localFeaturedProperty,
                          address: e.target.value
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Price ($)
                      </label>
                      <input
                        type="number"
                        value={localFeaturedProperty.price || ''}
                        onChange={(e) => setLocalFeaturedProperty({
                          ...localFeaturedProperty,
                          price: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected ROI (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={localFeaturedProperty.expectedROI || ''}
                        onChange={(e) => setLocalFeaturedProperty({
                          ...localFeaturedProperty,
                          expectedROI: parseFloat(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        value={localFeaturedProperty.bedrooms || ''}
                        onChange={(e) => setLocalFeaturedProperty({
                          ...localFeaturedProperty,
                          bedrooms: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        value={localFeaturedProperty.bathrooms || ''}
                        onChange={(e) => setLocalFeaturedProperty({
                          ...localFeaturedProperty,
                          bathrooms: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Square Feet
                      </label>
                      <input
                        type="number"
                        value={localFeaturedProperty.sqft || ''}
                        onChange={(e) => setLocalFeaturedProperty({
                          ...localFeaturedProperty,
                          sqft: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Rent ($)
                      </label>
                      <input
                        type="number"
                        value={localFeaturedProperty.monthlyRent || ''}
                        onChange={(e) => setLocalFeaturedProperty({
                          ...localFeaturedProperty,
                          monthlyRent: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Funding Progress (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={localFeaturedProperty.fundingProgress || ''}
                        onChange={(e) => setLocalFeaturedProperty({
                          ...localFeaturedProperty,
                          fundingProgress: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Investors
                      </label>
                      <input
                        type="number"
                        value={localFeaturedProperty.investors || ''}
                        onChange={(e) => setLocalFeaturedProperty({
                          ...localFeaturedProperty,
                          investors: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type
                      </label>
                      <select
                        value={localFeaturedProperty.propertyType || 'Single Family'}
                        onChange={(e) => setLocalFeaturedProperty({
                          ...localFeaturedProperty,
                          propertyType: e.target.value
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Single Family">Single Family</option>
                        <option value="Multi-Family">Multi-Family</option>
                        <option value="Condo">Condo</option>
                        <option value="Townhouse">Townhouse</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={localFeaturedProperty.isHot || false}
                          onChange={(e) => setLocalFeaturedProperty({
                            ...localFeaturedProperty,
                            isHot: e.target.checked
                          })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Mark as "HOT" property</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Testimonials Section */}
              {activeSection === 'testimonials' && (
                <motion.div
                  key="testimonials"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Customer Testimonials</h2>
                    <button
                      onClick={() => setShowAddTestimonial(true)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Testimonial
                    </button>
                  </div>

                  {/* Existing Testimonials */}
                  <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {testimonial.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{testimonial.name}</div>
                              <div className="text-sm text-gray-600">{testimonial.role}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <button
                              onClick={() => removeTestimonial(testimonial.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">"{testimonial.content}"</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Testimonial Modal */}
                  <AnimatePresence>
                    {showAddTestimonial && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                      >
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0.9 }}
                          className="bg-white rounded-xl p-6 w-full max-w-md"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Add New Testimonial</h3>
                            <button
                              onClick={() => setShowAddTestimonial(false)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                              <input
                                type="text"
                                value={newTestimonial.name}
                                onChange={(e) => setNewTestimonial({
                                  ...newTestimonial,
                                  name: e.target.value
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                              <input
                                type="text"
                                value={newTestimonial.role}
                                onChange={(e) => setNewTestimonial({
                                  ...newTestimonial,
                                  role: e.target.value
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Content</label>
                              <textarea
                                value={newTestimonial.content}
                                onChange={(e) => setNewTestimonial({
                                  ...newTestimonial,
                                  content: e.target.value
                                })}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                              <select
                                value={newTestimonial.rating}
                                onChange={(e) => setNewTestimonial({
                                  ...newTestimonial,
                                  rating: parseInt(e.target.value)
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value={5}>5 Stars</option>
                                <option value={4}>4 Stars</option>
                                <option value={3}>3 Stars</option>
                                <option value={2}>2 Stars</option>
                                <option value={1}>1 Star</option>
                              </select>
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={handleAddTestimonial}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                              >
                                Add Testimonial
                              </button>
                              <button
                                onClick={() => setShowAddTestimonial(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Contact Page Section */}
              {activeSection === 'contact' && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Contact Page Content</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAddSocialLink(true)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Social Link
                      </button>
                      <button
                        onClick={async () => {
                          const success = await updatePageContent('contact', localContactData);
                          showSaveStatus(success ? 'Contact page updated!' : 'Failed to update contact page', success ? 'success' : 'error');
                        }}
                        disabled={pagesSaving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>

                  {/* Hero Content */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Hero Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                        <input
                          type="text"
                          value={localContactData.title || ''}
                          onChange={(e) => setLocalContactData({
                            ...localContactData,
                            title: e.target.value
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Get in Touch"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                        <input
                          type="text"
                          value={localContactData.subtitle || ''}
                          onChange={(e) => setLocalContactData({
                            ...localContactData,
                            subtitle: e.target.value
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Have questions? We'd love to hear from you."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={localContactData.description || ''}
                          onChange={(e) => setLocalContactData({
                            ...localContactData,
                            description: e.target.value
                          })}
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Send us a message and we'll respond as soon as possible."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Labels */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Form Labels & Messages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name Field Label</label>
                        <input
                          type="text"
                          value={localContactData.formLabels?.name || ''}
                          onChange={(e) => setLocalContactData({
                            ...localContactData,
                            formLabels: {
                              ...localContactData.formLabels,
                              name: e.target.value
                            }
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Field Label</label>
                        <input
                          type="text"
                          value={localContactData.formLabels?.email || ''}
                          onChange={(e) => setLocalContactData({
                            ...localContactData,
                            formLabels: {
                              ...localContactData.formLabels,
                              email: e.target.value
                            }
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject Field Label</label>
                        <input
                          type="text"
                          value={localContactData.formLabels?.subject || ''}
                          onChange={(e) => setLocalContactData({
                            ...localContactData,
                            formLabels: {
                              ...localContactData.formLabels,
                              subject: e.target.value
                            }
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Subject"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Submit Button Text</label>
                        <input
                          type="text"
                          value={localContactData.formLabels?.submitButton || ''}
                          onChange={(e) => setLocalContactData({
                            ...localContactData,
                            formLabels: {
                              ...localContactData.formLabels,
                              submitButton: e.target.value
                            }
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Send Message"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Success Message</label>
                        <textarea
                          value={localContactData.successMessage || ''}
                          onChange={(e) => setLocalContactData({
                            ...localContactData,
                            successMessage: e.target.value
                          })}
                          rows={2}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Thank you for your message! We'll get back to you soon."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={localContactData.contactInfo?.email || ''}
                          onChange={(e) => setLocalContactData({
                            ...localContactData,
                            contactInfo: {
                              ...localContactData.contactInfo,
                              email: e.target.value
                            }
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="hello@fractionax.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={localContactData.contactInfo?.phone || ''}
                          onChange={(e) => setLocalContactData({
                            ...localContactData,
                            contactInfo: {
                              ...localContactData.contactInfo,
                              phone: e.target.value
                            }
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                          type="text"
                          value={localContactData.contactInfo?.address || ''}
                          onChange={(e) => setLocalContactData({
                            ...localContactData,
                            contactInfo: {
                              ...localContactData.contactInfo,
                              address: e.target.value
                            }
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="123 Innovation Drive, Tech City, TC 12345"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Map Address (for Google Maps)</label>
                        <input
                          type="text"
                          value={localContactData.mapAddress || ''}
                          onChange={(e) => setLocalContactData({
                            ...localContactData,
                            mapAddress: e.target.value
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="123 Innovation Drive, Tech City, TC 12345"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h3>
                    <div className="space-y-3">
                      {(localContactData.socialLinks || []).map((link) => (
                        <div key={link.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="text"
                              value={link.platform}
                              onChange={(e) => {
                                const updatedLinks = (localContactData.socialLinks || []).map(l => 
                                  l.id === link.id ? { ...l, platform: e.target.value } : l
                                );
                                setLocalContactData({
                                  ...localContactData,
                                  socialLinks: updatedLinks
                                });
                              }}
                              className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Platform (e.g., Twitter)"
                            />
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => {
                                const updatedLinks = (localContactData.socialLinks || []).map(l => 
                                  l.id === link.id ? { ...l, url: e.target.value } : l
                                );
                                setLocalContactData({
                                  ...localContactData,
                                  socialLinks: updatedLinks
                                });
                              }}
                              className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="https://twitter.com/fractionax"
                            />
                            <input
                              type="text"
                              value={link.icon}
                              onChange={(e) => {
                                const updatedLinks = (localContactData.socialLinks || []).map(l => 
                                  l.id === link.id ? { ...l, icon: e.target.value } : l
                                );
                                setLocalContactData({
                                  ...localContactData,
                                  socialLinks: updatedLinks
                                });
                              }}
                              className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Icon name (e.g., twitter)"
                            />
                          </div>
                          <button
                            onClick={async () => {
                              const updatedLinks = (localContactData.socialLinks || []).filter(l => l.id !== link.id);
                              setLocalContactData({
                                ...localContactData,
                                socialLinks: updatedLinks
                              });
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Social Link Modal */}
                  <AnimatePresence>
                    {showAddSocialLink && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                      >
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0.9 }}
                          className="bg-white rounded-xl p-6 w-full max-w-md"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Add Social Link</h3>
                            <button
                              onClick={() => setShowAddSocialLink(false)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                              <input
                                type="text"
                                value={newSocialLink.platform}
                                onChange={(e) => setNewSocialLink({
                                  ...newSocialLink,
                                  platform: e.target.value
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Twitter, LinkedIn"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                              <input
                                type="url"
                                value={newSocialLink.url}
                                onChange={(e) => setNewSocialLink({
                                  ...newSocialLink,
                                  url: e.target.value
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://twitter.com/fractionax"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
                              <input
                                type="text"
                                value={newSocialLink.icon}
                                onChange={(e) => setNewSocialLink({
                                  ...newSocialLink,
                                  icon: e.target.value
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="twitter, linkedin, etc."
                              />
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={async () => {
                                  if (!newSocialLink.platform || !newSocialLink.url) {
                                    showSaveStatus('Platform name and URL are required', 'error');
                                    return;
                                  }
                                  
                                  const updatedLinks = [
                                    ...(localContactData.socialLinks || []),
                                    {
                                      id: Date.now().toString(),
                                      ...newSocialLink
                                    }
                                  ];
                                  
                                  setLocalContactData({
                                    ...localContactData,
                                    socialLinks: updatedLinks
                                  });
                                  
                                  setNewSocialLink({ platform: '', url: '', icon: '' });
                                  setShowAddSocialLink(false);
                                  showSaveStatus('Social link added! Remember to save changes.');
                                }}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                              >
                                Add Link
                              </button>
                              <button
                                onClick={() => {
                                  setNewSocialLink({ platform: '', url: '', icon: '' });
                                  setShowAddSocialLink(false);
                                }}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Careers Page Section */}
              {activeSection === 'careers' && (
                <motion.div
                  key="careers"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Careers Page Content</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAddJob(true)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Job Position
                      </button>
                      <button
                        onClick={async () => {
                          const success = await updatePageContent('careers', localCareersData);
                          showSaveStatus(success ? 'Careers page updated!' : 'Failed to update careers page', success ? 'success' : 'error');
                        }}
                        disabled={pagesSaving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>

                  {/* Hero Content */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Hero Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                        <input
                          type="text"
                          value={localCareersData.title || ''}
                          onChange={(e) => setLocalCareersData({
                            ...localCareersData,
                            title: e.target.value
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Be Part of the First 3"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={localCareersData.description || ''}
                          onChange={(e) => setLocalCareersData({
                            ...localCareersData,
                            description: e.target.value
                          })}
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Join us as we redefine real estate investing with blockchain, AI, and real utility."
                        />
                      </div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Call-to-Action Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CTA Title</label>
                        <input
                          type="text"
                          value={localCareersData.ctaTitle || ''}
                          onChange={(e) => setLocalCareersData({
                            ...localCareersData,
                            ctaTitle: e.target.value
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Let's Build the Future—Together"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CTA Email</label>
                        <input
                          type="email"
                          value={localCareersData.ctaEmail || ''}
                          onChange={(e) => setLocalCareersData({
                            ...localCareersData,
                            ctaEmail: e.target.value
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="careers@fractionax.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">CTA Description</label>
                        <textarea
                          value={localCareersData.ctaDescription || ''}
                          onChange={(e) => setLocalCareersData({
                            ...localCareersData,
                            ctaDescription: e.target.value
                          })}
                          rows={2}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Don't see a role that fits perfectly? Pitch us. We're open to game-changing talent."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Job Positions */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Positions</h3>
                    <div className="space-y-4">
                      {(localCareersData.jobPositions || []).map((job) => (
                        <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                              <input
                                type="text"
                                value={job.title}
                                onChange={(e) => {
                                  const updatedJobs = (localCareersData.jobPositions || []).map(j => 
                                    j.id === job.id ? { ...j, title: e.target.value } : j
                                  );
                                  setLocalCareersData({
                                    ...localCareersData,
                                    jobPositions: updatedJobs
                                  });
                                }}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                              <select
                                value={job.department}
                                onChange={(e) => {
                                  const updatedJobs = (localCareersData.jobPositions || []).map(j => 
                                    j.id === job.id ? { ...j, department: e.target.value } : j
                                  );
                                  setLocalCareersData({
                                    ...localCareersData,
                                    jobPositions: updatedJobs
                                  });
                                }}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="Engineering">Engineering</option>
                                <option value="Product">Product</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Operations">Operations</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                              <input
                                type="text"
                                value={job.location}
                                onChange={(e) => {
                                  const updatedJobs = (localCareersData.jobPositions || []).map(j => 
                                    j.id === job.id ? { ...j, location: e.target.value } : j
                                  );
                                  setLocalCareersData({
                                    ...localCareersData,
                                    jobPositions: updatedJobs
                                  });
                                }}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                              <input
                                type="text"
                                value={job.type}
                                onChange={(e) => {
                                  const updatedJobs = (localCareersData.jobPositions || []).map(j => 
                                    j.id === job.id ? { ...j, type: e.target.value } : j
                                  );
                                  setLocalCareersData({
                                    ...localCareersData,
                                    jobPositions: updatedJobs
                                  });
                                }}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <textarea
                                value={job.description}
                                onChange={(e) => {
                                  const updatedJobs = (localCareersData.jobPositions || []).map(j => 
                                    j.id === job.id ? { ...j, description: e.target.value } : j
                                  );
                                  setLocalCareersData({
                                    ...localCareersData,
                                    jobPositions: updatedJobs
                                  });
                                }}
                                rows={3}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <button
                              onClick={async () => {
                                const updatedJobs = (localCareersData.jobPositions || []).filter(j => j.id !== job.id);
                                setLocalCareersData({
                                  ...localCareersData,
                                  jobPositions: updatedJobs
                                });
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Job Position Modal */}
                  <AnimatePresence>
                    {showAddJob && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                      >
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0.9 }}
                          className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Add Job Position</h3>
                            <button
                              onClick={() => setShowAddJob(false)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                              <input
                                type="text"
                                value={newJob.title}
                                onChange={(e) => setNewJob({
                                  ...newJob,
                                  title: e.target.value
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Full Stack Engineer"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                              <select
                                value={newJob.department}
                                onChange={(e) => setNewJob({
                                  ...newJob,
                                  department: e.target.value
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="Engineering">Engineering</option>
                                <option value="Product">Product</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Operations">Operations</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                              <input
                                type="text"
                                value={newJob.location}
                                onChange={(e) => setNewJob({
                                  ...newJob,
                                  location: e.target.value
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Remote"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                              <input
                                type="text"
                                value={newJob.type}
                                onChange={(e) => setNewJob({
                                  ...newJob,
                                  type: e.target.value
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Full-time"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Required</label>
                              <input
                                type="text"
                                value={newJob.experience}
                                onChange={(e) => setNewJob({
                                  ...newJob,
                                  experience: e.target.value
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="3+ years"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Salary/Compensation</label>
                              <input
                                type="text"
                                value={newJob.salary}
                                onChange={(e) => setNewJob({
                                  ...newJob,
                                  salary: e.target.value
                                })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Equity + Cash (DOE)"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                              <textarea
                                value={newJob.description}
                                onChange={(e) => setNewJob({
                                  ...newJob,
                                  description: e.target.value
                                })}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Detailed job description..."
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma-separated)</label>
                              <textarea
                                value={Array.isArray(newJob.requirements) ? newJob.requirements.join(', ') : ''}
                                onChange={(e) => setNewJob({
                                  ...newJob,
                                  requirements: e.target.value.split(',').map(req => req.trim()).filter(req => req)
                                })}
                                rows={2}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="React/Node.js, API development, Startup mindset"
                              />
                            </div>
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button
                              onClick={async () => {
                                if (!newJob.title || !newJob.description) {
                                  showSaveStatus('Job title and description are required', 'error');
                                  return;
                                }
                                
                                const updatedJobs = [
                                  ...(localCareersData.jobPositions || []),
                                  {
                                    id: Date.now().toString(),
                                    ...newJob
                                  }
                                ];
                                
                                setLocalCareersData({
                                  ...localCareersData,
                                  jobPositions: updatedJobs
                                });
                                
                                setNewJob({
                                  title: '',
                                  department: 'Engineering',
                                  location: 'Remote',
                                  type: 'Full-time',
                                  experience: '',
                                  description: '',
                                  requirements: [],
                                  salary: ''
                                });
                                setShowAddJob(false);
                                showSaveStatus('Job position added! Remember to save changes.');
                              }}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                            >
                              Add Job
                            </button>
                            <button
                              onClick={() => {
                                setNewJob({
                                  title: '',
                                  department: 'Engineering',
                                  location: 'Remote',
                                  type: 'Full-time',
                                  experience: '',
                                  description: '',
                                  requirements: [],
                                  salary: ''
                                });
                                setShowAddJob(false);
                              }}
                              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Platform Settings Section */}
              {activeSection === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Platform Settings</h2>
                    <button
                      onClick={handleSavePlatformSettings}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={localPlatformSettings.showLiveBadge || false}
                          onChange={(e) => setLocalPlatformSettings({
                            ...localPlatformSettings,
                            showLiveBadge: e.target.checked
                          })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Show "Live Market" badge in hero</span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={localPlatformSettings.featuredPropertyEnabled || false}
                          onChange={(e) => setLocalPlatformSettings({
                            ...localPlatformSettings,
                            featuredPropertyEnabled: e.target.checked
                          })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Show featured property in hero</span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={localPlatformSettings.testimonialsEnabled || false}
                          onChange={(e) => setLocalPlatformSettings({
                            ...localPlatformSettings,
                            testimonialsEnabled: e.target.checked
                          })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Show testimonials section</span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={localPlatformSettings.maintenanceMode || false}
                          onChange={(e) => setLocalPlatformSettings({
                            ...localPlatformSettings,
                            maintenanceMode: e.target.checked
                          })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Maintenance mode (disables some features)</span>
                      </label>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-red-800 mb-2">Danger Zone</h3>
                      <p className="text-sm text-red-700 mb-3">Reset all homepage data to defaults. This cannot be undone.</p>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to reset all homepage data? This cannot be undone.')) {
                            clearData();
                            showSaveStatus('Homepage data reset to defaults', 'success');
                          }
                        }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Reset All Data
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageAdmin;
