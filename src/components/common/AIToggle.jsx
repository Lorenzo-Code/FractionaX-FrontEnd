import React, { useState } from 'react';
import { customAIFilteredSearch } from '../../shared/utils/api';

/**
 * 🤖 AI Filter Toggle Component
 * 
 * Allows users to manually enable AI filtering with proper loading states
 */
const AIToggle = ({ onPropertiesUpdate, className = "" }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('idle');

  const handleEnableAI = async () => {
    setIsProcessing(true);
    setProgress(10);
    setStage('starting');

    try {
      // Step 1: Initialize
      setProgress(25);
      setStage('analyzing');

      // Step 2: Call AI filtering
      const result = await customAIFilteredSearch({
        targetUnits: 6,
        maxBudget: 1200000,
        analysisMode: 'quick'
      });

      // Step 3: Complete
      setProgress(100);
      setStage('complete');

      if (onPropertiesUpdate) {
        onPropertiesUpdate(result);
      }

      console.log('🎉 AI Filtering Success:', {
        total: result.totalFound,
        original: result.originalFound,
        aiFiltered: result.aiFiltered,
        qualificationRate: result.aiFiltering?.qualificationRate
      });

    } catch (error) {
      console.error('❌ AI filtering failed:', error);
      setStage('error');
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setStage('idle');
      }, 2000);
    }
  };

  const getStatusMessage = () => {
    switch (stage) {
      case 'starting':
        return 'Initializing AI analysis...';
      case 'analyzing':
        return 'AI analyzing 500+ properties (this may take 3-5 minutes)...';
      case 'complete':
        return 'AI filtering complete!';
      case 'error':
        return 'AI filtering failed, showing all properties';
      default:
        return '';
    }
  };

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      {!isProcessing ? (
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900">🤖 AI Property Filter</h4>
            <p className="text-sm text-blue-700">
              Get AI-curated investment opportunities (6+ units, high ROI)
            </p>
          </div>
          <button
            onClick={handleEnableAI}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enable AI Filter
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blue-900">🤖 AI Analysis in Progress</h4>
            <span className="text-blue-700 font-medium">{progress}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-sm text-blue-700">{getStatusMessage()}</p>
          
          {stage === 'analyzing' && (
            <div className="mt-2 text-xs text-blue-600">
              💡 Pro tip: AI filtering analyzes each property for investment potential. 
              This takes time but ensures you only see qualified opportunities.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIToggle;