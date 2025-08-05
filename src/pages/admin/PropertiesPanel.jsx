import React, { useEffect, useState } from "react";
import { smartFetch } from '../shared/utils';
import { FiPlus, FiEdit, FiTrash2, FiTrendingUp, FiPause, FiEye, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const PropertiesPanel = () => {
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState({});

    const token = localStorage.getItem("access_token");

    // Mock data for demonstration - replace with API call
    const mockProperties = [
        {
            _id: "1",
            title: "Modern Downtown Condo",
            location: "Houston, TX",
            price: 450000,
            status: "approved",
            type: "condo",
            beds: 2,
            baths: 2,
            sqft: 1200,
            listedDate: "2024-01-15",
            views: 245,
            promoted: false
        },
        {
            _id: "2",
            title: "Family Home with Pool",
            location: "Sugar Land, TX",
            price: 650000,
            status: "pending",
            type: "house",
            beds: 4,
            baths: 3,
            sqft: 2800,
            listedDate: "2024-01-20",
            views: 89,
            promoted: false
        },
        {
            _id: "3",
            title: "Luxury Townhouse",
            location: "The Woodlands, TX",
            price: 575000,
            status: "ai_suggested",
            type: "townhouse",
            beds: 3,
            baths: 2.5,
            sqft: 2200,
            listedDate: "2024-01-22",
            views: 32,
            promoted: true
        }
    ];

    const fetchProperties = async () => {
        try {
            setLoading(true);
            // In production, replace with actual API call
            // const response = await smartFetch("/api/admin/properties", {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //     },
            // });
            // const data = await response.json();
            // if (!response.ok) throw new Error(data.msg || "Failed to fetch properties");
            // setProperties(data.properties);
            
            // Using mock data for now
            setTimeout(() => {
                setProperties(mockProperties);
                setLoading(false);
            }, 500);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleStatusChange = async (propertyId, action) => {
        setActionLoading(prev => ({ ...prev, [propertyId]: action }));
        
        try {
            // In production, make API call
            // await smartFetch(`/api/admin/properties/${propertyId}/${action}`, {
            //     method: 'PATCH',
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //     },
            // });
            
            // Mock implementation
            setTimeout(() => {
                setProperties(prev => prev.map(p => 
                    p._id === propertyId 
                        ? { ...p, status: action === 'approve' ? 'approved' : 'rejected' }
                        : p
                ));
                setActionLoading(prev => ({ ...prev, [propertyId]: false }));
            }, 1000);
        } catch (err) {
            setError(err.message);
            setActionLoading(prev => ({ ...prev, [propertyId]: false }));
        }
    };

    const handleSuspendProperty = async (propertyId) => {
        setActionLoading(prev => ({ ...prev, [propertyId]: 'suspend' }));
        
        try {
            // API call would go here
            setTimeout(() => {
                setProperties(prev => prev.map(p => 
                    p._id === propertyId ? { ...p, status: 'suspended' } : p
                ));
                setActionLoading(prev => ({ ...prev, [propertyId]: false }));
            }, 1000);
        } catch (err) {
            setError(err.message);
            setActionLoading(prev => ({ ...prev, [propertyId]: false }));
        }
    };

    const handleDeleteProperty = async (propertyId) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;
        
        setActionLoading(prev => ({ ...prev, [propertyId]: 'delete' }));
        
        try {
            // API call would go here
            setTimeout(() => {
                setProperties(prev => prev.filter(p => p._id !== propertyId));
                setActionLoading(prev => ({ ...prev, [propertyId]: false }));
            }, 1000);
        } catch (err) {
            setError(err.message);
            setActionLoading(prev => ({ ...prev, [propertyId]: false }));
        }
    };

    const handlePromoteProperty = async (propertyId) => {
        setActionLoading(prev => ({ ...prev, [propertyId]: 'promote' }));
        
        try {
            // API call would go here
            setTimeout(() => {
                setProperties(prev => prev.map(p => 
                    p._id === propertyId ? { ...p, promoted: !p.promoted } : p
                ));
                setActionLoading(prev => ({ ...prev, [propertyId]: false }));
            }, 1000);
        } catch (err) {
            setError(err.message);
            setActionLoading(prev => ({ ...prev, [propertyId]: false }));
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Property Listings</h2>
            {error && <p className="text-red-600">⛔ {error}</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow border rounded">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Location</th>
                            <th className="p-3 text-left">Price</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((p) => (
                            <tr key={p._id} className="border-t">
                                <td className="p-3 space-x-2">
                                    {p.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => handleStatusChange(p._id, "approve")}
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(p._id, "reject")}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {p.status !== "pending" && (
                                        <span className="italic text-gray-500">Reviewed</span>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PropertiesPanel;
