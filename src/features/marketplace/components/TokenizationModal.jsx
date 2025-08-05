import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiDollarSign, FiTrendingUp, FiShield, FiInfo, FiCheck } from "react-icons/fi";
import { BsCoin, BsShieldCheck } from "react-icons/bs";

const TokenizationModal = ({ property, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [tokenDetails, setTokenDetails] = useState({
    totalTokens: Math.floor(property.price / 100), // $100 per token default
    tokenPrice: 100,
    minimumInvestment: 500,
    expectedROI: 12.5,
    dividendFrequency: 'monthly'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTokenize = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setSuccess(true);
    setStep(4);
  };

  const formatPrice = (price) => {
    return `$${price?.toLocaleString()}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl mr-4">
                <BsCoin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tokenize Property</h2>
                <p className="text-gray-600">Convert to FXST tokens for fractional ownership</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6 flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepNumber ? <FiCheck className="w-4 h-4" /> : stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Property Overview */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Property Image */}
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={property.images[0] || "/api/placeholder/400/300"}
                      alt={property.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Ready for Tokenization
                      </span>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{property.title}</h4>
                      <p className="text-gray-600">{property.address}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Property Value</p>
                        <p className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Monthly Rent</p>
                        <p className="text-xl font-bold text-gray-900">${property.rentPrice}</p>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <span>{property.beds} beds</span>
                      <span>{property.baths} baths</span>
                      <span>{property.sqft?.toLocaleString()} sq ft</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {property.features.slice(0, 4).map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Continue to Token Setup
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Token Configuration */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Token Configuration</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Token Price (USD)
                      </label>
                      <input
                        type="number"
                        value={tokenDetails.tokenPrice}
                        onChange={(e) => setTokenDetails({
                          ...tokenDetails,
                          tokenPrice: parseFloat(e.target.value),
                          totalTokens: Math.floor(property.price / parseFloat(e.target.value))
                        })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        min="1"
                        max="1000"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: $50 - $200 per token
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Tokens
                      </label>
                      <input
                        type="number"
                        value={tokenDetails.totalTokens}
                        onChange={(e) => setTokenDetails({
                          ...tokenDetails,
                          totalTokens: parseInt(e.target.value),
                          tokenPrice: Math.floor(property.price / parseInt(e.target.value))
                        })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        min="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Investment
                      </label>
                      <input
                        type="number"
                        value={tokenDetails.minimumInvestment}
                        onChange={(e) => setTokenDetails({
                          ...tokenDetails,
                          minimumInvestment: parseInt(e.target.value)
                        })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        min="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Annual ROI (%)
                      </label>
                      <input
                        type="number"
                        value={tokenDetails.expectedROI}
                        onChange={(e) => setTokenDetails({
                          ...tokenDetails,
                          expectedROI: parseFloat(e.target.value)
                        })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        min="0"
                        max="50"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Tokenization Summary</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Value:</span>
                        <span className="font-semibold">{formatPrice(property.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Token Price:</span>
                        <span className="font-semibold">${tokenDetails.tokenPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Tokens:</span>
                        <span className="font-semibold">{tokenDetails.totalTokens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min Investment:</span>
                        <span className="font-semibold">${tokenDetails.minimumInvestment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected ROI:</span>
                        <span className="font-semibold text-green-600">{tokenDetails.expectedROI}%</span>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
                      <div className="flex items-center text-sm text-purple-700">
                        <FiInfo className="w-4 h-4 mr-2" />
                        <span className="font-medium">Estimated Monthly Dividend</span>
                      </div>
                      <p className="text-lg font-bold text-purple-900 mt-1">
                        ${((property.rentPrice * tokenDetails.expectedROI / 100) / 12).toFixed(2)} per token
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Review & Confirm
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Review & Confirm</h3>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Tokenization Details</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Property</p>
                      <p className="font-semibold">{property.title}</p>
                      <p className="text-sm text-gray-600">{property.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Token Symbol</p>
                      <p className="font-semibold">FXST-{property.id}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <BsCoin className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Total Tokens</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {tokenDetails.totalTokens.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <FiDollarSign className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Token Price</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      ${tokenDetails.tokenPrice}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <FiTrendingUp className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Expected ROI</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {tokenDetails.expectedROI}%
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <FiShield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-blue-900 mb-2">Security & Compliance</h5>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Property ownership verified and documented</li>
                        <li>• Smart contract audited for security</li>
                        <li>• Compliant with SEC regulations</li>
                        <li>• Insurance coverage included</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <FiInfo className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-yellow-900 mb-2">Important Information</h5>
                      <p className="text-sm text-yellow-800">
                        By tokenizing this property, you agree to the FXST platform terms and conditions. 
                        Token holders will receive dividends based on rental income and property appreciation. 
                        This process is irreversible once confirmed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Back to Edit
                </button>
                <button
                  onClick={handleTokenize}
                  disabled={loading}
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Tokenizing...
                    </>
                  ) : (
                    <>
                      <BsCoin className="w-4 h-4 mr-2" />
                      Confirm Tokenization
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Property Successfully Tokenized!
              </h3>
              
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your property has been converted to {tokenDetails.totalTokens.toLocaleString()} FXST tokens 
                and is now available for fractional investment.
              </p>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
                <h4 className="font-semibold text-gray-900 mb-3">Token Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Token Symbol:</span>
                    <span className="font-semibold">FXST-{property.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Supply:</span>
                    <span className="font-semibold">{tokenDetails.totalTokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per Token:</span>
                    <span className="font-semibold">${tokenDetails.tokenPrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={onClose}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  View in Portfolio
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TokenizationModal;
