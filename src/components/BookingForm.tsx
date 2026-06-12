/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Package, Booking } from '../types';
import { bookingService, AuthUser } from '../services';
import { User, Phone, Mail, Calendar, Users, FileText, ChevronLeft, ChevronRight, HelpCircle, Ticket, Heart, Sparkles } from 'lucide-react';
import AuthModal from './AuthModal';

interface BookingFormProps {
  packages: Package[];
  selectedPackage: Package | null;
  onPackageSelect: (pkg: Package) => void;
  currentUser: AuthUser | null;
}

export default function BookingForm({ packages, selectedPackage, onPackageSelect, currentUser }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [passengers, setPassengers] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guest capture popup controls
  const [showAuthIntercept, setShowAuthIntercept] = useState(false);

  // Sync email input with logged-in user profile
  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const activePackage = selectedPackage || packages[0];

  const totalCost = activePackage ? activePackage.baselineCost * passengers : 0;

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
      setStep(2);
    } else if (step === 2) {
      if (!fullName.trim()) {
        setError('Please provide your full legal name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid contact email address.');
        return;
      }
      if (!phone.trim()) {
        setError('Please provide a working phone number.');
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

    if (!travelDate) {
      setError('Please select your preferred travel start date.');
      return;
    }

    // Intercept checkout if user is not authenticated (unauthenticated guest)
    if (!currentUser) {
      setShowAuthIntercept(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await bookingService.create({
        userId: currentUser.uid,
        fullName,
        email,
        phone,
        travelDate,
        passengerCount: passengers,
        specialRequests,
        packageId: activePackage.id,
        packageName: activePackage.title,
        totalCost
      });
      setSuccess(true);
      setStep(4);
    } catch (err: any) {
      setError(err?.message || 'Failed to record booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Callback after guest successfully logs in on our intercept trigger
  const handleAuthSuccess = () => {
    setShowAuthIntercept(false);
    // User is signed in now, proceed with final submit automatically!
  };

  const resetForm = () => {
    setStep(1);
    setPassengers(1);
    setFullName('');
    setPhone('');
    setTravelDate('');
    setSpecialRequests('');
    setSuccess(false);
    setError('');
  };

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cost);
  };

  if (success) {
    return (
      <div id="booking-success-card" className="bg-white rounded-3xl p-10 border border-forest-100 shadow-luxury text-center max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto border border-forest-200">
          <Heart className="w-8 h-8 text-forest-700 fill-forest-700 animate-pulse" />
        </div>
        <div>
          <h3 className="font-serif text-3xl font-bold tracking-tight text-forest-900">
            Murakoze Cane!
          </h3>
          <p className="text-sm text-forest-700 mt-2 font-medium">
            (Thank you very much)
          </p>
          <p className="text-sm text-forest-600 mt-3 max-w-md mx-auto leading-relaxed">
            Your booking request for <span className="font-bold text-forest-900">{activePackage?.title}</span> is registered. Our professional primates expert will email your itinerary within 24 hours.
          </p>
        </div>

        <div className="bg-sand-50 p-5 rounded-2xl border border-forest-100 text-left space-y-3.5 max-w-md mx-auto">
          <div className="flex justify-between text-xs border-b border-forest-150 pb-2">
            <span className="text-forest-600 font-medium">Lead Passenger:</span>
            <span className="font-bold text-forest-900">{fullName}</span>
          </div>
          <div className="flex justify-between text-xs border-b border-forest-150 pb-2">
            <span className="text-forest-600 font-medium">Headcount:</span>
            <span className="font-bold text-forest-900 font-mono">{passengers} Traveler(s)</span>
          </div>
          <div className="flex justify-between text-xs border-b border-forest-150 pb-2">
            <span className="text-forest-600 font-medium">Travel Date:</span>
            <span className="font-bold text-forest-900 font-mono">{travelDate}</span>
          </div>
          <div className="flex justify-between text-xs pt-1">
            <span className="text-forest-700 font-bold">Total Cost:</span>
            <span className="font-bold text-forest-900 font-mono text-base">{formatCost(totalCost)}</span>
          </div>
        </div>

        <button
          id="btn-book-another"
          onClick={resetForm}
          className="px-6 py-3 bg-forest-700 hover:bg-forest-600 text-sand-50 font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
        >
          Book Another Safari
        </button>
      </div>
    );
  }

  return (
    <div id="booking-scaffold" className="bg-white rounded-3xl overflow-hidden shadow-luxury border border-forest-100/40 grid grid-cols-1 md:grid-cols-12 max-w-5xl mx-auto">
      {/* Steps Indicator Left Progress bar (Desktop) */}
      <div className="md:col-span-4 bg-forest-800 p-8 text-white relative flex flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900 to-forest-800 opacity-95 pointer-events-none"></div>
        <div className="relative z-10 space-y-8">
          <div>
            <span className="text-[10px] font-bold text-sand-200 tracking-widest uppercase bg-forest-700/80 px-2.5 py-1 rounded border border-forest-600 font-mono">
              Reservation
            </span>
            <h3 className="font-serif text-2xl font-bold text-sand-100 mt-3 leading-tight">
              Secure Your Permits
            </h3>
          </div>

          {/* Stepper details */}
          <div className="space-y-6">
            {[
              { idx: 1, label: 'Select Tier & Headcount', desc: 'Active packages and group sizes' },
              { idx: 2, label: 'Lead Traveler Info', desc: 'Secure email and phone details' },
              { idx: 3, label: 'Set Date & Custom Demands', desc: 'Travel dates and special requests' }
            ].map(s => (
              <div key={s.idx} className="flex gap-4 items-start">
                <span className={`w-7 h-7 flex items-center justify-center font-mono text-xs font-bold rounded-lg border transition ${
                  step === s.idx 
                    ? 'bg-sand-600 border-sand-600 text-forest-900 font-bold' 
                    : step > s.idx 
                    ? 'bg-forest-700 border-forest-750 text-sand-200 line-through' 
                    : 'bg-transparent border-forest-700 text-forest-300'
                }`}>
                  {s.idx}
                </span>
                <div>
                  <h4 className={`text-xs font-bold ${step === s.idx ? 'text-white' : 'text-forest-200'}`}>
                    {s.label}
                  </h4>
                  <p className="text-[10px] text-forest-300/85 mt-0.5 leading-snug">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Dynamic quote card */}
        {activePackage && (
          <div className="relative z-10 bg-forest-900/60 p-4 rounded-xl border border-forest-700/60 space-y-3 mt-8">
            <div className="flex justify-between items-start gap-2 border-b border-forest-800 pb-2.5">
              <div>
                <span className="text-[9px] font-mono text-sand-200/90 tracking-wider uppercase">Active Tier</span>
                <p className="font-serif text-sm font-bold text-sand-50">{activePackage.title}</p>
              </div>
              <span className="text-xs bg-forest-800 text-sand-100 px-2 py-0.5 rounded border border-forest-750 font-mono">
                {activePackage.duration}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-forest-250">
              <div className="flex justify-between">
                <span>Baseline Cost:</span>
                <span className="font-mono">{formatCost(activePackage.baselineCost)} / pax</span>
              </div>
              <div className="flex justify-between">
                <span>Passengers:</span>
                <span className="font-bold text-white font-mono">{passengers} Traveler(s)</span>
              </div>
            </div>

            <div className="border-t border-forest-800 pt-2 flex justify-between items-baseline">
              <span className="text-xs font-bold text-sand-200 uppercase">Est. Total:</span>
              <span className="text-lg font-serif font-bold text-white font-mono tracking-tight">
                {formatCost(totalCost)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Booking Form steps (Desktop) */}
      <form onSubmit={(e) => e.preventDefault()} className="md:col-span-8 p-8 flex flex-col justify-between">
        <div className="space-y-6">
          {error && (
            <div id="booking-validation-error" className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-1 duration-200">
              <div>
                <h4 className="font-serif text-2xl font-bold text-forest-900">Choose Safari Tier</h4>
                <p className="text-xs text-forest-600 mt-1">Select from our three curated gorilla exploration matrices</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-forest-800 uppercase tracking-widest leading-none">
                  Available Tiers
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {packages.map(p => (
                    <button
                      id={`tier-select-${p.id}`}
                      key={p.id}
                      type="button"
                      onClick={() => onPackageSelect(p)}
                      className={`p-4 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer ${
                        activePackage.id === p.id
                          ? 'border-forest-700 bg-forest-50/50 ring-2 ring-forest-700/20'
                          : 'border-forest-100 hover:bg-forest-50/20'
                      }`}
                    >
                      <div>
                        <span className="text-[9px] font-bold tracking-widest text-forest-600 uppercase">
                          {p.tier}
                        </span>
                        <h5 className="text-xs font-bold text-forest-900 mt-1 leading-tight">{p.title}</h5>
                      </div>
                      <span className="text-xs font-bold text-forest-700 mt-3 font-mono">
                        {formatCost(p.baselineCost)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center bg-sand-50 p-4 rounded-xl border border-forest-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-lg border border-forest-100 text-forest-700">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-forest-900">Passenger Headcount</h5>
                      <p className="text-[10px] text-forest-650">Include yourself and all traveling members</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      id="pax-minus-btn"
                      type="button"
                      onClick={() => setPassengers(p => Math.max(1, p - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-forest-100 rounded-lg border border-forest-200 text-forest-800 font-bold transition cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-mono text-forest-900">
                      {passengers}
                    </span>
                    <button
                      id="pax-plus-btn"
                      type="button"
                      onClick={() => setPassengers(p => Math.min(25, p + 1))}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-forest-100 rounded-lg border border-forest-200 text-forest-800 font-bold transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-1 duration-200">
              <div>
                <h4 className="font-serif text-2xl font-bold text-forest-900">Lead Passenger Contact</h4>
                <p className="text-xs text-forest-600 mt-1">Provide coordination details for gorilla trekking permits communication</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-forest-800 uppercase tracking-widest mb-1.5">
                    Full Legal Name (as in passport)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-forest-600">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="book-fullName-input"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Jean Damascene"
                      className="w-full pl-10 pr-3 py-2 bg-white border border-forest-200/65 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-forest-800 uppercase tracking-widest mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-forest-600">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        id="book-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jean@example.com"
                        className="w-full pl-10 pr-3 py-2 bg-white border border-forest-200/65 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 disabled:opacity-60"
                        disabled={!!currentUser} // Prevent editing email if already signed in
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-forest-800 uppercase tracking-widest mb-1.5">
                      Phone Number (WhatsApp preferred)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-forest-600">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        id="book-phone-input"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+250 788..."
                        className="w-full pl-10 pr-3 py-2 bg-white border border-forest-200/65 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-1 duration-200">
              <div>
                <h4 className="font-serif text-2xl font-bold text-forest-900">Set Travel Details</h4>
                <p className="text-xs text-forest-600 mt-1">Lock down travel dates and outline customization targets</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-forest-800 uppercase tracking-widest mb-1.5">
                    Safari Commencing Date
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-forest-600">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <input
                      id="book-date-input"
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-white border border-forest-200/65 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-800 uppercase tracking-widest mb-1.5">
                    Special Requests, Dietary & Fitness Needs
                  </label>
                  <div className="relative">
                    <span className="absolute top-2.5 left-3 text-forest-650">
                      <FileText className="w-4 h-4" />
                    </span>
                    <textarea
                      id="book-requests-input"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                      placeholder="Let us know if you require private guides, have food allergies, or fitness limitations..."
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-forest-200/65 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                    />
                  </div>
                </div>
              </div>

              {/* Guest capture informational callout */}
              {!currentUser && (
                <div className="p-3.5 bg-sand-100 rounded-xl border border-sand-200 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-sand-700 animate-bounce" />
                  <p className="text-[10px] text-forest-800 leading-snug">
                    <strong>Guest Booking Hold</strong>: Submitting this form will safely trigger account enrollment/login to secure your record in the database.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stepper Buttons Row */}
        <div className="mt-8 pt-6 border-t border-forest-100 flex justify-between items-center">
          {step > 1 ? (
            <button
              id="btn-back-step"
              type="button"
              onClick={handlePrevStep}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-forest-700 hover:text-forest-900 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              id="btn-next-step"
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-1.5 py-2.5 px-5 bg-forest-900 hover:bg-forest-800 text-sand-50 font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-confirm-booking"
              type="button"
              onClick={() => handleFinalSubmit()}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 py-3 px-6 bg-sand-600 hover:bg-sand-700 disabled:bg-forest-200 text-forest-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              <span>{isSubmitting ? 'Securing Permit...' : 'Submit Safari Reservation'}</span>
              <Ticket className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Guest Intercept Auth Modal Trigger */}
      <AuthModal
        isOpen={showAuthIntercept}
        onClose={() => setShowAuthIntercept(false)}
        onSuccess={handleAuthSuccess}
        initialMode="register"
      />
    </div>
  );
}
