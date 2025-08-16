/**
 * Provider Price Override Dashboard
 * Comprehensive interface for managing negotiated provider pricing overrides
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { Textarea } from '../../../shared/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '../../../shared/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/components/ui/tabs';
import { Label } from '../../../shared/components/ui/label';
import { Checkbox } from '../../../shared/components/ui/checkbox';
import adminApiService from '../services/adminApiService';
import LoadingSpinner from '../../../shared/components/ui/loading-spinner';
import ProviderPricingConfigurator from './ProviderPricingConfigurator';
import { 
  Plus, 
  Search, 
  Filter, 
  Check, 
  X, 
  Archive, 
  Clock, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Calendar,
  User,
  Building2,
  Target,
  BarChart3
} from 'lucide-react';

const PROVIDERS = [
  'openai',
  'corelogic', 
  'attom',
  'zillow',
  'googlemaps',
  'greatschools',
  'sumsub',
  'jumio',
  'sendgrid',
  'twilio'
];

const PRICING_TYPES = [
  'token_based',
  'per_call',
  'per_verification',
  'per_email',
  'per_message'
];

const STATUS_COLORS = {
  active: 'bg-green-500',
  approved: 'bg-blue-500',
  pending: 'bg-yellow-500',
  draft: 'bg-gray-500',
  rejected: 'bg-red-500',
  expired: 'bg-orange-500',
  archived: 'bg-gray-400'
};

const APPROVAL_STATUS_COLORS = {
  approved: 'bg-green-500',
  pending: 'bg-yellow-500',
  rejected: 'bg-red-500'
};

const ProviderPriceOverrideDashboard = () => {
  // State management
  const [overrides, setOverrides] = useState([]);
  const [filteredOverrides, setFilteredOverrides] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State
  const [selectedOverrides, setSelectedOverrides] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOverride, setSelectedOverride] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    provider: '',
    approvalStatus: ''
  });
  
  // Form state for creating/editing
  const [formData, setFormData] = useState({
    provider: '',
    originalPricing: {
      type: 'token_based',
      models: {},
      endpoints: {}
    },
    overridePricing: {
      type: 'token_based', 
      models: {},
      endpoints: {}
    },
    negotiationDetails: {
      contactPerson: '',
      negotiationDate: '',
      terms: '',
      effectiveDate: ''
    },
    validityPeriod: {
      startDate: '',
      endDate: ''
    },
    notes: '',
    requiresApproval: true
  });

  // Load data on component mount
  useEffect(() => {
    loadOverrides();
    loadAnalytics();
  }, []);

  // Filter overrides when search/filters change
  useEffect(() => {
    applyFilters();
  }, [overrides, filters]);

  const loadOverrides = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getProviderPriceOverrides(filters);
      setOverrides(response.overrides || []);
    } catch (err) {
      console.error('❌ Failed to load overrides:', err);
      setError('Failed to load provider price overrides');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await adminApiService.getProviderPriceOverrideAnalytics();
      setAnalytics(response.analytics);
    } catch (err) {
      console.error('❌ Failed to load analytics:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...overrides];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(override => 
        override.provider.toLowerCase().includes(searchLower) ||
        override.negotiationDetails?.contactPerson?.toLowerCase().includes(searchLower) ||
        override.adminNotes?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(override => override.status === filters.status);
    }

    // Provider filter
    if (filters.provider) {
      filtered = filtered.filter(override => override.provider === filters.provider);
    }

    // Approval status filter
    if (filters.approvalStatus) {
      filtered = filtered.filter(override => override.approval?.status === filters.approvalStatus);
    }

    setFilteredOverrides(filtered);
  };

  const handleCreateOverride = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(true);
      await adminApiService.createProviderPriceOverride(formData);
      setShowCreateModal(false);
      resetForm();
      await loadOverrides();
      await loadAnalytics();
    } catch (err) {
      console.error('❌ Failed to create override:', err);
      setError('Failed to create provider price override');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveOverride = async (overrideId, notes = '') => {
    try {
      setActionLoading(true);
      await adminApiService.approveProviderPriceOverride(overrideId, notes);
      await loadOverrides();
      await loadAnalytics();
    } catch (err) {
      console.error('❌ Failed to approve override:', err);
      setError('Failed to approve override');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectOverride = async (overrideId, reason, notes = '') => {
    try {
      setActionLoading(true);
      await adminApiService.rejectProviderPriceOverride(overrideId, reason, notes);
      await loadOverrides();
      await loadAnalytics();
    } catch (err) {
      console.error('❌ Failed to reject override:', err);
      setError('Failed to reject override');
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchiveOverride = async (overrideId, reason = '') => {
    try {
      setActionLoading(true);
      await adminApiService.archiveProviderPriceOverride(overrideId, reason);
      await loadOverrides();
      await loadAnalytics();
    } catch (err) {
      console.error('❌ Failed to archive override:', err);
      setError('Failed to archive override');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedOverrides.length === 0) return;
    
    try {
      setActionLoading(true);
      await adminApiService.bulkProviderPriceOverrideAction(action, selectedOverrides, {
        reason: `Bulk ${action}`,
        notes: `Performed bulk ${action} on ${selectedOverrides.length} overrides`
      });
      setSelectedOverrides([]);
      await loadOverrides();
      await loadAnalytics();
    } catch (err) {
      console.error(`❌ Failed to perform bulk ${action}:`, err);
      setError(`Failed to perform bulk ${action}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = async (overrideId) => {
    try {
      setActionLoading(true);
      const response = await adminApiService.getProviderPriceOverride(overrideId);
      setSelectedOverride(response.override);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('❌ Failed to load override details:', err);
      setError('Failed to load override details');
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      provider: '',
      originalPricing: {
        type: 'token_based',
        models: {},
        endpoints: {}
      },
      overridePricing: {
        type: 'token_based',
        models: {},
        endpoints: {}
      },
      negotiationDetails: {
        contactPerson: '',
        negotiationDate: '',
        terms: '',
        effectiveDate: ''
      },
      validityPeriod: {
        startDate: '',
        endDate: ''
      },
      notes: '',
      requiresApproval: true
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner className="w-8 h-8" />
        <span className="ml-2">Loading provider price overrides...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Provider Price Overrides</h1>
          <p className="text-gray-600 mt-1">
            Manage negotiated pricing with external providers
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Override
        </Button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Overrides</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.summary.total}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Overrides</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.summary.active}</p>
                </div>
                <Check className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">{analytics.summary.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Savings</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(analytics.savings.totalMonthly)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search overrides..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <Select
              value={filters.provider}
              onValueChange={(value) => setFilters({ ...filters, provider: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Providers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Providers</SelectItem>
                {PROVIDERS.map(provider => (
                  <SelectItem key={provider} value={provider}>
                    {provider.charAt(0).toUpperCase() + provider.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.approvalStatus}
              onValueChange={(value) => setFilters({ ...filters, approvalStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Approvals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Approvals</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedOverrides.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedOverrides.length} overrides selected
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('approve')}
                disabled={actionLoading}
              >
                <Check className="w-4 h-4 mr-1" />
                Bulk Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('reject')}
                disabled={actionLoading}
              >
                <X className="w-4 h-4 mr-1" />
                Bulk Reject
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('archive')}
                disabled={actionLoading}
              >
                <Archive className="w-4 h-4 mr-1" />
                Bulk Archive
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overrides Table */}
      <Card>
        <CardHeader>
          <CardTitle>Price Overrides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">
                    <Checkbox
                      checked={selectedOverrides.length === filteredOverrides.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedOverrides(filteredOverrides.map(o => o._id));
                        } else {
                          setSelectedOverrides([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-left p-4">Provider</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Approval</th>
                  <th className="text-left p-4">Monthly Savings</th>
                  <th className="text-left p-4">Validity Period</th>
                  <th className="text-left p-4">Created</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredOverrides.map(override => (
                    <motion.tr
                      key={override._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={selectedOverrides.includes(override._id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOverrides([...selectedOverrides, override._id]);
                            } else {
                              setSelectedOverrides(selectedOverrides.filter(id => id !== override._id));
                            }
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium">
                              {override.provider.charAt(0).toUpperCase() + override.provider.slice(1)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {override.negotiationDetails?.contactPerson}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={`${STATUS_COLORS[override.status]} text-white`}>
                          {override.status.charAt(0).toUpperCase() + override.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={`${APPROVAL_STATUS_COLORS[override.approval?.status]} text-white`}>
                          {override.approval?.status.charAt(0).toUpperCase() + override.approval?.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-green-600">
                          {formatCurrency(override.monthlySavings || override.savings?.monthly || 0)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {override.validityPeriod?.startDate && (
                            <div>{formatDate(override.validityPeriod.startDate)}</div>
                          )}
                          {override.validityPeriod?.endDate && (
                            <div className="text-gray-600">
                              to {formatDate(override.validityPeriod.endDate)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>{formatDate(override.createdAt)}</div>
                          <div className="text-gray-600">
                            by {override.createdBy?.firstName} {override.createdBy?.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(override._id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {override.approval?.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleApproveOverride(override._id)}
                                disabled={actionLoading}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleRejectOverride(override._id, 'Administrative decision')}
                                disabled={actionLoading}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          
                          {override.status === 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-gray-600 hover:text-gray-700"
                              onClick={() => handleArchiveOverride(override._id)}
                              disabled={actionLoading}
                            >
                              <Archive className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredOverrides.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No provider price overrides found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Override Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create Provider Price Override</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreateOverride}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="validity">Validity</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="provider">Provider</Label>
                    <Select
                      value={formData.provider}
                      onValueChange={(value) => setFormData({ ...formData, provider: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVIDERS.map(provider => (
                          <SelectItem key={provider} value={provider}>
                            {provider.charAt(0).toUpperCase() + provider.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={formData.negotiationDetails.contactPerson}
                      onChange={(e) => setFormData({
                        ...formData,
                        negotiationDetails: {
                          ...formData.negotiationDetails,
                          contactPerson: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="terms">Negotiation Terms</Label>
                  <Textarea
                    id="terms"
                    value={formData.negotiationDetails.terms}
                    onChange={(e) => setFormData({
                      ...formData,
                      negotiationDetails: {
                        ...formData.negotiationDetails,
                        terms: e.target.value
                      }
                    })}
                    placeholder="Describe the negotiated terms..."
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Admin Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Internal notes about this override..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresApproval"
                    checked={formData.requiresApproval}
                    onCheckedChange={(checked) => setFormData({ ...formData, requiresApproval: checked })}
                  />
                  <Label htmlFor="requiresApproval">Requires approval before activation</Label>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4">
                {formData.provider ? (
                  <div className="max-h-96 overflow-y-auto">
                    <ProviderPricingConfigurator
                      provider={formData.provider}
                      originalPricing={formData.originalPricing}
                      overridePricing={formData.overridePricing}
                      onChange={(pricingData) => {
                        setFormData({
                          ...formData,
                          originalPricing: pricingData.originalPricing,
                          overridePricing: pricingData.overridePricing,
                          // Store the savings calculation for display
                          savingsCalculation: pricingData.savingsCalculation
                        });
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-lg font-medium mb-2">Select a Provider First</div>
                    <div className="text-sm">Choose a provider in the Basic Info tab to configure pricing</div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="validity" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.validityPeriod.startDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        validityPeriod: {
                          ...formData.validityPeriod,
                          startDate: e.target.value
                        }
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.validityPeriod.endDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        validityPeriod: {
                          ...formData.validityPeriod,
                          endDate: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="negotiationDate">Negotiation Date</Label>
                    <Input
                      id="negotiationDate"
                      type="date"
                      value={formData.negotiationDetails.negotiationDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        negotiationDetails: {
                          ...formData.negotiationDetails,
                          negotiationDate: e.target.value
                        }
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="effectiveDate">Effective Date</Label>
                    <Input
                      id="effectiveDate"
                      type="date"
                      value={formData.negotiationDetails.effectiveDate}
                      onChange={(e) => setFormData({
                        ...formData,
                        negotiationDetails: {
                          ...formData.negotiationDetails,
                          effectiveDate: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={actionLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {actionLoading && <LoadingSpinner className="w-4 h-4 mr-2" />}
                Create Override
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Override Details</DialogTitle>
          </DialogHeader>
          
          {selectedOverride && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Provider</Label>
                      <div className="font-medium">
                        {selectedOverride.provider.charAt(0).toUpperCase() + selectedOverride.provider.slice(1)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <div>
                        <Badge className={`${STATUS_COLORS[selectedOverride.status]} text-white`}>
                          {selectedOverride.status.charAt(0).toUpperCase() + selectedOverride.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Approval Status</Label>
                      <div>
                        <Badge className={`${APPROVAL_STATUS_COLORS[selectedOverride.approval?.status]} text-white`}>
                          {selectedOverride.approval?.status.charAt(0).toUpperCase() + selectedOverride.approval?.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Impact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Monthly Savings</Label>
                      <div className="font-medium text-green-600">
                        {formatCurrency(selectedOverride.monthlySavings || selectedOverride.savings?.monthly || 0)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Annual Savings</Label>
                      <div className="font-medium text-green-600">
                        {formatCurrency(selectedOverride.annualSavings || selectedOverride.savings?.annual || 0)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Currently Effective</Label>
                      <div>
                        <Badge className={selectedOverride.isCurrentlyEffective ? 'bg-green-500' : 'bg-gray-500'}>
                          {selectedOverride.isCurrentlyEffective ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Implementation Status */}
              {selectedOverride.implementationStatus && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Implementation Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Ready to Implement</Label>
                        <div>
                          <Badge className={selectedOverride.implementationStatus.readyToImplement ? 'bg-green-500' : 'bg-red-500'}>
                            {selectedOverride.implementationStatus.readyToImplement ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>

                      {selectedOverride.implementationStatus.blockers?.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Blockers</Label>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedOverride.implementationStatus.blockers.map((blocker, index) => (
                              <li key={index} className="text-sm text-red-600">{blocker}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedOverride.implementationStatus.requiredActions?.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Required Actions</Label>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedOverride.implementationStatus.requiredActions.map((action, index) => (
                              <li key={index} className="text-sm">{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cost Comparison */}
              {selectedOverride.costComparison && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cost Comparison Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <Label className="text-sm font-medium text-gray-500">Low Usage</Label>
                          <div className="text-lg font-medium text-green-600">
                            {selectedOverride.costComparison.comparison?.impactAnalysis?.lowUsage?.savings}
                          </div>
                          <div className="text-sm text-gray-600">
                            {selectedOverride.costComparison.comparison?.impactAnalysis?.lowUsage?.monthlyAmount}
                          </div>
                        </div>
                        <div className="text-center">
                          <Label className="text-sm font-medium text-gray-500">Medium Usage</Label>
                          <div className="text-lg font-medium text-green-600">
                            {selectedOverride.costComparison.comparison?.impactAnalysis?.mediumUsage?.savings}
                          </div>
                          <div className="text-sm text-gray-600">
                            {selectedOverride.costComparison.comparison?.impactAnalysis?.mediumUsage?.monthlyAmount}
                          </div>
                        </div>
                        <div className="text-center">
                          <Label className="text-sm font-medium text-gray-500">High Usage</Label>
                          <div className="text-lg font-medium text-green-600">
                            {selectedOverride.costComparison.comparison?.impactAnalysis?.highUsage?.savings}
                          </div>
                          <div className="text-sm text-gray-600">
                            {selectedOverride.costComparison.comparison?.impactAnalysis?.highUsage?.monthlyAmount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailsModal(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:text-red-200"
              onClick={() => setError(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProviderPriceOverrideDashboard;
