/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AuthUser } from '../services';
import { Compass, Menu, X, ShieldAlert, LogOut, LogIn, User, Sparkles, FolderLock, Heart, HelpCircle, Eye, ShieldCheck, TreePine } from 'lucide-react';
import AuthModal from './AuthModal';

interface NavbarProps {
  currentUser: AuthUser | null;
  onLogout: () => void;
  currentRoute: 'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin';
  onChangeRoute: (route: 'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin') => void;
  onTriggerAuth: () => void;
}

export default function Navbar({ currentUser, onLogout, currentRoute, onChangeRoute, onTriggerAuth }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const triggerAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    onChangeRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRouteNavigate = (route: any) => {
    onChangeRoute(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav id="app-navbar" className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-forest-100/50 py-4 px-6 shadow-sm select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <button 
            id="nav-logo-btn"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 cursor-pointer group text-left"
          >
            <div className="p-2.5 bg-forest-700 text-sand-50 rounded-xl transition group-hover:bg-forest-600">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-lg lg:text-xl font-bold tracking-tight text-forest-900 leading-none">
                Hobe Gorilla Rwanda
              </h1>
              <span className="text-[9px] font-bold tracking-widest text-sand-700 uppercase block mt-1">
                Eco-Luxury Wilderness Safaris
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-forest-800">
            {[
              { id: 'home', label: 'Home' },
              { id: 'destinations', label: 'Destinations' },
              { id: 'packages', label: 'Safari Packages' },
              { id: 'conservation', label: 'Conservation' },
              { id: 'bookings-hub', label: 'Bookings Hub' }
            ].map(tab => (
              <button
                id={`nav-link-${tab.id}`}
                key={tab.id}
                onClick={() => handleRouteNavigate(tab.id as any)}
                className={`hover:text-forest-600 transition cursor-pointer pb-1 border-b-2 ${
                  currentRoute === tab.id 
                    ? 'border-forest-700 text-forest-900 font-extrabold' 
                    : 'border-transparent font-medium'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Action buttons / profiles */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Book now highlighted action route */}
            <button
              id="nav-action-book-button"
              onClick={() => handleRouteNavigate('booking')}
              className={`flex items-center gap-1.5 py-2 px-4 rounded-xl text-[11.5px] font-extrabold uppercase tracking-widest transition cursor-pointer ${
                currentRoute === 'booking' 
                  ? 'bg-sand-700 text-forest-950 shadow-sm'
                  : 'bg-forest-950 hover:bg-forest-850 text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sand-300" />
              <span>Apply Permits</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Admin direct visual router check */}
                {currentUser.role === 'admin' && (
                  <button
                    id="nav-admin-dashboard-link"
                    onClick={() => handleRouteNavigate(currentRoute === 'admin' ? 'home' : 'admin')}
                    className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-[10.5px] font-bold tracking-wider uppercase transition cursor-pointer ${
                      currentRoute === 'admin'
                        ? 'bg-red-650 text-white'
                        : 'bg-sand-100 hover:bg-sand-200 text-forest-900 border border-sand-600/25'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-sand-705" />
                    <span>{currentRoute === 'admin' ? 'Website Portal' : 'Admin Panel'}</span>
                  </button>
                )}

                <div className="flex items-center gap-2.5 bg-forest-50 p-1.5 pr-3.5 rounded-xl border border-forest-100/50">
                  <div className="w-7 h-7 rounded-lg bg-forest-700 text-white font-bold text-xs flex items-center justify-center font-serif">
                    {currentUser.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[10px] text-forest-700 font-bold max-w-[120px] truncate leading-none">
                      {currentUser.email}
                    </p>
                    <span className="text-[8px] font-mono uppercase bg-forest-100 text-forest-800 px-1 py-0.2 rounded border border-forest-200 mt-0.5 inline-block">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 border border-forest-100 hover:border-forest-200 hover:bg-forest-50 rounded-lg text-forest-750 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  id="nav-login-btn"
                  onClick={() => triggerAuth('login')}
                  className="text-xs font-bold uppercase tracking-wider text-forest-800 hover:text-forest-600 px-3 py-2 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => triggerAuth('register')}
                  className="text-xs font-bold uppercase bg-forest-50 hover:bg-forest-100 border border-forest-200 text-forest-950 rounded-xl px-4 py-2 shadow-sm cursor-pointer transition"
                >
                  Join Safari
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-forest-800 hover:text-forest-600 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div id="mobile-nav-drawer" className="lg:hidden mt-4 pt-4 border-t border-forest-550/10 space-y-4 animate-in slide-in-from-top-4 duration-300 text-left">
            <div className="flex flex-col gap-3.5 text-xs font-bold uppercase tracking-widest text-forest-800 px-2 py-3">
              {[
                { id: 'home', label: 'Home' },
                { id: 'destinations', label: 'Destinations' },
                { id: 'packages', label: 'Safari Packages' },
                { id: 'conservation', label: 'Conservation' },
                { id: 'bookings-hub', label: 'Bookings Hub' }
              ].map(tab => (
                <button
                  id={`mobile-nav-link-${tab.id}`}
                  key={tab.id}
                  onClick={() => handleRouteNavigate(tab.id as any)}
                  className={`text-left hover:text-forest-600 transition cursor-pointer ${
                    currentRoute === tab.id ? 'text-forest-950 font-extrabold border-l-2 border-forest-750 pl-2' : ''
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <button
                id="mobile-nav-action-booking"
                onClick={() => handleRouteNavigate('booking')}
                className={`text-left text-forest-900 border-l-2 border-sand-600 pl-3 flex items-center gap-1 cursor-pointer font-extrabold`}
              >
                <Sparkles className="w-3.5 h-3.5 text-sand-500" />
                <span>Apply Permits Now</span>
              </button>
            </div>

            <div className="pt-4 border-t border-forest-100 flex flex-col gap-3">
              {currentUser ? (
                <div className="space-y-3.5 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-forest-750 text-white font-bold flex items-center justify-center font-serif">
                      {currentUser.email[0].toUpperCase()}
                    </div>
                    <div className="max-w-[170px] truncate">
                      <p className="text-xs font-bold text-forest-900 leading-tight">{currentUser.email}</p>
                      <span className="text-[9px] font-mono text-sand-850 bg-sand-100 border border-sand-200 px-1 rounded">{currentUser.role}</span>
                    </div>
                  </div>

                  {currentUser.role === 'admin' && (
                    <button
                      id="mobile-admin-dashboard-link"
                      onClick={() => handleRouteNavigate(currentRoute === 'admin' ? 'home' : 'admin')}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-sand-100 border border-sand-600/20 text-forest-900 transition mt-2 cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4 text-sand-700" />
                      <span>{currentRoute === 'admin' ? 'View Public Portal' : 'Admin Operations Mode'}</span>
                    </button>
                  )}

                  <button
                    id="mobile-logout-btn"
                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 px-2">
                  <button
                    id="mobile-login-btn"
                    onClick={() => triggerAuth('login')}
                    className="py-2.5 px-4 bg-white text-forest-800 border border-forest-150 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    id="mobile-register-btn"
                    onClick={() => triggerAuth('register')}
                    className="py-2.5 px-4 bg-forest-900 text-sand-550 border border-forest-800 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Join Safari
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Global Context Auth Modal Container */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}
