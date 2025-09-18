import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const NewsletterSignup = ({ placement = 'blog' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      // TODO: Replace with actual newsletter API endpoint
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success/failure
      setStatus('success');
      setMessage('Welcome to our newsletter! Check your email to confirm.');
      setEmail('');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  const getPlacementStyles = () => {
    switch (placement) {
      case 'blog':
        return {
          container: 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200',
          title: 'text-gray-900',
          description: 'text-gray-600',
          button: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
      case 'sidebar':
        return {
          container: 'bg-white border border-gray-200 shadow-sm',
          title: 'text-gray-900',
          description: 'text-gray-600',
          button: 'bg-indigo-600 hover:bg-indigo-700 text-white'
        };
      case 'footer':
        return {
          container: 'bg-gray-800 text-white border-0',
          title: 'text-white',
          description: 'text-gray-300',
          button: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
      default:
        return {
          container: 'bg-blue-50 border border-blue-200',
          title: 'text-gray-900',
          description: 'text-gray-600',
          button: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
    }
  };

  const styles = getPlacementStyles();

  return (
    <div className={`rounded-xl p-6 ${styles.container}`}>
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className={`text-lg font-bold mb-2 ${styles.title}`}>
          Stay Updated with Educational Content
        </h3>
        <p className={`text-sm ${styles.description}`}>
          Get the latest insights on real estate investing, blockchain technology, and market analysis 
          delivered to your inbox weekly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            disabled={status === 'loading' || status === 'success'}
          />
          <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${styles.button} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {status === 'loading' ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Subscribing...
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Subscribed!
            </>
          ) : (
            'Subscribe to Newsletter'
          )}
        </button>

        {message && (
          <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
            status === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}
      </form>

      <div className="mt-4 text-center">
        <p className={`text-xs ${styles.description}`}>
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default NewsletterSignup;
