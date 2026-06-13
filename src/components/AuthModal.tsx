/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, X, ChevronRight, Info } from 'lucide-react';
import { authService } from '../services';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const user = await authService.signInWithEmail(email, password);
      onSuccess?.(user);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Authentication error happened, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await authService.signInWithGoogle();
      onSuccess?.(user);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Google Auth error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-sm transition-all duration-300">
      <div 
        id="auth-modal-card"
        className="w-full max-w-md bg-sand-50 rounded-2xl border border-forest-100 overflow-hidden shadow-luxury animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Banner */}
        <div className="relative bg-forest-700 p-6 text-white text-center">
          <button 
            id="close-auth-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-forest-600 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h3 className="font-serif text-2xl font-bold tracking-tight text-sand-100 mt-2">
            Sign In to Account
          </h3>
          <p className="text-xs text-forest-100 mt-1">
            Access customized itineraries and Gorilla tracking logs
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div id="auth-error-banner" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-forest-800 uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-forest-600">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="auth-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-2 bg-white border border-forest-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-forest-800 uppercase tracking-widest">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-forest-600">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="auth-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2 bg-white border border-forest-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-forest-700 hover:bg-forest-600 disabled:bg-forest-200 text-sand-50 font-medium rounded-xl text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-700 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6 text-center">
            <span className="absolute inset-y-1/2 left-0 right-0 border-t border-forest-100"></span>
            <span className="relative bg-sand-50 px-3 text-xs text-forest-600 uppercase font-bold tracking-widest">
              OR
            </span>
          </div>

          {/* Google SSO Login */}
          <button
            id="auth-google-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-forest-50 border border-forest-200 text-forest-900 font-medium rounded-xl text-sm transition-all shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 15.02 1 12 1 7.35 1 3.4 3.65 1.54 7.54l3.87 3a7.14 7.14 0 0 1 6.59-5.5z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44a5.52 5.52 0 0 1-2.4 3.62l3.73 2.9c2.18-2.01 3.72-4.97 3.72-8.63z"
              />
              <path
                fill="#FBBC05"
                d="M5.41 14.54A7.12 7.12 0 0 1 5 12c0-.88.16-1.74.41-2.54L1.54 6.46A11.94 11.94 0 0 0 0 12c0 2.05.52 4 1.54 5.54l3.87-3z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.9c-1.1.74-2.5 1.18-4.23 1.18-3.2 0-5.91-2.16-6.88-5.07L1.27 16.3A11.97 11.97 0 0 0 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
