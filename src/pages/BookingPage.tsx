/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Package, Booking } from '../types';
import { bookingService, AuthUser } from '../services';
import { User, Phone, Mail, Calendar, Users, FileText, ChevronLeft, ChevronRight, HelpCircle, HardHat, Compass, Sparkles, Check, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AuthModal from '../components/AuthModal';

interface BookingPageProps {
  packages: Package[];
  selectedPackage: Package | null;
  configuredSetup: {
    passengers: number;
    addons: string[];
    tierLevel: 'standard' | 'vip' | 'elite';
    calculatedTotal: number;
  } | null;
  currentUser: AuthUser | null;
  onNavigate: (view: 'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin') => void;
  onTriggerAuth: () => void;
  onSelectPackage: (pkg: Package) => void;
}

export default function BookingPage({ 
  packages, 
  selectedPackage, 
  configuredSetup, 
  currentUser, 
  onNavigate,
  onTriggerAuth,
  onSelectPackage
}: BookingPageProps) {
  const [step, setStep] = useState(1);
  const [passengers, setPassengers] = useState(configuredSetup?.passengers || 2);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [error, setError] = useState('');
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state with preconfigured setup from Calculator
  useEffect(() => {
    if (configuredSetup) {
      setPassengers(configuredSetup.passengers);
    }
  }, [configuredSetup]);

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const activePackage = selectedPackage || packages[0];

  // Recalculate total cost if they didn't come from a preconfigured calculator setup
  const calculateLiveTotal = () => {
    if (configuredSetup && selectedPackage?.id === activePackage.id) {
      return configuredSetup.calculatedTotal;
    }
    // Fallback standard calculation
    const base = activePackage ? activePackage.baselineCost : 1650;
    return base * passengers;
  };

  const finalTotalCost = calculateLiveTotal();

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      if (!activePackage) {
        setError('Please select a safari travel package.');
        return;
      }
      if (passengers <= 0) {
        setError('Passenger headcount must be greater than zero.');
        return;
      }
      // Ensure date is chosen
      if (!travelDate) {
        setError('Please select your preferred travel start date.');
        return;
      }
      // Validate travelDate is not in the past
      const selectedTime = new Date(travelDate).getTime();
      const todayTime = new Date().setHours(0,0,0,0);
      if (selectedTime < todayTime) {
        setError('Permit date cannot be in the past. Choose an upcoming expedition date.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!fullName.trim()) {
        setError('Please provide your full legal name matching your passport.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid connection email address.');
        return;
      }
      if (!phone.trim()) {
        setError('Please provide a valid contact number.');
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setError('');
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');

    if (!currentUser) {
      // Prompt OAuth or standard signup/login
      onTriggerAuth();
      return;
    }

    setIsSubmitting(true);
    try {
      // Format details of addons or custom tier config so admins see it inside specialRequests if needed, or totalCost fits.
      let requestsWithSetup = specialRequests;
      if (configuredSetup) {
        const addonText = configuredSetup.addons.length > 0 
          ? `[Addons: ${configuredSetup.addons.join(', ')}]` 
          : '[No Addons]';
        requestsWithSetup = `${requestsWithSetup} | Tier Type: ${configuredSetup.tierLevel.toUpperCase()} | ${addonText}`.trim();
      }

      const result = await bookingService.create({
        userId: currentUser.uid,
        fullName,
        email,
        phone,
        travelDate,
        passengerCount: passengers,
        specialRequests: requestsWithSetup,
        packageId: activePackage.id,
        packageName: activePackage.title,
        totalCost: finalTotalCost
      });

      setSuccessBooking(result);
      setStep(4);
    } catch (err: any) {
      setError(err?.message || 'Failed to record tracking permit. Refresh and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 max-w-4xl mx-auto px-6">
      
      {/* 1. LAYOUT SECTION TITLES */}
      <div className="text-center space-y-4 mb-12">
        <span className="text-xs font-bold tracking-widest text-forest-700 uppercase bg-forest-100 px-3.5 py-1.5 rounded-full border border-forest-200/50 inline-block font-mono font-bold">
          Step Wise Registry
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-forest-900 leading-none">
          Permits Securing Desk
        </h1>
        <p className="text-xs text-forest-650 max-w-md mx-auto font-light leading-relaxed">
          Legal gorilla licenses are severely capped by the government of Rwanda. Complete your credentials dossier to lock-in active tracking calendars.
        </p>
      </div>

      {step < 4 && (
        <div className="mb-8 max-w-md mx-auto">
          {/* Progress indicators steps */}
          <div className="flex justify-between items-center text-xs font-mono font-bold text-sand-800">
            <span className={step >= 1 ? 'text-forest-700' : 'text-stone-400'}>1. PERMITS PARAM</span>
            <span className={step >= 2 ? 'text-forest-700' : 'text-stone-400'}>2. CREDENTIALS</span>
            <span className={step >= 3 ? 'text-forest-700' : 'text-stone-400'}>3. REVIEW</span>
          </div>
          <div className="h-1.5 w-full bg-forest-100 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-forest-700 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 2. STEP FORM ENGINES */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-luxury p-6 md:p-10 text-left">
        
        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: LICENSE & PASSENGERS PARAM SETUP */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-forest-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-sand-600" />
              <span>Select Active Tracking Expedition Parameters</span>
            </h3>

            <div className="space-y-4">
              {/* Select Package Dropdown */}
              <div className="space-y-2">
                <label htmlFor="booking-pkg-select" className="text-[10px] font-bold text-forest-800 uppercase tracking-wider block">
                  Select Base Safari Formula Pack
                </label>
                <select
                  id="booking-pkg-select"
                  value={activePackage.id}
                  onChange={(e) => {
                    const found = packages.find(p => p.id === e.target.value);
                    if (found) {
                      // Call standard callback so the rest of the app updates
                      onSelectPackage(found);
                    }
                  }}
                  className="w-full p-3.5 bg-sand-50 border border-forest-150 rounded-2xl text-xs focus:ring-2 focus:ring-forest-600 outline-none"
                >
                  {packages.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.duration}) - Baseline ${p.baselineCost} / person
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Select Date input */}
                <div className="space-y-2">
                  <label htmlFor="expedition-date-input" className="text-[10px] font-bold text-forest-800 uppercase tracking-wider block">
                    Preferred Expedition Tracking Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-forest-650" />
                    <input
                      id="expedition-date-input"
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-sand-50 border border-forest-150 rounded-2xl text-xs focus:ring-2 focus:ring-forest-600 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Live Client Counter */}
                <div className="space-y-2">
                  <label htmlFor="pax-counter-booking" className="text-[10px] font-bold text-forest-800 uppercase tracking-wider block">
                    Passenger Headcount
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-3.5 w-4 h-4 text-forest-650" />
                    <input
                      id="pax-counter-booking"
                      type="number"
                      min="1"
                      max="12"
                      value={passengers}
                      onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full pl-11 pr-4 py-3 bg-sand-50 border border-forest-150 rounded-2xl text-xs focus:ring-2 focus:ring-forest-600 outline-none font-mono"
                    />
                  </div>
                </div>

              </div>

              {/* Show Configured items if customized from Calculator page */}
              {configuredSetup && configuredSetup.addons.length > 0 && (
                <div className="p-4 bg-forest-50/50 border border-forest-100 rounded-2xl space-y-2">
                  <span className="text-[9px] font-mono text-sand-800 font-bold uppercase block tracking-wider">Locked-in Upgrades Vetted</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] bg-white border border-forest-150 px-2.5 py-0.5 rounded text-forest-900 capitalize font-medium">
                      Setup: {configuredSetup.tierLevel}
                    </span>
                    {configuredSetup.addons.map((a, idx) => (
                      <span key={idx} className="text-[10px] bg-white border border-forest-150 px-2.5 py-0.5 rounded text-forest-900 font-medium">
                        ✦ {a.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="pt-6 border-t border-forest-100 flex justify-end">
              <button
                id="booking-next-btn-1"
                type="button"
                onClick={handleNextStep}
                className="py-3 px-8 bg-forest-900 border border-forest-800 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-forest-850 cursor-pointer text-center"
              >
                Proceed with Credentials
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PASSPORT CREDENTIALS DETAILED PROFILE */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-forest-900 flex items-center gap-2">
              <User className="w-5 h-5 text-sand-600" />
              <span>Primate registry credentials passport dossier</span>
            </h3>

            <div className="space-y-4">
              
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-[10px] font-bold text-forest-800 uppercase tracking-wider block">
                  Full Legal Name (Matching Passport ID)
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-forest-650" />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Jane Goodall"
                    className="w-full pl-11 pr-4 py-3 bg-sand-50 border border-forest-150 rounded-2xl text-xs focus:ring-2 focus:ring-forest-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-bold text-forest-800 uppercase tracking-wider block">
                    Contact Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-forest-650" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      disabled={!!currentUser} // Auto filled if authenticated
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. jane@gorillasafari.org"
                      className="w-full pl-11 pr-4 py-3 bg-sand-50 border border-forest-150 rounded-2xl text-xs focus:ring-2 focus:ring-forest-600 outline-none disabled:opacity-75"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-[10px] font-bold text-forest-800 uppercase tracking-wider block">
                    Contact WhatsApp / Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-forest-650" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +250 788 653 917"
                      className="w-full pl-11 pr-4 py-3 bg-sand-50 border border-forest-150 rounded-2xl text-xs focus:ring-2 focus:ring-forest-600 outline-none font-mono"
                    />
                  </div>
                </div>

              </div>

              <div className="space-y-2 pt-2">
                <label id="requests-label" className="text-[10px] font-bold text-forest-800 uppercase tracking-wider block">
                  Dietary restriction / Medical requests / Trekking guides advice (Optional)
                </label>
                <div className="relative font-sans text-xs">
                  <textarea
                    id="special-requests-input"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="List food restrictions, pre-existing physical restrictions (need porter help), etc."
                    className="w-full p-4 bg-sand-50 border border-forest-150 rounded-2xl text-xs focus:ring-2 focus:ring-forest-600 outline-none min-h-[90px]"
                  />
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-forest-100 flex justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="py-3 px-6 border border-forest-200 text-forest-750 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-forest-50 cursor-pointer"
              >
                Back
              </button>
              <button
                id="booking-next-btn-2"
                type="button"
                onClick={handleNextStep}
                className="py-3 px-8 bg-forest-900 border border-forest-800 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-forest-850 cursor-pointer"
              >
                Proceed with Review
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUMMARY VERIFICATION PRIOR BOOKING */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-forest-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-sand-600" />
              <span>Verify tracking application metrics before securement</span>
            </h3>

            <div className="p-5 bg-sand-50 rounded-2xl border border-forest-100 space-y-4">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-stone-400 block uppercase font-sans">Primary Client:</span>
                  <span className="font-bold text-forest-950 uppercase font-sans text-xs">{fullName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block uppercase font-sans">Travel Date:</span>
                  <span className="font-bold text-forest-950 text-xs">
                    {new Date(travelDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block uppercase font-sans">Client size:</span>
                  <span className="font-bold text-forest-950 text-xs">{passengers} Passengers</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block uppercase font-sans font-bold">Estimated Cost:</span>
                  <span className="font-extrabold text-[#94743b] text-sm">${finalTotalCost} USD</span>
                </div>
              </div>

              <div className="border-t border-forest-100/50 pt-3 flex flex-col md:flex-row gap-4 justify-between items-start text-xs font-light">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-sand-800 font-bold uppercase tracking-wider block">Expedition Focus Formula:</span>
                  <span className="font-sans font-bold text-forest-900">{activePackage.title} ({activePackage.duration})</span>
                  <p className="text-[10.5px] text-forest-650 max-w-sm font-light leading-normal mt-0.5">{activePackage.description}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-forest-100/60 font-medium font-sans text-[11px] space-y-1 max-w-[240px]">
                  <span className="font-mono text-[9px] text-sand-700 font-bold uppercase tracking-wider block">Official Permit Policy</span>
                  <p className="text-stone-500 text-[10px] leading-snug font-light">
                    * Booking confirmation commits gorilla tracking fees which are non-refundable & managed in accordance with RDB conservation schedules.
                  </p>
                </div>
              </div>

            </div>

            {/* Authentications alerts */}
            {!currentUser && (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-amber-900">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <p>Tracking registration requires a secured profile mapping. Authenticate now to submit reservations directly with Rwanda Development parks.</p>
                </div>
                <button
                  type="button"
                  onClick={onTriggerAuth}
                  className="py-2.5 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl uppercase text-[10px] tracking-wider transition whitespace-nowrap cursor-pointer"
                >
                  Sign-In to Lock-in
                </button>
              </div>
            )}

            <div className="pt-6 border-t border-forest-100 flex justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="py-3 px-6 border border-forest-200 text-forest-750 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-forest-50 cursor-pointer"
              >
                Back
              </button>
              <button
                id="booking-final-commit-btn"
                type="button"
                onClick={() => handleFinalSubmit()}
                disabled={isSubmitting}
                className="py-3 px-8 bg-forest-900 border border-forest-800 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-forest-850 cursor-pointer disabled:opacity-50 text-center flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? 'Securing Permit...' : 'Submit Certified Voucher Request'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS CERTIFICATE PANEL */}
        {step === 4 && successBooking && (
          <div className="space-y-6 text-center py-6">
            <div className="w-16 h-16 bg-forest-100 rounded-full border border-forest-200 flex items-center justify-center mx-auto text-forest-750">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5px]" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-[#94743b] font-bold uppercase block">Expedition Confirmed</span>
              <h3 className="font-serif text-3xl font-bold text-forest-900 leading-tight">
                Murakoze Cane!
              </h3>
              <p className="text-xs text-forest-650 max-w-md mx-auto leading-relaxed font-light">
                We have registered your tracking variables under reservation ticket <b>#{successBooking.id.split('_')[1] || successBooking.id.slice(0, 6)}</b>. Official forest permit vouchers are wired and mapping complete.
              </p>
            </div>

            <div className="p-4 bg-sand-50 rounded-2xl border border-forest-100 max-w-sm mx-auto text-xs grid grid-cols-2 gap-4 text-left font-mono">
              <div>
                <span className="text-[8.5px] text-stone-400 block uppercase">Expedition Guide</span>
                <span className="font-sans font-bold text-forest-900">{successBooking.packageName}</span>
              </div>
              <div>
                <span className="text-[8.5px] text-stone-400 block uppercase">Authorizations</span>
                <span className="font-sans font-bold text-forest-900">{successBooking.passengerCount} Clients</span>
              </div>
            </div>

            <div className="pt-6 border-t border-forest-100 flex flex-col sm:flex-row gap-3 items-center justify-center">
              <button
                id="success-view-hub-btn"
                onClick={() => onNavigate('bookings-hub')}
                className="w-full sm:w-auto py-3 px-8 bg-forest-900 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Open My Permits Hub
              </button>
              <button
                id="success-close-btn"
                onClick={() => {
                  setStep(1);
                  setFullName('');
                  setPhone('');
                  setTravelDate('');
                  setSpecialRequests('');
                  setSuccessBooking(null);
                  onNavigate('home');
                }}
                className="w-full sm:w-auto py-3 px-6 border border-forest-200 text-forest-750 hover:bg-forest-50 font-semibold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Return Home
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
