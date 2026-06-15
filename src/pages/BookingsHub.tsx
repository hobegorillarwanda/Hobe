/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Booking } from '../types';
import { bookingService, AuthUser } from '../services';
import { Compass, HelpCircle, Check, MapPin, Printer, ShieldCheck, Heart, User, Calendar, FileText, CheckSquare, Square, RefreshCw, X, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from '../components/Logo';

interface BookingsHubProps {
  currentUser: AuthUser | null;
  onNavigate: (view: 'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin') => void;
  onTriggerAuth: () => void;
}

export default function BookingsHub({ currentUser, onNavigate, onTriggerAuth }: BookingsHubProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Booking | null>(null);

  // Packing Checklist states
  const [packedItems, setPackedItems] = useState<string[]>([
    'permit-voucher', // default pre-checked to feel active
  ]);

  const checklistItems = [
    { id: 'permit-voucher', category: 'Documentation', name: 'Official Printed Permit Voucher Copies' },
    { id: 'yellow-fever', category: 'Documentation', name: 'Yellow Fever Vaccination Certificates' },
    { id: 'passport-copy', category: 'Documentation', name: 'Passport Copy (Minimum 6 months validity)' },
    { id: 'boots', category: 'Attire & Wardrobe', name: 'Ankle-high waterproof hiking boots' },
    { id: 'gloves', category: 'Attire & Wardrobe', name: 'Thick garden gloves (protection from stinging nettles)' },
    { id: 'gaiters', category: 'Attire & Wardrobe', name: 'Long moisture leggings/gaiters to shield trousers' },
    { id: 'masks', category: 'Attire & Wardrobe', name: 'Approved protective KN95 face masks' },
    { id: 'hydration', category: 'Trekking Gear', name: 'Reusable water bottle bladder (No single-use plastics)' },
    { id: 'insect-shield', category: 'Trekking Gear', name: 'High-strength DEET insect repellent' }
  ];

  const fetchBookings = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const list = await bookingService.getByUser(currentUser.uid);
      setBookings(list);
    } catch (err) {
      console.error("Could not fetch user bookings logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentUser]);

  const toggleChecklistItem = (id: string) => {
    setPackedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const calculatePackingProgress = () => {
    const total = checklistItems.length;
    const current = packedItems.length;
    return Math.round((current / total) * 100);
  };

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-6 space-y-16 text-left">
      
      {/* 1. VIEW HEADER */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold tracking-widest text-forest-700 uppercase bg-forest-100 px-3.5 py-1.5 rounded-full border border-forest-200/50 inline-block font-mono">
          My Sanctuary
        </span>
        <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-forest-900 leading-none">
          My Permits Hub
        </h1>
        <p className="text-sm text-forest-650 max-w-xl mx-auto font-light leading-relaxed">
          Access your saved booking history, print your official tracking permits, and prepare for your mountain trail trek.
        </p>
      </div>

      {/* 2. SECURITY GUARD GATE - RENDER CORRESPONDING STATES */}
      {!currentUser ? (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-forest-100 p-8 md:p-10 shadow-luxury text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 border border-forest-150 rounded-2xl flex items-center justify-center mx-auto text-forest-750 p-2">
            <Logo size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-forest-900">Sign-in to Sync Reservation Records</h3>
            <p className="text-xs text-forest-650 max-w-md mx-auto font-light leading-relaxed">
              Official gorilla tracking regulations mandate secure profile mapping. Log in to claim tracking vouchers, query pending applications, and download print invoices.
            </p>
          </div>
          <div className="pt-2">
            <button
              id="hub-profile-signin-btn"
              onClick={onTriggerAuth}
              className="py-3 px-8 bg-forest-900 hover:bg-forest-850 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Sign-In or Register Account
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: ACTIVE CONSERVATION RECORDS LIST */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-center border-b border-forest-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-forest-900 flex items-center gap-2">
                <span>Active Tracking Vouchers</span>
                {loading && <RefreshCw className="w-3.5 h-3.5 text-forest-600 animate-spin" />}
              </h3>
              <button
                id="btn-manual-sync-hub"
                onClick={fetchBookings}
                className="text-[10px] font-mono text-sand-800 font-bold hover:text-sand-900 flex items-center gap-1 cursor-pointer bg-sand-100 px-2 py-0.5 rounded border border-sand-200"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync Cloud</span>
              </button>
            </div>

            {loading ? (
              <div className="py-20 text-center text-xs text-forest-600">
                Loading your tracking permits from our reservation list...
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-forest-100 text-center space-y-5">
                <p className="text-xs text-forest-650 font-light">
                  You do not have any active tracking permits booked yet under this account.
                </p>
                <button
                  id="hub-book-tour-btn"
                  onClick={() => onNavigate('packages')}
                  className="py-2.5 px-6 bg-sand-600 hover:bg-sand-700 text-forest-950 font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer inline-block"
                >
                  View Expedition Packages
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => {
                  const isConfirmed = booking.status === 'Confirmed';
                  const isCancelled = booking.status === 'Cancelled';
                  return (
                    <div 
                      key={booking.id}
                      className="bg-white p-6 rounded-3xl border border-forest-100/80 shadow-luxury space-y-4 text-left"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-sand-800 font-bold block">
                            RESERVATION PERMIT: #{booking.id.split('_')[1] || booking.id.slice(0, 8)}
                          </span>
                          <h4 className="font-serif text-lg font-bold text-forest-900">
                            {booking.packageName}
                          </h4>
                        </div>

                        {/* Status label badges */}
                        <span className={`text-[10px] uppercase tracking-wider font-mono font-extrabold px-3 py-1 rounded-full border flex items-center gap-1.5 h-fit ${
                          isConfirmed 
                            ? 'bg-forest-100 border-forest-200 text-forest-750' 
                            : isCancelled 
                              ? 'bg-red-50 border-red-100 text-red-700' 
                              : 'bg-amber-50 border-amber-100 text-amber-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isConfirmed ? 'bg-forest-600' : isCancelled ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                          <span>{booking.status}</span>
                        </span>
                      </div>

                      {/* Client parameters list */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-2 border-y border-forest-50/50 text-xs text-forest-700">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono uppercase text-stone-400">TRACK DATE</span>
                          <p className="font-medium text-forest-950 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-sand-700" />
                            <span>{new Date(booking.travelDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono uppercase text-stone-400">PASSENGER COUNT</span>
                          <p className="font-medium text-forest-950 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-sand-700" />
                            <span>{booking.passengerCount} Clients</span>
                          </p>
                        </div>
                        <div className="space-y-0.5 col-span-2 md:col-span-1">
                          <span className="text-[9px] font-mono uppercase text-stone-400">FINANCING TOTAL</span>
                          <p className="font-bold text-forest-950 font-mono">
                            ${booking.totalCost} USD
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-forest-600">
                          {isConfirmed ? (
                            <>
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="font-light">Official tracking licenses are mapped and ready at base camp.</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                              <span className="font-light">Application pending. RDB registry clearing completes in under 24 hours.</span>
                            </>
                          )}
                        </div>
                        <button
                          id={`btn-hub-cert-${booking.id}`}
                          onClick={() => setActiveTicket(booking)}
                          className="w-full sm:w-auto py-2 px-4 bg-forest-900 border border-forest-800 text-white hover:bg-forest-850 font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer text-center"
                        >
                          Verify Permit Docket
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: INTERACTIVE WARDROBE PACKING PROGRESS CHECKLIST */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-serif text-xl font-bold text-forest-900 border-b border-forest-100 pb-3">
              Trail Readiness Gauge
            </h3>

            <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-luxury space-y-6 text-left">
              
              {/* Progress visual circular status bar count */}
              <div className="flex items-center gap-4 bg-forest-50/50 p-4 rounded-2xl border border-forest-100/60">
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  {/* Flat circle representing progress */}
                  <div className="absolute inset-0 rounded-full border-4 border-forest-100"></div>
                  <div className="text-xs font-mono font-extrabold text-forest-850">
                    {calculatePackingProgress()}%
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-forest-900">Trail Pack Progress</h4>
                  <p className="text-[10px] text-forest-650">
                    {packedItems.length} of {checklistItems.length} essential items packed.
                  </p>
                </div>
              </div>

              {/* Items categories list */}
              <div className="space-y-4">
                {['Documentation', 'Attire & Wardrobe', 'Trekking Gear'].map(category => {
                  const categoryItems = checklistItems.filter(item => item.category === category);
                  return (
                    <div key={category} className="space-y-2">
                      <h4 className="text-[9.5px] font-bold text-[#94743b] uppercase tracking-widest border-b border-forest-50 pb-1">
                        {category}
                      </h4>
                      <ul className="space-y-1.5">
                        {categoryItems.map(item => {
                          const isPacked = packedItems.includes(item.id);
                          return (
                            <li 
                              key={item.id}
                              onClick={() => toggleChecklistItem(item.id)}
                              className="flex gap-2.5 items-start text-[11px] text-forest-750 font-light select-none cursor-pointer hover:text-forest-950 transition leading-snug"
                            >
                              <span className="shrink-0 mt-0.5">
                                {isPacked ? (
                                  <CheckSquare className="w-4 h-4 text-forest-700" />
                                ) : (
                                  <Square className="w-4 h-4 text-forest-200" />
                                )}
                              </span>
                              <span className={isPacked ? 'line-through text-stone-400 font-normal' : ''}>
                                {item.name}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* 3. POPUP MODAL FOR EXPENDITURE PERMIT CERTIFICATES */}
      <AnimatePresence>
        {activeTicket && (
          <motion.div
            key="ticket-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-xl bg-white rounded-3xl border border-forest-150 shadow-luxury overflow-hidden flex flex-col max-h-[85vh] print:p-0 print:border-none print:shadow-none"
            >
              
              {/* PRINT CONTAINER ELEMENT */}
              <div id="physical-printed-cert-voucher" className="p-6 md:p-8 space-y-6 overflow-y-auto print:overflow-visible">
                
                {/* Official Header */}
                <div className="flex justify-between items-start gap-4 border-b-2 border-forest-900 pb-5">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono tracking-widest text-[#94743b] font-bold uppercase block leading-none">
                      Rwanda Development Board Certified
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-forest-950">
                      Hobe Gorilla Rwanda
                    </h3>
                    <p className="text-[10px] text-forest-650 leading-tight">
                      Eco-Luxury Safari Permits Registry, Kigali, Gasabo
                    </p>
                  </div>
                  
                  {/* Off-white seal medallion */}
                  <div className="w-16 h-16 rounded-full border-4 border-double border-forest-700 flex flex-col items-center justify-center text-center p-1 font-mono text-[7px] leading-tight text-forest-800 tracking-tighter self-center">
                    <span>OFFICIAL</span>
                    <span className="font-bold font-sans text-[8px]">SEAL</span>
                    <span>VERIFIED</span>
                  </div>
                </div>

                {/* Subtitle */}
                <div className="text-center bg-forest-50 p-3 rounded-xl border border-forest-100">
                  <h4 className="text-[11px] font-bold font-mono text-forest-905 uppercase tracking-widest">
                    OFFICIAL PRIMATE TRACKING ACCREDITATION DECREE
                  </h4>
                  <p className="text-[10px] text-forest-650 font-light mt-0.5 leading-none">
                    Legal tracking permit cleared under wildlife protection rules of Volcanoes National Park.
                  </p>
                </div>

                {/* Grid data elements */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  
                  <div className="space-y-1 bg-sand-50/50 p-3 rounded-lg border border-forest-50">
                    <span className="text-[8px] text-stone-400 uppercase block">PRIMARY CLIENT NAME</span>
                    <p className="font-bold text-forest-900 uppercase font-sans truncate">{activeTicket.fullName}</p>
                  </div>

                  <div className="space-y-1 bg-sand-50/50 p-3 rounded-lg border border-forest-50">
                    <span className="text-[8px] text-stone-400 uppercase block">TRACKING ID</span>
                    <p className="font-bold text-forest-900 uppercase truncate">HGR-{activeTicket.id.split('_')[1] || activeTicket.id.slice(0, 8)}</p>
                  </div>

                  <div className="space-y-1 bg-sand-50/50 p-3 rounded-lg border border-forest-50">
                    <span className="text-[8px] text-stone-400 uppercase block">COORDINATION TOUR</span>
                    <p className="font-bold text-forest-900 font-sans truncate">{activeTicket.packageName}</p>
                  </div>

                  <div className="space-y-1 bg-sand-50/50 p-3 rounded-lg border border-forest-50">
                    <span className="text-[8px] text-stone-400 uppercase block">TRACK DATE APPROVED</span>
                    <p className="font-bold text-forest-900 font-sans">
                      {new Date(activeTicket.travelDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="space-y-1 bg-sand-50/50 p-3 rounded-lg border border-forest-50">
                    <span className="text-[8px] text-stone-400 uppercase block">AUTHORIZED CLIENTS</span>
                    <p className="font-bold text-forest-900 font-sans">{activeTicket.passengerCount} Passengers</p>
                  </div>

                  <div className="space-y-1 bg-sand-50/50 p-3 rounded-lg border border-forest-50">
                    <span className="text-[8px] text-stone-400 uppercase block">DOCKET REGISTRY STATUS</span>
                    <p className={`font-bold uppercase ${activeTicket.status === 'Confirmed' ? 'text-forest-750' : 'text-amber-600'}`}>
                      {activeTicket.status}
                    </p>
                  </div>

                </div>

                 {/* Bottom Tracking & Admin Details */}
                <div className="border-t border-forest-100 pt-5 text-center space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest block">
                      Permit Tracking Key
                    </span>
                    <span className="font-mono text-xs font-bold text-forest-950 bg-sand-50/50 px-3 py-1 rounded-md border border-forest-100 select-all block w-fit mx-auto">
                      {activeTicket.id}
                    </span>
                  </div>
                </div>

              </div>

              {/* Action layout controls */}
              <div className="p-5 border-t border-forest-100 bg-sand-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0 print:hidden">
                <button
                  type="button"
                  onClick={handlePrintTicket}
                  className="w-full sm:w-auto py-2.5 px-6 bg-forest-900 text-white rounded-xl text-xs uppercase font-extrabold flex items-center justify-center gap-2 cursor-pointer hover:bg-forest-850"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download / Print Ticket Voucher</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  className="w-full sm:w-auto py-2.5 px-4 scroll-smooth border border-forest-200 text-forest-750 rounded-xl text-xs uppercase font-bold text-center cursor-pointer hover:bg-forest-50"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// git-sync-trigger