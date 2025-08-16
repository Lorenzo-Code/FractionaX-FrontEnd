import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { smartFetch } from '../../../shared/utils';
import adminApiService from '../services/adminApiService';
import { 
  FaArrowLeft, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaClock,
  FaShieldAlt,
  FaWallet,
  FaCoins,
  FaHistory,
  FaEdit,
  FaBan,
  FaUnlock,
  FaUserShield,
  FaUserTimes,
  FaKey,
  FaTrash,
  FaCopy,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaGlobe,
  FaUserTag,
  FaChartLine,
  FaFileAlt,
  FaImage,
  FaRobot,
  FaReceipt,
  FaCog,
  FaChartBar,
  FaClipboardCheck,
  FaNetworkWired,
  FaBell,
  FaBuilding,
  FaDownload,
  FaFilter
} from 'react-icons/fa';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Additional user data
  const [walletData, setWalletData] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [kycData, setKycData] = useState(null);
  const [userDocuments, setUserDocuments] = useState([]);
  
  // Phase 1: Enhanced KYC/AML, Risk Assessment, Security
  const [kycAmlData, setKycAmlData] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [behavioralAnalysis, setBehavioralAnalysis] = useState(null);
  const [transactionAlerts, setTransactionAlerts] = useState([]);
  const [userDevices, setUserDevices] = useState([]);
  const [suspiciousReports, setSuspiciousReports] = useState([]);
  
  // Phase 2: Portfolio Analytics, Property Management, Tax Reporting
  const [portfolioData, setPortfolioData] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [taxReports, setTaxReports] = useState([]);
  const [incomeAnalytics, setIncomeAnalytics] = useState(null);
  
  // Phase 3: Advanced Reporting, Compliance, Integration
  const [complianceData, setComplianceData] = useState(null);
  const [customReports, setCustomReports] = useState([]);
  const [integrationLogs, setIntegrationLogs] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);
  
  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    suspended: false,
    emailVerified: false,
    twoFactorEnabled: false,
    // Additional profile fields
    dateOfBirth: '',
    nationality: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    kycStatus: '',
    occupation: '',
    companyName: '',
    annualIncome: '',
    investmentExperience: '',
    riskTolerance: '',
    identityDocument: {
      type: '',
      number: '',
      expiryDate: '',
      issueCountry: ''
    }
  });
  const [editLoading, setEditLoading] = useState(false);

  // Password Reset Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordResetData, setPasswordResetData] = useState({
    newPassword: '',
    confirmPassword: '',
    generateRandom: true,
    requireChangeOnLogin: true,
    sendEmail: true
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('access_token');
    setLoading(true);

    try {
      const response = await smartFetch(`/api/admin/users/${userId}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to load user profile');

      setUser(data.user);
      
      // Load additional data based on active tab
      if (activeTab === 'wallet') {
        await fetchWalletData();
      } else if (activeTab === 'transactions') {
        await fetchTransactionHistory();
      } else if (activeTab === 'security') {
        await fetchSecurityLogs();
      } else if (activeTab === 'kyc') {
        await fetchKycData();
      } else if (activeTab === 'documents') {
        await fetchUserDocuments();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletData = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await smartFetch(`/api/admin/users/${userId}/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setWalletData(data.wallet);
    } catch (err) {
      console.error('Failed to load wallet data:', err);
    }
  };

  const fetchTransactionHistory = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await smartFetch(`/api/admin/users/${userId}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setTransactionHistory(data.transactions);
    } catch (err) {
      console.error('Failed to load transaction history:', err);
    }
  };

  const fetchSecurityLogs = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await smartFetch(`/api/admin/users/${userId}/security-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setSecurityLogs(data.logs);
    } catch (err) {
      console.error('Failed to load security logs:', err);
    }
  };

  const fetchKycData = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await smartFetch(`/api/admin/users/${userId}/kyc`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setKycData(data.kyc);
    } catch (err) {
      console.error('Failed to load KYC data:', err);
    }
  };

  const fetchUserDocuments = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await smartFetch(`/api/admin/users/${userId}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setUserDocuments(data.documents);
    } catch (err) {
      console.error('Failed to load user documents:', err);
    }
  };

  // Phase 1 fetch functions
  const fetchKycAmlData = async () => {
    try {
      const data = await adminApiService.getKycAmlScreening(userId);
      setKycAmlData(data);
    } catch (err) {
      console.error('Failed to load KYC/AML data:', err);
    }
  };

  const fetchRiskAssessment = async () => {
    try {
      const data = await adminApiService.getRiskAssessment(userId);
      setRiskAssessment(data);
    } catch (err) {
      console.error('Failed to load risk assessment:', err);
    }
  };

  const fetchBehavioralAnalysis = async () => {
    try {
      const data = await adminApiService.getBehavioralAnalysis(userId);
      setBehavioralAnalysis(data);
    } catch (err) {
      console.error('Failed to load behavioral analysis:', err);
    }
  };

  const fetchTransactionAlerts = async () => {
    try {
      const data = await adminApiService.getTransactionAlerts(userId);
      setTransactionAlerts(data);
    } catch (err) {
      console.error('Failed to load transaction alerts:', err);
    }
  };

  const fetchUserDevices = async () => {
    try {
      const data = await adminApiService.getUserDevices(userId);
      setUserDevices(data);
    } catch (err) {
      console.error('Failed to load user devices:', err);
    }
  };

  const fetchSuspiciousReports = async () => {
    try {
      const data = await adminApiService.getSuspiciousActivityReports(userId);
      setSuspiciousReports(data);
    } catch (err) {
      console.error('Failed to load suspicious reports:', err);
    }
  };

  // Phase 2 fetch functions
  const fetchPortfolioData = async () => {
    try {
      const data = await adminApiService.getPortfolioAnalytics(userId);
      setPortfolioData(data);
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    }
  };

  const fetchPropertyData = async () => {
    try {
      const data = await adminApiService.getPropertyManagement(userId);
      setPropertyData(data);
    } catch (err) {
      console.error('Failed to load property data:', err);
    }
  };

  const fetchTaxReports = async () => {
    try {
      const data = await adminApiService.getTaxReports(userId);
      setTaxReports(data);
    } catch (err) {
      console.error('Failed to load tax reports:', err);
    }
  };

  const fetchIncomeAnalytics = async () => {
    try {
      const data = await adminApiService.getIncomeAnalytics(userId);
      setIncomeAnalytics(data);
    } catch (err) {
      console.error('Failed to load income analytics:', err);
    }
  };

  // Phase 3 fetch functions
  const fetchComplianceData = async () => {
    try {
      const data = await adminApiService.getComplianceData(userId);
      setComplianceData(data);
    } catch (err) {
      console.error('Failed to load compliance data:', err);
    }
  };

  const fetchCustomReports = async () => {
    try {
      const data = await adminApiService.getCustomReports(userId);
      setCustomReports(data);
    } catch (err) {
      console.error('Failed to load custom reports:', err);
    }
  };

  const fetchIntegrationLogs = async () => {
    try {
      const data = await adminApiService.getIntegrationLogs(userId);
      setIntegrationLogs(data);
    } catch (err) {
      console.error('Failed to load integration logs:', err);
    }
  };

  const fetchAuditTrail = async () => {
    try {
      const data = await adminApiService.getAuditTrail(userId);
      setAuditTrail(data);
    } catch (err) {
      console.error('Failed to load audit trail:', err);
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showMessage('Copied to clipboard!');
    }).catch(() => {
      showMessage('Failed to copy to clipboard', 'error');
    });
  };

  // Disable/enable background scrolling
  const disableBackgroundScroll = () => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px'; // Prevent layout shift from scrollbar
  };

  const enableBackgroundScroll = () => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  };

  // Edit Profile Functions
  const handleEditProfile = () => {
    if (user) {
      setEditFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        suspended: user.suspended || false,
        emailVerified: user.emailVerified || false,
        twoFactorEnabled: user.twoFactorEnabled || false,
        // Additional profile fields
        dateOfBirth: user.dateOfBirth || '',
        nationality: user.nationality || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          postalCode: user.address?.postalCode || '',
          country: user.address?.country || ''
        },
        kycStatus: user.kycStatus || '',
        occupation: user.occupation || '',
        companyName: user.companyName || '',
        annualIncome: user.annualIncome || '',
        investmentExperience: user.investmentExperience || '',
        riskTolerance: user.riskTolerance || '',
        identityDocument: {
          type: user.identityDocument?.type || '',
          number: user.identityDocument?.number || '',
          expiryDate: user.identityDocument?.expiryDate || '',
          issueCountry: user.identityDocument?.issueCountry || ''
        }
      });
      setShowEditModal(true);
      disableBackgroundScroll(); // Disable background scroll when modal opens
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setEditLoading(true);
    const token = localStorage.getItem('access_token');

    console.log('🔄 Attempting to update user profile:', {
      userId,
      editFormData,
      hasToken: !!token
    });

    // List of possible endpoints to try
    const possibleEndpoints = [
      `/api/admin/users/${userId}`,
      `/api/admin/users/${userId}/update`,
      `/api/users/${userId}`,
      `/api/users/${userId}/update`,
      `/api/admin/user/${userId}`,
      `/api/admin/user/${userId}/update`
    ];

    let lastError = null;

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`🔍 Trying endpoint: ${endpoint}`);
        
        const response = await smartFetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFormData)
        });

        console.log('📡 Response status:', response.status);
        
        // If we get a 404, try the next endpoint
        if (response.status === 404) {
          console.log(`❌ 404 Not Found for ${endpoint}, trying next...`);
          continue;
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          throw new Error('Invalid response format from server');
        }

        console.log('📦 Response data:', data);

        if (!response.ok) {
          throw new Error(data.msg || data.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        // Success! Update local user state
        console.log(`✅ Success with endpoint: ${endpoint}`);
        setUser(data.user || data);
        setShowEditModal(false);
        showMessage('User profile updated successfully!');
        return; // Exit the function on success

      } catch (err) {
        console.error(`❌ Failed with endpoint ${endpoint}:`, err);
        lastError = err;
        
        // If it's not a 404, this might be a real error, so break
        if (!err.message.includes('404')) {
          break;
        }
      }
    }

    // If we get here, all endpoints failed
    console.error('❌ All endpoints failed, last error:', lastError);
    showMessage(lastError?.message || 'Failed to update profile - no valid endpoint found', 'error');
    setEditLoading(false);
  };

  const handleSuspendUser = async () => {
    const token = localStorage.getItem('access_token');
    const action = user.suspended ? 'unsuspend' : 'suspend';

    try {
      const response = await smartFetch(`/api/admin/users/${userId}/${action}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || `Failed to ${action} user`);

      // Update local user state
      setUser(prev => ({ ...prev, suspended: !prev.suspended }));
      showMessage(`User ${action}ed successfully!`);
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  // Password Reset Functions
  const generateRandomPassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handlePasswordFormChange = (field, value) => {
    setPasswordResetData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear generated password if switching to manual mode
    if (field === 'generateRandom' && !value) {
      setGeneratedPassword('');
    }
    
    // Clear confirm password if changing main password
    if (field === 'newPassword') {
      setPasswordResetData(prev => ({ ...prev, confirmPassword: '' }));
    }
  };
  
  // Check if passwords match
  const passwordsMatch = () => {
    if (passwordResetData.generateRandom || !passwordResetData.newPassword) {
      return true; // No validation needed for generated passwords
    }
    return passwordResetData.newPassword === passwordResetData.confirmPassword;
  };
  
  // Check if password meets requirements
  const isPasswordValid = () => {
    if (passwordResetData.generateRandom) {
      return true; // Generated passwords are always valid
    }
    const password = passwordResetData.newPassword;
    return password && password.length >= 8;
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    setGeneratedPassword(newPassword);
    setPasswordResetData(prev => ({
      ...prev,
      newPassword: newPassword
    }));
  };

  const handleResetPassword = async () => {
    setPasswordLoading(true);
    const token = localStorage.getItem('access_token');

    console.log('🔄 Attempting to reset user password:', {
      userId,
      hasToken: !!token,
      generateRandom: passwordResetData.generateRandom,
      requireChangeOnLogin: passwordResetData.requireChangeOnLogin,
      sendEmail: passwordResetData.sendEmail
    });

    try {
      // Prepare password - use custom password if provided, otherwise let backend generate
      let passwordToUse = passwordResetData.newPassword;
      if (passwordResetData.generateRandom && !passwordToUse) {
        passwordToUse = generateRandomPassword();
        setGeneratedPassword(passwordToUse);
        setPasswordResetData(prev => ({ ...prev, newPassword: passwordToUse }));
      }
      
      // Build request body - include newPassword if we have one, otherwise send empty object
      const requestBody = passwordToUse ? { newPassword: passwordToUse } : {};
      
      console.log('🔍 Using backend endpoint: POST /api/admin/users/:id/reset-password');
      console.log('📤 Request body:', passwordToUse ? { newPassword: '[REDACTED]' } : {});
      
      const response = await smartFetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Invalid response format from server');
      }

      console.log('📦 Response data:', data);

      if (!response.ok) {
        throw new Error(data.msg || data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Success!
      console.log('✅ Password reset successful');
      
      // If the backend returned a temporary password, show it
      if (data.tempPassword) {
        setGeneratedPassword(data.tempPassword);
        setPasswordResetData(prev => ({ ...prev, newPassword: data.tempPassword }));
        showMessage(`Password reset successful! Temporary password: ${data.tempPassword}`, 'success');
      } else {
        showMessage(`Password reset successfully! ${passwordResetData.sendEmail ? 'User will receive email notification.' : ''}`);
      }
      
      // Auto-close modal after success
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordResetData({
          newPassword: '',
          generateRandom: true,
          requireChangeOnLogin: true,
          sendEmail: true
        });
        setGeneratedPassword('');
      }, 3000); // Close after 3 seconds to let user see the success message
      
      setPasswordLoading(false);
      return; // Exit the function on success

    } catch (err) {
      console.error('❌ Password reset failed:', err);
      
      // If the endpoint doesn't exist, try the force-password-change endpoint
      if (err.message.includes('404') || err.message.includes('Not Found')) {
        console.log('🔄 Trying alternative endpoint: force-password-change');
        await handleResetPasswordFallback();
        return;
      }
      
      showMessage(err.message || 'Failed to reset password', 'error');
      setPasswordLoading(false);
      return;
    }
  };

  // Keep the old implementation as fallback (but this should not be needed)
  const handleResetPasswordFallback = async () => {
    setPasswordLoading(true);
    const token = localStorage.getItem('access_token');

    // Generate password if needed
    let passwordToUse = passwordResetData.newPassword;
    if (passwordResetData.generateRandom && !passwordToUse) {
      passwordToUse = generateRandomPassword();
      setGeneratedPassword(passwordToUse);
      setPasswordResetData(prev => ({ ...prev, newPassword: passwordToUse }));
    }

    if (!passwordToUse) {
      showMessage('Please provide a password or generate one', 'error');
      setPasswordLoading(false);
      return;
    }

    const requestData = {
      newPassword: passwordToUse,
      requireChangeOnLogin: passwordResetData.requireChangeOnLogin,
      sendEmail: passwordResetData.sendEmail
    };

    console.log('🔄 Attempting to reset user password (fallback):', {
      userId,
      hasToken: !!token,
      requireChangeOnLogin: requestData.requireChangeOnLogin,
      sendEmail: requestData.sendEmail
    });

    // List of possible endpoints to try
    const possibleEndpoints = [
      `/api/admin/users/${userId}/force-password-change`,
      `/api/admin/users/${userId}/password-reset`,
      `/api/admin/users/${userId}/password`,
      `/api/users/${userId}/reset-password`,
      `/api/users/${userId}/password-reset`,
      `/api/admin/user/${userId}/reset-password`,
      `/api/admin/user/${userId}/password-reset`
    ];

    let lastError = null;

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`🔍 Trying fallback endpoint: ${endpoint}`);
        
        const response = await smartFetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData)
        });

        console.log('📡 Response status:', response.status);
        
        // If we get a 404, try the next endpoint
        if (response.status === 404) {
          console.log(`❌ 404 Not Found for ${endpoint}, trying next...`);
          continue;
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          throw new Error('Invalid response format from server');
        }

        console.log('📦 Response data:', data);

        if (!response.ok) {
          throw new Error(data.msg || data.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        // Success!
        console.log(`✅ Success with endpoint: ${endpoint}`);
        showMessage('Password reset successfully!');
        
        // Keep modal open to show generated password if applicable
        if (!passwordResetData.generateRandom) {
          setShowPasswordModal(false);
          // Reset form
          setPasswordResetData({
            newPassword: '',
            generateRandom: true,
            requireChangeOnLogin: true,
            sendEmail: true
          });
          setGeneratedPassword('');
        }
        setPasswordLoading(false);
        return; // Exit the function on success

      } catch (err) {
        console.error(`❌ Failed with endpoint ${endpoint}:`, err);
        lastError = err;
        
        // If it's not a 404, this might be a real error, so break
        if (!err.message.includes('404')) {
          break;
        }
      }
    }

    // If we get here, all endpoints failed
    console.error('❌ All endpoints failed, last error:', lastError);
    showMessage(lastError?.message || 'Failed to reset password - no valid endpoint found', 'error');
    setPasswordLoading(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Fetch data for the new tab if needed
    if (tab === 'wallet' && !walletData) {
      fetchWalletData();
    } else if (tab === 'transactions' && transactionHistory.length === 0) {
      fetchTransactionHistory();
    } else if (tab === 'security' && securityLogs.length === 0) {
      fetchSecurityLogs();
      fetchUserDevices();
    } else if (tab === 'kyc-aml' && !kycAmlData) {
      fetchKycAmlData();
    } else if (tab === 'risk-assessment' && !riskAssessment) {
      fetchRiskAssessment();
      fetchBehavioralAnalysis();
    } else if (tab === 'monitoring' && transactionAlerts.length === 0) {
      fetchTransactionAlerts();
      fetchSuspiciousReports();
    } else if (tab === 'portfolio' && !portfolioData) {
      fetchPortfolioData();
    } else if (tab === 'properties' && !propertyData) {
      fetchPropertyData();
    } else if (tab === 'tax-reports' && taxReports.length === 0) {
      fetchTaxReports();
      fetchIncomeAnalytics();
    } else if (tab === 'compliance' && !complianceData) {
      fetchComplianceData();
    } else if (tab === 'reports' && customReports.length === 0) {
      fetchCustomReports();
    } else if (tab === 'integrations' && integrationLogs.length === 0) {
      fetchIntegrationLogs();
      fetchAuditTrail();
    } else if (tab === 'documents' && userDocuments.length === 0) {
      fetchUserDocuments();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto text-6xl text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'wallet', label: 'Wallet', icon: FaWallet },
    { id: 'transactions', label: 'Transactions', icon: FaHistory },
    
    // Phase 1: Advanced Admin Features
    { id: 'kyc-aml', label: 'KYC/AML', icon: FaShieldAlt },
    { id: 'risk-assessment', label: 'Risk Assessment', icon: FaExclamationTriangle },
    { id: 'security', label: 'Security & Devices', icon: FaCog },
    { id: 'monitoring', label: 'Transaction Monitoring', icon: FaBell },
    
    // Phase 2: Portfolio Analytics, Property Management & Tax Reporting
    { id: 'portfolio', label: 'Portfolio Analytics', icon: FaChartLine },
    { id: 'properties', label: 'Properties & Assets', icon: FaBuilding },
    { id: 'tax-reports', label: 'Tax Reporting', icon: FaReceipt },
    
    // Phase 3: Advanced Reporting, Compliance & Integration
    { id: 'compliance', label: 'Compliance', icon: FaClipboardCheck },
    { id: 'reports', label: 'Advanced Reports', icon: FaFileAlt },
    { id: 'integrations', label: 'Integrations', icon: FaNetworkWired },
    { id: 'documents', label: 'Documents', icon: FaImage },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/users')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  User Profile
                </h1>
                <p className="text-sm text-gray-600">
                  {user?.firstName || user?.email}'s account
                </p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleEditProfile}
                className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
              >
                <FaEdit className="inline mr-2" />
                Edit Profile
              </button>
              <button 
                onClick={handleSuspendUser}
                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                  user?.suspended 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                {user?.suspended ? <FaUnlock className="inline mr-2" /> : <FaBan className="inline mr-2" />}
                {user?.suspended ? 'Unsuspend' : 'Suspend'}
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-3 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors text-sm flex items-center"
              >
                <FaKey className="inline mr-2" />
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {(success || error) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 flex-shrink-0">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 min-h-0">
        <div className="lg:flex lg:space-x-6 h-full">
          {/* Sidebar - User Summary */}
          <div className="lg:w-80 mb-4 lg:mb-0 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              <div className="p-4 flex-shrink-0">
              {/* User Avatar & Basic Info */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.firstName ? user.firstName.charAt(0).toUpperCase() : user?.email.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.email
                  }
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                
                {/* Status Badges */}
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user?.role === 'admin' ? <FaUserShield className="mr-1" /> : <FaUser className="mr-1" />}
                    {user?.role}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user?.suspended 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user?.suspended ? <FaTimesCircle className="mr-1" /> : <FaCheckCircle className="mr-1" />}
                    {user?.suspended ? 'Suspended' : 'Active'}
                  </span>
                </div>
              </div>

              </div>
              
              {/* Scrollable Stats Area */}
              <div className="flex-1 overflow-y-auto border-t pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Login</span>
                    <span className="font-medium">
                      {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">User ID</span>
                    <div className="flex items-center space-x-1">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {user?._id?.substring(0, 8)}...
                      </code>
                      <button
                        onClick={() => copyToClipboard(user?._id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaCopy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Additional Stats */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Activity Stats</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Logins</span>
                        <span className="font-medium text-blue-600">{user?.loginCount || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Transactions</span>
                        <span className="font-medium text-green-600">{user?.transactionCount || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Investments</span>
                        <span className="font-medium text-purple-600">{user?.investmentCount || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Referrals</span>
                        <span className="font-medium text-orange-600">{user?.referralCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              <div className="border-b border-gray-200 flex-shrink-0">
                <div className="overflow-x-auto">
                  <nav className="-mb-px flex space-x-4 px-6 min-w-max">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          className={`py-3 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors flex items-center ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="mr-2 flex-shrink-0" />
                          <span className="hidden sm:inline">{tab.label}</span>
                          <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Tab Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Personal Information */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <FaUser className="mr-2 text-blue-600" />
                          Personal Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <p className="text-gray-900">{user?.email}</p>
                          </div>
                          {user?.firstName && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">First Name</label>
                              <p className="text-gray-900">{user.firstName}</p>
                            </div>
                          )}
                          {user?.lastName && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Last Name</label>
                              <p className="text-gray-900">{user.lastName}</p>
                            </div>
                          )}
                          {user?.phone && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Phone</label>
                              <p className="text-gray-900">{user.phone}</p>
                            </div>
                          )}
                          {user?.dateOfBirth && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                              <p className="text-gray-900">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
                            </div>
                          )}
                          {user?.nationality && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Nationality</label>
                              <p className="text-gray-900">{user.nationality}</p>
                            </div>
                          )}
                          {user?.occupation && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Occupation</label>
                              <p className="text-gray-900">{user.occupation}</p>
                            </div>
                          )}
                          {user?.companyName && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Company</label>
                              <p className="text-gray-900">{user.companyName}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Account Information */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <FaShieldAlt className="mr-2 text-green-600" />
                          Account Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Account Status</label>
                            <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user?.suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {user?.suspended ? 'Suspended' : 'Active'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Role</label>
                            <p className="text-gray-900 capitalize">{user?.role}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Email Verified</label>
                            <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user?.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user?.emailVerified ? 'Verified' : 'Pending'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Two-Factor Auth</label>
                            <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user?.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Address Information */}
                      {(user?.address?.street || user?.address?.city || user?.address?.country) && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-orange-600" />
                            Address Information
                          </h3>
                          <div className="space-y-3">
                            {user?.address?.street && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Street Address</label>
                                <p className="text-gray-900">{user.address.street}</p>
                              </div>
                            )}
                            {user?.address?.city && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">City</label>
                                <p className="text-gray-900">{user.address.city}</p>
                              </div>
                            )}
                            {user?.address?.state && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">State/Province</label>
                                <p className="text-gray-900">{user.address.state}</p>
                              </div>
                            )}
                            {user?.address?.postalCode && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Postal Code</label>
                                <p className="text-gray-900">{user.address.postalCode}</p>
                              </div>
                            )}
                            {user?.address?.country && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Country</label>
                                <p className="text-gray-900">{user.address.country}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Financial Information */}
                      {(user?.annualIncome || user?.investmentExperience || user?.riskTolerance) && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <FaChartBar className="mr-2 text-green-600" />
                            Financial Profile
                          </h3>
                          <div className="space-y-3">
                            {user?.annualIncome && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Annual Income</label>
                                <p className="text-gray-900">{user.annualIncome}</p>
                              </div>
                            )}
                            {user?.investmentExperience && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Investment Experience</label>
                                <p className="text-gray-900 capitalize">{user.investmentExperience}</p>
                              </div>
                            )}
                            {user?.riskTolerance && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Risk Tolerance</label>
                                <p className="text-gray-900 capitalize">{user.riskTolerance}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* KYC & Identity Information */}
                      {(user?.kycStatus || user?.identityDocument?.type) && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <FaFileAlt className="mr-2 text-purple-600" />
                            KYC & Identity
                          </h3>
                          <div className="space-y-3">
                            {user?.kycStatus && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">KYC Status</label>
                                <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  user.kycStatus === 'approved' 
                                    ? 'bg-green-100 text-green-800' 
                                    : user.kycStatus === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {user.kycStatus}
                                </p>
                              </div>
                            )}
                            {user?.identityDocument?.type && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Identity Document</label>
                                <p className="text-gray-900">{user.identityDocument.type}</p>
                              </div>
                            )}
                            {user?.identityDocument?.number && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Document Number</label>
                                <p className="text-gray-900 font-mono">***{user.identityDocument.number.slice(-4)}</p>
                              </div>
                            )}
                            {user?.identityDocument?.expiryDate && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                                <p className="text-gray-900">{new Date(user.identityDocument.expiryDate).toLocaleDateString()}</p>
                              </div>
                            )}
                            {user?.identityDocument?.issueCountry && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Issue Country</label>
                                <p className="text-gray-900">{user.identityDocument.issueCountry}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Activity Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FaChartLine className="mr-2 text-purple-600" />
                        Activity Summary
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{user?.loginCount || 0}</div>
                          <div className="text-sm text-gray-600">Total Logins</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{user?.transactionCount || 0}</div>
                          <div className="text-sm text-gray-600">Transactions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{user?.investmentCount || 0}</div>
                          <div className="text-sm text-gray-600">Investments</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{user?.referralCount || 0}</div>
                          <div className="text-sm text-gray-600">Referrals</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'wallet' && (
                  <div className="space-y-6">
                    {walletData ? (
                      <>
                        {/* Wallet Balances */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-yellow-700 font-medium">FXCT Balance</p>
                                <p className="text-3xl font-bold text-yellow-900">{walletData.fxctBalance || '0.00'}</p>
                              </div>
                              <FaCoins className="text-4xl text-yellow-600" />
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-green-700 font-medium">FXST Balance</p>
                                <p className="text-3xl font-bold text-green-900">{walletData.fxstBalance || '0.00'}</p>
                              </div>
                              <FaCoins className="text-4xl text-green-600" />
                            </div>
                          </div>
                        </div>

                        {/* Wallet Details */}
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4">Wallet Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Wallet Address</label>
                              <div className="flex items-center space-x-2 mt-1">
                                <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">
                                  {walletData.address || 'Not generated'}
                                </code>
                                {walletData.address && (
                                  <button
                                    onClick={() => copyToClipboard(walletData.address)}
                                    className="p-2 text-gray-500 hover:text-gray-700"
                                  >
                                    <FaCopy />
                                  </button>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Status</label>
                              <p className={`mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                walletData.frozen ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {walletData.frozen ? 'Frozen' : 'Active'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <FaWallet className="mx-auto text-4xl text-gray-300 mb-4" />
                        <p className="text-gray-500">Loading wallet data...</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'transactions' && (
                  <div className="space-y-6">
                    {transactionHistory.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left p-4 font-medium text-gray-700">Date</th>
                              <th className="text-left p-4 font-medium text-gray-700">Type</th>
                              <th className="text-left p-4 font-medium text-gray-700">Token</th>
                              <th className="text-left p-4 font-medium text-gray-700">Amount</th>
                              <th className="text-left p-4 font-medium text-gray-700">Status</th>
                              <th className="text-left p-4 font-medium text-gray-700">TX Hash</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactionHistory.map((tx, index) => (
                              <tr key={index} className="border-t hover:bg-gray-50">
                                <td className="p-4 text-sm">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                <td className="p-4">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    tx.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {tx.type}
                                  </span>
                                </td>
                                <td className="p-4 font-mono">{tx.tokenType}</td>
                                <td className="p-4 font-mono">
                                  <span className={tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                                    {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {tx.status}
                                  </span>
                                </td>
                                <td className="p-4">
                                  {tx.txHash ? (
                                    <div className="flex items-center space-x-1">
                                      <code className="text-xs">{tx.txHash.substring(0, 10)}...</code>
                                      <button
                                        onClick={() => copyToClipboard(tx.txHash)}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        <FaCopy className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">N/A</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FaHistory className="mx-auto text-4xl text-gray-300 mb-4" />
                        <p className="text-gray-500">No transaction history found</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Add other tab contents as needed */}
                {activeTab === 'security' && (
                  <div className="text-center py-8">
                    <FaShieldAlt className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500">Security logs will be displayed here</p>
                  </div>
                )}

                {activeTab === 'kyc' && (
                  <div className="text-center py-8">
                    <FaCheckCircle className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500">KYC/AML information will be displayed here</p>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="text-center py-8">
                    <FaFileAlt className="mx-auto text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500">User documents will be displayed here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit User Profile</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  enableBackgroundScroll();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimesCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Wrap form inputs in a proper form tag for password manager detection */}
            <form 
              id="edit-user-profile-form"
              name="editUserProfile"
              onSubmit={(e) => e.preventDefault()} 
              autoComplete="on"
              method="post"
              action="#"
            >
              <div className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      id="edit-firstName"
                      name="firstName"
                      type="text"
                      value={editFormData.firstName}
                      onChange={(e) => handleEditFormChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter first name"
                      autoComplete="given-name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      id="edit-lastName"
                      name="lastName"
                      type="text"
                      value={editFormData.lastName}
                      onChange={(e) => handleEditFormChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter last name"
                      autoComplete="family-name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => handleEditFormChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                      autoComplete="email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      id="edit-phone"
                      name="phone"
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => handleEditFormChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                      autoComplete="tel"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      id="edit-dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={editFormData.dateOfBirth}
                      onChange={(e) => handleEditFormChange('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoComplete="bday"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-nationality" className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                    <input
                      id="edit-nationality"
                      name="nationality"
                      type="text"
                      value={editFormData.nationality}
                      onChange={(e) => handleEditFormChange('nationality', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter nationality"
                      autoComplete="country"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-occupation" className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                    <input
                      id="edit-occupation"
                      name="occupation"
                      type="text"
                      value={editFormData.occupation}
                      onChange={(e) => handleEditFormChange('occupation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter occupation"
                      autoComplete="organization-title"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      id="edit-companyName"
                      name="companyName"
                      type="text"
                      value={editFormData.companyName}
                      onChange={(e) => handleEditFormChange('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter company name"
                      autoComplete="organization"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="edit-street" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      id="edit-street"
                      name="streetAddress"
                      type="text"
                      value={editFormData.address.street}
                      onChange={(e) => handleEditFormChange('address', { ...editFormData.address, street: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter street address"
                      autoComplete="street-address"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      id="edit-city"
                      name="city"
                      type="text"
                      value={editFormData.address.city}
                      onChange={(e) => handleEditFormChange('address', { ...editFormData.address, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter city"
                      autoComplete="address-level2"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-state" className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                    <input
                      id="edit-state"
                      name="state"
                      type="text"
                      value={editFormData.address.state}
                      onChange={(e) => handleEditFormChange('address', { ...editFormData.address, state: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter state or province"
                      autoComplete="address-level1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      id="edit-postalCode"
                      name="postalCode"
                      type="text"
                      value={editFormData.address.postalCode}
                      onChange={(e) => handleEditFormChange('address', { ...editFormData.address, postalCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter postal code"
                      autoComplete="postal-code"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      id="edit-country"
                      name="country"
                      type="text"
                      value={editFormData.address.country}
                      onChange={(e) => handleEditFormChange('address', { ...editFormData.address, country: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter country"
                      autoComplete="country-name"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-annualIncome" className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
                    <select
                      id="edit-annualIncome"
                      name="annualIncome"
                      value={editFormData.annualIncome}
                      onChange={(e) => handleEditFormChange('annualIncome', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select annual income</option>
                      <option value="under-25k">Under $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k-250k">$100,000 - $250,000</option>
                      <option value="250k-500k">$250,000 - $500,000</option>
                      <option value="over-500k">Over $500,000</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-investmentExperience" className="block text-sm font-medium text-gray-700 mb-1">Investment Experience</label>
                    <select
                      id="edit-investmentExperience"
                      name="investmentExperience"
                      value={editFormData.investmentExperience}
                      onChange={(e) => handleEditFormChange('investmentExperience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select experience level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-riskTolerance" className="block text-sm font-medium text-gray-700 mb-1">Risk Tolerance</label>
                    <select
                      id="edit-riskTolerance"
                      name="riskTolerance"
                      value={editFormData.riskTolerance}
                      onChange={(e) => handleEditFormChange('riskTolerance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select risk tolerance</option>
                      <option value="conservative">Conservative</option>
                      <option value="moderate">Moderate</option>
                      <option value="aggressive">Aggressive</option>
                      <option value="very-aggressive">Very Aggressive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* KYC & Identity Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">KYC & Identity Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-kycStatus" className="block text-sm font-medium text-gray-700 mb-1">KYC Status</label>
                    <select
                      id="edit-kycStatus"
                      name="kycStatus"
                      value={editFormData.kycStatus}
                      onChange={(e) => handleEditFormChange('kycStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select KYC status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-documentType" className="block text-sm font-medium text-gray-700 mb-1">Identity Document Type</label>
                    <select
                      id="edit-documentType"
                      name="documentType"
                      value={editFormData.identityDocument.type}
                      onChange={(e) => handleEditFormChange('identityDocument', { ...editFormData.identityDocument, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select document type</option>
                      <option value="passport">Passport</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="national_id">National ID</option>
                      <option value="state_id">State ID</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-documentNumber" className="block text-sm font-medium text-gray-700 mb-1">Document Number</label>
                    <input
                      id="edit-documentNumber"
                      name="documentNumber"
                      type="text"
                      value={editFormData.identityDocument.number}
                      onChange={(e) => handleEditFormChange('identityDocument', { ...editFormData.identityDocument, number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter document number"
                      autoComplete="off"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-documentExpiry" className="block text-sm font-medium text-gray-700 mb-1">Document Expiry Date</label>
                    <input
                      id="edit-documentExpiry"
                      name="documentExpiry"
                      type="date"
                      value={editFormData.identityDocument.expiryDate}
                      onChange={(e) => handleEditFormChange('identityDocument', { ...editFormData.identityDocument, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoComplete="off"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-issueCountry" className="block text-sm font-medium text-gray-700 mb-1">Issue Country</label>
                    <input
                      id="edit-issueCountry"
                      name="issueCountry"
                      type="text"
                      value={editFormData.identityDocument.issueCountry}
                      onChange={(e) => handleEditFormChange('identityDocument', { ...editFormData.identityDocument, issueCountry: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter issuing country"
                      autoComplete="country-name"
                    />
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      id="edit-role"
                      name="role"
                      value={editFormData.role}
                      onChange={(e) => handleEditFormChange('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Account Options</label>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="suspended"
                          name="suspended"
                          checked={editFormData.suspended}
                          onChange={(e) => handleEditFormChange('suspended', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="suspended" className="ml-2 text-sm text-gray-700">
                          Suspended Account
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="emailVerified"
                          name="emailVerified"
                          checked={editFormData.emailVerified}
                          onChange={(e) => handleEditFormChange('emailVerified', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="emailVerified" className="ml-2 text-sm text-gray-700">
                          Email Verified
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="twoFactorEnabled"
                          name="twoFactorEnabled"
                          checked={editFormData.twoFactorEnabled}
                          onChange={(e) => handleEditFormChange('twoFactorEnabled', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="twoFactorEnabled" className="ml-2 text-sm text-gray-700">
                          Two-Factor Authentication Enabled
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </form>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  enableBackgroundScroll();
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={editLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {editLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FaKey className="text-red-600 mr-3 text-xl" />
                <h2 className="text-xl font-bold text-gray-900">Reset User Password</h2>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordResetData({
                    newPassword: '',
                    generateRandom: true,
                    requireChangeOnLogin: true,
                    sendEmail: true
                  });
                  setGeneratedPassword('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimesCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Password Options */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Password Options</h3>
                
                <div className="space-y-4">
                  {/* Generate Random Password Option */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="radio"
                        id="generateRandom"
                        name="passwordMode"
                        checked={passwordResetData.generateRandom}
                        onChange={() => handlePasswordFormChange('generateRandom', true)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="generateRandom" className="ml-2 text-sm font-medium text-gray-700">
                        Generate Random Password (Recommended)
                      </label>
                    </div>
                    
                    {passwordResetData.generateRandom && (
                      <div className="mt-3 space-y-3">
                        <button
                          type="button"
                          onClick={handleGeneratePassword}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <FaKey className="mr-2" />
                          Generate New Password
                        </button>
                        
                        {generatedPassword && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Generated Password:
                            </label>
                            <div className="flex items-center space-x-2">
                              <code className="flex-1 bg-white px-3 py-2 rounded border text-sm font-mono">
                                {generatedPassword}
                              </code>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(generatedPassword)}
                                className="p-2 text-gray-500 hover:text-gray-700 border rounded"
                                title="Copy to clipboard"
                              >
                                <FaCopy />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Make sure to save this password - it won't be shown again!
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Manual Password Option */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="radio"
                        id="manualPassword"
                        name="passwordMode"
                        checked={!passwordResetData.generateRandom}
                        onChange={() => handlePasswordFormChange('generateRandom', false)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="manualPassword" className="ml-2 text-sm font-medium text-gray-700">
                        Set Custom Password
                      </label>
                    </div>
                    
                    {!passwordResetData.generateRandom && (
                      <div className="mt-3 space-y-4">
                        {/* New Password Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={passwordResetData.newPassword}
                              onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
                                isPasswordValid() 
                                  ? 'border-gray-300 focus:ring-blue-500' 
                                  : 'border-red-300 focus:ring-red-500'
                              }`}
                              placeholder="Enter new password"
                              minLength="8"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                              ) : (
                                <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                          </div>
                          {!isPasswordValid() && passwordResetData.newPassword && (
                            <p className="text-xs text-red-600 mt-1">
                              Password must be at least 8 characters long
                            </p>
                          )}
                        </div>
                        
                        {/* Confirm Password Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordResetData.confirmPassword}
                              onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
                                passwordsMatch() 
                                  ? 'border-gray-300 focus:ring-blue-500' 
                                  : 'border-red-300 focus:ring-red-500'
                              }`}
                              placeholder="Confirm new password"
                              minLength="8"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                              ) : (
                                <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                          </div>
                          {!passwordsMatch() && passwordResetData.confirmPassword && (
                            <p className="text-xs text-red-600 mt-1">
                              Passwords do not match
                            </p>
                          )}
                          {passwordsMatch() && passwordResetData.confirmPassword && passwordResetData.newPassword && (
                            <p className="text-xs text-green-600 mt-1 flex items-center">
                              <FaCheckCircle className="mr-1" />
                              Passwords match
                            </p>
                          )}
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-blue-700">
                            <strong>⚠️ Important:</strong> Make sure to double-check the password before setting it for the user. 
                            They will need this exact password to log in.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Settings</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireChangeOnLogin"
                      checked={passwordResetData.requireChangeOnLogin}
                      onChange={(e) => handlePasswordFormChange('requireChangeOnLogin', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="requireChangeOnLogin" className="ml-2 text-sm text-gray-700">
                      Require password change on next login
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sendEmail"
                      checked={passwordResetData.sendEmail}
                      onChange={(e) => handlePasswordFormChange('sendEmail', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sendEmail" className="ml-2 text-sm text-gray-700">
                      Send password reset email to user
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordResetData({
                    newPassword: '',
                    generateRandom: true,
                    requireChangeOnLogin: true,
                    sendEmail: true
                  });
                  setGeneratedPassword('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={passwordLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                disabled={passwordLoading || 
                  (!passwordResetData.generateRandom && 
                    (!passwordResetData.newPassword || 
                     !passwordResetData.confirmPassword || 
                     !passwordsMatch() || 
                     !isPasswordValid())) ||
                  (passwordResetData.generateRandom && !generatedPassword && !passwordResetData.newPassword)
                }
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {passwordLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                {passwordLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
