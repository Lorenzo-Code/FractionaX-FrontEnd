import React, { useEffect, useState } from "react";
import { smartFetch } from "../../utils/apiClient";

const PropertiesPanel = () => {
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState("");

    const token = localStorage.getItem("access_token");

    const fetchProperties = async () => {
        try {
            const response = await smartFetch("/api/admin/properties", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || "Failed to fetch properties");

            setProperties(data.properties);
        } catch (err) {
            setError(err.message);
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
