import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSend, 
  FiMic, 
  FiMicOff, 
  FiMessageCircle, 
  FiUser, 
  FiRefreshCw,
  FiMinimize2,
  FiMaximize2,
  FiX,
  FiSearch,
  FiTrendingUp,
  FiHome,
  FiDollarSign,
  FiMapPin
} from 'react-icons/fi';
import { BsRobot, BsStars } from 'react-icons/bs';
import { HiOutlineSparkles } from 'react-icons/hi';
import { smartFetch } from '../../../shared/utils';

const SmartAISearch = ({
  onResults,
  onConversationUpdate,
  className = "",
  placeholder = "Ask me anything about real estate, investments, or properties...",
  initialMessage = "Hi! I'm your AI property assistant. I can help you find the perfect investment opportunities, analyze properties, or answer any real estate questions. What are you looking for today?"
}) => {
  // State management
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: initialMessage,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);
  
  // Quick action suggestions
  const quickActions = [
    {
      icon: <FiHome className="w-4 h-4" />,
      text: "Find properties under $500K",
      query: "Show me properties under $500,000 with good investment potential"
    },
    {
      icon: <FiTrendingUp className="w-4 h-4" />,
      text: "High ROI investments",
      query: "Find high ROI investment properties with strong rental yields"
    },
    {
      icon: <FiMapPin className="w-4 h-4" />,
      text: "Properties in Houston",
      query: "Show me real estate investment opportunities in Houston, Texas"
    },
    {
      icon: <FiDollarSign className="w-4 h-4" />,
      text: "Tokenized assets",
      query: "What tokenized investment opportunities are available right now?"
    }
  ];
  
  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      console.log('🤖 Sending message to AI:', userMessage.content);
      
      // Call the AI search API with conversation context
      const response = await smartFetch('/api/ai/chat-search', {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage.content,
          conversation_history: updatedMessages,
          search_context: 'marketplace',
          user_intent: 'property_search',
          include_properties: true,
          max_properties: 6
        })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🤖 AI Response:', data);
      
      // Create AI response message
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response || data.message || "I found some great options for you!",
        timestamp: new Date(),
        properties: data.properties || [],
        suggestions: data.suggestions || []
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      
      // Notify parent components
      if (onResults && data.properties?.length > 0) {
        onResults(data.properties, data.response);
      }
      
      if (onConversationUpdate) {
        onConversationUpdate(finalMessages);
      }
      
    } catch (error) {
      console.error('❌ AI Chat Error:', error);
      
      // Fallback AI response
      const fallbackResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble connecting right now, but I'd love to help you find properties! Could you try rephrasing your request? I can help you search for real estate investments, analyze properties, or find tokenized assets.",
        timestamp: new Date(),
        suggestions: [
          "Show me properties under $300K",
          "Find high-yield rental properties", 
          "What are the best investment areas in Houston?"
        ]
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };
  
  // Handle voice input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  
  // Handle quick action click
  const handleQuickAction = (query) => {
    setInputValue(query);
    setTimeout(() => handleSendMessage(), 100);
  };
  
  // Clear conversation
  const handleClearConversation = () => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: initialMessage,
        timestamp: new Date()
      }
    ]);
  };
  
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <BsRobot className="w-8 h-8" />
              <HiOutlineSparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">AI Property Assistant</h3>
              <p className="text-blue-100 text-sm">Powered by ChatGPT • Ask me anything!</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearConversation}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Clear conversation"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-x border-b border-gray-200 rounded-b-xl overflow-hidden"
          >
            {/* Messages Container */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <MessageBubble 
                  key={message.id} 
                  message={message}
                  onPropertySelect={onResults}
                />
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2"
                >
                  <div className="bg-blue-100 rounded-full p-2">
                    <BsRobot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-blue-100 rounded-2xl px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 py-3 bg-white border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-3">Try asking me about:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.query)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      {action.icon}
                      <span>{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                    placeholder={placeholder}
                    disabled={isLoading}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  
                  {/* Voice Input Button */}
                  {recognitionRef.current && (
                    <button
                      onClick={toggleVoiceInput}
                      disabled={isLoading}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                        isListening 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={isListening ? "Stop listening" : "Voice input"}
                    >
                      {isListening ? <FiMicOff className="w-4 h-4" /> : <FiMic className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white p-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiSend className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 text-center">
                Ask about properties, investments, market trends, or anything real estate related!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, onPropertySelect }) => {
  const isUser = message.type === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'
        }`}>
          {isUser ? <FiUser className="w-4 h-4 text-white" /> : <BsRobot className="w-4 h-4 text-white" />}
        </div>
        
        {/* Message Content */}
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-blue-500 text-white rounded-tr-md' 
            : 'bg-white border border-gray-200 rounded-tl-md shadow-sm'
        }`}>
          <p className={`text-sm ${isUser ? 'text-white' : 'text-gray-800'} leading-relaxed`}>
            {message.content}
          </p>
          
          {/* Properties Results */}
          {message.properties && message.properties.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="text-xs text-gray-500 font-medium">Properties Found:</div>
              {message.properties.slice(0, 3).map((property, index) => (
                <div 
                  key={index}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => onPropertySelect && onPropertySelect([property], message.content)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{property.title}</h4>
                      <p className="text-xs text-gray-600">{property.address || property.location}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-bold text-green-600">
                          ${property.price?.toLocaleString()}
                        </span>
                        {property.expectedROI && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {property.expectedROI}% ROI
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {message.properties.length > 3 && (
                <button 
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => onPropertySelect && onPropertySelect(message.properties, message.content)}
                >
                  View all {message.properties.length} properties →
                </button>
              )}
            </div>
          )}
          
          {/* Suggestions */}
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="mt-3 space-y-1">
              <div className="text-xs text-gray-500 font-medium">You might also ask:</div>
              {message.suggestions.map((suggestion, index) => (
                <div key={index} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  "{suggestion}"
                </div>
              ))}
            </div>
          )}
          
          <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SmartAISearch;
