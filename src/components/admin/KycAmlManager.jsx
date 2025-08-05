import React, { useState, useEffect } from 'react';
import { smartFetch } from '../shared/utils';
import {
  FaUser, FaShieldAlt, FaCheckCircle, FaTimesCircle, FaSearch, FaFilter,
  FaExclamationTriangle, FaEye, FaDownload, FaFileImage, FaFileAlt,
  FaClock, FaUserCheck, FaUserTimes, FaFlag, FaHistory, FaComment
} from 'react-icons/fa';
import Modal from './Modal';

const KycAmlManager = () => {
  const [kycData, setKycData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchKycData();
  }, []);

  const fetchKycData = async () => {
    const token = localStorage.getItem('access_token');
    setLoading(true);
    
    try {
      const response = await smartFetch('/api/admin/kyc/applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setKycData(data.applications);
      } else {
        throw new Error(data.msg || 'Failed to fetch KYC data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId) => {
    const token = localStorage.getItem('access_token');
    setLoading(true);
    
    try {
      const response = await smartFetch(`/api/admin/kyc/approve/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess('User KYC approved successfully!');
        fetchKycData();
      } else {
        const data = await response.json();
        throw new Error(data.msg || 'Failed to approve KYC');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const rejectUser = async (userId, reason) => {
    const token = localStorage.getItem('access_token');
    setLoading(true);
    
    try {
      const response = await smartFetch(`/api/admin/kyc/reject/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        setSuccess('User KYC rejected successfully!');
        setShowRejectModal(false);
        setRejectionReason('');
        fetchKycData();
      } else {
        const data = await response.json();
        throw new Error(data.msg || 'Failed to reject KYC');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const openRejectModal = (user) => {
    setSelectedUser(user);
    setShowRejectModal(true);
  };

  const getFilteredData = () => {
    return kycData.filter(user => {
      const matchesSearch = user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || user.kycStatus === statusFilter;
      const matchesRisk = riskFilter === 'all' || user.riskLevel === riskFilter;
      
      return matchesSearch && matchesStatus && matchesRisk;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">KYC & AML Management</h2>
          <p className="text-gray-600">Review and manage user verification applications</p>
        </div>
        <button 
          onClick={fetchKycData} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          disabled={loading}
        >
          <FaShieldAlt />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <FaCheckCircle className="inline mr-2" />
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <FaExclamationTriangle className="inline mr-2" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>

          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <FaDownload />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KYC Applications Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredData().map((user) => (
            <div key={user._id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.kycStatus)}`}>
                    {user.kycStatus}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(user.riskLevel)}`}>
                    {user.riskLevel} risk
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Submitted:</span>
                  <span>{user.submittedAt ? new Date(user.submittedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Documents:</span>
                  <span>{user.documentsCount || 0} files</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Country:</span>
                  <span>{user.country || 'N/A'}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => openUserModal(user)} 
                  className="flex-1 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-1"
                >
                  <FaEye />
                  <span>View</span>
                </button>
                
                {user.kycStatus === 'pending' && (
                  <>
                    <button 
                      onClick={() => approveUser(user._id)} 
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                      disabled={loading}
                    >
                      <FaCheckCircle />
                      <span>Approve</span>
                    </button>
                    <button 
                      onClick={() => openRejectModal(user)} 
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                      disabled={loading}
                    >
                      <FaTimesCircle />
                      <span>Reject</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {getFilteredData().length === 0 && !loading && (
        <div className="text-center py-12">
          <FaUser className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No KYC applications</h3>
          <p className="mt-1 text-sm text-gray-500">No applications match your current filters.</p>
        </div>
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <Modal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)}
          title={`KYC Application - ${selectedUser.firstName} ${selectedUser.lastName}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">First Name:</span>
                    <p className="font-medium">{selectedUser.firstName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Name:</span>
                    <p className="font-medium">{selectedUser.lastName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date of Birth:</span>
                    <p className="font-medium">{selectedUser.dateOfBirth || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Country:</span>
                    <p className="font-medium">{selectedUser.country || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{selectedUser.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Status Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">KYC Status:</span>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedUser.kycStatus)}`}>
                      {selectedUser.kycStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRiskColor(selectedUser.riskLevel)}`}>
                      {selectedUser.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Submitted:</span>
                    <span>{selectedUser.submittedAt ? new Date(selectedUser.submittedAt).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Uploaded Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedUser.documents?.map((doc, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      {doc.type?.includes('image') ? <FaFileImage className="text-blue-500" /> : <FaFileAlt className="text-gray-500" />}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    </div>
                  </div>
                )) || (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <FaFileAlt className="mx-auto h-8 w-8 mb-2" />
                    <p>No documents uploaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {selectedUser.kycStatus === 'pending' && (
              <div className="flex space-x-3 pt-4 border-t">
                <button 
                  onClick={() => {
                    approveUser(selectedUser._id);
                    setShowModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  disabled={loading}
                >
                  <FaCheckCircle />
                  <span>Approve Application</span>
                </button>
                <button 
                  onClick={() => {
                    setShowModal(false);
                    openRejectModal(selectedUser);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  disabled={loading}
                >
                  <FaTimesCircle />
                  <span>Reject Application</span>
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Rejection Modal */}
      {showRejectModal && selectedUser && (
        <Modal 
          isOpen={showRejectModal} 
          onClose={() => setShowRejectModal(false)}
          title="Reject KYC Application"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Please provide a reason for rejecting {selectedUser.firstName} {selectedUser.lastName}'s KYC application:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Enter rejection reason..."
            />
            <div className="flex space-x-3">
              <button 
                onClick={() => rejectUser(selectedUser._id, rejectionReason)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={loading || !rejectionReason.trim()}
              >
                Reject Application
              </button>
              <button 
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default KycAmlManager;
