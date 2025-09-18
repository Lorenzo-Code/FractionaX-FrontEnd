import { useState, useCallback } from 'react';
import { enableAIFilteringWithProgress, multiFamilyPropertyDiscovery } from '../shared/utils/api';

/**
 * 🤖 Custom Hook for AI Property Filtering
 * 
 * Provides loading states, progress tracking, and error handling
 * for OpenAI-powered property filtering
 */
export const useAIFiltering = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('idle');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleProgress = useCallback((progressData) => {
    setLoadingStage(progressData.stage);
    setLoadingMessage(progressData.message);
    setProgress(progressData.progress);
    
    console.log(`🤖 AI Filtering Progress: ${progressData.stage} - ${progressData.message} (${progressData.progress}%)`);
  }, []);

  const loadPropertiesWithAI = useCallback(async (options = {}) => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await enableAIFilteringWithProgress(options, handleProgress);
      setIsLoading(false);
      setProgress(100);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      setProgress(0);
      console.error('❌ AI filtering failed:', err);
      
      // Fallback to raw properties
      return await multiFamilyPropertyDiscovery({ useAIFilter: false });
    }
  }, [handleProgress]);

  const loadPropertiesWithoutAI = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setLoadingMessage('Loading properties...');
    setProgress(50);

    try {
      const result = await multiFamilyPropertyDiscovery({ useAIFilter: false });
      setIsLoading(false);
      setProgress(100);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      setProgress(0);
      console.error('❌ Property loading failed:', err);
      throw err;
    }
  }, []);

  return {
    // State
    isLoading,
    loadingStage,
    loadingMessage,
    progress,
    error,
    
    // Actions
    loadPropertiesWithAI,
    loadPropertiesWithoutAI,
    
    // Utilities
    isAnalyzing: loadingStage === 'analyzing',
    isDiscovering: loadingStage === 'discovering',
    isComplete: loadingStage === 'complete',
    hasError: !!error
  };
};

export default useAIFiltering;