// src/components/admin/AdminTodoPanel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supportTicketService from '../services/supportTicketService';
import { toast } from 'react-toastify';



const AdminTodoPanel = ({
    tasks,
    setTasks,
    userRole,
    newTask,
    setNewTask,
    newTag,
    setNewTag,
    newDue,
    setNewDue,
    searchQuery,
    setSearchQuery,
}) => {
    const [view, setView] = useState("active");
    const [loading, setLoading] = useState(false);
    const [apiTodos, setApiTodos] = useState([]);
    const navigate = useNavigate();

    const handleNavigate = (task) => {
        if (task.link) return navigate(task.link);
        const lower = task.text.toLowerCase();
        if (lower.includes("flagged transaction")) navigate("/admin/transactions");
        else if (lower.includes("kyc")) navigate("/admin/kyc");
        else if (lower.includes("support")) navigate("/admin/messages");
        else if (lower.includes("tax")) navigate("/admin/tax-reports");
        else navigate("/admin");
    };

    const handleResolve = (id) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, resolved: true } : t)));
    };

    const handleEscalate = (id) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "escalated" } : t)));
    };

    const handleDelete = (id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const handleReassign = (id, newAssignee) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, assignedTo: newAssignee } : t)));
    };

    const handleAddTask = () => {
        if (!newTask.trim()) return;
        setTasks((prev) => [
            ...prev,
            {
                id: Date.now(),
                text: newTask.trim(),
                resolved: false,
                assignedTo: userRole,
                tag: newTag,
                due: newDue,
                status: "open",
                timestamp: new Date().toISOString(),
                link: "", // allow future routing override
                meta: {},  // store structured data for future use
            },
        ]);
        setNewTask("");
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesRole = task.assignedTo === userRole || userRole === "Admin";
        const matchesDue = newDue === "All" || task.due === newDue;
        const matchesSearch = !searchQuery || task.text.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesView =
            view === "all" || (view === "resolved" ? task.resolved : !task.resolved);
        return matchesRole && matchesDue && matchesSearch && matchesView;
    });

    const taskSummary = {
        total: tasks.length,
        active: tasks.filter((t) => !t.resolved).length,
        resolved: tasks.filter((t) => t.resolved).length,
        escalated: tasks.filter((t) => t.status === "escalated").length,
    };

    const isRecent = (timestamp) => {
        return Date.now() - new Date(timestamp).getTime() < 86400000;
    };

    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
    const [ticketForm, setTicketForm] = useState({
        customerEmail: '',
        subject: '',
        description: ''
    });

    // Fetch admin todos from API
    useEffect(() => {
        fetchAdminTodos();
    }, []);

    const fetchAdminTodos = async () => {
        try {
            setLoading(true);
            const todos = await supportTicketService.getAdminTodos();
            setApiTodos(todos);
        } catch (error) {
            console.error('Failed to fetch admin todos:', error);
            toast.error('Failed to load admin todos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSupportTicket = async () => {
        if (!ticketForm.customerEmail || !ticketForm.subject || !ticketForm.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const result = await supportTicketService.createTicket(ticketForm);
            toast.success(`Support ticket created successfully! Slack thread: ${result.slackThreadId}`);
            setShowCreateTicketModal(false);
            setTicketForm({ customerEmail: '', subject: '', description: '' });
            // Refresh todos to show new ticket
            await fetchAdminTodos();
        } catch (error) {
            console.error('Failed to create support ticket:', error);
            toast.error('Failed to create support ticket: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-2">✅ Admin To-Do</h2>
            <p className="text-sm text-gray-500 mb-4">
                {taskSummary.active} active • {taskSummary.resolved} completed • {taskSummary.escalated} escalated
            </p>

            {/* View Tabs */}
            <div className="flex gap-2 mb-4">
                {['active', 'resolved', 'all'].map((tab) => (
                    <button
                        key={tab}
                        className={`text-sm px-3 py-1 rounded-full border ${view === tab ? "bg-blue-100 text-blue-700 border-blue-300" : "text-gray-600"
                            }`}
                        onClick={() => setView(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Filter & Search Controls */}
            <div className="flex flex-wrap gap-2 mb-4">
                <select
                    className="px-3 py-1 border rounded text-sm"
                    onChange={(e) => setNewDue(e.target.value)}
                    value={newDue}
                >
                    <option value="All">All</option>
                    <option value="Today">Urgent (Today)</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Next 7 Days">Next 7 Days</option>
                    <option value="Overdue">Overdue</option>
                </select>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    className="px-3 py-1 border rounded text-sm w-60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="max-h-96 overflow-y-auto pr-2 space-y-3">
                {filteredTasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => handleNavigate(task)}
                        className={`cursor-pointer flex items-center justify-between p-3 rounded border transition hover:shadow-sm ${task.resolved ? "bg-green-50" : "bg-gray-50"
                            }`}
                    >
                        <div>
                            <span
                                className={`block font-medium ${task.resolved ? "line-through text-gray-400" : "text-gray-700"
                                    }`}
                            >
                                {task.text} {isRecent(task.timestamp) && <span className="text-xs text-green-600 font-medium">🆕</span>}
                            </span>
                            <div className="text-xs text-gray-500 flex flex-wrap gap-2 mt-1">
                                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">#{task.tag}</span>
                                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Due: {task.due}</span>
                                {task.status === "escalated" && (
                                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded">Escalated</span>
                                )}
                                <span className="text-gray-400">🕓 {new Date(task.timestamp || task.id).toLocaleString()}</span>
                            </div>
                            {userRole === "Admin" && !task.resolved && (
                                <div className="mt-1">
                                    <label className="text-xs mr-1 text-gray-600">Reassign:</label>
                                    <select
                                        value={task.assignedTo}
                                        onChange={(e) => handleReassign(task.id, e.target.value)}
                                        className="text-xs px-2 py-1 border rounded"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Support">Support</option>
                                        <option value="Compliance">Compliance</option>
                                        <option value="Finance">Finance</option>
                                    </select>
                                    
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            {!task.resolved && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleResolve(task.id);
                                        }}
                                        className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Resolve
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEscalate(task.id);
                                        }}
                                        className="text-xs px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    >
                                        Escalate
                                    </button>
                                </>
                            )}
                            {task.resolved && userRole === "Admin" && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(task.id);
                                    }}
                                    className="text-xs px-2 py-1 text-red-500 hover:text-red-700"
                                >
                                    🗑 Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {filteredTasks.length === 0 && (
                    <p className="text-center text-sm text-gray-400 mt-6">
                        No tasks match your current filters.
                    </p>
                )}
            </div>

            {/* API-based Admin Todos */}
            {loading ? (
                <p className="text-center text-sm text-gray-500 mt-4">Loading admin todos...</p>
            ) : apiTodos.length > 0 && (
                <div className="mt-4 border-t pt-4">
                    <h3 className="text-md font-semibold mb-3">🔄 Live Admin Tasks</h3>
                    <div className="space-y-2">
                        {apiTodos.map((todo, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">{todo.type}: {todo.description}</span>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Count: {todo.count} • Priority: {todo.priority}
                                    </div>
                                </div>
                                <button 
                                    className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => {
                                        if (todo.type === 'KYC Requests') navigate('/admin/kyc');
                                        else if (todo.type === 'Support Tickets') navigate('/admin/support');
                                        else navigate('/admin');
                                    }}
                                >
                                    View
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="mt-4 border-t pt-4">
                <h3 className="text-md font-semibold mb-3">⚡ Quick Actions</h3>
                <div className="flex gap-2 flex-wrap">
                    <button 
                        onClick={() => setShowCreateTicketModal(true)}
                        className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                        🎫 Create Support Ticket
                    </button>
                    <button 
                        onClick={fetchAdminTodos}
                        className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                        🔄 Refresh Todos
                    </button>
                </div>
            </div>

            {/* Add Task Form */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                <input
                    type="text"
                    placeholder="New local task..."
                    className="col-span-2 px-3 py-2 border rounded shadow-sm"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="px-3 py-2 border rounded"
                >
                    <option value="general">#general</option>
                    <option value="compliance">#compliance</option>
                    <option value="support">#support</option>
                    <option value="finance">#finance</option>
                </select>
                <select
                    value={newDue}
                    onChange={(e) => setNewDue(e.target.value)}
                    className="px-3 py-2 border rounded"
                >
                    <option>No Deadline</option>
                    <option>Today</option>
                    <option>Tomorrow</option>
                    <option>Next 7 Days</option>
                    <option>Overdue</option>
                </select>
                <button
                    onClick={handleAddTask}
                    className="col-span-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Add
                </button>
            </div>

            {/* Create Support Ticket Modal */}
            {showCreateTicketModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-full">
                        <h3 className="text-lg font-semibold mb-4">🎫 Create Support Ticket</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Customer Email *
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={ticketForm.customerEmail}
                                    onChange={(e) => setTicketForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                                    placeholder="customer@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={ticketForm.subject}
                                    onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                                    placeholder="Brief description of the issue"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={ticketForm.description}
                                    onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Detailed description of the issue or request"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => {
                                    setShowCreateTicketModal(false);
                                    setTicketForm({ customerEmail: '', subject: '', description: '' });
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateSupportTicket}
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create & Post to Slack'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTodoPanel;
