import React, { useEffect, useState } from "react";
import { smartFetch } from '../../../shared/utils';

const AuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            const token = localStorage.getItem("access_token");

            const res = await smartFetch("/api/admin/audit-logs", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) setLogs(data.logs);
        };

        fetchLogs();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Audit Logs</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-3 text-left">Event</th>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Timestamp</th>
                            <th className="p-3 text-left">Meta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id} className="border-t">
                                <td className="p-3">{log.event}</td>
                                <td className="p-3">{log.user?.email || "N/A"}</td>
                                <td className="p-3">{log.role}</td>
                                <td className="p-3">{new Date(log.createdAt).toLocaleString()}</td>
                                <td className="p-3 text-sm text-gray-500">
                                    <pre>{JSON.stringify(log.meta, null, 2)}</pre>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="">All Events</option>
                        <option value="TOKEN_TRANSFER">Token Transfers</option>
                        <option value="HOLDING_UPDATE">FXCT Holdings</option>
                        <option value="LOGIN">Logins</option>
                        <option value="ADMIN_PROMOTE">Admin Promotions</option>
                    </select>

                </table>
            </div>
        </div>
    );
};

export default AuditLog;
