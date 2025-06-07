import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CheckCircleIcon, ExclamationTriangleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import './EmailVerificationPage.css';

const EmailVerificationPage = () => {
  const { verifyEmail, resendVerificationEmail } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationState, setVerificationState] = useState('idle'); 
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleVerification(token);
    }
  }, [searchParams]);

  const handleVerification = async (token) => {
    setVerificationState('verifying');
    setError('');
    
    try {
      await verifyEmail(token);
      setVerificationState('success');
    } catch (err) {
      setError(err.message);
      setVerificationState('error');
    }
  };

  const handleResendEmail = async (data) => {
    setIsResending(true);
    setResendMessage('');
    setError('');
    
    try {
      await resendVerificationEmail(data.email);
      setResendMessage('Verification email has been sent. Please check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  if (verificationState === 'verifying') {
    return (
      <div className="verification-container">
        <div className="verification-card">
          <div className="verification-icon">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          </div>
          <div className="verification-content">
            <h2 className="verification-title">Verifying Email...</h2>
            <p className="verification-message">
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationState === 'success') {
    return (
      <div className="verification-container">
        <div className="verification-card">
          <div className="verification-icon">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
          </div>
          <div className="verification-content">
            <h2 className="verification-title success">Email Verified!</h2>
            <p className="verification-message">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
            <div className="verification-actions">
              <button
                onClick={() => navigate('/login')}
                className="primary-button"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verificationState === 'error') {
    return (
      <div className="verification-container">
        <div className="verification-card">
          <div className="verification-icon">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500" />
          </div>
          <div className="verification-content">
            <h2 className="verification-title error">Verification Failed</h2>
            <p className="verification-message">
              {error || 'The verification link is invalid or has expired.'}
            </p>
            <div className="verification-actions">
              <Link to="/verify-email" className="primary-button">
                Request New Link
              </Link>
              <Link to="/login" className="secondary-link">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="verification-icon">
          <EnvelopeIcon className="w-16 h-16 text-indigo-600" />
        </div>
        <div className="verification-content">
          <h2 className="verification-title">Email Verification</h2>
          <p className="verification-message">
            Enter your email address to receive a new verification link.
          </p>

          <form onSubmit={handleSubmit(handleResendEmail)} className="verification-form">
            {error && (
              <div className="error-alert">
                <p>{error}</p>
              </div>
            )}

            {resendMessage && (
              <div className="success-alert">
                <p>{resendMessage}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                id="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isResending}
              className="submit-button"
            >
              {isResending ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  Sending...
                </div>
              ) : (
                'Send Verification Email'
              )}
            </button>
          </form>

          <div className="verification-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login" className="auth-link">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage; 