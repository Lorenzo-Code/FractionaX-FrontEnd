import React, { useState, useEffect } from 'react';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Monitor,
  Moon,
  Sun,
  Save,
  Eye,
  EyeOff,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Clock,
  Smartphone,
  Laptop,
  Tablet,
  Activity,
  Lock,
  Unlock,
  Edit3,
  Star,
  TrendingUp,
  BarChart3,
  Settings,
  Zap,
  Database,
  CreditCard,
  DollarSign,
  FileText,
  IdCard,
  Building,
  Receipt,
  Users,
  Gavel,
  FileCheck,
  FilePlus,
  FileX,
  Image,
  Paperclip,
  ExternalLink,
  Wallet
} from 'lucide-react';

const CustomerSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  
  // Customer settings state
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      middleName: '',
      email: 'john.doe@example.com',
      phone: '+1 (555) 987-6543',
      timezone: 'America/New_York',
      occupation: 'Real Estate Investor',
      company: 'Independent',
      bio: '',
      // KYC Enhanced Fields
      ssn: '',
      taxId: '',
      dateOfBirth: '',
      nationality: 'US',
      employmentStatus: 'employed',
      annualIncome: '',
      sourceOfFunds: '',
      investmentExperience: 'intermediate',
      riskTolerance: 'moderate'
    },
    address: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      residencyStatus: 'citizen'
    },
    identity: {
      governmentIdType: 'drivers_license',
      governmentIdNumber: '',
      governmentIdExpiry: '',
      passportNumber: '',
      passportExpiry: '',
      verificationStatus: 'pending',
      lastVerified: null
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      securityAlerts: true,
      marketingEmails: false,
      investmentAlerts: true,
      priceAlerts: true,
      stakingRewards: true,
      portfolioUpdates: true
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: 30,
      transactionConfirmation: true,
      requirePasswordForTransactions: false,
      transactionEmailAlerts: true,
      largeTransactionThreshold: 5000,
      withdrawalLimits: {
        daily: 50000,
        monthly: 500000
      }
    },
    appearance: {
      theme: 'light',
      compactMode: false,
      animationsEnabled: true,
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      showBalances: true
    },
    privacy: {
      profileVisibility: 'private',
      shareInvestmentActivity: false,
      allowMarketingCommunications: false,
      dataProcessingConsent: true
    }
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'wallet', label: 'Wallet Settings', icon: Wallet },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'sessions', label: 'Activity Log', icon: Activity }
  ];

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving customer settings:', settings);
    // TODO: Implement API call to save settings
  };

  const handlePasswordUpdate = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Updating password');
    // TODO: Implement password update API call
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : 'Never';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // TODO: Show toast notification
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account preferences and security settings</p>
          </div>
          <button
            onClick={handleSaveSettings}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={16} className="mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Information</h2>
                <p className="text-gray-600">Update your personal information and preferences</p>
              </div>

              {/* Profile Picture Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {settings.profile.firstName[0]}{settings.profile.lastName[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50">
                    <Camera size={16} className="text-gray-600" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {settings.profile.firstName} {settings.profile.lastName}
                  </h3>
                  <p className="text-gray-600">{settings.profile.email}</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1">
                    Change photo
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={settings.profile.firstName}
                      onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={settings.profile.lastName}
                      onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupation
                    </label>
                    <input
                      type="text"
                      value={settings.profile.occupation}
                      onChange={(e) => handleSettingChange('profile', 'occupation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.profile.timezone}
                      onChange={(e) => handleSettingChange('profile', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Investment Profile */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Experience
                    </label>
                    <select
                      value={settings.profile.investmentExperience}
                      onChange={(e) => handleSettingChange('profile', 'investmentExperience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Risk Tolerance
                    </label>
                    <select
                      value={settings.profile.riskTolerance}
                      onChange={(e) => handleSettingChange('profile', 'riskTolerance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="conservative">Conservative</option>
                      <option value="moderate">Moderate</option>
                      <option value="aggressive">Aggressive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={settings.profile.bio}
                  onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>
            </div>
          )}

          {/* Wallet Settings Tab */}
          {activeTab === 'wallet' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Settings</h2>
                <p className="text-gray-600">Configure your wallet preferences and transaction settings</p>
              </div>

              {/* Display Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">Show Balance</span>
                      <p className="text-sm text-gray-500">Display your wallet balance on the dashboard</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.appearance.showBalances}
                        onChange={(e) => handleSettingChange('appearance', 'showBalances', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Currency
                    </label>
                    <select
                      value={settings.appearance.currency}
                      onChange={(e) => handleSettingChange('appearance', 'currency', e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Transaction Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-900">Email Confirmation</span>
                      <p className="text-sm text-gray-500">Require email confirmation for all transactions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.transactionConfirmation}
                        onChange={(e) => handleSettingChange('security', 'transactionConfirmation', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-900">Password for Transactions</span>
                      <p className="text-sm text-gray-500">Require password confirmation for crypto transactions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.requirePasswordForTransactions}
                        onChange={(e) => handleSettingChange('security', 'requirePasswordForTransactions', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Large Transaction Alert Threshold
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">$</span>
                      <input
                        type="number"
                        value={settings.security.largeTransactionThreshold}
                        onChange={(e) => handleSettingChange('security', 'largeTransactionThreshold', parseInt(e.target.value))}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="100"
                        step="100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h2>
                <p className="text-gray-600">Protect your account with advanced security features</p>
              </div>

              {/* Password Change */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwords.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={handlePasswordUpdate}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      settings.security.twoFactorEnabled ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {settings.security.twoFactorEnabled ? (
                        <CheckCircle size={20} className="text-green-600" />
                      ) : (
                        <Shield size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {settings.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('security', 'twoFactorEnabled', !settings.security.twoFactorEnabled)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      settings.security.twoFactorEnabled
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {settings.security.twoFactorEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>

              {/* Login Alerts */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">Login Alerts</span>
                      <p className="text-sm text-gray-500">Get notified of new device logins</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.loginAlerts}
                        onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={480}>8 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
                <p className="text-gray-600">Choose how and when you receive notifications</p>
              </div>

              {/* General Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-900">Email Notifications</span>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-900">Push Notifications</span>
                      <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-900">SMS Notifications</span>
                      <p className="text-sm text-gray-500">Receive important alerts via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Investment Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-900">Investment Alerts</span>
                      <p className="text-sm text-gray-500">Get notified about investment opportunities</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.investmentAlerts}
                        onChange={(e) => handleSettingChange('notifications', 'investmentAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-900">Price Alerts</span>
                      <p className="text-sm text-gray-500">Notifications for significant price changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.priceAlerts}
                        onChange={(e) => handleSettingChange('notifications', 'priceAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-900">Staking Rewards</span>
                      <p className="text-sm text-gray-500">Notifications for staking reward distributions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.stakingRewards}
                        onChange={(e) => handleSettingChange('notifications', 'stakingRewards', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <span className="font-medium text-gray-900">Portfolio Updates</span>
                      <p className="text-sm text-gray-500">Weekly portfolio performance summaries</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.portfolioUpdates}
                        onChange={(e) => handleSettingChange('notifications', 'portfolioUpdates', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy Settings</h2>
                <p className="text-gray-600">Control your privacy and data sharing preferences</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <span className="font-medium text-gray-900">Profile Visibility</span>
                    <p className="text-sm text-gray-500">Control who can see your profile information</p>
                  </div>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                    <option value="investors">Investors Only</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <span className="font-medium text-gray-900">Share Investment Activity</span>
                    <p className="text-sm text-gray-500">Allow others to see your investment activities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.shareInvestmentActivity}
                      onChange={(e) => handleSettingChange('privacy', 'shareInvestmentActivity', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-medium text-gray-900">Marketing Communications</span>
                    <p className="text-sm text-gray-500">Receive promotional emails and updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowMarketingCommunications}
                      onChange={(e) => handleSettingChange('privacy', 'allowMarketingCommunications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Appearance</h2>
                <p className="text-gray-600">Customize how FractionaX looks and feels</p>
              </div>

              <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {['light', 'dark', 'system'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => handleSettingChange('appearance', 'theme', theme)}
                        className={`p-4 border rounded-lg text-center capitalize transition-colors ${
                          settings.appearance.theme === theme
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {theme === 'light' && <Sun size={24} className="mx-auto mb-2" />}
                        {theme === 'dark' && <Moon size={24} className="mx-auto mb-2" />}
                        {theme === 'system' && <Monitor size={24} className="mx-auto mb-2" />}
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language & Region */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Language & Region</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.appearance.language}
                        onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Format
                      </label>
                      <select
                        value={settings.appearance.dateFormat}
                        onChange={(e) => handleSettingChange('appearance', 'dateFormat', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Display Options */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">Compact Mode</span>
                        <p className="text-sm text-gray-500">Use a more compact interface</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.appearance.compactMode}
                          onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">Animations</span>
                        <p className="text-sm text-gray-500">Enable interface animations and transitions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.appearance.animationsEnabled}
                          onChange={(e) => handleSettingChange('appearance', 'animationsEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity Log</h2>
                <p className="text-gray-600">Review your recent account activity and sessions</p>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'Logged in', device: 'Chrome on Windows', time: '2 hours ago', ip: '192.168.1.100' },
                    { action: 'Password changed', device: 'Chrome on Windows', time: '1 day ago', ip: '192.168.1.100' },
                    { action: 'New device login', device: 'Safari on iPhone', time: '3 days ago', ip: '10.0.1.50' },
                    { action: 'Settings updated', device: 'Chrome on Windows', time: '5 days ago', ip: '192.168.1.100' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.device} • {activity.ip}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Sessions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  {[
                    { device: 'Chrome on Windows', location: 'New York, US', current: true, lastActive: 'Active now' },
                    { device: 'Safari on iPhone', location: 'New York, US', current: false, lastActive: '2 hours ago' }
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {session.device.includes('iPhone') ? (
                            <Smartphone size={20} className="text-gray-600" />
                          ) : (
                            <Laptop size={20} className="text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{session.device}</p>
                            {session.current && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{session.location} • {session.lastActive}</p>
                        </div>
                      </div>
                      {!session.current && (
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;
