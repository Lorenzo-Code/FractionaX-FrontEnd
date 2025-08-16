import React from 'react';
import { 
  FaTimes, FaRobot, FaExclamationTriangle, 
  FaCheckCircle, FaUser, FaClock, FaShieldAlt
} from 'react-icons/fa';

const AIAnalysisModal = ({ 
  isOpen, 
  onClose, 
  user, 
  analysisResult, 
  recommendations = [], 
  threatAnalysis = null 
}) => {
  if (!isOpen) return null;

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return <FaExclamationTriangle className="text-red-500" />;
      case 'medium': return <FaExclamationTriangle className="text-yellow-500" />;
      case 'low': return <FaCheckCircle className="text-green-500" />;
      default: return <FaShieldAlt className="text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <FaRobot className="text-purple-600 text-2xl" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Security Analysis</h2>
              <p className="text-gray-600">Detailed analysis and recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* User Information */}
        {user && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <FaUser className="text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">User Profile</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Name:</span> {user.name}
              </div>
              <div>
                <span className="font-medium text-blue-800">Email:</span> {user.email}
              </div>
              <div>
                <span className="font-medium text-blue-800">Role:</span> {user.role?.toUpperCase()}
              </div>
              <div>
                <span className="font-medium text-blue-800">Status:</span> {user.status}
              </div>
              <div>
                <span className="font-medium text-blue-800">Security Score:</span> {user.securityScore}/100
              </div>
              <div>
                <span className="font-medium text-blue-800">Last Login:</span> {user.lastLogin?.toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Risk Assessment */}
            <div className={`p-4 rounded-lg border ${getRiskColor(analysisResult.riskLevel)}`}>
              <div className="flex items-center space-x-3 mb-3">
                {getRiskIcon(analysisResult.riskLevel)}
                <h3 className="text-lg font-semibold">Risk Assessment: {analysisResult.riskLevel?.toUpperCase()}</h3>
              </div>
              {analysisResult.summary && (
                <p className="text-sm mb-3">{analysisResult.summary}</p>
              )}
              {analysisResult.score && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">AI Risk Score:</span>
                  <span className="font-bold text-lg">{analysisResult.score}/100</span>
                </div>
              )}
            </div>

            {/* Key Findings */}
            {analysisResult.findings && analysisResult.findings.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Key Findings</h4>
                <ul className="space-y-2">
                  {analysisResult.findings.map((finding, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Security Metrics */}
            {analysisResult.metrics && (
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Security Metrics Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(analysisResult.metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <span className="text-sm font-bold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">AI Recommendations</h4>
                <div className="space-y-3">
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-purple-200">
                      <div className="flex items-start space-x-2">
                        <FaRobot className="text-purple-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-purple-900">{rec.title || `Recommendation ${index + 1}`}</p>
                          <p className="text-xs text-purple-700 mt-1">{rec.description || rec}</p>
                          {rec.priority && (
                            <span className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                              rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {rec.priority.toUpperCase()} PRIORITY
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className="flex items-center space-x-2 text-xs text-gray-500 pt-4 border-t">
              <FaClock />
              <span>Analysis generated: {new Date().toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* General Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg mt-6">
            <h4 className="font-semibold text-green-900 mb-3">General Security Recommendations</h4>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-green-800">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Threat Analysis */}
        {threatAnalysis && (
          <div className="bg-red-50 p-4 rounded-lg mt-6">
            <h4 className="font-semibold text-red-900 mb-3">Threat Analysis</h4>
            <div className="text-sm text-red-800">
              {typeof threatAnalysis === 'string' ? (
                <p>{threatAnalysis}</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(threatAnalysis).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!analysisResult && (!recommendations || recommendations.length === 0) && !threatAnalysis && (
          <div className="text-center py-8">
            <FaRobot className="text-gray-400 text-4xl mx-auto mb-3" />
            <p className="text-gray-600">No AI analysis results available</p>
            <p className="text-sm text-gray-500 mt-1">Try running the analysis again</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisModal;
