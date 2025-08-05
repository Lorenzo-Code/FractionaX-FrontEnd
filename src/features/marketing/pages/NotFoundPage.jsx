import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-6xl font-bold mb-4 text-gray-600">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="mb-8">The page you're looking for doesn't exist.</p>
      <Link 
        to="/home" 
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
