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
  ExternalLink
} from 'lucide-react';

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  
  // Basic settings state
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      middleName: '',
      email: 'admin@fractionax.com',
      phone: '+1 (555) 123-4567',
      timezone: 'America/New_York',
      occupation: 'Software Engineer',
      company: 'FractionaX Inc.',
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
      marketingEmails: false
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: 30
    },
    appearance: {
      theme: 'dark',
      compactMode: false,
      animationsEnabled: true,
      language: 'en',
      dateFormat: 'MM/DD/YYYY'
    }
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'compliance', label: 'Compliance', icon: Gavel },
    { id: 'crypto', label: 'Crypto Wallets', icon: CreditCard },
    { id: 'login', label: 'Login & Access', icon: Lock },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'sessions', label: 'Activity Log', icon: Activity },
    { id: 'appearance', label: 'Appearance', icon: Palette }
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
    console.log('Saving settings:', settings);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Settings</h1>
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

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
              
              {/* Basic Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
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
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="tel"
                        value={settings.profile.phone}
                        onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
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
                      <option value="America/New_York">Eastern Time (UTC-5)</option>
                      <option value="America/Chicago">Central Time (UTC-6)</option>
                      <option value="America/Denver">Mountain Time (UTC-7)</option>
                      <option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
                      <option value="Europe/London">London (UTC+0)</option>
                      <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                    </select>
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
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={settings.profile.bio}
                    onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {/* KYC Information */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Identity Verification (KYC)</h3>
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-600">Verified</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Info size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Regulatory Compliance</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        As a financial services platform, FractionaX is required to collect and verify customer identity information to comply with federal regulations including the Bank Secrecy Act and USA PATRIOT Act.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={settings.profile.middleName}
                      onChange={(e) => handleSettingChange('profile', 'middleName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={settings.profile.dateOfBirth}
                      onChange={(e) => handleSettingChange('profile', 'dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social Security Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={settings.profile.ssn}
                        onChange={(e) => handleSettingChange('profile', 'ssn', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="XXX-XX-XXXX"
                        maxLength="11"
                        required
                      />
                      <IdCard size={16} className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax ID (if different from SSN)
                    </label>
                    <input
                      type="text"
                      value={settings.profile.taxId}
                      onChange={(e) => handleSettingChange('profile', 'taxId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="XX-XXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={settings.profile.nationality}
                      onChange={(e) => handleSettingChange('profile', 'nationality', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employment Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={settings.profile.employmentStatus}
                      onChange={(e) => handleSettingChange('profile', 'employmentStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="employed">Employed</option>
                      <option value="self_employed">Self-Employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="retired">Retired</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={settings.address.street1}
                      onChange={(e) => handleSettingChange('address', 'street1', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address 2
                    </label>
                    <input
                      type="text"
                      value={settings.address.street2}
                      onChange={(e) => handleSettingChange('address', 'street2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={settings.address.city}
                      onChange={(e) => handleSettingChange('address', 'city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={settings.address.state}
                      onChange={(e) => handleSettingChange('address', 'state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP/Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={settings.address.zipCode}
                      onChange={(e) => handleSettingChange('address', 'zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={settings.address.country}
                      onChange={(e) => handleSettingChange('address', 'country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Accredited Investor Status */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Accredited Investor Verification</h3>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle size={16} className="text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-600">Verification Required</span>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle size={20} className="text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Property Investment Restriction</h4>
                      <p className="text-sm text-red-700 mt-1">
                        <strong>Only Accredited Investors</strong> are eligible to purchase fractional real estate properties on FractionaX. This requirement is mandated by SEC regulations for private real estate investments. Non-accredited investors can access all other platform features including market analysis, portfolio tracking, and educational content.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Info size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">What is an Accredited Investor?</h4>
                      <p className="text-sm text-blue-700 mt-2 mb-3">
                        An accredited investor is an individual or entity that meets specific financial criteria set by the SEC:
                      </p>
                      <ul className="text-sm text-blue-700 space-y-1 ml-4">
                        <li>• <strong>Income Test:</strong> Annual income exceeding $200,000 (or $300,000 for joint income) in each of the prior two years with expectation of the same in the current year</li>
                        <li>• <strong>Net Worth Test:</strong> Net worth exceeding $1,000,000 (excluding primary residence)</li>
                        <li>• <strong>Professional Knowledge:</strong> Hold certain professional certifications, designations, or credentials (Series 7, 65, 82)</li>
                        <li>• <strong>Entity Requirements:</strong> Certain institutional investors, banks, or entities with assets exceeding $5,000,000</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Accreditation Method Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Accreditation Qualification Method <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="radio" name="accreditationMethod" value="income" className="text-blue-600" />
                        <div>
                          <span className="font-medium text-gray-900">Income Qualification</span>
                          <p className="text-sm text-gray-600">Individual income &gt;$200K or joint income &gt;$300K annually</p>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="radio" name="accreditationMethod" value="networth" className="text-blue-600" />
                        <div>
                          <span className="font-medium text-gray-900">Net Worth Qualification</span>
                          <p className="text-sm text-gray-600">Net worth &gt;$1M (excluding primary residence)</p>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="radio" name="accreditationMethod" value="professional" className="text-blue-600" />
                        <div>
                          <span className="font-medium text-gray-900">Professional Qualification</span>
                          <p className="text-sm text-gray-600">Hold qualifying professional certifications (Series 7, 65, 82)</p>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="radio" name="accreditationMethod" value="entity" className="text-blue-600" />
                        <div>
                          <span className="font-medium text-gray-900">Entity Qualification</span>
                          <p className="text-sm text-gray-600">Qualifying institutional or business entity</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Self-Certification */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Self-Certification</h4>
                    <div className="space-y-3">
                      <label className="flex items-start space-x-3">
                        <input type="checkbox" className="mt-1 text-blue-600" />
                        <span className="text-sm text-gray-700">
                          I certify that I meet the accredited investor requirements as defined by SEC Rule 501 of Regulation D under the Securities Act of 1933.
                        </span>
                      </label>
                      <label className="flex items-start space-x-3">
                        <input type="checkbox" className="mt-1 text-blue-600" />
                        <span className="text-sm text-gray-700">
                          I understand that this self-certification may be subject to verification and that providing false information may result in account suspension and legal consequences.
                        </span>
                      </label>
                      <label className="flex items-start space-x-3">
                        <input type="checkbox" className="mt-1 text-blue-600" />
                        <span className="text-sm text-gray-700">
                          I acknowledge that my accredited investor status will be reviewed periodically and I agree to notify FractionaX immediately if my status changes.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Verification Status</h4>
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending Verification</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Your accredited investor status is currently under review. This process typically takes 2-3 business days.
                    </p>
                    <div className="flex items-center space-x-4">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                        Submit for Verification
                      </button>
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">
                        Upload Supporting Documents
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Financial Disclosure</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        This information is required for regulatory compliance and helps us provide appropriate investment recommendations.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Income <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={settings.profile.annualIncome}
                      onChange={(e) => handleSettingChange('profile', 'annualIncome', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Income Range</option>
                      <option value="under_25k">Under $25,000</option>
                      <option value="25k_50k">$25,000 - $50,000</option>
                      <option value="50k_100k">$50,000 - $100,000</option>
                      <option value="100k_250k">$100,000 - $250,000</option>
                      <option value="250k_500k">$250,000 - $500,000</option>
                      <option value="over_500k">Over $500,000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source of Funds <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={settings.profile.sourceOfFunds}
                      onChange={(e) => handleSettingChange('profile', 'sourceOfFunds', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Source</option>
                      <option value="employment">Employment Income</option>
                      <option value="business">Business Income</option>
                      <option value="investments">Investment Returns</option>
                      <option value="inheritance">Inheritance</option>
                      <option value="savings">Personal Savings</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Experience <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={settings.profile.investmentExperience}
                      onChange={(e) => handleSettingChange('profile', 'investmentExperience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="beginner">Beginner (0-2 years)</option>
                      <option value="intermediate">Intermediate (2-5 years)</option>
                      <option value="advanced">Advanced (5+ years)</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Risk Tolerance <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={settings.profile.riskTolerance}
                      onChange={(e) => handleSettingChange('profile', 'riskTolerance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="conservative">Conservative</option>
                      <option value="moderate">Moderate</option>
                      <option value="aggressive">Aggressive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Document Verification</h2>
                  <p className="text-gray-600 text-sm mt-1">Upload and manage required compliance documents</p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-green-600">3/4 Documents Verified</span>
                </div>
              </div>

              {/* Document Categories */}
              <div className="space-y-6">
                {/* Identity Documents */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Identity Verification</h3>
                      <p className="text-sm text-gray-600">Government-issued photo identification required</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-600">Verified</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Driver's License */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Driver's License</h4>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Verified</span>
                      </div>
                      <div className="flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg mb-3">
                        <div className="text-center">
                          <Image size={24} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">drivers_license_front.jpg</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Uploaded: Jan 15, 2024</span>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                            <Download size={14} />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-red-600 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Passport */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Passport (Optional)</h4>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Not Uploaded</span>
                      </div>
                      <div className="flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg mb-3 hover:bg-gray-100 cursor-pointer transition-colors">
                        <div className="text-center">
                          <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Click to upload</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proof of Address */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Proof of Address</h3>
                      <p className="text-sm text-gray-600">Recent utility bill, bank statement, or lease agreement</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-600">Verified</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Utility Bill</h4>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Verified</span>
                    </div>
                    <div className="flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg mb-3">
                      <div className="text-center">
                        <FileText size={24} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">electric_bill_january_2024.pdf</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Uploaded: Jan 20, 2024</span>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                          <Download size={14} />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-red-600 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Documents */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Financial Verification</h3>
                      <p className="text-sm text-gray-600">Income verification and bank statements</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-600">Verified</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pay Stub */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Recent Pay Stub</h4>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Verified</span>
                      </div>
                      <div className="flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg mb-3">
                        <div className="text-center">
                          <Receipt size={24} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">pay_stub_december_2024.pdf</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Uploaded: Jan 10, 2024</span>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                            <Download size={14} />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-red-600 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bank Statement */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Bank Statement</h4>
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending Review</span>
                      </div>
                      <div className="flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg mb-3 hover:bg-gray-100 cursor-pointer transition-colors">
                        <div className="text-center">
                          <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Click to upload</p>
                          <p className="text-xs text-gray-500">PDF up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tax Documents */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Tax Documentation</h3>
                      <p className="text-sm text-gray-600">W-2, 1099, or tax returns for income verification</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle size={16} className="text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-600">Required</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">W-2 or 1099 Forms</h4>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Not Uploaded</span>
                    </div>
                    <div className="flex items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg mb-3 hover:bg-gray-100 cursor-pointer transition-colors">
                      <div className="text-center">
                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload tax documents</p>
                        <p className="text-xs text-gray-500">PDF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Upload Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Document Guidelines</h4>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Documents must be clear, legible, and in full color</li>
                      <li>• All corners of documents must be visible</li>
                      <li>• Documents must be current and not expired</li>
                      <li>• Bank statements must be from the last 3 months</li>
                      <li>• Accepted formats: PDF, JPG, PNG (max 10MB each)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Crypto Wallets Tab */}
          {activeTab === 'crypto' && (
            <div className="space-y-8">
              {/* Header with Comprehensive Stats */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Management</h2>
                    <p className="text-gray-600">Manage your cryptocurrency wallets and platform funds</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-auto">
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <CreditCard size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">External Wallet</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">$58,225.00</div>
                      <div className="text-xs text-gray-500">MetaMask Connected</div>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                      <div className="flex items-center space-x-2 mb-1">
                        <Database size={16} className="text-purple-600" />
                        <span className="text-sm font-medium text-purple-600">Platform Wallet</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">$12,450.75</div>
                      <div className="text-xs text-gray-500">FractionaX Internal</div>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50 col-span-2 lg:col-span-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <BarChart3 size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-green-600">Total Assets</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">$70,675.75</div>
                      <div className="text-xs text-green-600">+5.2% this month</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Wallet Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* External Cryptocurrency Wallet */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">External Crypto Wallet</h3>
                    <p className="text-sm text-gray-600">Your connected cryptocurrency wallet for blockchain assets</p>
                  </div>

                  {/* Policy Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Info size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-800 mb-1">Single Wallet Policy</h4>
                        <p className="text-sm text-blue-700 leading-relaxed">
                          For security and compliance, only one crypto wallet can be connected at a time. All transactions are tracked and verified.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Connected Wallet Card */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    {/* Wallet Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">MM</span>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold">MetaMask Wallet</h4>
                            <p className="text-blue-100">Ethereum & ERC-20 Tokens</p>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 text-sm bg-green-400/20 text-white rounded-full font-medium border border-green-400/30">
                          ✓ Verified
                        </span>
                      </div>
                      
                      <div className="pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-100 text-sm mb-1">Wallet Address</p>
                            <div className="flex items-center space-x-2">
                              <code className="font-mono text-white text-lg">0x1234...abcd</code>
                              <button className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded transition-colors">
                                <Copy size={16} />
                              </button>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm transition-colors border border-white/20">
                            View on Etherscan
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Wallet Details */}
                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">Connected</div>
                          <div className="font-semibold text-gray-900">Jan 10, 2024</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">Last Verified</div>
                          <div className="font-semibold text-gray-900">2 hours ago</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">Transactions</div>
                          <div className="font-semibold text-gray-900">23</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-100">
                        <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                          <RefreshCw size={16} className="mr-2" />
                          Refresh Balance
                        </button>
                        <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">
                          <Settings size={16} className="mr-2" />
                          Wallet Settings
                        </button>
                        <button className="flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm transition-colors">
                          <X size={16} className="mr-2" />
                          Unlink
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Assets & Transactions Tabs */}
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex border-b border-gray-200 bg-gray-50">
                      <button className="px-6 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-white">
                        Assets
                      </button>
                      <button className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-colors">
                        Transactions
                      </button>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Your Assets</h4>
                        <span className="text-sm text-gray-500">Updated 2 minutes ago</span>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { symbol: 'ETH', name: 'Ethereum', balance: '12.45', usd: '$31,125.00', color: 'blue', change: '+2.3%' },
                          { symbol: 'BTC', name: 'Bitcoin', balance: '0.75', usd: '$32,250.00', color: 'orange', change: '-0.5%' },
                          { symbol: 'USDC', name: 'USD Coin', balance: '5,000.00', usd: '$5,000.00', color: 'green', change: '0.0%' }
                        ].map((crypto) => (
                          <div key={crypto.symbol} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 bg-${crypto.color}-100 rounded-xl flex items-center justify-center`}>
                                <span className={`text-${crypto.color}-600 font-bold text-sm`}>{crypto.symbol}</span>
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900">{crypto.name}</h5>
                                <p className="text-sm text-gray-500">{crypto.balance} {crypto.symbol}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">{crypto.usd}</div>
                              <div className={`text-sm ${
                                crypto.change.startsWith('+') ? 'text-green-600' : 
                                crypto.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'
                              }`}>
                                {crypto.change} 24h
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform Wallet & Controls */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Platform Wallet & Controls</h3>
                    <p className="text-sm text-gray-600">Your FractionaX internal wallet and transaction controls</p>
                  </div>

                  {/* Platform Wallet Card */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-semibold mb-1">FractionaX Wallet</h4>
                          <p className="text-indigo-100">Internal Platform Balance</p>
                        </div>
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                          <Database size={24} className="text-white" />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-3xl font-bold mb-2">$12,450.75</div>
                        <div className="text-purple-100 text-sm">Available Balance</div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/20">
                        <div className="text-sm">
                          <div className="text-purple-100">Wallet ID</div>
                          <div className="font-mono text-white">FX-W-789456123</div>
                        </div>
                        <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors border border-white/20">
                          Copy ID
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="text-sm text-yellow-700 mb-1">Pending</div>
                          <div className="text-xl font-bold text-yellow-800">$250.00</div>
                          <div className="text-xs text-yellow-600 mt-1">2 transactions</div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="text-sm text-blue-700 mb-1">Reserved</div>
                          <div className="text-xl font-bold text-blue-800">$1,200.00</div>
                          <div className="text-xs text-blue-600 mt-1">Open orders</div>
                        </div>
                      </div>
                      
                      {/* Quick Actions Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center space-x-2 p-4 bg-green-50 border border-green-200 hover:bg-green-100 rounded-lg transition-colors">
                          <TrendingUp size={20} className="text-green-600" />
                          <span className="font-medium text-green-700">Deposit</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 p-4 bg-orange-50 border border-orange-200 hover:bg-orange-100 rounded-lg transition-colors">
                          <TrendingUp size={20} className="text-orange-600 rotate-180" />
                          <span className="font-medium text-orange-700">Withdraw</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 p-4 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors">
                          <RefreshCw size={20} className="text-blue-600" />
                          <span className="font-medium text-blue-700">Refresh</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 p-4 bg-purple-50 border border-purple-200 hover:bg-purple-100 rounded-lg transition-colors">
                          <FileText size={20} className="text-purple-600" />
                          <span className="font-medium text-purple-700">History</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Limits */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Transaction Limits</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800">Daily Limit</span>
                          <span className="text-sm font-medium text-blue-600">$5,000 / $50,000</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-blue-600 h-3 rounded-full relative" style={{width: '10%'}}>
                            <div className="absolute right-0 top-0 h-full w-1 bg-blue-700 rounded-r-full"></div>
                          </div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>10% used</span>
                          <span>Resets in 14:25:16</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800">Monthly Limit</span>
                          <span className="text-sm font-medium text-blue-600">$75,000 / $500,000</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-blue-600 h-3 rounded-full relative" style={{width: '15%'}}>
                            <div className="absolute right-0 top-0 h-full w-1 bg-blue-700 rounded-r-full"></div>
                          </div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>15% used</span>
                          <span>Resets in 21 days</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security & Settings */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Security Settings</h4>
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Manage</button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Shield size={18} className="text-green-600" />
                          <span className="text-sm font-medium text-gray-700">2FA Protection</span>
                        </div>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">Active</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail size={18} className="text-green-600" />
                          <span className="text-sm font-medium text-gray-700">Email Confirmation</span>
                        </div>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">Active</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Clock size={18} className="text-green-600" />
                          <span className="text-sm font-medium text-gray-700">Withdrawal Delay</span>
                        </div>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">24h</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Lock size={18} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Address Whitelisting</span>
                        </div>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">Disabled</span>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Change Process */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-2">Need to Change Wallets?</h4>
                        <p className="text-sm text-yellow-700 mb-3">
                          To connect a different wallet, complete our security verification process.
                        </p>
                        <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors">
                          Start Wallet Change
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                    View All Transactions
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[
                    {
                      type: 'deposit',
                      crypto: 'ETH',
                      amount: '2.5',
                      usd: '$6,250.00',
                      status: 'confirmed',
                      time: '2 hours ago',
                      from: 'External Wallet'
                    },
                    {
                      type: 'withdrawal',
                      crypto: 'USDC',
                      amount: '1,000.00',
                      usd: '$1,000.00',
                      status: 'pending',
                      time: '1 day ago',
                      from: 'Platform Wallet'
                    },
                    {
                      type: 'investment',
                      crypto: 'USD',
                      amount: '5,000.00',
                      usd: '$5,000.00',
                      status: 'completed',
                      time: '3 days ago',
                      from: 'Platform Wallet'
                    }
                  ].map((tx, index) => (
                    <div key={index} className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-lg ${
                          tx.type === 'deposit' ? 'bg-green-100' : 
                          tx.type === 'withdrawal' ? 'bg-orange-100' : 'bg-blue-100'
                        }`}>
                          {tx.type === 'deposit' ? (
                            <TrendingUp size={16} className="text-green-600" />
                          ) : tx.type === 'withdrawal' ? (
                            <TrendingUp size={16} className="text-orange-600 rotate-180" />
                          ) : (
                            <DollarSign size={16} className="text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900 capitalize">{tx.type}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              tx.status === 'confirmed' || tx.status === 'completed' ? 'bg-green-100 text-green-800'
                              : tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {tx.amount} {tx.crypto} • {tx.usd}
                          </div>
                          <div className="text-xs text-gray-500">
                            {tx.from} • {tx.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Compliance & Regulatory</h2>
              
              {/* Compliance Status Overview */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Status Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* KYC Status */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <CheckCircle size={20} className="text-green-600" />
                      <h4 className="font-medium text-gray-900">KYC Verification</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Identity verification complete</p>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Verified</span>
                      <span className="text-xs text-gray-500">Jan 15, 2024</span>
                    </div>
                  </div>

                  {/* Accredited Investor Status */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <AlertTriangle size={20} className="text-yellow-600" />
                      <h4 className="font-medium text-gray-900">Accredited Investor</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Required for property purchases</p>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                      <span className="text-xs text-gray-500">Submitted</span>
                    </div>
                  </div>

                  {/* AML Status */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <CheckCircle size={20} className="text-green-600" />
                      <h4 className="font-medium text-gray-900">AML Screening</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Anti-money laundering check passed</p>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Clear</span>
                      <span className="text-xs text-gray-500">Jan 16, 2024</span>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <TrendingUp size={20} className="text-blue-600" />
                      <h4 className="font-medium text-gray-900">Risk Assessment</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Investment risk profile evaluated</p>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Moderate Risk</span>
                      <span className="text-xs text-gray-500">Jan 20, 2024</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accredited Investor Details */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Accredited Investor Status</h3>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle size={20} className="text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Property Investment Eligibility</h4>
                      <p className="text-sm text-red-700 mt-1">
                        <strong>Property purchases are restricted to Accredited Investors only.</strong> This is a federal requirement for private real estate investments. You can still access all other platform features while your accreditation is being verified.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Current Status */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <CreditCard size={20} className="text-yellow-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Verification Status</h4>
                          <p className="text-sm text-gray-600">Current accredited investor verification status</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Under Review</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Method:</span>
                          <span className="text-gray-600 ml-2">Income Qualification</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Submitted:</span>
                          <span className="text-gray-600 ml-2">January 22, 2024</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Expected Decision:</span>
                          <span className="text-gray-600 ml-2">January 25, 2024</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center space-x-3">
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">
                        View Application
                      </button>
                      <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors">
                        Upload Additional Documents
                      </button>
                    </div>
                  </div>

                  {/* Platform Access */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Lock size={20} className="text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Platform Access Levels</h4>
                          <p className="text-sm text-gray-600">Features available based on your current status</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <CheckCircle size={16} className="text-green-600" />
                          <span className="text-sm text-gray-700">Market Analysis & Research</span>
                        </div>
                        <span className="text-xs text-green-600 font-medium">Available</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <CheckCircle size={16} className="text-green-600" />
                          <span className="text-sm text-gray-700">Portfolio Tracking</span>
                        </div>
                        <span className="text-xs text-green-600 font-medium">Available</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <CheckCircle size={16} className="text-green-600" />
                          <span className="text-sm text-gray-700">Educational Content</span>
                        </div>
                        <span className="text-xs text-green-600 font-medium">Available</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <Lock size={16} className="text-red-600" />
                          <span className="text-sm text-gray-700">Property Purchases</span>
                        </div>
                        <span className="text-xs text-red-600 font-medium">Restricted</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <Lock size={16} className="text-red-600" />
                          <span className="text-sm text-gray-700">Private Offerings</span>
                        </div>
                        <span className="text-xs text-red-600 font-medium">Restricted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AML (Anti-Money Laundering) Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Anti-Money Laundering (AML)</h3>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle size={20} className="text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Regulatory Requirement</h4>
                      <p className="text-sm text-red-700 mt-1">
                        FractionaX is required by federal law to verify customer identity and screen for suspicious activities to prevent money laundering and terrorist financing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Source of Funds Verification */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <DollarSign size={20} className="text-green-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Source of Funds Verification</h4>
                          <p className="text-sm text-gray-600">Documentation of fund origins required for transactions over $10,000</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Verified</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Primary Source:</span>
                          <span className="text-gray-600 ml-2">Employment Income</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Annual Income:</span>
                          <span className="text-gray-600 ml-2">$100,000 - $250,000</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Employer:</span>
                          <span className="text-gray-600 ml-2">FractionaX Inc.</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Verified:</span>
                          <span className="text-gray-600 ml-2">January 16, 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PEP (Politically Exposed Person) Screening */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Users size={20} className="text-purple-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">PEP (Politically Exposed Person) Screening</h4>
                          <p className="text-sm text-gray-600">Screening against global PEP and sanctions lists</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Clear</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">OFAC Sanctions:</span>
                          <span className="text-green-600 ml-2">✓ Clear</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">PEP Status:</span>
                          <span className="text-green-600 ml-2">✓ Not Listed</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Last Screened:</span>
                          <span className="text-gray-600 ml-2">Jan 16, 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Monitoring */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <BarChart3 size={20} className="text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Transaction Monitoring</h4>
                          <p className="text-sm text-gray-600">Automated monitoring for suspicious patterns and activities</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Active</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Monitoring Status:</span>
                          <span className="text-blue-600 ml-2">Active</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Risk Level:</span>
                          <span className="text-green-600 ml-2">Low</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Alerts:</span>
                          <span className="text-green-600 ml-2">0 Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regulatory Reporting */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Regulatory Reporting</h3>
                
                <div className="space-y-4">
                  {/* Tax Reporting */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Receipt size={20} className="text-orange-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Tax Reporting (1099 Forms)</h4>
                          <p className="text-sm text-gray-600">Annual tax documents for investment income reporting</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors">
                        View Forms
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Tax Year 2024:</span>
                          <span className="text-gray-600 ml-2">In Progress</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Tax Year 2023:</span>
                          <span className="text-green-600 ml-2">Available</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Delivery Method:</span>
                          <span className="text-gray-600 ml-2">Electronic</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FINRA Reporting */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Building size={20} className="text-indigo-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">FINRA Compliance</h4>
                          <p className="text-sm text-gray-600">Financial Industry Regulatory Authority requirements</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Compliant</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Suitability Review:</span>
                          <span className="text-green-600 ml-2">✓ Complete</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Risk Disclosure:</span>
                          <span className="text-green-600 ml-2">✓ Acknowledged</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Last Review:</span>
                          <span className="text-gray-600 ml-2">Jan 20, 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Suspicious Activity Reports */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle size={20} className="text-yellow-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Suspicious Activity Reports (SARs)</h4>
                          <p className="text-sm text-gray-600">Mandatory reporting for suspicious transactions</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">No Reports Filed</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Total SARs:</span>
                          <span className="text-green-600 ml-2">0</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Last Review:</span>
                          <span className="text-gray-600 ml-2">Daily Automated</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Threshold:</span>
                          <span className="text-gray-600 ml-2">$10,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal Documents & Agreements */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Legal Documents & Agreements</h3>
                
                <div className="space-y-3">
                  {/* Terms of Service */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileCheck size={20} className="text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Terms of Service</h4>
                        <p className="text-sm text-gray-600">Accepted on January 15, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Accepted</span>
                      <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Privacy Policy */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileCheck size={20} className="text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Privacy Policy</h4>
                        <p className="text-sm text-gray-600">Accepted on January 15, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Accepted</span>
                      <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Investment Risk Disclosure */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileCheck size={20} className="text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Investment Risk Disclosure</h4>
                        <p className="text-sm text-gray-600">Acknowledged on January 20, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Acknowledged</span>
                      <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Customer Agreement */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileCheck size={20} className="text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Customer Agreement</h4>
                        <p className="text-sm text-gray-600">Signed electronically on January 15, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Signed</span>
                      <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Assessment & Monitoring</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <Info size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Investment Risk Profile</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your risk profile is regularly updated based on your investment activities, financial changes, and regulatory requirements.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Risk Score */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Current Risk Score</h4>
                      <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">Medium (5/10)</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Investment Experience:</span>
                        <span className="text-gray-900">Intermediate</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Risk Tolerance:</span>
                        <span className="text-gray-900">Moderate</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Time Horizon:</span>
                        <span className="text-gray-900">5-10 years</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="text-gray-900">Jan 20, 2024</span>
                      </div>
                    </div>
                  </div>

                  {/* Compliance Alerts */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Compliance Alerts</h4>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">All Clear</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-gray-600">No active compliance issues</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-gray-600">All documents up to date</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-gray-600">Risk profile current</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock size={16} className="text-gray-500" />
                        <span className="text-gray-600">Next review: Apr 20, 2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Actions */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Available Actions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Download size={20} className="text-gray-500" />
                    <span className="text-gray-700">Download Compliance Report</span>
                  </button>
                  
                  <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <RefreshCw size={20} className="text-gray-500" />
                    <span className="text-gray-700">Update Risk Assessment</span>
                  </button>
                  
                  <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <FileText size={20} className="text-gray-500" />
                    <span className="text-gray-700">View Audit Trail</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Login & Access Tab */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Login & Access Settings</h2>
              
              {/* Password Management Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Password Management</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <Info size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Strong Password Requirements</h4>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• Minimum 12 characters (recommended for financial accounts)</li>
                        <li>• Include uppercase and lowercase letters</li>
                        <li>• Include numbers and special characters</li>
                        <li>• Avoid using personal information or common words</li>
                        <li>• Password expires every 90 days for security</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwords.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        minLength="12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {/* Password Strength Indicator */}
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <span className="text-xs text-green-600 font-medium">Strong</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                {/* Password History */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Password History</h4>
                      <p className="text-xs text-gray-600">Last changed: January 15, 2024 • Expires: April 15, 2024</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">60 days remaining</span>
                  </div>
                </div>
                
                <button
                  onClick={() => alert('Password update functionality to be implemented')}
                  className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Update Password
                </button>
              </div>

              {/* Multi-Factor Authentication */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Multi-Factor Authentication (MFA)</h3>
                <div className="space-y-4">
                  {/* Authenticator App */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Smartphone size={20} className="text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Authenticator App</h4>
                          <p className="text-sm text-gray-600">Use Google Authenticator, Authy, or similar apps</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                        <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">
                          Configure
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SMS Authentication */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Phone size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">SMS Authentication</h4>
                          <p className="text-sm text-gray-600">Receive codes via text message to +1 (555) ***-4567</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Backup</span>
                        <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hardware Security Keys */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Key size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Hardware Security Keys</h4>
                          <p className="text-sm text-gray-600">YubiKey, FIDO2, or WebAuthn compatible devices</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Not Set Up</span>
                        <button className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                          Add Key
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Backup Codes */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <FileText size={20} className="text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Recovery Codes</h4>
                          <p className="text-sm text-gray-600">One-time backup codes (8 remaining)</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">
                          View Codes
                        </button>
                        <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">
                          Generate New
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Management */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Session Management</h3>
                
                {/* Session Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout
                    </label>
                    <select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={15}>15 minutes (High Security)</option>
                      <option value={30}>30 minutes (Recommended)</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={480}>8 hours</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Automatic logout after inactivity</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Concurrent Sessions
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={3}
                    >
                      <option value={1}>1 session (Most Secure)</option>
                      <option value={3}>3 sessions (Recommended)</option>
                      <option value={5}>5 sessions</option>
                      <option value={10}>10 sessions</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Devices that can be logged in simultaneously</p>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Active Sessions</h4>
                    <button className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors">
                      Terminate All Other Sessions
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Current Session */}
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Laptop size={20} className="text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">Current Session</p>
                          <p className="text-sm text-green-700">Chrome on Windows • New York, NY</p>
                          <p className="text-xs text-green-600">Active now</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">This device</span>
                    </div>

                    {/* Other Sessions */}
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone size={20} className="text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">iPhone 15</p>
                          <p className="text-sm text-gray-600">Safari on iOS • New York, NY</p>
                          <p className="text-xs text-gray-500">Last active 2 hours ago</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors">
                        Terminate
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Tablet size={20} className="text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">iPad Pro</p>
                          <p className="text-sm text-gray-600">Safari on iPadOS • New York, NY</p>
                          <p className="text-xs text-gray-500">Last active 1 day ago</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors">
                        Terminate
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Login Security */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Login Security</h3>
                
                <div className="space-y-4">
                  {/* Login Notifications */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Mail size={16} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Login Notifications</p>
                        <p className="text-sm text-gray-500">Email alerts for new device logins</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.loginAlerts}
                        onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Suspicious Activity Monitoring */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Shield size={16} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Suspicious Activity Monitoring</p>
                        <p className="text-sm text-gray-500">Automatic detection of unusual login patterns</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Account Lockout Protection */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Lock size={16} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Account Lockout Protection</p>
                        <p className="text-sm text-gray-500">Lock account after 5 failed login attempts</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* IP Address Restrictions */}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <Globe size={16} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">IP Address Restrictions</p>
                        <p className="text-sm text-gray-500">Restrict login access to specific IP ranges</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">
                      Configure
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Recovery */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Recovery</h3>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Important Security Notice</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Keep your recovery information up to date. This information will be used to verify your identity if you lose access to your account.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recovery Email
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        defaultValue="recovery@example.com"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recovery Phone
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="tel"
                        defaultValue="+1 (555) 987-6543"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center space-x-4">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                    Update Recovery Info
                  </button>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200">
                    Test Recovery Process
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
              
              {/* Security Status Overview */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Status Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Overall Security Score */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Shield size={20} className="text-green-600" />
                      <h4 className="font-medium text-gray-900">Security Score</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">85/100</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Strong</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Above average security posture</p>
                  </div>

                  {/* Active Threats */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <AlertTriangle size={20} className="text-blue-600" />
                      <h4 className="font-medium text-gray-900">Threat Detection</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">0</span>
                      <span className="text-sm text-gray-600">Active Threats</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">No suspicious activity detected</p>
                  </div>

                  {/* Security Updates */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <RefreshCw size={20} className="text-orange-600" />
                      <h4 className="font-medium text-gray-900">Last Security Scan</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">2 hours ago</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Clean</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Next scan in 6 hours</p>
                  </div>
                </div>
              </div>

              {/* Advanced Authentication */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Authentication</h3>
                
                <div className="space-y-4">
                  {/* Enhanced 2FA */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Shield size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600">Add an extra layer of security with 2FA</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Enabled</span>
                        <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">
                          Configure
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Primary Method:</span>
                          <span className="text-gray-600 ml-2">Authenticator App</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Backup Method:</span>
                          <span className="text-gray-600 ml-2">SMS</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Recovery Codes:</span>
                          <span className="text-gray-600 ml-2">8 Available</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Biometric Authentication */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <User size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Biometric Authentication</h4>
                          <p className="text-sm text-gray-600">Use fingerprint, Face ID, or Windows Hello</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Available</span>
                        <button className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                          Set Up
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Fingerprint:</span>
                          <span className="text-yellow-600 ml-2">Not Set Up</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Face Recognition:</span>
                          <span className="text-yellow-600 ml-2">Not Set Up</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Windows Hello:</span>
                          <span className="text-green-600 ml-2">Available</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hardware Security Keys */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Key size={20} className="text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Hardware Security Keys</h4>
                          <p className="text-sm text-gray-600">FIDO2/WebAuthn compatible security keys</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">1 Key Registered</span>
                        <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">
                          Manage Keys
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">YubiKey 5C NFC</span>
                            <p className="text-xs text-gray-600">Added Jan 15, 2024 • Last used 2 days ago</p>
                          </div>
                        </div>
                        <button className="p-1 text-red-500 hover:text-red-700 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Protection */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Protection</h3>
                
                <div className="space-y-4">
                  {/* Account Monitoring */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Activity size={20} className="text-green-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Real-time Account Monitoring</h4>
                          <p className="text-sm text-gray-600">24/7 monitoring for suspicious activities</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Login Monitoring:</span>
                          <span className="text-green-600 ml-2">✓ Active</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Device Tracking:</span>
                          <span className="text-green-600 ml-2">✓ Active</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Geo-location:</span>
                          <span className="text-green-600 ml-2">✓ Active</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Threat Detection:</span>
                          <span className="text-green-600 ml-2">✓ Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Threat Protection */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Shield size={20} className="text-red-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Advanced Threat Protection</h4>
                          <p className="text-sm text-gray-600">AI-powered protection against sophisticated attacks</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Premium Feature</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Phishing Protection:</span>
                          <span className="text-green-600 ml-2">✓ Enabled</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Malware Detection:</span>
                          <span className="text-green-600 ml-2">✓ Enabled</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Behavioral Analysis:</span>
                          <span className="text-green-600 ml-2">✓ Enabled</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
                      Upgrade to Premium Security
                    </button>
                  </div>

                  {/* Privacy Controls */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Eye size={20} className="text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Privacy Controls</h4>
                          <p className="text-sm text-gray-600">Control data collection and sharing preferences</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors">
                        Configure
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-700">Anonymous Analytics</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-700">Performance Metrics</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-700">Third-party Integrations</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notifications */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Notifications</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Bell size={16} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Security Alerts</p>
                        <p className="text-sm text-gray-500">Immediate notifications for security events</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Smartphone size={16} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Push Notifications</p>
                        <p className="text-sm text-gray-500">Mobile notifications for critical security events</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Mail size={16} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Email Security Reports</p>
                        <p className="text-sm text-gray-500">Weekly security summary and recommendations</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle size={16} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">Threat Intelligence Updates</p>
                        <p className="text-sm text-gray-500">Latest security threats and protection updates</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Data Encryption & Security */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Data Encryption & Security</h3>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <Lock size={20} className="text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Bank-Level Encryption</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your data is protected with AES-256 encryption at rest and TLS 1.3 in transit, meeting banking industry standards.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Encryption Status */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Encryption Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Data at Rest:</span>
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={14} className="text-green-600" />
                          <span className="text-sm font-medium text-green-600">AES-256</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Data in Transit:</span>
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={14} className="text-green-600" />
                          <span className="text-sm font-medium text-green-600">TLS 1.3</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Database Encryption:</span>
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={14} className="text-green-600" />
                          <span className="text-sm font-medium text-green-600">Active</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Backup Encryption:</span>
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={14} className="text-green-600" />
                          <span className="text-sm font-medium text-green-600">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Certifications */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Security Certifications</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">SOC 2 Type II:</span>
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={14} className="text-green-600" />
                          <span className="text-sm font-medium text-green-600">Compliant</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">PCI DSS:</span>
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={14} className="text-green-600" />
                          <span className="text-sm font-medium text-green-600">Level 1</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">ISO 27001:</span>
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={14} className="text-green-600" />
                          <span className="text-sm font-medium text-green-600">Certified</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">GDPR Compliance:</span>
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={14} className="text-green-600" />
                          <span className="text-sm font-medium text-green-600">Compliant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Actions */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Actions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Shield size={24} className="text-gray-500 mb-2" />
                    <span className="text-sm text-gray-700 text-center">Run Security Scan</span>
                  </button>
                  
                  <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Download size={24} className="text-gray-500 mb-2" />
                    <span className="text-sm text-gray-700 text-center">Download Security Report</span>
                  </button>
                  
                  <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <RefreshCw size={24} className="text-gray-500 mb-2" />
                    <span className="text-sm text-gray-700 text-center">Refresh Security Tokens</span>
                  </button>
                  
                  <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-red-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors">
                    <AlertTriangle size={24} className="text-red-500 mb-2" />
                    <span className="text-sm text-red-700 text-center">Emergency Lockdown</span>
                  </button>
                </div>
              </div>

              {/* Security Recommendations */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Recommendations</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Star size={16} className="text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Enable Biometric Authentication</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Add fingerprint or face recognition for faster and more secure logins.
                      </p>
                      <button className="mt-2 px-3 py-1 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors">
                        Set Up Now
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Info size={16} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Regular Security Reviews</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Schedule monthly reviews of your security settings and access permissions.
                      </p>
                      <button className="mt-2 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                        Schedule Review
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle size={16} className="text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Security Score: Excellent</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your account meets all recommended security practices. Keep up the great work!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
                <p className="text-gray-600">Manage how and when you receive notifications from FractionaX</p>
              </div>

              {/* Notification Channels */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Email Notifications */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Mail size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Email</h4>
                          <p className="text-xs text-gray-600">admin@fractionax.com</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Daily digest:</span>
                        <span className="font-medium text-green-600">6:00 AM</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>This week:</span>
                        <span className="font-medium">47 emails sent</span>
                      </div>
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Bell size={20} className="text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Push</h4>
                          <p className="text-xs text-gray-600">Browser & Mobile</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.pushNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Quiet hours:</span>
                        <span className="font-medium text-gray-900">10 PM - 8 AM</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>This week:</span>
                        <span className="font-medium">23 notifications</span>
                      </div>
                    </div>
                  </div>

                  {/* SMS Notifications */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Smartphone size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">SMS</h4>
                          <p className="text-xs text-gray-600">+1 (555) ***-4567</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.smsNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Emergency only:</span>
                        <span className="font-medium text-red-600">Security alerts</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>This week:</span>
                        <span className="font-medium">0 messages</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Notifications */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Transaction & Investment Notifications</h3>
                    <p className="text-sm text-gray-600">Get notified about your financial activities</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Investment Updates */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Property Investment Updates</p>
                        <p className="text-sm text-gray-600">New investment opportunities and property updates</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="instant">Instant</option>
                          <option value="daily">Daily digest</option>
                          <option value="weekly">Weekly summary</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Transaction Confirmations */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Transaction Confirmations</p>
                        <p className="text-sm text-gray-600">Deposits, withdrawals, and transfers</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="instant">Instant</option>
                          <option value="daily">Daily digest</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Dividend Payments */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Dividend Payments</p>
                        <p className="text-sm text-gray-600">Monthly dividend distributions</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="instant">Instant</option>
                          <option value="monthly">Monthly summary</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Portfolio Updates */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Portfolio Performance</p>
                        <p className="text-sm text-gray-600">Monthly portfolio summaries and performance metrics</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Wallet Balance */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Low Balance Alerts</p>
                        <p className="text-sm text-gray-600">When wallet balance falls below threshold</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <input type="number" placeholder="$500" className="text-sm border border-gray-300 rounded-md px-2 py-1 w-20" />
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Price Alerts */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Property Price Alerts</p>
                        <p className="text-sm text-gray-600">Significant price changes in your investments</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="5">±5% change</option>
                          <option value="10">±10% change</option>
                          <option value="20">±20% change</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notifications */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Shield size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Security & Account Notifications</h3>
                    <p className="text-sm text-gray-600">Critical security alerts and account changes</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Login Alerts */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Login Alerts</p>
                        <p className="text-sm text-gray-600">New device logins and suspicious activity</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-red-600 font-medium">Always On</span>
                        <div className="w-9 h-5 bg-red-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                        </div>
                      </div>
                    </div>

                    {/* Password Changes */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Password & Security Changes</p>
                        <p className="text-sm text-gray-600">Password updates, 2FA changes</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-red-600 font-medium">Always On</span>
                        <div className="w-9 h-5 bg-red-500 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                        </div>
                      </div>
                    </div>

                    {/* Account Changes */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Account Changes</p>
                        <p className="text-sm text-gray-600">Profile updates, contact information changes</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="instant">Instant</option>
                          <option value="daily">Daily digest</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* API Activity */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">API Key Activity</p>
                        <p className="text-sm text-gray-600">API key creation, usage, and security events</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="instant">Instant</option>
                          <option value="daily">Daily digest</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Compliance Alerts */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Compliance & KYC Updates</p>
                        <p className="text-sm text-gray-600">Document verification, accreditation status</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="instant">Instant</option>
                          <option value="weekly">Weekly summary</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Maintenance Alerts */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">System Maintenance</p>
                        <p className="text-sm text-gray-600">Scheduled maintenance and platform updates</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="instant">Instant</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing & Educational */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Star size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Marketing & Educational Content</h3>
                    <p className="text-sm text-gray-600">Optional updates and educational materials</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Market Insights */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Market Insights & Analysis</p>
                        <p className="text-sm text-gray-600">Weekly real estate market trends and insights</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Educational Content */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Educational Content</p>
                        <p className="text-sm text-gray-600">Investment guides, webinars, and tutorials</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Product Updates */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Product Updates & Features</p>
                        <p className="text-sm text-gray-600">New features, improvements, and announcements</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="instant">Instant</option>
                          <option value="monthly">Monthly</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Newsletter */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">FractionaX Newsletter</p>
                        <p className="text-sm text-gray-600">Monthly newsletter with company updates</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Promotional Offers */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Promotional Offers</p>
                        <p className="text-sm text-gray-600">Special offers, discounts, and exclusive deals</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="instant">Instant</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Survey & Feedback */}
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Surveys & Feedback Requests</p>
                        <p className="text-sm text-gray-600">Help us improve with your feedback</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="never">Never</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Schedule */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Notification Schedule & Preferences</h3>
                    <p className="text-sm text-gray-600">Customize when and how you receive notifications</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Quiet Hours */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Quiet Hours</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Enable Quiet Hours</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                          <input type="time" defaultValue="22:00" className="border border-gray-300 rounded-md px-2 py-1 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">End Time</label>
                          <input type="time" defaultValue="08:00" className="border border-gray-300 rounded-md px-2 py-1 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Timezone</label>
                        <select className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm">
                          <option value="America/New_York">Eastern Time (UTC-5)</option>
                          <option value="America/Chicago">Central Time (UTC-6)</option>
                          <option value="America/Denver">Mountain Time (UTC-7)</option>
                          <option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Digest Settings */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Daily Digest</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Enable Daily Digest</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Delivery Time</label>
                        <input type="time" defaultValue="06:00" className="border border-gray-300 rounded-md px-2 py-1 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Days</label>
                        <div className="flex space-x-2 text-sm">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                            <label key={day} className="flex items-center">
                              <input type="checkbox" defaultChecked={!['Sat', 'Sun'].includes(day)} className="mr-1" />
                              <span>{day}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Summary Length</label>
                        <select className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm">
                          <option value="brief">Brief (Top 3 items)</option>
                          <option value="standard">Standard (Top 10 items)</option>
                          <option value="detailed">Detailed (All activity)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification History */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Activity size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Recent Notification Activity</h3>
                      <p className="text-sm text-gray-600">Last 7 days of notification delivery</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    View All History
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Mail size={16} className="text-blue-600" />
                      <span className="text-2xl font-bold text-blue-700">47</span>
                    </div>
                    <p className="text-sm text-blue-700 font-medium">Emails Sent</p>
                    <p className="text-xs text-blue-600">98% delivery rate</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Bell size={16} className="text-green-600" />
                      <span className="text-2xl font-bold text-green-700">23</span>
                    </div>
                    <p className="text-sm text-green-700 font-medium">Push Notifications</p>
                    <p className="text-xs text-green-600">85% open rate</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Smartphone size={16} className="text-purple-600" />
                      <span className="text-2xl font-bold text-purple-700">0</span>
                    </div>
                    <p className="text-sm text-purple-700 font-medium">SMS Messages</p>
                    <p className="text-xs text-purple-600">Emergency only</p>
                  </div>
                </div>

                {/* Recent Notifications */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Recent Notifications</h4>
                  {[
                    {
                      type: 'email',
                      title: 'Monthly Portfolio Summary',
                      message: 'Your portfolio performance for January 2024',
                      time: '2 hours ago',
                      status: 'delivered',
                      icon: Mail,
                      color: 'blue'
                    },
                    {
                      type: 'push',
                      title: 'Transaction Complete',
                      message: 'Your $5,000 investment in Manhattan Property has been confirmed',
                      time: '1 day ago',
                      status: 'opened',
                      icon: Bell,
                      color: 'green'
                    },
                    {
                      type: 'email',
                      title: 'New Login Detected',
                      message: 'We detected a login from a new device in New York, NY',
                      time: '2 days ago',
                      status: 'delivered',
                      icon: Shield,
                      color: 'red'
                    }
                  ].map((notification, index) => {
                    const Icon = notification.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`p-2 bg-${notification.color}-100 rounded-lg flex-shrink-0`}>
                          <Icon size={16} className={`text-${notification.color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium text-gray-900 truncate">{notification.title}</h5>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              notification.status === 'delivered' ? 'bg-blue-100 text-blue-800'
                              : notification.status === 'opened' ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                              {notification.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Test Notifications */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Test Notifications</h3>
                    <p className="text-sm text-gray-600">Send test notifications to verify your settings</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Mail size={24} className="text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Test Email</span>
                    <span className="text-xs text-gray-500 mt-1">Send sample email notification</span>
                  </button>
                  
                  <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                    <Bell size={24} className="text-green-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Test Push</span>
                    <span className="text-xs text-gray-500 mt-1">Send sample push notification</span>
                  </button>
                  
                  <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                    <Smartphone size={24} className="text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Test SMS</span>
                    <span className="text-xs text-gray-500 mt-1">Send sample SMS message</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200">
                  <Key size={16} className="inline mr-2" />
                  Generate New Key
                </button>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">API Security</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Keep your API keys secure and never share them publicly. Rotate keys regularly for better security.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Key size={16} className="text-gray-500" />
                      <div>
                        <h3 className="font-medium text-gray-900">Production API</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Created Jan 1, 2024</span>
                          <span>Last used 2 hours ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <Copy size={16} />
                      </button>
                      <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 text-sm font-mono text-gray-700">fx_live_1234...abcd</code>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Permissions:</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">read</span>
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">write</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Activity Log</h2>
                  <p className="text-gray-600 text-sm mt-1">Comprehensive tracking of all user actions and system events</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="all">All Activities</option>
                    <option value="authentication">Authentication</option>
                    <option value="transactions">Transactions</option>
                    <option value="compliance">Compliance</option>
                    <option value="system">System</option>
                    <option value="security">Security</option>
                  </select>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors duration-200">
                    <Download size={16} className="inline mr-2" />
                    Export CSV
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200">
                    <RefreshCw size={16} className="inline mr-2" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* Activity Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Activity size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Actions</p>
                      <p className="text-xl font-bold text-gray-900">1,247</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Transactions</p>
                      <p className="text-xl font-bold text-gray-900">23</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertTriangle size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Security Events</p>
                      <p className="text-xl font-bold text-gray-900">3</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last 24h</p>
                      <p className="text-xl font-bold text-gray-900">47</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: '1',
                    type: 'investment',
                    category: 'transactions',
                    description: 'Purchased $5,000 fractional shares in Manhattan Property #MP-2024-001',
                    details: 'Transaction ID: TXN-789123 • Property: 123 Park Ave, Manhattan',
                    device: 'MacBook Pro - Chrome 120.0',
                    location: 'New York, NY (IP: 192.168.1.***)',
                    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    status: 'completed',
                    priority: 'high',
                    amount: '$5,000.00'
                  },
                  {
                    id: '2',
                    type: 'kyc_update',
                    category: 'compliance',
                    description: 'Uploaded new identity verification document',
                    details: 'Document: Updated Drivers License • Status: Under Review',
                    device: 'iPhone 15 - Safari 17.1',
                    location: 'New York, NY (IP: 192.168.1.***)',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    status: 'pending_review',
                    priority: 'medium'
                  },
                  {
                    id: '3',
                    type: 'login',
                    category: 'authentication',
                    description: 'Successful login with 2FA verification',
                    details: 'MFA Method: Authenticator App • Login attempt: 1 of 1',
                    device: 'MacBook Pro - Chrome 120.0',
                    location: 'New York, NY (IP: 192.168.1.***)',
                    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                    status: 'success',
                    priority: 'low'
                  },
                  {
                    id: '4',
                    type: 'withdrawal',
                    category: 'transactions',
                    description: 'Initiated withdrawal to external bank account',
                    details: 'Amount: $1,250.00 • Bank: Chase ****1234 • Processing time: 1-3 business days',
                    device: 'MacBook Pro - Chrome 120.0',
                    location: 'New York, NY (IP: 192.168.1.***)',
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    status: 'processing',
                    priority: 'high',
                    amount: '$1,250.00'
                  },
                  {
                    id: '5',
                    type: 'security_alert',
                    category: 'security',
                    description: 'Suspicious login attempt blocked',
                    details: 'Location: Unknown (IP: 203.45.67.***) • Blocked by geo-restriction rules',
                    device: 'Unknown Device - Chrome 119.0',
                    location: 'Moscow, Russia (IP: 203.45.67.***)',
                    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                    status: 'blocked',
                    priority: 'critical'
                  },
                  {
                    id: '6',
                    type: 'accredited_investor',
                    category: 'compliance',
                    description: 'Submitted accredited investor verification application',
                    details: 'Method: Income Qualification • Required Documents: W-2, Bank Statements',
                    device: 'MacBook Pro - Chrome 120.0',
                    location: 'New York, NY (IP: 192.168.1.***)',
                    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                    status: 'under_review',
                    priority: 'high'
                  },
                  {
                    id: '7',
                    type: 'property_view',
                    category: 'system',
                    description: 'Viewed property details and analytics',
                    details: 'Property: Brooklyn Heights Luxury Condo #BH-2024-003 • Time spent: 7 minutes',
                    device: 'iPhone 15 - Safari 17.1',
                    location: 'New York, NY (IP: 192.168.1.***)',
                    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
                    status: 'completed',
                    priority: 'low'
                  },
                  {
                    id: '8',
                    type: 'password_change',
                    category: 'security',
                    description: 'Password successfully updated',
                    details: 'Password strength: Strong • Previous change: 45 days ago',
                    device: 'MacBook Pro - Chrome 120.0',
                    location: 'New York, NY (IP: 192.168.1.***)',
                    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                    status: 'completed',
                    priority: 'medium'
                  },
                  {
                    id: '9',
                    type: 'api_access',
                    category: 'system',
                    description: 'API key generated for third-party integration',
                    details: 'Key: fx_live_****abcd • Permissions: read, write • Rate limit: 1000/hour',
                    device: 'MacBook Pro - Chrome 120.0',
                    location: 'New York, NY (IP: 192.168.1.***)',
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    status: 'active',
                    priority: 'medium'
                  },
                  {
                    id: '10',
                    type: 'dividend_received',
                    category: 'transactions',
                    description: 'Monthly dividend payment received',
                    details: 'Properties: 3 active investments • Total dividend: $127.50',
                    device: 'System Generated',
                    location: 'Automated Process',
                    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                    status: 'completed',
                    priority: 'medium',
                    amount: '$127.50'
                  },
                  {
                    id: '11',
                    type: 'tax_document',
                    category: 'compliance',
                    description: '1099-DIV tax document generated and delivered',
                    details: 'Tax Year: 2024 • Delivery: Electronic • Total dividends: $1,530.00',
                    device: 'System Generated',
                    location: 'Automated Process',
                    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
                    status: 'delivered',
                    priority: 'medium'
                  },
                  {
                    id: '12',
                    type: 'logout',
                    category: 'authentication',
                    description: 'User logged out - session terminated',
                    details: 'Session duration: 2h 34m • Logout type: Manual',
                    device: 'iPhone 15 - Safari 17.1',
                    location: 'New York, NY (IP: 192.168.1.***)',
                    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
                    status: 'completed',
                    priority: 'low'
                  }
                ].map((activity) => {
                  const getActivityIcon = () => {
                    switch (activity.type) {
                      case 'login': return <Lock size={16} className="text-blue-600" />;
                      case 'logout': return <Unlock size={16} className="text-gray-600" />;
                      case 'investment': return <DollarSign size={16} className="text-green-600" />;
                      case 'withdrawal': return <TrendingUp size={16} className="text-orange-600" />;
                      case 'dividend_received': return <Receipt size={16} className="text-green-600" />;
                      case 'kyc_update': return <IdCard size={16} className="text-purple-600" />;
                      case 'accredited_investor': return <Gavel size={16} className="text-indigo-600" />;
                      case 'security_alert': return <AlertTriangle size={16} className="text-red-600" />;
                      case 'password_change': return <Shield size={16} className="text-blue-600" />;
                      case 'property_view': return <Building size={16} className="text-gray-600" />;
                      case 'api_access': return <Key size={16} className="text-purple-600" />;
                      case 'tax_document': return <FileText size={16} className="text-indigo-600" />;
                      case 'settings_change': return <Settings size={16} className="text-orange-600" />;
                      default: return <Activity size={16} className="text-gray-600" />;
                    }
                  };

                  const getPriorityColor = () => {
                    switch (activity.priority) {
                      case 'critical': return 'border-l-4 border-red-500 bg-red-50';
                      case 'high': return 'border-l-4 border-orange-500 bg-orange-50';
                      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50';
                      case 'low': return 'border-l-4 border-green-500 bg-green-50';
                      default: return 'border-l-4 border-gray-500 bg-gray-50';
                    }
                  };

                  const getStatusColor = () => {
                    switch (activity.status) {
                      case 'completed':
                      case 'success':
                      case 'delivered':
                      case 'active':
                        return 'bg-green-100 text-green-800';
                      case 'processing':
                      case 'pending_review':
                      case 'under_review':
                        return 'bg-yellow-100 text-yellow-800';
                      case 'blocked':
                      case 'failed':
                        return 'bg-red-100 text-red-800';
                      default:
                        return 'bg-gray-100 text-gray-800';
                    }
                  };

                  const getCategoryIcon = () => {
                    switch (activity.category) {
                      case 'transactions': return <DollarSign size={12} className="text-green-600" />;
                      case 'compliance': return <Gavel size={12} className="text-purple-600" />;
                      case 'authentication': return <Lock size={12} className="text-blue-600" />;
                      case 'security': return <Shield size={12} className="text-red-600" />;
                      case 'system': return <Monitor size={12} className="text-gray-600" />;
                      default: return <Activity size={12} className="text-gray-600" />;
                    }
                  };

                  return (
                    <div key={activity.id} className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${getPriorityColor()}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            {getActivityIcon()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{activity.description}</h4>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor()}`}>
                                  {activity.status.replace('_', ' ')}
                                </span>
                                <div className="flex items-center space-x-1">
                                  {getCategoryIcon()}
                                  <span className="text-xs text-gray-500 capitalize">{activity.category}</span>
                                </div>
                                {activity.amount && (
                                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                                    {activity.amount}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">{activity.details}</p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Monitor size={12} />
                                <span>{activity.device}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin size={12} />
                                <span>{activity.location}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock size={12} />
                                <span>{new Date(activity.timestamp).toLocaleString()}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        {activity.priority === 'critical' && (
                          <div className="ml-2">
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full font-medium">
                              CRITICAL
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More and Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing 12 of 1,247 activities
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200">
                    Previous
                  </button>
                  <span className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">1</span>
                  <span className="px-3 py-2 text-gray-600 rounded-lg text-sm">2</span>
                  <span className="px-3 py-2 text-gray-600 rounded-lg text-sm">3</span>
                  <span className="px-2 py-2 text-gray-600 text-sm">...</span>
                  <span className="px-3 py-2 text-gray-600 rounded-lg text-sm">104</span>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200">
                    Next
                  </button>
                </div>
              </div>

              {/* Activity Statistics */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Statistics (Last 30 Days)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Most Active Hours</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">9:00 AM - 11:00 AM:</span>
                        <span className="font-medium text-gray-900">23%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">2:00 PM - 4:00 PM:</span>
                        <span className="font-medium text-gray-900">19%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">7:00 PM - 9:00 PM:</span>
                        <span className="font-medium text-gray-900">15%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Activity Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Transactions:</span>
                        <span className="font-medium text-green-600">45%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Property Views:</span>
                        <span className="font-medium text-blue-600">28%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Authentication:</span>
                        <span className="font-medium text-orange-600">15%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Compliance:</span>
                        <span className="font-medium text-purple-600">12%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Device Usage</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Desktop (Chrome):</span>
                        <span className="font-medium text-gray-900">67%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Mobile (Safari):</span>
                        <span className="font-medium text-gray-900">28%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tablet:</span>
                        <span className="font-medium text-gray-900">5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Appearance & Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Monitor size={16} className="text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Theme</p>
                      <p className="text-sm text-gray-500">Choose your preferred color scheme</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                      className={`p-2 rounded-lg border transition-colors duration-200 ${
                        settings.appearance.theme === 'light'
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Sun size={16} />
                    </button>
                    <button
                      onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                      className={`p-2 rounded-lg border transition-colors duration-200 ${
                        settings.appearance.theme === 'dark'
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Moon size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Palette size={16} className="text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Compact Mode</p>
                      <p className="text-sm text-gray-500">Reduce spacing for more content</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.appearance.compactMode}
                      onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <Globe size={16} className="text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Language</p>
                      <p className="text-sm text-gray-500">Select your preferred language</p>
                    </div>
                  </div>
                  <select
                    value={settings.appearance.language}
                    onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
