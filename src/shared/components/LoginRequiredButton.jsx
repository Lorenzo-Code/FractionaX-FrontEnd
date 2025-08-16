import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const LoginRequiredButton = ({ 
  children, 
  onClick, 
  requireLogin = true, 
  loginPromptText = "Sign in to continue",
  className = "",
  ...props 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (requireLogin && !user) {
      e.preventDefault();
      e.stopPropagation();
      
      // Show login prompt and redirect
      if (confirm(`${loginPromptText}\n\nWould you like to sign in now?`)) {
        navigate('/login');
      }
      return;
    }
    
    // User is logged in or login not required, proceed with action
    if (onClick) {
      onClick(e);
    }
  };

  // If login is required and user isn't logged in, modify button appearance
  const buttonClassName = requireLogin && !user 
    ? `${className} opacity-75 hover:opacity-90 transition-opacity`
    : className;

  return (
    <button
      {...props}
      className={buttonClassName}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default LoginRequiredButton;
