/**
 * Support Ticket API Service
 * Manages support ticket operations with Slack integration
 * Handles ticket lifecycle: creation → Slack thread → resolution
 * Updated to match the new admin API endpoints
 */

import { smartFetch } from '../../../shared/utils';

class SupportTicketService {
  constructor() {
    this.baseUrl = '/api/admin/support-tickets';
    this.oldBaseUrl = '/api/admin/support';
    this.todosUrl = '/api/admin/todos';
    this.integrationsUrl = '/api/admin/integrations';
  }

  // ===== TICKET MANAGEMENT =====

  /**
   * Get all support tickets with filtering and pagination
   */
  async getTickets(filters = {}) {
    const token = localStorage.getItem('access_token');
    const queryParams = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 50,
      ...(filters.search && { search: filters.search }),
      ...(filters.status && filters.status !== 'all' && { status: filters.status }),
      ...(filters.priority && filters.priority !== 'all' && { priority: filters.priority }),
      ...(filters.assignedTo && filters.assignedTo !== 'all' && { assignedTo: filters.assignedTo }),
      ...(filters.source && filters.source !== 'all' && { source: filters.source }),
      ...(filters.dateRange && { dateRange: filters.dateRange }),
      ...(filters.category && { category: filters.category })
    });

    try {
      const response = await smartFetch(`${this.baseUrl}?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to fetch tickets');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to fetch support tickets:', error);
      throw error;
    }
  }

  /**
   * Get specific ticket details with comments and history
   */
  async getTicket(ticketId) {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to fetch ticket details');
      }

      return data.ticket;
    } catch (error) {
      console.error('❌ Failed to fetch ticket details:', error);
      throw error;
    }
  }

  /**
   * Create new support ticket
   * Automatically creates Slack thread for collaboration
   */
  async createTicket(ticketData) {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerEmail: ticketData.customerEmail,
          subject: ticketData.subject,
          description: ticketData.description
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.msg || 'Failed to create ticket');
      }

      return {
        ticket: data.ticket,
        slackThreadId: data.slackThreadId
      };
    } catch (error) {
      console.error('❌ Failed to create support ticket:', error);
      throw error;
    }
  }

  /**
   * Update ticket status
   * When resolved, automatically archives Slack thread
   */
  async updateTicketStatus(ticketId, status, notes = '') {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status, 
          notes,
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to update ticket status');
      }

      return data.ticket;
    } catch (error) {
      console.error('❌ Failed to update ticket status:', error);
      throw error;
    }
  }

  /**
   * Update ticket priority
   */
  async updateTicketPriority(ticketId, priority) {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/${ticketId}/priority`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to update ticket priority');
      }

      return data.ticket;
    } catch (error) {
      console.error('❌ Failed to update ticket priority:', error);
      throw error;
    }
  }

  /**
   * Assign ticket to team member
   */
  async assignTicket(ticketId, assignedTo, notes = '') {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/${ticketId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          assignedTo, 
          notes,
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to assign ticket');
      }

      return data.ticket;
    } catch (error) {
      console.error('❌ Failed to assign ticket:', error);
      throw error;
    }
  }

  /**
   * Add comment to a ticket (public comment visible to customer)
   */
  async addComment(ticketId, comment) {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/${ticketId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          comment,
          isInternal: false 
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.msg || 'Failed to add comment');
      }

      return data.ticket;
    } catch (error) {
      console.error('❌ Failed to add comment:', error);
      throw error;
    }
  }

  /**
   * Add internal support note (not visible to customer)
   */
  async addSupportNote(ticketId, note, isPrivate = false) {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/${ticketId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          note,
          isPrivate
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.msg || 'Failed to add support note');
      }

      return data.ticket;
    } catch (error) {
      console.error('❌ Failed to add support note:', error);
      throw error;
    }
  }

  /**
   * Reply to existing support ticket
   * Posts reply to Slack thread and updates ticket status
   */
  async replyToTicket(ticketId, reply) {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/reply/${ticketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to reply to ticket');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to reply to ticket:', error);
      throw error;
    }
  }

  /**
   * Get ticket comments with Helper Scout and Slack sync status
   */
  async getTicketComments(ticketId) {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/${ticketId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to fetch comments');
      }

      return data.comments;
    } catch (error) {
      console.error('❌ Failed to fetch comments:', error);
      throw error;
    }
  }

  /**
   * Delete ticket (archive)
   */
  async deleteTicket(ticketId, reason = '') {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || 'Failed to delete ticket');
      }

      return true;
    } catch (error) {
      console.error('❌ Failed to delete ticket:', error);
      throw error;
    }
  }

  // ===== STATISTICS AND ANALYTICS =====

  /**
   * Get support ticket statistics
   */
  async getStatistics(timeRange = '30d') {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/statistics?timeRange=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.msg || 'Failed to fetch statistics');
      }

      // Return the statistics with fallback values if not present
      return {
        total: data.total || 0,
        open: data.open || 0,
        inProgress: data.inProgress || 0,
        waitingCustomer: data.waitingCustomer || 0,
        resolved: data.resolved || 0,
        closed: data.closed || 0,
        overdue: data.overdue || 0,
        avgResponseTime: data.avgResponseTimeFormatted || '0h 0m',
        avgResolutionTime: data.avgResolutionTimeFormatted || '0h 0m',
        ...data
      };
    } catch (error) {
      console.error('❌ Failed to fetch statistics:', error);
      // Return fallback statistics instead of throwing
      return {
        total: 0,
        open: 0,
        inProgress: 0,
        waitingCustomer: 0,
        resolved: 0,
        closed: 0,
        overdue: 0,
        avgResponseTime: '0h 0m',
        avgResolutionTime: '0h 0m'
      };
    }
  }

  /**
   * Get ticket analytics dashboard data
   */
  async getAnalytics(timeRange = '7d') {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/analytics?timeRange=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to fetch analytics');
      }

      return data.analytics;
    } catch (error) {
      console.error('❌ Failed to fetch analytics:', error);
      throw error;
    }
  }

  // ===== INTEGRATION MANAGEMENT =====

  /**
   * Get integration status for Helper Scout and Slack
   */
  async getIntegrationStatus() {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/integration-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to fetch integration status');
      }

      return {
        helpScout: data.helpScout || false,
        slack: data.slack || false,
        integrationDetails: data
      };
    } catch (error) {
      console.error('❌ Failed to fetch integration status:', error);
      return { helpScout: false, slack: false, integrationDetails: null };
    }
  }

  /**
   * Sync with Helper Scout
   * Fetches latest conversations and creates/updates tickets
   */
  async syncWithHelpScout() {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/sync/helpscout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to sync with Help Scout');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to sync with Help Scout:', error);
      throw error;
    }
  }

  /**
   * Sync with Slack
   * Updates ticket status based on Slack thread activity
   */
  async syncWithSlack() {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/sync/slack`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to sync with Slack');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to sync with Slack:', error);
      throw error;
    }
  }

  /**
   * Create Slack thread for existing ticket
   */
  async createSlackThread(ticketId) {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/${ticketId}/slack-thread`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to create Slack thread');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to create Slack thread:', error);
      throw error;
    }
  }

  /**
   * Archive Slack thread (when ticket is resolved)
   */
  async archiveSlackThread(ticketId) {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/${ticketId}/slack-thread/archive`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to archive Slack thread');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to archive Slack thread:', error);
      throw error;
    }
  }

  // ===== BULK OPERATIONS =====

  /**
   * Bulk update ticket status
   */
  async bulkUpdateStatus(ticketIds, status, notes = '') {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/bulk/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          ticketIds,
          status,
          notes,
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to bulk update tickets');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to bulk update tickets:', error);
      throw error;
    }
  }

  /**
   * Bulk assign tickets
   */
  async bulkAssign(ticketIds, assignedTo, notes = '') {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/bulk/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          ticketIds,
          assignedTo,
          notes,
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to bulk assign tickets');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to bulk assign tickets:', error);
      throw error;
    }
  }

  // ===== TEMPLATES AND AUTOMATION =====

  /**
   * Get response templates
   */
  async getResponseTemplates() {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/templates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to fetch templates');
      }

      return data.templates;
    } catch (error) {
      console.error('❌ Failed to fetch templates:', error);
      throw error;
    }
  }

  /**
   * Create response template
   */
  async createResponseTemplate(template) {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(template),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to create template');
      }

      return data.template;
    } catch (error) {
      console.error('❌ Failed to create template:', error);
      throw error;
    }
  }

  // ===== REPORTING =====

  /**
   * Export tickets to CSV
   */
  async exportTickets(filters = {}, format = 'csv') {
    const token = localStorage.getItem('access_token');
    const queryParams = new URLSearchParams({
      format,
      ...filters
    });

    try {
      const response = await smartFetch(`${this.baseUrl}/export?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export tickets');
      }

      return response.blob();
    } catch (error) {
      console.error('❌ Failed to export tickets:', error);
      throw error;
    }
  }

  /**
   * Generate support report
   */
  async generateReport(reportType = 'summary', timeRange = '30d') {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.baseUrl}/reports/${reportType}?timeRange=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to generate report');
      }

      return data.report;
    } catch (error) {
      console.error('❌ Failed to generate report:', error);
      throw error;
    }
  }

  // ===== USER SEARCH FOR AUTOCOMPLETE =====

  /**
   * Search users by email, firstName, or lastName for autocomplete
   */
  async searchUsers(query, limit = 10) {
    const token = localStorage.getItem('access_token');
    const queryParams = new URLSearchParams({
      q: query,
      limit: limit
    });

    try {
      const response = await smartFetch(`/api/admin/users/search?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to search users');
      }

      return {
        users: data.users || [],
        count: data.count || 0,
        query: data.query || query
      };
    } catch (error) {
      console.error('❌ Failed to search users:', error);
      throw error;
    }
  }

  // ===== ADMIN TODOS INTEGRATION =====

  /**
   * Get admin todos (KYC requests, support tickets, etc.)
   */
  async getAdminTodos() {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(this.todosUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to fetch admin todos');
      }

      return data.todos;
    } catch (error) {
      console.error('❌ Failed to fetch admin todos:', error);
      throw error;
    }
  }

  // ===== HELPER SCOUT SPECIFIC =====

  /**
   * Get Help Scout conversation details
   */
  async getHelpScoutConversation(conversationId) {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.integrationsUrl}/helpscout/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to fetch Help Scout conversation');
      }

      return data.conversation;
    } catch (error) {
      console.error('❌ Failed to fetch Help Scout conversation:', error);
      throw error;
    }
  }

  /**
   * Send reply to Help Scout conversation
   */
  async sendHelpScoutReply(conversationId, message) {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.integrationsUrl}/helpscout/conversations/${conversationId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to send Help Scout reply');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to send Help Scout reply:', error);
      throw error;
    }
  }

  // ===== SLACK SPECIFIC =====

  /**
   * Post message to Slack thread
   */
  async postSlackMessage(threadId, message) {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.integrationsUrl}/slack/threads/${threadId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to post Slack message');
      }

      return data;
    } catch (error) {
      console.error('❌ Failed to post Slack message:', error);
      throw error;
    }
  }

  /**
   * Get Slack thread messages
   */
  async getSlackThreadMessages(threadId) {
    const token = localStorage.getItem('access_token');

    try {
      const response = await smartFetch(`${this.integrationsUrl}/slack/threads/${threadId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to fetch Slack messages');
      }

      return data.messages;
    } catch (error) {
      console.error('❌ Failed to fetch Slack messages:', error);
      throw error;
    }
  }
}

// Create singleton instance
const supportTicketService = new SupportTicketService();

export { SupportTicketService };
export default supportTicketService;
