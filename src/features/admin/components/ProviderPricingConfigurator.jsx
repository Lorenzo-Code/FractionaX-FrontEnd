/**
 * Provider Pricing Configurator
 * Dynamic component for configuring provider-specific pricing structures
 * Supports token-based, per-call, per-verification, and other pricing models
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
import { Label } from '../../../shared/components/ui/label';
import { Separator } from '../../../shared/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/components/ui/tabs';
import { 
  Plus, 
  Minus, 
  DollarSign, 
  Calculator,
  TrendingUp,
  AlertCircle,
  Info,
  Zap
} from 'lucide-react';

// Provider-specific pricing configurations
const PROVIDER_CONFIGS = {
  openai: {
    name: 'OpenAI',
    type: 'token_based',
    models: [
      { id: 'gpt-4', name: 'GPT-4', inputCost: 0.00003, outputCost: 0.00006 },
      { id: 'gpt-4-32k', name: 'GPT-4 32K', inputCost: 0.00006, outputCost: 0.00012 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', inputCost: 0.0000015, outputCost: 0.000002 },
      { id: 'gpt-3.5-turbo-16k', name: 'GPT-3.5 Turbo 16K', inputCost: 0.000003, outputCost: 0.000004 }
    ],
    endpoints: []
  },
  corelogic: {
    name: 'CoreLogic',
    type: 'per_call',
    models: [],
    endpoints: [
      { id: 'property-details', name: 'Property Details', cost: 0.25 },
      { id: 'valuation', name: 'Property Valuation', cost: 0.50 },
      { id: 'ownership-history', name: 'Ownership History', cost: 0.15 },
      { id: 'market-trends', name: 'Market Trends', cost: 0.35 }
    ]
  },
  attom: {
    name: 'ATTOM Data',
    type: 'per_call',
    models: [],
    endpoints: [
      { id: 'property-basic', name: 'Property Basic Info', cost: 0.10 },
      { id: 'property-detail', name: 'Property Detail', cost: 0.30 },
      { id: 'sales-history', name: 'Sales History', cost: 0.20 },
      { id: 'foreclosure', name: 'Foreclosure Data', cost: 0.40 }
    ]
  },
  zillow: {
    name: 'Zillow',
    type: 'per_call',
    models: [],
    endpoints: [
      { id: 'zestimate', name: 'Zestimate API', cost: 0.05 },
      { id: 'rental-estimate', name: 'Rental Estimate', cost: 0.08 },
      { id: 'comparable-sales', name: 'Comparable Sales', cost: 0.15 }
    ]
  },
  googlemaps: {
    name: 'Google Maps',
    type: 'per_call',
    models: [],
    endpoints: [
      { id: 'geocoding', name: 'Geocoding API', cost: 0.005 },
      { id: 'places', name: 'Places API', cost: 0.017 },
      { id: 'directions', name: 'Directions API', cost: 0.005 },
      { id: 'distance-matrix', name: 'Distance Matrix', cost: 0.01 }
    ]
  },
  greatschools: {
    name: 'GreatSchools',
    type: 'per_call',
    models: [],
    endpoints: [
      { id: 'school-search', name: 'School Search', cost: 0.02 },
      { id: 'school-profile', name: 'School Profile', cost: 0.05 },
      { id: 'district-info', name: 'District Info', cost: 0.03 }
    ]
  },
  sumsub: {
    name: 'Sum&Substance (Sumsub)',
    type: 'per_verification',
    models: [],
    endpoints: [
      { id: 'identity-verification', name: 'Identity Verification', cost: 1.50 },
      { id: 'document-verification', name: 'Document Verification', cost: 0.75 },
      { id: 'face-matching', name: 'Face Matching', cost: 0.50 },
      { id: 'aml-screening', name: 'AML Screening', cost: 0.25 }
    ]
  },
  jumio: {
    name: 'Jumio',
    type: 'per_verification',
    models: [],
    endpoints: [
      { id: 'netverify', name: 'Netverify', cost: 1.25 },
      { id: 'authentication', name: 'Authentication', cost: 0.80 },
      { id: 'document-verification', name: 'Document Verification', cost: 0.60 },
      { id: 'selfie-comparison', name: 'Selfie Comparison', cost: 0.40 }
    ]
  },
  sendgrid: {
    name: 'SendGrid',
    type: 'per_email',
    models: [],
    endpoints: [
      { id: 'email-send', name: 'Email Send', cost: 0.0006 },
      { id: 'template-send', name: 'Template Send', cost: 0.0008 },
      { id: 'marketing-email', name: 'Marketing Email', cost: 0.001 }
    ]
  },
  twilio: {
    name: 'Twilio',
    type: 'per_message',
    models: [],
    endpoints: [
      { id: 'sms-send', name: 'SMS Send', cost: 0.0075 },
      { id: 'voice-call', name: 'Voice Call (per minute)', cost: 0.013 },
      { id: 'phone-verification', name: 'Phone Verification', cost: 0.05 }
    ]
  }
};

// Calculate monthly savings using consistent logic
const calculateMonthlySavings = (originalPricing, overridePricing) => {
  console.log('🧮 Calculating monthly savings:', { originalPricing, overridePricing });
  
  if (!originalPricing || !overridePricing) {
    console.warn('⚠️ Missing pricing data for calculation');
    return { monthly: 0, annual: 0, percentageSaved: 0, details: {} };
  }

  let monthlySavings = 0;
  const details = {};

  // Token-based pricing (e.g., OpenAI models)
  if (originalPricing.type === 'token_based' && originalPricing.models && overridePricing.models) {
    Object.keys(originalPricing.models).forEach(modelId => {
      const original = originalPricing.models[modelId];
      const override = overridePricing.models[modelId];
      
      if (original && override) {
        // Estimate monthly usage (tokens) - using realistic estimates
        const estimatedMonthlyInputTokens = 1000000; // 1M input tokens per month
        const estimatedMonthlyOutputTokens = 500000; // 500K output tokens per month
        
        const originalCost = (original.inputCost * estimatedMonthlyInputTokens) + (original.outputCost * estimatedMonthlyOutputTokens);
        const overrideCost = (override.inputCost * estimatedMonthlyInputTokens) + (override.outputCost * estimatedMonthlyOutputTokens);
        
        const modelSavings = originalCost - overrideCost;
        monthlySavings += modelSavings;
        
        details[modelId] = {
          originalCost,
          overrideCost,
          savings: modelSavings,
          percentageSaved: originalCost > 0 ? ((modelSavings / originalCost) * 100) : 0
        };
        
        console.log(`💰 Model ${modelId}: Original $${originalCost.toFixed(4)}, Override $${overrideCost.toFixed(4)}, Savings $${modelSavings.toFixed(4)}`);
      }
    });
  }

  // Per-call pricing (e.g., CoreLogic, ATTOM, etc.)
  if (originalPricing.type === 'per_call' && originalPricing.endpoints && overridePricing.endpoints) {
    Object.keys(originalPricing.endpoints).forEach(endpointId => {
      const original = originalPricing.endpoints[endpointId];
      const override = overridePricing.endpoints[endpointId];
      
      if (original && override) {
        // Estimate monthly API calls - using realistic estimates
        const estimatedMonthlyCalls = 10000; // 10K calls per month per endpoint
        
        const originalCost = original.cost * estimatedMonthlyCalls;
        const overrideCost = override.cost * estimatedMonthlyCalls;
        
        const endpointSavings = originalCost - overrideCost;
        monthlySavings += endpointSavings;
        
        details[endpointId] = {
          originalCost,
          overrideCost,
          savings: endpointSavings,
          percentageSaved: originalCost > 0 ? ((endpointSavings / originalCost) * 100) : 0
        };
        
        console.log(`🔗 Endpoint ${endpointId}: Original $${originalCost.toFixed(2)}, Override $${overrideCost.toFixed(2)}, Savings $${endpointSavings.toFixed(2)}`);
      }
    });
  }

  const annualSavings = monthlySavings * 12;
  const percentageSaved = monthlySavings > 0 ? 
    ((monthlySavings / (monthlySavings + Object.values(details).reduce((sum, d) => sum + d.overrideCost, 0))) * 100) : 0;

  console.log('✅ Monthly savings calculation complete:', { monthlySavings, annualSavings, percentageSaved });

  return {
    monthly: monthlySavings,
    annual: annualSavings,
    percentageSaved,
    details
  };
};

const ProviderPricingConfigurator = ({ 
  provider, 
  originalPricing = {}, 
  overridePricing = {}, 
  onChange,
  readOnly = false 
}) => {
  const [localOriginal, setLocalOriginal] = useState(originalPricing);
  const [localOverride, setLocalOverride] = useState(overridePricing);
  const [savingsCalculation, setSavingsCalculation] = useState(null);
  const [activeTab, setActiveTab] = useState('original');

  const providerConfig = PROVIDER_CONFIGS[provider] || { 
    name: provider, 
    type: 'per_call', 
    models: [], 
    endpoints: [] 
  };

  // Initialize pricing structures based on provider config
  useEffect(() => {
    if (provider && !localOriginal.type) {
      const initialOriginal = {
        type: providerConfig.type,
        models: {},
        endpoints: {}
      };

      const initialOverride = {
        type: providerConfig.type,
        models: {},
        endpoints: {}
      };

      // Initialize models for token-based providers
      if (providerConfig.type === 'token_based') {
        providerConfig.models.forEach(model => {
          initialOriginal.models[model.id] = {
            inputCost: model.inputCost,
            outputCost: model.outputCost
          };
          initialOverride.models[model.id] = {
            inputCost: model.inputCost,
            outputCost: model.outputCost
          };
        });
      } else {
        // Initialize endpoints for per-call providers
        providerConfig.endpoints.forEach(endpoint => {
          initialOriginal.endpoints[endpoint.id] = {
            cost: endpoint.cost
          };
          initialOverride.endpoints[endpoint.id] = {
            cost: endpoint.cost
          };
        });
      }

      setLocalOriginal(initialOriginal);
      setLocalOverride(initialOverride);
    }
  }, [provider, providerConfig]);

  // Calculate savings when pricing changes
  useEffect(() => {
    if (localOriginal.type && localOverride.type) {
      const calculation = calculateMonthlySavings(localOriginal, localOverride);
      setSavingsCalculation(calculation);
    }
  }, [localOriginal, localOverride]);

  // Notify parent component of changes
  useEffect(() => {
    if (onChange) {
      onChange({
        originalPricing: localOriginal,
        overridePricing: localOverride,
        savingsCalculation
      });
    }
  }, [localOriginal, localOverride, savingsCalculation, onChange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  };

  const updateModelPricing = (modelId, field, value, isOverride = false) => {
    const numValue = parseFloat(value) || 0;
    
    if (isOverride) {
      setLocalOverride(prev => ({
        ...prev,
        models: {
          ...prev.models,
          [modelId]: {
            ...prev.models[modelId],
            [field]: numValue
          }
        }
      }));
    } else {
      setLocalOriginal(prev => ({
        ...prev,
        models: {
          ...prev.models,
          [modelId]: {
            ...prev.models[modelId],
            [field]: numValue
          }
        }
      }));
    }
  };

  const updateEndpointPricing = (endpointId, value, isOverride = false) => {
    const numValue = parseFloat(value) || 0;
    
    if (isOverride) {
      setLocalOverride(prev => ({
        ...prev,
        endpoints: {
          ...prev.endpoints,
          [endpointId]: {
            cost: numValue
          }
        }
      }));
    } else {
      setLocalOriginal(prev => ({
        ...prev,
        endpoints: {
          ...prev.endpoints,
          [endpointId]: {
            cost: numValue
          }
        }
      }));
    }
  };

  const renderTokenBasedPricing = (pricing, isOverride = false) => (
    <div className="space-y-4">
      {providerConfig.models.map(model => {
        const modelPricing = pricing.models?.[model.id] || { inputCost: 0, outputCost: 0 };
        const originalModelPricing = localOriginal.models?.[model.id] || { inputCost: 0, outputCost: 0 };
        const savingsData = savingsCalculation?.details?.[model.id];
        
        return (
          <Card key={model.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{model.name}</CardTitle>
                {savingsData && (
                  <Badge variant={savingsData.savings > 0 ? 'default' : 'secondary'} className="bg-green-500 text-white">
                    {savingsData.savings > 0 ? `+${formatCurrency(savingsData.savings)}` : 'No savings'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-500">Input Cost (per token)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      step="0.000001"
                      min="0"
                      className="pl-10"
                      value={modelPricing.inputCost}
                      onChange={(e) => updateModelPricing(model.id, 'inputCost', e.target.value, isOverride)}
                      readOnly={readOnly}
                    />
                  </div>
                  {!isOverride && (
                    <div className="text-xs text-gray-500 mt-1">
                      Current: {formatCurrency(model.inputCost)}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label className="text-xs text-gray-500">Output Cost (per token)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      step="0.000001"
                      min="0"
                      className="pl-10"
                      value={modelPricing.outputCost}
                      onChange={(e) => updateModelPricing(model.id, 'outputCost', e.target.value, isOverride)}
                      readOnly={readOnly}
                    />
                  </div>
                  {!isOverride && (
                    <div className="text-xs text-gray-500 mt-1">
                      Current: {formatCurrency(model.outputCost)}
                    </div>
                  )}
                </div>
              </div>
              
              {isOverride && savingsData && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-green-800 mb-1">Estimated Monthly Impact</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-600">Original</div>
                      <div className="font-medium">{formatCurrency(savingsData.originalCost)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Override</div>
                      <div className="font-medium">{formatCurrency(savingsData.overrideCost)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Savings</div>
                      <div className="font-medium text-green-600">
                        {formatCurrency(savingsData.savings)} ({savingsData.percentageSaved.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderPerCallPricing = (pricing, isOverride = false) => (
    <div className="space-y-4">
      {providerConfig.endpoints.map(endpoint => {
        const endpointPricing = pricing.endpoints?.[endpoint.id] || { cost: 0 };
        const savingsData = savingsCalculation?.details?.[endpoint.id];
        
        return (
          <Card key={endpoint.id} className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{endpoint.name}</CardTitle>
                {savingsData && (
                  <Badge variant={savingsData.savings > 0 ? 'default' : 'secondary'} className="bg-green-500 text-white">
                    {savingsData.savings > 0 ? `+${formatCurrency(savingsData.savings)}` : 'No savings'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-gray-500">Cost per API Call</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    className="pl-10"
                    value={endpointPricing.cost}
                    onChange={(e) => updateEndpointPricing(endpoint.id, e.target.value, isOverride)}
                    readOnly={readOnly}
                  />
                </div>
                {!isOverride && (
                  <div className="text-xs text-gray-500 mt-1">
                    Current: {formatCurrency(endpoint.cost)}
                  </div>
                )}
              </div>
              
              {isOverride && savingsData && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-green-800 mb-1">Estimated Monthly Impact</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-600">Original</div>
                      <div className="font-medium">{formatCurrency(savingsData.originalCost)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Override</div>
                      <div className="font-medium">{formatCurrency(savingsData.overrideCost)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Savings</div>
                      <div className="font-medium text-green-600">
                        {formatCurrency(savingsData.savings)} ({savingsData.percentageSaved.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  if (!provider) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500">
        Select a provider to configure pricing
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{providerConfig.name} Pricing Configuration</h3>
          <p className="text-sm text-gray-600">
            Configure original and override pricing for {providerConfig.type.replace('_', ' ')} model
          </p>
        </div>
        <Badge variant="outline">{providerConfig.type.replace('_', ' ')}</Badge>
      </div>

      {/* Savings Summary */}
      {savingsCalculation && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Estimated Savings</h4>
                  <p className="text-sm text-gray-600">Based on typical usage patterns</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(savingsCalculation.monthly)}
                </div>
                <div className="text-sm text-gray-600">per month</div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(savingsCalculation.annual)} annually
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Configuration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="original">Original Pricing</TabsTrigger>
          <TabsTrigger value="override">Override Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="original" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>Current Provider Pricing</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Enter the current pricing structure from {providerConfig.name}
              </p>
            </CardHeader>
            <CardContent>
              {providerConfig.type === 'token_based' 
                ? renderTokenBasedPricing(localOriginal, false)
                : renderPerCallPricing(localOriginal, false)
              }
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="override" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Negotiated Override Pricing</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Enter the negotiated pricing structure for {providerConfig.name}
              </p>
            </CardHeader>
            <CardContent>
              {providerConfig.type === 'token_based' 
                ? renderTokenBasedPricing(localOverride, true)
                : renderPerCallPricing(localOverride, true)
              }
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Usage Assumptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>Calculation Assumptions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            {providerConfig.type === 'token_based' ? (
              <>
                <p>• Monthly input tokens: ~1,000,000 tokens</p>
                <p>• Monthly output tokens: ~500,000 tokens</p>
                <p>• Calculations based on typical AI application usage</p>
              </>
            ) : (
              <>
                <p>• Monthly API calls per endpoint: ~10,000 calls</p>
                <p>• Calculations based on typical application integration usage</p>
                <p>• Actual usage may vary significantly based on your specific needs</p>
              </>
            )}
            <p className="italic">
              These are estimates for comparison purposes. Actual savings will depend on your usage patterns.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderPricingConfigurator;
