// src/pages/admin/UsersPanel.jsx
import React, { useEffect, useState } from "react";
import { smartFetch } from "../../utils/apiClient"; // adjust path if needed
import { FaSearch, FaUserShield, FaUserTimes, FaBan, FaUnlock, FaKey, FaEye, FaTrash, FaCheck, FaTimes, FaWallet, FaCoins, FaExchangeAlt, FaHistory, FaPlus, FaMinus, FaLink, FaUnlink, FaCopy, FaDownload, FaUsers, FaUserCheck, FaChartLine, FaGlobeAmericas, FaShieldAlt, FaExclamationTriangle, FaUserTag, FaEnvelope, FaClock, FaSort, FaSortUp, FaSortDown, FaFilter } from "react-icons/fa";

const UsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(null);
  const [showTokenModal, setShowTokenModal] = useState(null);
  const [showTransactionHistory, setShowTransactionHistory] = useState(null);
  const [tokenAmount, setTokenAmount] = useState('');
  const [tokenType, setTokenType] = useState('FXCT');
  const [transactionType, setTransactionType] = useState('credit');
  const [transactionReason, setTransactionReason] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [externalWallets, setExternalWallets] = useState([]);
  
  // Phase 1 Features State
  const [analytics, setAnalytics] = useState(null);
  const [advancedSearchTerm, setAdvancedSearchTerm] = useState('');
  const [walletAddressSearch, setWalletAddressSearch] = useState('');
  const [txHashSearch, setTxHashSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('all');
  const [balanceRangeMin, setBalanceRangeMin] = useState('');
  const [balanceRangeMax, setBalanceRangeMax] = useState('');
  const [lastLoginFilter, setLastLoginFilter] = useState('all');
  const [registrationDateFrom, setRegistrationDateFrom] = useState('');
  const [registrationDateTo, setRegistrationDateTo] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [userTags, setUserTags] = useState({});
  const [showSecurityModal, setShowSecurityModal] = useState(null);
  const [showKycModal, setShowKycModal] = useState(null);
  const [showCommunicationModal, setShowCommunicationModal] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [securityLogs, setSecurityLogs] = useState([]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("access_token");
    setLoading(true);
    
    try {
      const response = await smartFetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to load users");

      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "active" && !user.suspended) ||
                           (statusFilter === "suspended" && user.suspended);
      return matchesSearch && matchesRole && matchesStatus;
    });
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const showMessage = (message, type = "success") => {
    if (type === "success") {
      setSuccess(message);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handlePromote = async (userId) => {
    const token = localStorage.getItem("access_token");
    setLoading(true);

    try {
      const response = await smartFetch(`/api/admin/users/${userId}/promote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Promotion failed");

      showMessage("User promoted to admin successfully!");
      fetchUsers();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDemote = async (userId) => {
    const token = localStorage.getItem("access_token");
    setLoading(true);

    try {
      const response = await smartFetch(`/api/admin/users/${userId}/demote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Demotion failed");

      showMessage("Admin demoted to user successfully!");
      fetchUsers();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId, suspend = true) => {
    const token = localStorage.getItem("access_token");
    setLoading(true);

    try {
      const response = await smartFetch(`/api/admin/users/${userId}/${suspend ? 'suspend' : 'unsuspend'}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || `${suspend ? 'Suspension' : 'Unsuspension'} failed`);

      showMessage(`User ${suspend ? 'suspended' : 'unsuspended'} successfully!`);
      fetchUsers();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("access_token");
    setLoading(true);

    try {
      const response = await smartFetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Deletion failed");

      showMessage("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId) => {
    const token = localStorage.getItem("access_token");
    setLoading(true);

    try {
      const response = await smartFetch(`/api/admin/users/${userId}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Password reset failed");

      showMessage("Password reset email sent successfully!");
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      showMessage("Please select users first", "error");
      return;
    }

    const token = localStorage.getItem("access_token");
    setLoading(true);

    try {
      const response = await smartFetch(`/api/admin/users/bulk/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || `Bulk ${action} failed`);

      showMessage(`Bulk ${action} completed successfully!`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmAndExecute = (action, userId, message) => {
    setConfirmAction({
      action,
      userId,
      message,
      execute: () => {
        if (action === 'delete') handleDelete(userId);
        else if (action === 'suspend') handleSuspend(userId, true);
        else if (action === 'unsuspend') handleSuspend(userId, false);
        else if (action === 'demote') handleDemote(userId);
        setConfirmAction(null);
      }
    });
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id));
    }
  };

  // Wallet Management Functions
  const fetchUserWallet = async (userId) => {
    const token = localStorage.getItem("access_token");
    setLoading(true);

    try {
      const response = await smartFetch(`/api/admin/users/${userId}/wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to load wallet");

      setWalletData(data.wallet);
      setExternalWallets(data.externalWallets || []);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionHistory = async (userId) => {
    const token = localStorage.getItem("access_token");
    setLoading(true);

    try {
      const response = await smartFetch(`/api/admin/users/${userId}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to load transactions");

      setTransactionHistory(data.transactions);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTokenTransaction = async () => {
    if (!tokenAmount || !transactionReason.trim()) {
      showMessage("Please fill in all required fields", "error");
      return;
    }

    const token = localStorage.getItem("access_token");
    setLoading(true);

    try {
      const response = await smartFetch(`/api/admin/users/${showTokenModal._id}/tokens/${transactionType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tokenType,
          amount: parseFloat(tokenAmount),
          reason: transactionReason,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Transaction failed");

      showMessage(`${transactionType === 'credit' ? 'Credited' : 'Debited'} ${tokenAmount} ${tokenType} successfully!`);
      setShowTokenModal(null);
      setTokenAmount('');
      setTransactionReason('');
      fetchUsers();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFreezeWallet = async (userId, freeze = true) => {
    const token = localStorage.getItem("access_token");
    setLoading(true);

    try {
      const response = await smartFetch(`/api/admin/users/${userId}/wallet/${freeze ? 'freeze' : 'unfreeze'}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || `Wallet ${freeze ? 'freeze' : 'unfreeze'} failed`);

      showMessage(`Wallet ${freeze ? 'frozen' : 'unfrozen'} successfully!`);
      fetchUsers();
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectExternalWallet = async (userId, walletAddress) => {
    const token = localStorage.getItem("access_token");
    setLoading(true);

    try {
      const response = await smartFetch(`/api/admin/users/${userId}/wallet/disconnect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Disconnect failed");

      showMessage("External wallet disconnected successfully!");
      fetchUserWallet(userId);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showMessage("Copied to clipboard!");
    }).catch(() => {
      showMessage("Failed to copy to clipboard", "error");
    });
  };

  const exportTransactions = async (userId) => {
    const token = localStorage.getItem("access_token");
    setLoading(true);

    try {
      const response = await smartFetch(`/api/admin/users/${userId}/transactions/export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `user_${userId}_transactions.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      showMessage("Transaction history exported successfully!");
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const openWalletModal = (user) => {
    setShowWalletModal(user);
    fetchUserWallet(user._id);
  };

  const openTokenModal = (user) => {
    setShowTokenModal(user);
    setTokenAmount('');
    setTransactionReason('');
  };

  const openTransactionHistoryModal = (user) => {
    setShowTransactionHistory(user);
    fetchTransactionHistory(user._id);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <div className="text-sm text-gray-600">
          Total Users: {users.length} | Filtered: {filteredUsers.length}
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <FaCheck className="inline mr-2" />
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <FaTimes className="inline mr-2" />
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("all");
              setStatusFilter("all");
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium text-blue-800">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleBulkAction('suspend')}
                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                <FaBan className="inline mr-1" />
                Suspend Selected
              </button>
              <button
                onClick={() => handleBulkAction('unsuspend')}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <FaUnlock className="inline mr-1" />
                Unsuspend Selected
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete selected users? This action cannot be undone.')) {
                    handleBulkAction('delete');
                  }
                }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                <FaTrash className="inline mr-1" />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {loading && (
          <div className="bg-blue-50 text-blue-700 px-4 py-2 text-center">
            Loading...
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left p-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={selectAllUsers}
                    className="rounded"
                  />
                </th>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Joined</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium text-gray-900">{user.email}</div>
                      {(user.firstName || user.lastName) && (
                        <div className="text-sm text-gray-500">
                          {user.firstName} {user.lastName}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.suspended 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.suspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setShowUserDetails(user)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      
                      {user.role === 'user' ? (
                        <button
                          onClick={() => handlePromote(user._id)}
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                          title="Promote to Admin"
                          disabled={loading}
                        >
                          <FaUserShield />
                        </button>
                      ) : (
                        <button
                          onClick={() => confirmAndExecute('demote', user._id, 'Are you sure you want to demote this admin to user?')}
                          className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded transition-colors"
                          title="Demote to User"
                          disabled={loading}
                        >
                          <FaUserTimes />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleResetPassword(user._id)}
                        className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded transition-colors"
                        title="Reset Password"
                        disabled={loading}
                      >
                        <FaKey />
                      </button>
                      
                      {user.suspended ? (
                        <button
                          onClick={() => confirmAndExecute('unsuspend', user._id, 'Are you sure you want to unsuspend this user?')}
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                          title="Unsuspend User"
                          disabled={loading}
                        >
                          <FaUnlock />
                        </button>
                      ) : (
                        <button
                          onClick={() => confirmAndExecute('suspend', user._id, 'Are you sure you want to suspend this user?')}
                          className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded transition-colors"
                          title="Suspend User"
                          disabled={loading}
                        >
                          <FaBan />
                        </button>
                      )}
                      
                      <button
                        onClick={() => openWalletModal(user)}
                        className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded transition-colors"
                        title="Manage Wallet"
                        disabled={loading}
                      >
                        <FaWallet />
                      </button>
                      
                      <button
                        onClick={() => openTokenModal(user)}
                        className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded transition-colors"
                        title="Token Operations"
                        disabled={loading}
                      >
                        <FaCoins />
                      </button>
                      
                      <button
                        onClick={() => openTransactionHistoryModal(user)}
                        className="p-1 text-teal-600 hover:text-teal-800 hover:bg-teal-100 rounded transition-colors"
                        title="Transaction History"
                        disabled={loading}
                      >
                        <FaHistory />
                      </button>
                      
                      <button
                        onClick={() => confirmAndExecute('delete', user._id, 'Are you sure you want to delete this user? This action cannot be undone.')}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                        title="Delete User"
                        disabled={loading}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your criteria.
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Details</h3>
              <button
                onClick={() => setShowUserDetails(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="font-medium text-gray-700">Email:</label>
                <p className="text-gray-900">{showUserDetails.email}</p>
              </div>
              {showUserDetails.firstName && (
                <div>
                  <label className="font-medium text-gray-700">First Name:</label>
                  <p className="text-gray-900">{showUserDetails.firstName}</p>
                </div>
              )}
              {showUserDetails.lastName && (
                <div>
                  <label className="font-medium text-gray-700">Last Name:</label>
                  <p className="text-gray-900">{showUserDetails.lastName}</p>
                </div>
              )}
              <div>
                <label className="font-medium text-gray-700">Role:</label>
                <p className="text-gray-900 capitalize">{showUserDetails.role}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Status:</label>
                <p className="text-gray-900">{showUserDetails.suspended ? 'Suspended' : 'Active'}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Joined:</label>
                <p className="text-gray-900">
                  {showUserDetails.createdAt ? new Date(showUserDetails.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Last Login:</label>
                <p className="text-gray-900">
                  {showUserDetails.lastLogin ? new Date(showUserDetails.lastLogin).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Management Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold flex items-center">
                <FaWallet className="mr-2 text-indigo-600" />
                Wallet Management - {showWalletModal.email}
              </h3>
              <button
                onClick={() => setShowWalletModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            {walletData && (
              <div className="space-y-6">
                {/* Internal Wallet Balances */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <FaCoins className="mr-2 text-yellow-500" />
                    Internal Wallet Balances
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded border">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">FXCT Balance</span>
                        <span className="text-2xl font-bold text-yellow-600">
                          {walletData.fxctBalance || '0.00'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded border">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">FXST Balance</span>
                        <span className="text-2xl font-bold text-green-600">
                          {walletData.fxstBalance || '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wallet Status and Controls */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4">Wallet Status & Controls</h4>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        walletData.frozen 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {walletData.frozen ? 'Frozen' : 'Active'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Address:</span>
                      <code className="px-2 py-1 bg-gray-200 rounded text-sm">
                        {walletData.address || 'N/A'}
                      </code>
                      {walletData.address && (
                        <button
                          onClick={() => copyToClipboard(walletData.address)}
                          className="p-1 text-gray-600 hover:text-gray-800"
                          title="Copy Address"
                        >
                          <FaCopy />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 space-x-2">
                    {walletData.frozen ? (
                      <button
                        onClick={() => handleFreezeWallet(showWalletModal._id, false)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        <FaUnlock className="inline mr-1" />
                        Unfreeze Wallet
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFreezeWallet(showWalletModal._id, true)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        <FaBan className="inline mr-1" />
                        Freeze Wallet
                      </button>
                    )}
                  </div>
                </div>

                {/* Connected External Wallets */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <FaLink className="mr-2 text-blue-500" />
                    Connected External Wallets
                  </h4>
                  {externalWallets.length > 0 ? (
                    <div className="space-y-2">
                      {externalWallets.map((wallet, index) => (
                        <div key={index} className="bg-white p-3 rounded border flex justify-between items-center">
                          <div>
                            <div className="font-medium">{wallet.type || 'Unknown'}</div>
                            <code className="text-sm text-gray-600">{wallet.address}</code>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => copyToClipboard(wallet.address)}
                              className="p-1 text-gray-600 hover:text-gray-800"
                              title="Copy Address"
                            >
                              <FaCopy />
                            </button>
                            <button
                              onClick={() => handleDisconnectExternalWallet(showWalletModal._id, wallet.address)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Disconnect Wallet"
                            >
                              <FaUnlink />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No external wallets connected</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Token Operations Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold flex items-center">
                <FaCoins className="mr-2 text-yellow-600" />
                Token Operations
              </h3>
              <button
                onClick={() => setShowTokenModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-4">
              <p className="font-medium text-gray-700">User: {showTokenModal.email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="credit">Credit (Add Tokens)</option>
                  <option value="debit">Debit (Remove Tokens)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token Type
                </label>
                <select
                  value={tokenType}
                  onChange={(e) => setTokenType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="FXCT">FXCT</option>
                  <option value="FXST">FXST</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Required)
                </label>
                <textarea
                  value={transactionReason}
                  onChange={(e) => setTransactionReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter reason for this transaction"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleTokenTransaction}
                disabled={loading || !tokenAmount || !transactionReason.trim()}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  transactionType === 'credit'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {transactionType === 'credit' ? <FaPlus className="inline mr-1" /> : <FaMinus className="inline mr-1" />}
                {transactionType === 'credit' ? 'Credit' : 'Debit'} {tokenType}
              </button>
              <button
                onClick={() => setShowTokenModal(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Modal */}
      {showTransactionHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold flex items-center">
                <FaHistory className="mr-2 text-teal-600" />
                Transaction History - {showTransactionHistory.email}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportTransactions(showTransactionHistory._id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <FaDownload className="inline mr-1" />
                  Export
                </button>
                <button
                  onClick={() => setShowTransactionHistory(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {transactionHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3 border-b">Date</th>
                      <th className="text-left p-3 border-b">Type</th>
                      <th className="text-left p-3 border-b">Token</th>
                      <th className="text-left p-3 border-b">Amount</th>
                      <th className="text-left p-3 border-b">Status</th>
                      <th className="text-left p-3 border-b">Reason</th>
                      <th className="text-left p-3 border-b">TX Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionHistory.map((tx, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">
                          {new Date(tx.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            tx.type === 'credit' 
                              ? 'bg-green-100 text-green-800' 
                              : tx.type === 'debit'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-semibold">{tx.tokenType}</td>
                        <td className="p-3 font-mono">
                          <span className={tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                            {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            tx.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : tx.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm">{tx.reason || 'N/A'}</td>
                        <td className="p-3">
                          {tx.txHash ? (
                            <div className="flex items-center space-x-1">
                              <code className="text-xs text-gray-600">
                                {tx.txHash.substring(0, 10)}...
                              </code>
                              <button
                                onClick={() => copyToClipboard(tx.txHash)}
                                className="p-1 text-gray-600 hover:text-gray-800"
                                title="Copy Transaction Hash"
                              >
                                <FaCopy className="text-xs" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaHistory className="mx-auto text-4xl mb-4 text-gray-300" />
                <p>No transaction history found for this user.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-red-100">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Confirm Action</h3>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">{confirmAction.message}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={confirmAction.execute}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPanel;
