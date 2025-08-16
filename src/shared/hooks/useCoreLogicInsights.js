import { useContext } from 'react';
import CoreLogicInsightsContext from '../../context/CoreLogicInsightsContext';

/**
 * Custom hook for accessing CoreLogic insights functionality
 * Provides methods to check limits, view insights, and manage user access
 */
const useCoreLogicInsights = () => {
  const context = useContext(CoreLogicInsightsContext);
  
  if (!context) {
    throw new Error('useCoreLogicInsights must be used within a CoreLogicInsightsProvider');
  }

  return context;
};

export default useCoreLogicInsights;
