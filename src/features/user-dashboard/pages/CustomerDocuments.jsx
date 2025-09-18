import React, { useState } from 'react';
import { FileText, Download, Upload, Eye, Search, Filter, Calendar, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const CustomerDocuments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const documents = [
    {
      id: 1,
      name: 'Property Investment Agreement - Downtown Condo',
      type: 'Contract',
      category: 'Investment',
      date: '2024-01-15',
      size: '2.4 MB',
      status: 'Signed',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'KYC Verification Documents',
      type: 'Compliance',
      category: 'Verification',
      date: '2024-01-10',
      size: '1.8 MB',
      status: 'Approved',
      downloadUrl: '#'
    },
    {
      id: 3,
      name: 'Tax Documents 2023',
      type: 'Tax',
      category: 'Financial',
      date: '2024-01-05',
      size: '3.2 MB',
      status: 'Processing',
      downloadUrl: '#'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-600">Manage your investment and legal documents</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Upload size={16} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="contract">Contracts</option>
            <option value="compliance">Compliance</option>
            <option value="tax">Tax Documents</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Document Library</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{doc.category}</span>
                      <span>•</span>
                      <span>{new Date(doc.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    doc.status === 'Signed' || doc.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    doc.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {doc.status}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDocuments;
