import React, { useEffect, useState } from 'react';

function OpenAIAuth({ onAuthSuccess }) {
  const [authStatus, setAuthStatus] = useState('pending'); // pending, loading, success, error

  useEffect(() => {
    // Check if we're returning from the OAuth flow
    const urlParams = new URLSearchParams(window.location.search);
    const authResult = urlParams.get('auth');
    
    if (authResult === 'success') {
      setAuthStatus('success');
      onAuthSuccess();
      
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authResult === 'error') {
      setAuthStatus('error');
    }
  }, [onAuthSuccess]);

  const handleAuth = () => {
    setAuthStatus('loading');
    // Redirect to the backend auth endpoint
    window.location.href = '/api/auth/openai';
  };

  return (
    <div className="openai-auth">
      {authStatus === 'error' && (
        <div className="auth-error">
          Authentication failed. Please try again.
        </div>
      )}
      
      <button 
        onClick={handleAuth} 
        className="auth-button"
        disabled={authStatus === 'loading' || authStatus === 'success'}
      >
        {authStatus === 'loading' ? 'Redirecting...' : 'Authorize with OpenAI'}
      </button>
      
      {authStatus === 'success' && (
        <div className="auth-success">
          <span>✓</span> Successfully authorized with OpenAI
        </div>
      )}
      
      <div className="auth-info">
        <p>We need your permission to generate images using OpenAI's DALL-E 3.</p>
        <p>This will use your OpenAI credits.</p>
      </div>
    </div>
  );
}

export default OpenAIAuth;
