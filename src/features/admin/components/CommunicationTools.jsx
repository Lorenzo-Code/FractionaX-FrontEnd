import React, { useState, useEffect } from 'react';
import { smartFetch } from '../../../shared/utils';
import {
  FaSlack, FaHeadset, FaUsers, FaSearch, FaPaperPlane, FaInbox,
  FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaClock, FaFilter,
  FaUser, FaBroadcastTower, FaHistory, FaDownload,
  FaPlus, FaComments, FaSms, FaMailBulk, FaExclamationTriangle,
  FaCheckCircle, FaTimesCircle, FaCopy, FaFile, FaImage, FaExternalLinkAlt,
  FaCog, FaSync, FaKey, FaLink, FaUnlink, FaBell, FaEnvelope
} from 'react-icons/fa';

const CommunicationTools = () => {
  const [activeTab, setActiveTab] = useState('integrations');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Integration state
  const [integrationStatus, setIntegrationStatus] = useState({
    slack: { 
      connected: false, 
      workspace: '', 
      channels: [],
      botUser: null,
      teamInfo: null
    },
    helpScout: { 
      connected: false, 
      mailboxes: [], 
      conversations: [],
      user: null
    }
  });

  const [slackConfig, setSlackConfig] = useState({
    botToken: '',
    signingSecret: '',
    defaultChannel: '#general',
    webhookUrl: ''
  });

  const [helpScoutConfig, setHelpScoutConfig] = useState({
    appId: '',
    appSecret: '',
    accessToken: '',
    defaultMailbox: ''
  });

  const [slackMessages, setSlackMessages] = useState([]);
  const [helpScoutTickets, setHelpScoutTickets] = useState([]);

  useEffect(() => {
    fetchIntegrationStatus();
  }, []);

  const fetchIntegrationStatus = async () => {
    const token = localStorage.getItem('access_token');
    setLoading(true);
    
    try {
      const response = await smartFetch('/api/admin/integrations/status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setIntegrationStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch integration status:', err);
    } finally {
      setLoading(false);
    }
  };

  const connectSlack = async () => {
    if (!slackConfig.botToken) {
      setError('Bot token is required to connect Slack');
      return;
    }

    const token = localStorage.getItem('access_token');
    setLoading(true);

    try {
      const response = await smartFetch('/api/admin/integrations/slack/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(slackConfig),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Slack connected successfully!');
        fetchIntegrationStatus();
      } else {
        throw new Error(data.msg || 'Failed to connect Slack');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const connectHelpScout = async () => {
    if (!helpScoutConfig.accessToken) {
      setError('Access token is required to connect Help Scout');
      return;
    }

    const token = localStorage.getItem('access_token');
    setLoading(true);

    try {
      const response = await smartFetch('/api/admin/integrations/helpscout/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(helpScoutConfig),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Help Scout connected successfully!');
        fetchIntegrationStatus();
      } else {
        throw new Error(data.msg || 'Failed to connect Help Scout');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const disconnectIntegration = async (platform) => {
    const token = localStorage.getItem('access_token');
    setLoading(true);

    try {
      const response = await smartFetch(`/api/admin/integrations/${platform}/disconnect`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess(`${platform} disconnected successfully!`);
        fetchIntegrationStatus();
      } else {
        throw new Error(`Failed to disconnect ${platform}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendSlackMessage = async (channel, message) => {
    const token = localStorage.getItem('access_token');
    setLoading(true);

    try {
      const response = await smartFetch('/api/admin/integrations/slack/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ channel, message }),
      });

      if (response.ok) {
        setSuccess('Message sent to Slack successfully!');
      } else {
        throw new Error('Failed to send Slack message');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createHelpScoutTicket = async (subject, message, customerEmail) => {
    const token = localStorage.getItem('access_token');
    setLoading(true);

    try {
      const response = await smartFetch('/api/admin/integrations/helpscout/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, message, customerEmail }),
      });

      if (response.ok) {
        setSuccess('Help Scout ticket created successfully!');
      } else {
        throw new Error('Failed to create Help Scout ticket');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const IntegrationCard = ({ platform, config, onConnect, onDisconnect, connected, icon: Icon, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
            <Icon className={`text-${color}-600 text-2xl`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{platform}</h3>
            <p className="text-sm text-gray-500">
              {connected ? 'Connected' : 'Not connected'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400' : 'bg-gray-300'}`}></div>
          <span className={`text-sm font-medium ${connected ? 'text-green-600' : 'text-gray-500'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {!connected ? (
        <div className="space-y-4">
          {Object.entries(config).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type={key.includes('secret') || key.includes('token') ? 'password' : 'text'}
                value={value}
                onChange={(e) => {
                  if (platform === 'Slack') {
                    setSlackConfig(prev => ({ ...prev, [key]: e.target.value }));
                  } else {
                    setHelpScoutConfig(prev => ({ ...prev, [key]: e.target.value }));
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter ${key}...`}
              />
            </div>
          ))}
          <button
            onClick={onConnect}
            disabled={loading}
            className={`w-full px-4 py-2 bg-${color}-600 text-white rounded-md hover:bg-${color}-700 transition-colors disabled:opacity-50`}
          >
            <FaLink className="inline mr-2" />
            Connect {platform}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-600 mr-2" />
              <span className="text-green-800 font-medium">{platform} is connected and ready to use!</span>
            </div>
          </div>
          <button
            onClick={() => onDisconnect(platform.toLowerCase())}
            disabled={loading}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <FaUnlink className="inline mr-2" />
            Disconnect {platform}
          </button>
        </div>
      )}
    </div>
  );

  const QuickActionCard = ({ title, description, action, icon: Icon, color = 'blue', disabled = false }) => (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className={`text-${color}-600 text-xl`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          <button
            onClick={action}
            disabled={disabled || loading}
            className={`px-4 py-2 ${disabled ? 'bg-gray-300 text-gray-500' : `bg-${color}-600 text-white hover:bg-${color}-700`} rounded-md transition-colors disabled:opacity-50`}
          >
            <FaExternalLinkAlt className="inline mr-2" />
            {disabled ? 'Connect Integration First' : 'Open'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Communication Hub</h2>
          <p className="text-gray-600">Manage Slack and Help Scout integrations for customer support</p>
        </div>
        <button
          onClick={fetchIntegrationStatus}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          disabled={loading}
        >
          <FaSync className={loading ? 'animate-spin' : ''} />
          <span>Refresh Status</span>
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'integrations', label: 'Integrations', icon: FaCog },
            { id: 'slack', label: 'Slack Hub', icon: FaSlack },
            { id: 'helpscout', label: 'Help Scout', icon: FaHeadset },
            { id: 'quick-actions', label: 'Quick Actions', icon: FaBroadcastTower }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IntegrationCard
            platform="Slack"
            config={slackConfig}
            onConnect={connectSlack}
            onDisconnect={disconnectIntegration}
            connected={integrationStatus.slack.connected}
            icon={FaSlack}
            color="purple"
          />
          <IntegrationCard
            platform="Help Scout"
            config={helpScoutConfig}
            onConnect={connectHelpScout}
            onDisconnect={disconnectIntegration}
            connected={integrationStatus.helpScout.connected}
            icon={FaHeadset}
            color="blue"
          />
        </div>
      )}

      {/* Slack Hub Tab */}
      {activeTab === 'slack' && (
        <div className="space-y-6">
          {integrationStatus.slack.connected ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Workspace Info</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Workspace:</span> {integrationStatus.slack.workspace || 'Loading...'}</div>
                    <div><span className="font-medium">Bot User:</span> {integrationStatus.slack.botUser || 'Loading...'}</div>
                    <div><span className="font-medium">Channels:</span> {integrationStatus.slack.channels?.length || 0} available</div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => window.open('https://slack.com', '_blank')}
                      className="w-full px-4 py-2 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <FaSlack className="text-purple-600" />
                      <span>Open Slack Workspace</span>
                      <FaExternalLinkAlt className="text-gray-400 ml-auto" />
                    </button>
                    <button className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2">
                      <FaCog className="text-gray-600" />
                      <span>Manage Bot Settings</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="text-sm text-gray-500">
                    No recent Slack activity to show.
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Send Test Message</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select className="px-3 py-2 border rounded-lg">
                    <option value="#general">#general</option>
                    <option value="#support">#support</option>
                    <option value="#alerts">#alerts</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Enter your message..."
                    className="px-3 py-2 border rounded-lg col-span-1 md:col-span-2"
                  />
                </div>
                <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <FaPaperPlane className="inline mr-2" />
                  Send to Slack
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FaSlack className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Slack Not Connected</h3>
              <p className="text-gray-500 mb-4">Connect your Slack workspace to start using Slack features.</p>
              <button
                onClick={() => setActiveTab('integrations')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Connect Slack
              </button>
            </div>
          )}
        </div>
      )}

      {/* Help Scout Tab */}
      {activeTab === 'helpscout' && (
        <div className="space-y-6">
          {integrationStatus.helpScout.connected ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Account Info</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">User:</span> {integrationStatus.helpScout.user || 'Loading...'}</div>
                    <div><span className="font-medium">Mailboxes:</span> {integrationStatus.helpScout.mailboxes?.length || 0} available</div>
                    <div><span className="font-medium">Active Conversations:</span> {integrationStatus.helpScout.conversations?.length || 0}</div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => window.open('https://secure.helpscout.net', '_blank')}
                      className="w-full px-4 py-2 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <FaHeadset className="text-blue-600" />
                      <span>Open Help Scout</span>
                      <FaExternalLinkAlt className="text-gray-400 ml-auto" />
                    </button>
                    <button className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2">
                      <FaPlus className="text-gray-600" />
                      <span>Create New Ticket</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Recent Tickets</h3>
                  <div className="text-sm text-gray-500">
                    No recent tickets to show.
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Create Support Ticket</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="email"
                    placeholder="Customer email..."
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Subject..."
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>
                <textarea
                  placeholder="Message content..."
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg mb-4"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FaPlus className="inline mr-2" />
                  Create Ticket
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FaHeadset className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Help Scout Not Connected</h3>
              <p className="text-gray-500 mb-4">Connect your Help Scout account to manage customer support.</p>
              <button
                onClick={() => setActiveTab('integrations')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect Help Scout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions Tab */}
      {activeTab === 'quick-actions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickActionCard
            title="Broadcast Alert"
            description="Send important alerts to all team members via Slack"
            action={() => console.log('Broadcast alert')}
            icon={FaBroadcastTower}
            color="red"
            disabled={!integrationStatus.slack.connected}
          />
          
          <QuickActionCard
            title="Customer Support Summary"
            description="Get a summary of recent Help Scout tickets and trends"
            action={() => console.log('Support summary')}
            icon={FaHeadset}
            color="blue"
            disabled={!integrationStatus.helpScout.connected}
          />
          
          <QuickActionCard
            title="Team Notification"
            description="Send updates about platform changes to the team"
            action={() => console.log('Team notification')}
            icon={FaUsers}
            color="green"
            disabled={!integrationStatus.slack.connected}
          />
          
          <QuickActionCard
            title="Escalate Issue"
            description="Quickly escalate a user issue to both Slack and Help Scout"
            action={() => console.log('Escalate issue')}
            icon={FaExclamationTriangle}
            color="yellow"
            disabled={!integrationStatus.slack.connected || !integrationStatus.helpScout.connected}
          />
        </div>
      )}
    </div>
  );
};

export default CommunicationTools;
