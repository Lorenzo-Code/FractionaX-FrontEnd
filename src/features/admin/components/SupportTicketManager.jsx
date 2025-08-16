// src/features/admin/components/SupportTicketManager.jsx
import React, { useState, useEffect } from 'react';
import supportTicketService from '../services/supportTicketService';
import { UserEmailAutocomplete } from '../../../shared/components';
import { toast } from 'react-toastify';

const SupportTicketManager = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTicketData, setCreateTicketData] = useState({
    customerEmail: '',
    subject: '',
    description: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await supportTicketService.getTickets(filters);
      setTickets(data.tickets || []);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyToTicket = async () => {
    if (!selectedTicket || !replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      setLoading(true);
      await supportTicketService.replyToTicket(selectedTicket.id, replyText.trim());
      toast.success('Reply sent successfully and posted to Slack!');
      setShowReplyModal(false);
      setReplyText('');
      setSelectedTicket(null);
      await fetchTickets(); // Refresh tickets
    } catch (error) {
      console.error('Failed to reply to ticket:', error);
      toast.error('Failed to send reply: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!createTicketData.customerEmail.trim()) {
      toast.error('Please enter a customer email');
      return;
    }
    if (!createTicketData.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    if (!createTicketData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    try {
      setLoading(true);
      const result = await supportTicketService.createTicket(createTicketData);
      toast.success(`Ticket #${result.ticket.id} created successfully!`);
      
      if (result.slackThreadId) {
        toast.success('Slack thread created for team collaboration');
      }
      
      // Reset form and close modal
      setCreateTicketData({
        customerEmail: '',
        subject: '',
        description: ''
      });
      setSelectedUser(null);
      setShowCreateModal(false);
      
      // Refresh tickets list
      await fetchTickets();
    } catch (error) {
      console.error('Failed to create ticket:', error);
      toast.error('Failed to create ticket: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setCreateTicketData(prev => ({
      ...prev,
      customerEmail: user.email
    }));
  };

  const resetCreateModal = () => {
    setCreateTicketData({
      customerEmail: '',
      subject: '',
      description: ''
    });
    setSelectedUser(null);
    setShowCreateModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-orange-600 bg-orange-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🎫 Support Ticket Management</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Ticket
          </button>
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search tickets..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Loading support tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No support tickets found matching your filters.</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-800">
                      #{ticket.id} - {ticket.subject}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status || 'Open'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority || 'Medium'} Priority
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{ticket.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📧 {ticket.customerEmail}</span>
                    <span>📅 {new Date(ticket.createdAt).toLocaleString()}</span>
                    {ticket.slackThreadId && (
                      <span className="text-green-600">
                        💬 Slack Thread: {ticket.slackThreadId}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setShowReplyModal(true);
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    📝 Reply
                  </button>
                  <button
                    onClick={() => {
                      // Future: View ticket details
                      toast.info('Ticket details view coming soon!');
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    👁️ View
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4">
              📝 Reply to Ticket #{selectedTicket.id}
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Subject:</strong> {selectedTicket.subject}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Customer:</strong> {selectedTicket.customerEmail}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Status:</strong> {selectedTicket.status || 'Open'}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply *
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here. This will be posted to Slack and sent to the customer."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                  setSelectedTicket(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReplyToTicket}
                disabled={loading || !replyText.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reply to Slack'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Support Ticket
              </h3>
              <button
                onClick={resetCreateModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Email with Autocomplete */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email *
                </label>
                <UserEmailAutocomplete
                  value={createTicketData.customerEmail}
                  onChange={(email) => setCreateTicketData(prev => ({ ...prev, customerEmail: email }))}
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
                          setCreateTicketData(prev => ({ ...prev, customerEmail: '' }));
                        }}
                        className="text-green-600 hover:text-green-800 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={createTicketData.subject}
                  onChange={(e) => setCreateTicketData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter ticket subject..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  disabled={loading}
                  maxLength={200}
                />
                <div className="mt-1 text-xs text-gray-500">
                  {createTicketData.subject.length}/200 characters
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={6}
                  value={createTicketData.description}
                  onChange={(e) => setCreateTicketData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the issue or request in detail..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-vertical min-h-[120px]"
                  disabled={loading}
                  maxLength={2000}
                />
                <div className="mt-1 text-xs text-gray-500 flex justify-between">
                  <span>{createTicketData.description.length}/2000 characters</span>
                  <span>This will automatically create a Slack thread for team collaboration</span>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={resetCreateModal}
                  disabled={loading}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTicket}
                  disabled={loading || !createTicketData.customerEmail.trim() || !createTicketData.subject.trim() || !createTicketData.description.trim()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Create Ticket & Slack Thread
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketManager;
