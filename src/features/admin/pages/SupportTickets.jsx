import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supportTicketService from '../services/supportTicketService';
import { UserEmailAutocomplete } from '../../../shared/components';
import { toast } from 'react-toastify';
import {
  FaTicketAlt, FaSlack, FaHeadset, FaUser, FaSearch, FaFilter,
  FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaClock,
  FaComments, FaEnvelope, FaArchive, FaExclamationTriangle,
  FaCheckCircle, FaTimesCircle, FaSync, FaDownload, FaTag,
  FaStar, FaReply, FaForward, FaUserTie, FaCalendar, FaHistory,
  FaTasks, FaListAlt, FaBell, FaLock, FaPhone, FaMapMarker,
  FaCreditCard, FaBuilding
} from 'react-icons/fa';

const SupportTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Admin todos state
  const [apiTodos, setApiTodos] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    source: 'all',
    dateRange: '7d'
  });

  // Integration status
  const [integrationStatus, setIntegrationStatus] = useState({
    helpScout: false,
    slack: false
  });

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    avgResponseTime: '0h',
    avgResolutionTime: '0h'
  });

  // Create ticket form state
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    customerEmail: '',
    priority: 'medium',
    category: 'general',
    assignedTo: '',
    tags: []
  });

  useEffect(() => {
    fetchTickets();
    fetchIntegrationStatus();
    fetchStatistics();
    fetchAdminTodos();
  }, [filters, searchQuery]);

  // Lock/unlock body scroll when modals are open (more targeted approach)
  useEffect(() => {
    if (showTicketModal || showCreateModal) {
      // Store original values
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Only lock scroll if body doesn't already have overflow styling
      if (!originalOverflow || originalOverflow === 'auto' || originalOverflow === 'visible') {
        document.body.style.overflow = 'hidden';
        
        // Check if scrollbar is present before adding padding
        const hasScrollbar = document.documentElement.scrollHeight > document.documentElement.clientHeight;
        if (hasScrollbar) {
          document.body.style.paddingRight = '15px';
        }
      }

      // Cleanup function for this specific effect
      return () => {
        // Only reset if we actually changed it
        if (!originalOverflow || originalOverflow === 'auto' || originalOverflow === 'visible') {
          document.body.style.overflow = originalOverflow || '';
          document.body.style.paddingRight = originalPaddingRight || '';
        }
      };
    }
  }, [showTicketModal, showCreateModal]);
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Reset body styles when component unmounts, but be gentle
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
      }
      if (document.body.style.paddingRight === '15px') {
        document.body.style.paddingRight = '';
      }
    };
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    
    try {
      const data = await supportTicketService.getTickets({
        ...filters,
        search: searchQuery,
        page: 1,
        limit: 50
      });
      
      setTickets(data.tickets || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchIntegrationStatus = async () => {
    try {
      const status = await supportTicketService.getIntegrationStatus();
      setIntegrationStatus({
        helpScout: status.helpScout,
        slack: status.slack
      });
    } catch (err) {
      console.error('Failed to fetch integration status:', err);
    }
  };

  const fetchStatistics = async () => {
    try {
      const statistics = await supportTicketService.getStatistics();
      setStats(statistics);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };

  const createTicket = async () => {
    if (!newTicket.subject || !newTicket.description || !newTicket.customerEmail) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      await supportTicketService.createTicket(newTicket);
      setSuccess('Support ticket created successfully!');
      setShowCreateModal(false);
      setNewTicket({
        subject: '',
        description: '',
        customerEmail: '',
        priority: 'medium',
        category: 'general',
        assignedTo: '',
        tags: []
      });
      fetchTickets();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await supportTicketService.updateTicketStatus(ticketId, newStatus);
      setSuccess(`Ticket status updated to ${newStatus}`);
      fetchTickets();
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const assignTicket = async (ticketId, assigneeId) => {
    try {
      await supportTicketService.assignTicket(ticketId, assigneeId);
      setSuccess('Ticket assigned successfully');
      fetchTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const addTicketComment = async (ticketId, comment) => {
    try {
      await supportTicketService.addComment(ticketId, comment);
      setSuccess('Comment added successfully');
      // Refresh ticket details if modal is open
      if (selectedTicket && selectedTicket.id === ticketId) {
        fetchTicketDetails(ticketId);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const addSupportNote = async (ticketId, note, isPrivate) => {
    try {
      await supportTicketService.addSupportNote(ticketId, note, isPrivate);
      setSuccess('Support note added successfully');
      // Refresh ticket details if modal is open
      if (selectedTicket && selectedTicket.id === ticketId) {
        fetchTicketDetails(ticketId);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      const ticket = await supportTicketService.getTicket(ticketId);
      setSelectedTicket(ticket);
    } catch (err) {
      setError(err.message);
    }
  };

  const syncWithHelpScout = async () => {
    setLoading(true);

    try {
      await supportTicketService.syncWithHelpScout();
      setSuccess('Synchronized with Help Scout successfully');
      fetchTickets();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin todos from API
  const fetchAdminTodos = async () => {
    try {
      const todos = await supportTicketService.getAdminTodos();
      setApiTodos(todos);
    } catch (error) {
      console.error('Failed to fetch admin todos:', error);
      toast.error('Failed to load admin todos');
    }
  };

  // Handle user selection from autocomplete
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setNewTicket(prev => ({ ...prev, customerEmail: user.email }));
  };

  // Reset create modal
  const resetCreateModal = () => {
    setNewTicket({
      subject: '',
      description: '',
      customerEmail: '',
      priority: 'medium',
      category: 'general',
      assignedTo: '',
      tags: []
    });
    setSelectedUser(null);
    setShowCreateModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'waiting_customer': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-purple-600 bg-purple-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === 'open' && ticket.status !== 'open') return false;
    if (activeTab === 'in_progress' && ticket.status !== 'in_progress') return false;
    if (activeTab === 'resolved' && ticket.status !== 'resolved') return false;
    if (activeTab === 'closed' && ticket.status !== 'closed') return false;
    return true;
  });

  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`text-${color}-600 text-xl`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
          <p className="text-gray-600">Manage customer support tickets and integrations</p>
        </div>
        <div className="flex items-center space-x-3">
          {integrationStatus.helpScout && (
            <button
              onClick={syncWithHelpScout}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              disabled={loading}
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              <span>Sync Help Scout</span>
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <FaPlus />
            <span>Create Ticket</span>
          </button>
        </div>
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

      {/* Integration Status */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Integration Status</h3>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <FaHeadset className={`text-xl ${integrationStatus.helpScout ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-sm">
              Help Scout: {integrationStatus.helpScout ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FaSlack className={`text-xl ${integrationStatus.slack ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-sm">
              Slack: {integrationStatus.slack ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tickets" value={stats.total} icon={FaTicketAlt} color="blue" />
        <StatCard title="Open Tickets" value={stats.open} icon={FaExclamationTriangle} color="red" />
        <StatCard title="In Progress" value={stats.inProgress} icon={FaClock} color="yellow" />
        <StatCard title="Resolved" value={stats.resolved} icon={FaCheckCircle} color="green" />
      </div>

      {/* Admin Todos Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FaTasks className="text-blue-600 text-xl" />
            <h3 className="text-lg font-semibold text-gray-900">Admin To-Do Items</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
              {apiTodos.length} {apiTodos.length === 1 ? 'item' : 'items'}
            </span>
            <button
              onClick={() => navigate('/admin/todos')}
              className="px-3 py-1 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <FaListAlt className="text-xs" />
              <span>View All</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {apiTodos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaCheckCircle className="mx-auto text-4xl mb-2 text-green-400" />
              <p className="text-lg font-medium mb-1">All caught up!</p>
              <p className="text-sm">No pending admin tasks at the moment.</p>
            </div>
          ) : (
            <>
              {apiTodos.slice(0, 5).map((todo, index) => (
                <div
                  key={todo.id || index}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    todo.priority === 'high' ? 'bg-red-400' :
                    todo.priority === 'medium' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {todo.title || todo.task || 'Untitled Task'}
                        </h4>
                        {todo.description && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {todo.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          {todo.category && (
                            <span className="px-2 py-1 bg-white rounded text-gray-600 font-medium">
                              {todo.category}
                            </span>
                          )}
                          {todo.dueDate && (
                            <span className="flex items-center space-x-1">
                              <FaCalendar />
                              <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
                            </span>
                          )}
                          {todo.assignedTo && (
                            <span className="flex items-center space-x-1">
                              <FaUserTie />
                              <span>{todo.assignedTo}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-3">
                        {todo.priority && (
                          <span className={`text-xs px-2 py-1 rounded font-medium ${
                            todo.priority === 'high' ? 'bg-red-100 text-red-700' :
                            todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {todo.priority}
                          </span>
                        )}
                        
                        {todo.urgent && (
                          <span className="flex items-center space-x-1 text-red-600">
                            <FaBell className="text-xs" />
                            <span className="text-xs font-medium">Urgent</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {apiTodos.length > 5 && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => navigate('/admin/todos')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 mx-auto"
                  >
                    <span>View {apiTodos.length - 5} more todos</span>
                    <FaHistory className="text-xs" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets by subject, customer, or ticket ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting_customer">Waiting Customer</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', label: 'All Tickets', count: stats.total },
            { id: 'open', label: 'Open', count: stats.open },
            { id: 'in_progress', label: 'In Progress', count: stats.inProgress },
            { id: 'resolved', label: 'Resolved', count: stats.resolved },
            { id: 'closed', label: 'Closed', count: stats.closed }
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
              <span>{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading tickets...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No tickets found
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr 
                    key={ticket.id || ticket._id || ticket.ticketNumber} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setShowTicketModal(true);
                      fetchTicketDetails(ticket.id || ticket._id);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                          <span>#{ticket.ticketNumber}</span>
                          {ticket.priority === 'urgent' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              🚨 URGENT
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {ticket.subject}
                        </div>
                        {ticket.lastResponse && (
                          <div className="text-xs text-gray-400 mt-1">
                            Last response: {new Date(ticket.lastResponse).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                            ticket.customerStatus === 'verified' ? 'bg-green-500' :
                            ticket.customerStatus === 'premium' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`}>
                            {ticket.customerName ? ticket.customerName.charAt(0).toUpperCase() : '?'}
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                            <span>{ticket.customerName || 'Unknown'}</span>
                            {ticket.customerStatus === 'verified' && (
                              <span className="text-green-500" title="Verified Customer">
                                <FaCheckCircle className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {ticket.customerEmail}
                          </div>
                          {ticket.lastLogin && (
                            <div className="text-xs text-gray-400">
                              Last seen: {new Date(ticket.lastLogin).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUserTie className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {ticket.assignedTo || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendar className="mr-1" />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowTicketModal(true);
                            fetchTicketDetails(ticket.id);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTicketStatus(ticket.id, 'resolved');
                            }}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Mark as Resolved"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <select
                          value={ticket.assignedTo || ''}
                          onChange={(e) => {
                            e.stopPropagation();
                            assignTicket(ticket.id, e.target.value);
                          }}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          title="Assign Ticket"
                        >
                          <option value="">Assign...</option>
                          <option value="support">Support</option>
                          <option value="technical">Technical</option>
                          <option value="billing">Billing</option>
                          <option value="compliance">Compliance</option>
                        </select>
                        {integrationStatus.slack && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Open Slack thread for ticket', ticket.id);
                            }}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                            title="Open Slack Thread"
                          >
                            <FaSlack />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full m-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create Support Ticket</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Email *
                  </label>
                  <UserEmailAutocomplete
                    value={newTicket.customerEmail}
                    onChange={(email) => setNewTicket(prev => ({ ...prev, customerEmail: email }))}
                    onUserSelect={handleUserSelect}
                    placeholder="Start typing customer email or search by name..."
                    disabled={loading}
                  />
                  
                  {/* Selected User Info */}
                  {selectedUser && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Selected User: {selectedUser.fullName || selectedUser.email}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                              selectedUser.role === 'premium' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {selectedUser.role}
                            </span>
                            <span className={`w-2 h-2 rounded-full ${
                              selectedUser.isEmailVerified ? 'bg-green-400' : 'bg-orange-400'
                            }`} title={selectedUser.isEmailVerified ? 'Email verified' : 'Email not verified'} />
                            <span className="text-xs text-green-600">ID: {selectedUser.id}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedUser(null);
                            setNewTicket(prev => ({ ...prev, customerEmail: '' }));
                          }}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Detailed description of the issue"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">General Support</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing</option>
                      <option value="account">Account</option>
                      <option value="property">Property</option>
                      <option value="investment">Investment</option>
                      <option value="tokens">Tokens</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign To
                  </label>
                  <select
                    value={newTicket.assignedTo}
                    onChange={(e) => setNewTicket({ ...newTicket, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Unassigned</option>
                    <option value="support">Support Team</option>
                    <option value="technical">Technical Team</option>
                    <option value="billing">Billing Team</option>
                    <option value="compliance">Compliance Team</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createTicket}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full m-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ticket #{selectedTicket.ticketNumber}
                  </h3>
                  <p className="text-gray-600">{selectedTicket.subject}</p>
                </div>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Ticket Details */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Description</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FaClock />
                        <span>Response Time: {selectedTicket.responseTime || 'N/A'}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{selectedTicket.description}</p>
                    
                    {/* Tags */}
                    {selectedTicket.tags && selectedTicket.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedTicket.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            <FaTag className="mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Customer Correspondence History */}
                  <div className="bg-white border rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <FaEnvelope className="mr-2 text-blue-600" />
                      Customer Correspondence
                    </h4>
                    {selectedTicket.correspondence && selectedTicket.correspondence.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedTicket.correspondence.map((message, index) => (
                          <div key={index} className={`p-3 rounded-lg ${
                            message.direction === 'incoming' ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-green-50 border-l-4 border-green-400'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {message.direction === 'incoming' ? 'From Customer' : 'To Customer'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(message.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{message.content}</p>
                            {message.channel && (
                              <span className="text-xs text-gray-500 mt-1 block">via {message.channel}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No correspondence history available</p>
                    )}
                  </div>

                  {/* Support Notes */}
                  <div className="bg-white border rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <FaComments className="mr-2 text-green-600" />
                      Internal Support Notes
                    </h4>
                    {selectedTicket.supportNotes && selectedTicket.supportNotes.length > 0 ? (
                      <div className="space-y-3">
                        {selectedTicket.supportNotes.map((note, index) => (
                          <div key={index} className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">{note.author}</span>
                              <span className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-700">{note.content}</p>
                            {note.isPrivate && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-2">
                                <FaLock className="mr-1" /> Private Note
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No internal notes available</p>
                    )}
                    
                    {/* Add Support Note */}
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="font-medium mb-2">Add Internal Note</h5>
                      <textarea
                        id="support-note"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add internal support note (not visible to customer)..."
                      />
                      <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" id="private-note" />
                          <span className="text-sm text-gray-600">Mark as private</span>
                        </label>
                        <button
                          onClick={() => {
                            const textarea = document.getElementById('support-note');
                            const privateCheckbox = document.getElementById('private-note');
                            if (textarea.value.trim()) {
                              addSupportNote(selectedTicket.id, textarea.value, privateCheckbox.checked);
                              textarea.value = '';
                              privateCheckbox.checked = false;
                            }
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                        >
                          Add Note
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Activity Timeline */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center">
                      <FaHistory className="mr-2 text-purple-600" />
                      Activity Timeline
                    </h4>
                    {selectedTicket.comments && selectedTicket.comments.length > 0 ? (
                      selectedTicket.comments.map((comment, index) => (
                        <div key={index} className="bg-white border rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                              comment.type === 'status_change' ? 'bg-blue-500' :
                              comment.type === 'assignment' ? 'bg-green-500' :
                              comment.type === 'comment' ? 'bg-gray-500' :
                              'bg-purple-500'
                            }`}>
                              {comment.type === 'status_change' ? '📋' :
                               comment.type === 'assignment' ? '👤' :
                               comment.type === 'comment' ? '💬' : '🔄'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-900">{comment.author}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{comment.content}</p>
                              {comment.type && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-2 ${
                                  comment.type === 'status_change' ? 'bg-blue-100 text-blue-800' :
                                  comment.type === 'assignment' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {comment.type.replace('_', ' ').toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No activity yet</p>
                    )}

                    {/* Add Comment */}
                    <div className="bg-white border rounded-lg p-4">
                      <h5 className="font-medium mb-2">Add Public Comment</h5>
                      <textarea
                        id="public-comment"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add your comment (visible to customer)..."
                      />
                      <button
                        onClick={() => {
                          const textarea = document.getElementById('public-comment');
                          if (textarea.value.trim()) {
                            addTicketComment(selectedTicket.id, textarea.value);
                            textarea.value = '';
                          }
                        }}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Add Comment
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Ticket Meta Information */}
                  <div className="bg-white border rounded-lg p-4 space-y-4">
                    <h4 className="font-semibold flex items-center">
                      <FaTicketAlt className="mr-2 text-blue-600" />
                      Ticket Information
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="waiting_customer">Waiting Customer</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                      <select
                        value={selectedTicket.assignedTo || ''}
                        onChange={(e) => assignTicket(selectedTicket.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Unassigned</option>
                        <option value="support">Support Team</option>
                        <option value="technical">Technical Team</option>
                        <option value="billing">Billing Team</option>
                        <option value="compliance">Compliance Team</option>
                      </select>
                    </div>

                    {/* Enhanced Customer Information */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Customer Information</label>
                      <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                            selectedTicket.customerStatus === 'verified' ? 'bg-green-500' :
                            selectedTicket.customerStatus === 'premium' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`}>
                            {selectedTicket.customerName ? selectedTicket.customerName.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{selectedTicket.customerName || 'Unknown User'}</p>
                            <p className="text-xs text-gray-600">{selectedTicket.customerEmail}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-1">
                            <FaUser className="text-gray-400" />
                            <span>ID: {selectedTicket.customerId || 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaCheckCircle className={selectedTicket.customerStatus === 'verified' ? 'text-green-500' : 'text-gray-400'} />
                            <span>{selectedTicket.customerStatus || 'Basic'}</span>
                          </div>
                          {selectedTicket.customerPhone && (
                            <div className="flex items-center space-x-1">
                              <FaPhone className="text-gray-400" />
                              <span>{selectedTicket.customerPhone}</span>
                            </div>
                          )}
                          {selectedTicket.customerLocation && (
                            <div className="flex items-center space-x-1">
                              <FaMapMarker className="text-gray-400" />
                              <span>{selectedTicket.customerLocation}</span>
                            </div>
                          )}
                          {selectedTicket.lastLogin && (
                            <div className="flex items-center space-x-1">
                              <FaClock className="text-gray-400" />
                              <span>Last seen: {new Date(selectedTicket.lastLogin).toLocaleDateString()}</span>
                            </div>
                          )}
                          {selectedTicket.customerTier && (
                            <div className="flex items-center space-x-1">
                              <FaCreditCard className="text-gray-400" />
                              <span>{selectedTicket.customerTier} tier</span>
                            </div>
                          )}
                          {selectedTicket.totalTickets && (
                            <div className="flex items-center space-x-1">
                              <FaTicketAlt className="text-gray-400" />
                              <span>{selectedTicket.totalTickets} tickets</span>
                            </div>
                          )}
                          {selectedTicket.customerCompany && (
                            <div className="flex items-center space-x-1 col-span-2">
                              <FaBuilding className="text-gray-400" />
                              <span>{selectedTicket.customerCompany}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Customer Notes */}
                        {selectedTicket.customerNotes && (
                          <div className="mt-3 pt-2 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-1">Customer Notes:</p>
                            <p className="text-xs text-gray-600 italic">{selectedTicket.customerNotes}</p>
                          </div>
                        )}
                        
                        {/* Quick Actions */}
                        <div className="mt-3 pt-2 border-t border-gray-200 flex space-x-2">
                          <button 
                            onClick={() => console.log('View customer profile:', selectedTicket.customerId)}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            View Profile
                          </button>
                          <button 
                            onClick={() => console.log('View customer tickets:', selectedTicket.customerId)}
                            className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          >
                            All Tickets
                          </button>
                          {selectedTicket.customerEmail && (
                            <button 
                              onClick={() => window.location.href = `mailto:${selectedTicket.customerEmail}`}
                              className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                            >
                              Email
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedTicket.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {selectedTicket.slackThreadId && integrationStatus.slack && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slack Thread</label>
                        <button
                          onClick={() => window.open(`https://slack.com/app_redirect?channel=${selectedTicket.slackThreadId}`, '_blank')}
                          className="w-full px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <FaSlack />
                          <span>Open Thread</span>
                        </button>
                      </div>
                    )}

                    {selectedTicket.helpScoutId && integrationStatus.helpScout && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Help Scout</label>
                        <button
                          onClick={() => window.open(`https://secure.helpscout.net/conversation/${selectedTicket.helpScoutId}`, '_blank')}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <FaHeadset />
                          <span>View in Help Scout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
