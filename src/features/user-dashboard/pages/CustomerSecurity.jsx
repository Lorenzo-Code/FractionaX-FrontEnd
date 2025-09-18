import React, { useState } from 'react';
import { Shield, Key, Smartphone, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';

const CustomerSecurity = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600">Manage your account security and privacy settings</p>
      </div>

      {/* Security Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Account Verified</p>
              <p className="text-sm text-green-600">KYC completed</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">2FA Recommended</p>
              <p className="text-sm text-yellow-600">Enable for better security</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Strong Password</p>
              <p className="text-sm text-blue-600">Last updated 30 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
            <p className="text-gray-600 text-sm">Add an extra layer of security to your account</p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>
        {twoFactorEnabled && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-4">Scan the QR code with your authenticator app</p>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Show QR Code
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                Enter Code Manually
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSecurity;
