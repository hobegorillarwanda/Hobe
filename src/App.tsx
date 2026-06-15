/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import { 
  authService, 
  destinationService, 
  packageService, 
  bookingService, 
  AuthUser 
} from './services';
import { Destination, Package, Booking } from './types';
import { SEED_DESTINATIONS, SEED_PACKAGES } from './data';

// Eagerly import primary landing views for instant layout rendering
import Home from './pages/Home';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';

// Lazily load heavier page modules for peak performance (best practice code splitting)
const Destinations = lazy(() => import('./pages/Destinations'));
const Packages = lazy(() => import('./pages/Packages'));
const Conservation = lazy(() => import('./pages/Conservation'));
const BookingsHub = lazy(() => import('./pages/BookingsHub'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

import { Compass, Leaf, MapPin, Phone, Mail, AlertCircle, FolderLock } from 'lucide-react';
import Logo from './components/Logo';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>(SEED_DESTINATIONS);
  const [packages, setPackages] = useState<Package[]>(SEED_PACKAGES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  
  // Custom multi-page routing state
  const [currentRoute, setCurrentRoute] = useState<'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin' | 'privacy' | 'terms'>('home');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);

  // Synchronize route state with URL path for perfect bookmarking, sharing & back-button support without #
  useEffect(() => {
    const handlePopState = () => {
      const pathWithSlash = window.location.pathname;
      const parts = pathWithSlash.split('/').filter(Boolean);
      
      const mainRoute = parts[0] || 'home';
      const subRoute = parts[1] || null;

      const validRoutes = ['home', 'destinations', 'packages', 'booking', 'bookings-hub', 'conservation', 'admin', 'privacy', 'terms'];
      if (validRoutes.includes(mainRoute)) {
        setCurrentRoute(mainRoute as any);
        if (mainRoute === 'destinations') {
          setSelectedDestinationId(subRoute);
        } else {
          setSelectedDestinationId(null);
        }
      } else {
        // Fallback
        setCurrentRoute('home');
        setSelectedDestinationId(null);
      }
    };

    // Run check initially on mount
    handlePopState();

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [configuredSetup, setConfiguredSetup] = useState<{
    passengers: number;
    addons: string[];
    tierLevel: 'standard' | 'vip' | 'elite';
    calculatedTotal: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Floating Auth modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authModalRole, setAuthModalRole] = useState<'customer' | 'admin'>('customer');

  // 1. Subscribe to Auth status changes
  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch or seed cloud firestore collection metrics on mount
  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [dests, pkgs] = await Promise.all([
        destinationService.getAll(),
        packageService.getAll()
      ]);
      
      setDestinations(dests || []);
      setPackages(pkgs || []);

      if (pkgs && pkgs.length > 0 && !selectedPackage) {
        setSelectedPackage(pkgs[0]);
      }

      // Sync active tracking lists depending on level
      if (currentUser) {
        if (currentUser.role === 'admin') {
          const bks = await bookingService.getAll();
          setBookings(bks || []);
        } else {
          const bks = await bookingService.getByUser(currentUser.uid);
          setBookings(bks || []);
        }
      } else {
        setBookings([]);
      }
    } catch (err: any) {
      console.error("Database sync error:", err);
      setError('A connection sync issue occurred. Secure local database fallback is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [currentUser]);

  // 3. Auto-claim any guest bookings made prior to signing-in
  useEffect(() => {
    if (currentUser) {
      const pendingGuestBookingId = localStorage.getItem('hobe_pending_guest_booking_id');
      if (pendingGuestBookingId) {
        bookingService.claimBooking(pendingGuestBookingId, currentUser.uid)
          .then(() => {
            localStorage.removeItem('hobe_pending_guest_booking_id');
            fetchAllData();
          })
          .catch(err => console.error("Error auto-linking guest booking:", err));
      }
    }
  }, [currentUser]);

  // Handle Logouts
  const handleLogout = async () => {
    try {
      await authService.signOut();
      setCurrentRoute('home');
    } catch (err: any) {
      console.error("Logout failure: ", err);
    }
  };

  // Callback mapping for packages configuration setup
  const handleSelectConfigurePkg = (pkg: Package, setup: typeof configuredSetup) => {
    setSelectedPackage(pkg);
    setConfiguredSetup(setup);
  };

  const handleTriggerAuthModal = () => {
    setAuthModalMode('login');
    setAuthModalRole('customer');
    setAuthModalOpen(true);
  };

  const handleNavigateWithScroll = (route: any, subRoute?: string) => {
    const buildPath = subRoute 
      ? `/${route}/${subRoute}` 
      : `/${route === 'home' ? '' : route}`;
    
    window.history.pushState({}, '', buildPath);
    setCurrentRoute(route);
    if (route === 'destinations') {
      setSelectedDestinationId(subRoute || null);
    } else {
      setSelectedDestinationId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-sand-50/50">
      
      {/* Dynamic Navigation Navbar */}
      <Navbar 
        currentUser={currentUser}
        onLogout={handleLogout}
        currentRoute={currentRoute}
        onChangeRoute={handleNavigateWithScroll}
        onTriggerAuth={handleTriggerAuthModal}
      />

      {/* Database Warning Banner on Connectivity errors */}
      {error && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs py-2 px-6 flex items-center justify-center gap-2 select-none">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Routed views wrapper container */}
      <main className="flex-grow">
        {loading && destinations.length === 0 ? (
          /* Circular tracker loader */
          <div className="flex flex-col items-center justify-center py-44 space-y-4">
            <Compass className="w-12 h-12 text-forest-700 animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest text-forest-800 font-mono">
              Mapping Wildlife Reserve Canopies...
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center py-44 space-y-4">
                <Compass className="w-12 h-12 text-forest-700 animate-spin" />
                <p className="text-xs font-bold uppercase tracking-widest text-forest-800 font-mono">
                  Optimizing Wilderness View...
                </p>
              </div>
            }>
              {currentRoute === 'home' && (
                <Home 
                  destinations={destinations}
                  packages={packages}
                  onNavigate={handleNavigateWithScroll}
                  onSelectPackage={setSelectedPackage}
                />
              )}

              {currentRoute === 'destinations' && (
                <Destinations 
                  destinations={destinations}
                  onNavigate={handleNavigateWithScroll}
                  activeDestinationId={selectedDestinationId}
                  onSelectConfigurePkg={handleSelectConfigurePkg}
                />
              )}

              {currentRoute === 'packages' && (
                <Packages 
                  packages={packages}
                  onNavigate={handleNavigateWithScroll}
                  onSelectConfigurePkg={handleSelectConfigurePkg}
                />
              )}

              {currentRoute === 'conservation' && (
                <Conservation 
                  onNavigate={handleNavigateWithScroll}
                />
              )}

              {currentRoute === 'bookings-hub' && (
                <BookingsHub 
                  currentUser={currentUser}
                  onNavigate={handleNavigateWithScroll}
                  onTriggerAuth={handleTriggerAuthModal}
                />
              )}

              {currentRoute === 'booking' && (
                <BookingPage 
                  packages={packages}
                  selectedPackage={selectedPackage}
                  configuredSetup={configuredSetup}
                  currentUser={currentUser}
                  onNavigate={handleNavigateWithScroll}
                  onTriggerAuth={handleTriggerAuthModal}
                  onSelectPackage={setSelectedPackage}
                />
              )}

              {currentRoute === 'admin' && currentUser && currentUser.role === 'admin' && (
                <AdminPanel 
                  currentUser={currentUser}
                  destinations={destinations}
                  packages={packages}
                  bookings={bookings}
                  refreshData={fetchAllData}
                />
              )}

              {currentRoute === 'privacy' && (
                <Privacy onNavigate={handleNavigateWithScroll} />
              )}

              {currentRoute === 'terms' && (
                <Terms onNavigate={handleNavigateWithScroll} />
              )}
            </Suspense>
          </div>
        )}
      </main>

      {/* Premium Contact & Address Vetted footer */}
      <footer id="app-footer" className="bg-forest-950 text-white border-t border-forest-900/60 pt-20 pb-12 select-none">
        <div className="max-w-7xl mx-auto px-6 space-y-12 text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Column 1: Branding and certifications */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="p-1 bg-emerald-50 rounded-xl border border-forest-800">
                  <Logo size={42} />
                </div>
                <h3 className="font-serif text-xl font-bold tracking-tight">
                  Hobe Gorilla Rwanda
                </h3>
              </div>

              <p className="text-xs text-forest-200 leading-relaxed font-light pr-6">
                HOBE GORILLA RWANDA is your gate to the pristine heart of Rwanda. We craft customized, unforgettable wildlife and cultural experiences while promoting sustainable bio-diversity.
              </p>

              <div className="flex items-center gap-2 text-xs text-sand-500 font-mono">
                <Leaf className="w-4 h-4 text-sand-600 animate-pulse" />
                <span>Authorized Gorilla Trekking Partner</span>
              </div>
            </div>

            {/* Column 2: Route Navigation mappings */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-sand-200">
                Wilderness Links
              </h4>
              <ul className="space-y-2.5 text-xs text-forest-200 font-medium">
                <li>
                  <button onClick={() => handleNavigateWithScroll('home')} className="hover:text-sand-100 transition cursor-pointer text-left">
                    Home Sanctuary
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigateWithScroll('destinations')} className="hover:text-sand-100 transition cursor-pointer text-left">
                    Travel Locations
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigateWithScroll('packages')} className="hover:text-sand-100 transition cursor-pointer text-left">
                    Interactive Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigateWithScroll('conservation')} className="hover:text-sand-100 transition cursor-pointer text-left">
                    Conservation Studies
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigateWithScroll('booking')} className="hover:text-sand-100 transition cursor-pointer text-left">
                    Apply tracking Permits
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contacts */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-sand-200">
                Coordinators Contact
              </h4>
              
              <ul className="space-y-3.5 text-xs text-forest-200">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-sand-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">Kigali City, Gasabo District, Remera, Giporoso</span>
                </li>

                <li className="flex items-center gap-2.5 font-mono">
                  <Phone className="w-4 h-4 text-sand-600 shrink-0" />
                  <a href="tel:+250788653917" className="hover:text-sand-100">+250 788653917</a>
                </li>

                <li className="flex items-center gap-2.5 font-mono">
                  <Mail className="w-4 h-4 text-sand-600 shrink-0" />
                  <a href="mailto:hobegorillarwanda@gmail.com" className="hover:text-sand-100">hobegorillarwanda@gmail.com</a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-10 border-t border-forest-900/85 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-forest-300">
            <p>
              &copy; {new Date().getFullYear()} Hobe Gorilla Rwanda. All rights reserved. Created in Kigali.
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleNavigateWithScroll('privacy')} 
                className="hover:text-sand-100 transition cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-forest-800">|</span>
              <button 
                onClick={() => handleNavigateWithScroll('terms')} 
                className="hover:text-sand-100 transition cursor-pointer"
              >
                Terms & Conditions
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating global AuthModal intercept triggered by actions */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        initialRoleTab={authModalRole}
        onSuccess={(authenticatedUser) => {
          if (authenticatedUser && authenticatedUser.role === 'admin') {
            handleNavigateWithScroll('admin');
          }
        }}
      />

    </div>
  );
}

// git-sync-trigger