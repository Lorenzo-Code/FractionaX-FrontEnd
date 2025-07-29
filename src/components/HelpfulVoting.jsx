import React, { useState, useCallback } from 'react';
import { FiThumbsUp, FiThumbsDown, FiCheck, FiX } from 'react-icons/fi';
import faqAnalytics from '../utils/faqAnalytics';

const HelpfulVoting = ({ 
  category, 
  question, 
  questionIndex, 
  onVote, 
  className = "" 
}) => {
  const [userVote, setUserVote] = useState(null); // 'helpful', 'not-helpful', or null
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [votingState, setVotingState] = useState('voting'); // 'voting', 'feedback', 'thankyou'

  const handleVote = useCallback(async (isHelpful) => {
    const voteType = isHelpful ? 'helpful' : 'not-helpful';
    setUserVote(voteType);
    
    // Track the vote in analytics
    faqAnalytics.trackHelpfulVote(category, question, questionIndex, isHelpful);
    
    // Call parent callback if provided
    if (onVote) {
      onVote(isHelpful, questionIndex);
    }

    // Store vote in localStorage for persistence
    const voteKey = `faq_vote_${category}_${questionIndex}`;
    localStorage.setItem(voteKey, JSON.stringify({
      vote: voteType,
      timestamp: Date.now(),
      category,
      question: question.substring(0, 100), // Store first 100 chars for reference
    }));

    // Show feedback form for negative votes
    if (!isHelpful) {
      setVotingState('feedback');
      setShowFeedback(true);
    } else {
      setVotingState('thankyou');
      // Auto-hide thank you message after 3 seconds
      setTimeout(() => {
        setVotingState('voting');
      }, 3000);
    }

    // Send vote to backend API (if available)
    try {
      await fetch('/api/faq/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          question,
          questionIndex,
          isHelpful,
          timestamp: Date.now(),
          sessionId: faqAnalytics.sessionId,
        }),
      });
    } catch (error) {
      console.warn('Failed to send vote to backend:', error);
    }
  }, [category, question, questionIndex, onVote]);

  const handleFeedbackSubmit = useCallback(async () => {
    if (!feedback.trim()) return;

    setIsSubmittingFeedback(true);
    
    try {
      // Track feedback submission
      faqAnalytics.trackEvent('faq_feedback_submitted', {
        category,
        question,
        questionIndex,
        feedback: feedback.substring(0, 200), // Limit feedback length in analytics
        vote: userVote,
      });

      // Send feedback to backend
      await fetch('/api/faq/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          question,
          questionIndex,
          feedback,
          vote: userVote,
          timestamp: Date.now(),
          sessionId: faqAnalytics.sessionId,
        }),
      });

      setVotingState('thankyou');
      setShowFeedback(false);
      
      // Auto-hide thank you message
      setTimeout(() => {
        setVotingState('voting');
      }, 3000);

    } catch (error) {
      console.warn('Failed to submit feedback:', error);
      // Still show thank you to user
      setVotingState('thankyou');
      setShowFeedback(false);
    } finally {
      setIsSubmittingFeedback(false);
    }
  }, [feedback, category, question, questionIndex, userVote]);

  const handleSkipFeedback = useCallback(() => {
    setShowFeedback(false);
    setVotingState('thankyou');
    setTimeout(() => {
      setVotingState('voting');
    }, 3000);
  }, []);

  // Check if user has already voted (from localStorage)
  React.useEffect(() => {
    const voteKey = `faq_vote_${category}_${questionIndex}`;
    const storedVote = localStorage.getItem(voteKey);
    if (storedVote) {
      try {
        const { vote } = JSON.parse(storedVote);
        setUserVote(vote);
      } catch (error) {
        console.warn('Failed to parse stored vote:', error);
      }
    }
  }, [category, questionIndex]);

  if (votingState === 'thankyou') {
    return (
      <div className={`flex items-center justify-center py-3 ${className}`}>
        <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
          <FiCheck className="w-4 h-4" />
          <span className="text-sm font-medium">
            Thank you for your feedback!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
      {/* Voting Buttons */}
      {!showFeedback && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">
            Was this answer helpful?
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleVote(true)}
              disabled={userVote !== null}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                userVote === 'helpful'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : userVote === null
                  ? 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
            >
              <FiThumbsUp className="w-4 h-4" />
              <span>Yes</span>
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={userVote !== null}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                userVote === 'not-helpful'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : userVote === null
                  ? 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
            >
              <FiThumbsDown className="w-4 h-4" />
              <span>No</span>
            </button>
          </div>
        </div>
      )}

      {/* Feedback Form */}
      {showFeedback && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Help us improve this answer
          </h4>
          <p className="text-xs text-gray-600 mb-3">
            What information were you looking for that wasn't included?
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what's missing or how we can improve this answer..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">
              {feedback.length}/500 characters
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSkipFeedback}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleFeedbackSubmit}
                disabled={isSubmittingFeedback || !feedback.trim()}
                className="px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmittingFeedback ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vote Status Display */}
      {userVote && !showFeedback && votingState === 'voting' && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          {userVote === 'helpful' 
            ? "Thanks! Your feedback helps us improve our FAQ."
            : "Thanks for your feedback. We'll work on improving this answer."
          }
        </div>
      )}
    </div>
  );
};

export default HelpfulVoting;
