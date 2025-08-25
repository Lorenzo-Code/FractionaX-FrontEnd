import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  MapPin, 
  AlertCircle,
  X,
  Loader
} from 'lucide-react';
import useCoreLogicInsights from '../hooks/useCoreLogicInsights';

const FXCTConfirmationModal = () => {
  const { 
    showFxctModal, 
    setShowFxctModal, 
    pendingInsightRequest,
    confirmPropertyInsights,
    cancelPropertyInsights,
    fxctBalance,
    getTierPricing
  } = useCoreLogicInsights();

  const [confirming, setConfirming] = React.useState(false);

  if (!showFxctModal || !pendingInsightRequest) return null;

  const tierConfig = getTierPricing(pendingInsightRequest.tier);
  const confirmationData = pendingInsightRequest.confirmationData;

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const result = await confirmPropertyInsights();
      if (result.success) {
        // Trigger a custom event to notify PropertyDetails
        window.dispatchEvent(new CustomEvent('fxctInsightConfirmed', {
          detail: {
            propertyId: pendingInsightRequest.propertyId,
            tier: pendingInsightRequest.tier,
            data: result.data
          }
        }));
      } else {
        console.error('Failed to confirm property insights:', result.error);
        // You could show an error state here
      }
    } catch (error) {
      console.error('Error confirming property insights:', error);
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = () => {
    cancelPropertyInsights();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={handleCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              disabled={confirming}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">
                Unlock Property Intelligence
              </h3>
              
              <p className="text-blue-100">
                Confirm your FXCT token purchase for enhanced property data
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Tier Summary */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">{tierConfig.name}</h4>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-600">{tierConfig.fxctCost} FXCT</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">{tierConfig.description}</p>
              
              {/* Benefits list */}
              <div className="space-y-2">
                {tierConfig.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <Star className="w-3 h-3 text-blue-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Balance and Cost Breakdown */}
            <div className="mb-6 space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Current FXCT Balance</span>
                <span className="font-semibold text-gray-900">{fxctBalance} FXCT</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Cost for {tierConfig.name}</span>
                <span className="font-semibold text-blue-600">-{tierConfig.fxctCost} FXCT</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-gray-700 font-medium">Remaining Balance</span>
                <span className="font-bold text-green-600">{fxctBalance - tierConfig.fxctCost} FXCT</span>
              </div>
            </div>

            {/* Property Info */}
            {confirmationData && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Property Details</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Address: {pendingInsightRequest.address}</div>
                  {confirmationData.estimatedDataSize && (
                    <div>Estimated Data: {confirmationData.estimatedDataSize}</div>
                  )}
                  {confirmationData.includesZillow && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Star className="w-3 h-3" />
                      Includes Zillow property photos
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Warning for low balance */}
            {fxctBalance - tierConfig.fxctCost < 10 && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-yellow-900 mb-1">Low FXCT Balance</h5>
                    <p className="text-yellow-800 text-sm">
                      After this purchase, you'll have {fxctBalance - tierConfig.fxctCost} FXCT remaining. 
                      Consider purchasing more FXCT tokens to continue using premium features.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {confirming ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5" />
                    Confirm Purchase - {tierConfig.fxctCost} FXCT
                  </>
                )}
              </button>

              <button
                onClick={handleCancel}
                disabled={confirming}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>

            {/* Additional info */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                FXCT tokens will be deducted immediately upon confirmation.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FXCTConfirmationModal;
