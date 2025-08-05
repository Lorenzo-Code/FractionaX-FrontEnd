import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const AIAssistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleAskAI = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('https://dummy-ai-backend.com/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error('Failed to fetch AI response');

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('AI request error:', error);
      setResponse('Sorry, I couldn\'t find an answer to your question.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
      <div className="flex items-center mb-3">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Ask your question..."
          className="flex-grow p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleAskAI}
          disabled={isLoading}
          className="ml-2 bg-blue-600 text-white px-3 py-2 rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : <FiSend />}
        </button>
      </div>
      {response && (
        <div className="bg-white p-3 rounded-lg shadow-md">
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
