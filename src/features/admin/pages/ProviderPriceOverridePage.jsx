/**
 * Provider Price Override Page
 * Admin page wrapper for the Provider Price Override Dashboard
 */

import React from 'react';
import { ProviderPriceOverrideDashboard } from '../components';

const ProviderPriceOverridePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderPriceOverrideDashboard />
    </div>
  );
};

export default ProviderPriceOverridePage;
