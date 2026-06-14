/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Destination, Package, Booking } from '../types';
import { AuthUser, destinationService, packageService, bookingService } from '../services';
import { ShieldCheck, Database, Layers, ClipboardList, PenTool, Plus, Trash2, Edit2, CheckCircle2, XCircle, Clock, Tag, RefreshCw, Lock, MessageSquare, DollarSign, Users, TrendingUp, Award, Search } from 'lucide-react';

interface AdminPanelProps {
  currentUser: AuthUser | null;
  destinations: Destination[];
  packages: Package[];
  bookings: Booking[];
  refreshData: () => void;
}

export default function AdminPanel({ currentUser, destinations, packages, bookings, refreshData }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'destinations' | 'packages'>('bookings');
  const [isSyncing, setIsSyncing] = useState(false);
  const [bookingSearch, setBookingSearch] = useState('');

  // Form states for Destination CRUD
  const [destId, setDestId] = useState('');
  const [destName, setDestName] = useState('');
  const [destLoc, setDestLoc] = useState('');
  const [destDesc, setDestDesc] = useState('');
  const [destHighlights, setDestHighlights] = useState('');
  const [destWildlife, setDestWildlife] = useState('');
  const [editingDest, setEditingDest] = useState(false);

  // Form states for Package CRUD
  const [pkgId, setPkgId] = useState('');
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDuration, setPkgDuration] = useState('');
  const [pkgTier, setPkgTier] = useState<'budget' | 'mid-range' | 'luxury'>('budget');
  const [pkgCost, setPkgCost] = useState(0);
  const [pkgDesc, setPkgDesc] = useState('');
  const [pkgInclusions, setPkgInclusions] = useState('');
  const [editingPkg, setEditingPkg] = useState(false);

  // Verification guard
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div id="admin-security-guard" className="max-w-xl mx-auto py-24 px-6 text-center space-y-6">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto border border-red-200">
          <ShieldCheck className="w-7 h-7 text-red-650" />
        </div>
        <div>
          <h3 className="font-serif text-2xl font-bold text-forest-900 tracking-tight">
            Administrative Access Revoked
          </h3>
          <p className="text-xs text-forest-600 mt-2 leading-relaxed max-w-sm mx-auto">
            This module is protected by a client-side role guard. You must be authenticated using the verified coordinator account to make database mutations.
          </p>
        </div>
        <div className="bg-sand-100 p-4 rounded-xl text-xs text-forest-850 font-medium flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-forest-750 shrink-0" />
          <span>Sign in with your verified administrator account to authorize.</span>
        </div>
      </div>
    );
  }

  const handleManualSync = async () => {
    setIsSyncing(true);
    await refreshData();
    setTimeout(() => setIsSyncing(false), 800);
  };

  // --- Destination Handlers ---
  const handleSaveDest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destId || !destName || !destLoc || !destDesc) {
      alert("Please enter all required fields for national parks.");
      return;
    }

    const payload: Destination = {
      id: destId.trim(),
      name: destName.trim(),
      location: destLoc.trim(),
      description: destDesc.trim(),
      highlights: destHighlights ? destHighlights.split(',').map(h => h.trim()).filter(Boolean) : [],
      wildlife: destWildlife ? destWildlife.split(',').map(w => w.trim()).filter(Boolean) : []
    };

    try {
      await destinationService.save(payload);
      resetDestForm();
      refreshData();
    } catch (err: any) {
      alert("Failed to write destination doc: " + err.message);
    }
  };

  const editDestForm = (d: Destination) => {
    setDestId(d.id);
    setDestName(d.name);
    setDestLoc(d.location);
    setDestDesc(d.description);
    setDestHighlights(d.highlights.join(', '));
    setDestWildlife(d.wildlife.join(', '));
    setEditingDest(true);
  };

  const handleDeleteDest = async (id: string) => {
    if (!confirm("Are you sure you want to write-off this national park record? This updates the client screens instantly.")) return;
    try {
      await destinationService.delete(id);
      refreshData();
    } catch (err: any) {
      alert("Wipe operation failed: " + err.message);
    }
  };

  const resetDestForm = () => {
    setDestId('');
    setDestName('');
    setDestLoc('');
    setDestDesc('');
    setDestHighlights('');
    setDestWildlife('');
    setEditingDest(false);
  };

  // --- Package Handlers ---
  const handleSavePkg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgId || !pkgTitle || !pkgDuration || pkgCost <= 0 || !pkgDesc) {
      alert("Please provide valid information for all package parameters.");
      return;
    }

    const payload: Package = {
      id: pkgId.trim(),
      title: pkgTitle.trim(),
      duration: pkgDuration.trim(),
      tier: pkgTier,
      baselineCost: Number(pkgCost),
      description: pkgDesc.trim(),
      inclusions: pkgInclusions ? pkgInclusions.split(',').map(i => i.trim()).filter(Boolean) : []
    };

    try {
      await packageService.save(payload);
      resetPkgForm();
      refreshData();
    } catch (err: any) {
      alert("Failed to write safari package doc: " + err.message);
    }
  };

  const editPkgForm = (p: Package) => {
    setPkgId(p.id);
    setPkgTitle(p.title);
    setPkgDuration(p.duration);
    setPkgTier(p.tier);
    setPkgCost(p.baselineCost);
    setPkgDesc(p.description);
    setPkgInclusions(p.inclusions.join(', '));
    setEditingPkg(true);
  };

  const handleDeletePkg = async (id: string) => {
    if (!confirm("Are you sure you want to archive this package? Baseline cost configurations will be lost.")) return;
    try {
      await packageService.delete(id);
      refreshData();
    } catch (err: any) {
      alert("Archive failed: " + err.message);
    }
  };

  const resetPkgForm = () => {
    setPkgId('');
    setPkgTitle('');
    setPkgDuration('');
    setPkgTier('budget');
    setPkgCost(0);
    setPkgDesc('');
    setPkgInclusions('');
    setEditingPkg(false);
  };

  // --- Booking State Toggles ---
  const handleToggleStatus = async (id: string, status: 'Pending' | 'Confirmed' | 'Cancelled') => {
    try {
      await bookingService.updateStatus(id, status);
      refreshData();
    } catch (err: any) {
      alert("Permit status transition declined: " + err.message);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Delete this booking transaction row? This operation is permanent.")) return;
    try {
      await bookingService.delete(id);
      refreshData();
    } catch (err: any) {
      alert("Failed to remove booking transaction row: " + err.message);
    }
  };

  const formatCostInUSD = (cost: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cost);
  };

  // Analytics and Metrics
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  const pendingBookings = bookings.filter(b => b.status === 'Pending' || !b.status);
  
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalCost || 0), 0);
  const pendingRevenue = pendingBookings.reduce((sum, b) => sum + (b.totalCost || 0), 0);
  
  const totalConfirmedPassengers = confirmedBookings.reduce((sum, b) => sum + (b.passengerCount || 0), 0);
  const totalPendingPassengers = pendingBookings.reduce((sum, b) => sum + (b.passengerCount || 0), 0);
  
  const confirmationRate = bookings.length > 0 
    ? Math.round((confirmedBookings.length / bookings.length) * 100) 
    : 0;

  // Compute most popular package
  const packageCounts = bookings.reduce((acc, b) => {
    if (b.packageName) {
      acc[b.packageName] = (acc[b.packageName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  let topPackage = "None Active";
  let topPackageCount = 0;
  Object.entries(packageCounts).forEach(([name, count]) => {
    if (count > topPackageCount) {
      topPackageCount = count;
      topPackage = name;
    }
  });

  return (
    <div id="admin-panel-container" className="max-w-7xl mx-auto py-12 px-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-forest-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-sand-600 text-forest-950 rounded-xl">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-forest-900 flex items-center gap-2">
              <span>Secured Command Center</span>
            </h2>
            <p className="text-xs text-forest-650 mt-1">
              Active Session: <strong className="text-forest-900">{currentUser.email}</strong> (System Administrator)
            </p>
          </div>
        </div>

        <button
          id="btn-manual-sync"
          onClick={handleManualSync}
          disabled={isSyncing}
          className="flex items-center gap-2 py-2 px-4 bg-forest-900 text-sand-50 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-forest-800 disabled:opacity-60 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Database'}</span>
        </button>
      </div>

      {/* Analytics Overview Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-sm flex items-start justify-between min-h-[120px]">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-forest-600 uppercase tracking-widest">Invoiced Volume</p>
            <h3 className="text-2xl font-bold text-forest-950 font-mono tracking-tight">{formatCostInUSD(totalRevenue)}</h3>
            <p className="text-[10px] text-forest-500 font-medium leading-relaxed">
              Pending estimate: <span className="font-semibold text-amber-700">{formatCostInUSD(pendingRevenue)}</span>
            </p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-sm flex items-start justify-between min-h-[120px]">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-forest-600 uppercase tracking-widest">Approved Permits</p>
            <h3 className="text-2xl font-bold text-forest-950 font-mono tracking-tight">{totalConfirmedPassengers} <span className="text-xs font-normal text-forest-700">seats</span></h3>
            <p className="text-[10px] text-forest-500 font-medium leading-relaxed">
              In progress queue: <span className="font-semibold text-amber-700">{totalPendingPassengers} pending</span>
            </p>
          </div>
          <div className="p-2.5 bg-forest-50 text-forest-900 rounded-xl border border-forest-100 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-sm flex items-start justify-between min-h-[120px]">
          <div className="space-y-1 w-full flex-1">
            <p className="text-[10px] font-bold text-forest-600 uppercase tracking-widest">Leads Approved</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-forest-950 font-mono tracking-tight">{confirmationRate}%</h3>
              <span className="text-[9px] font-semibold text-forest-500">({confirmedBookings.length}/{bookings.length})</span>
            </div>
            {/* Simple mini-progress bar */}
            <div className="w-full bg-forest-50 border border-forest-100/50 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-forest-700 h-full rounded-full transition-all duration-500" 
                style={{ width: `${confirmationRate}%` }}
              ></div>
            </div>
          </div>
          <div className="p-2.5 bg-sky-50 text-sky-850 rounded-xl border border-sky-100 shrink-0 ml-3">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-sm flex items-start justify-between min-h-[120px]">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-[10px] font-bold text-forest-600 uppercase tracking-widest">Preferred Safari</p>
            <h3 className="text-sm font-bold text-forest-950 font-serif truncate mt-1 tracking-tight" title={topPackage}>
              {topPackage}
            </h3>
            <p className="text-[10px] text-forest-550 font-medium leading-relaxed mt-0.5">
              Ranked top with <span className="font-bold text-forest-800">{topPackageCount} roster entries</span>
            </p>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-100 shrink-0 ml-3">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap border-b border-forest-100/60 pb-1.5 gap-2.5">
        <button
          id="tab-bookings-btn"
          onClick={() => setActiveTab('bookings')}
          className={`py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition ${
            activeTab === 'bookings'
              ? 'bg-forest-700 text-white shadow-sm'
              : 'text-forest-700 hover:bg-forest-100/50'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Client Bookings ({bookings.length})</span>
        </button>

        <button
          id="tab-destinations-btn"
          onClick={() => setActiveTab('destinations')}
          className={`py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition ${
            activeTab === 'destinations'
              ? 'bg-forest-700 text-white shadow-sm'
              : 'text-forest-700 hover:bg-forest-100/50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Travel Locations ({destinations.length})</span>
        </button>

        <button
          id="tab-packages-btn"
          onClick={() => setActiveTab('packages')}
          className={`py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition ${
            activeTab === 'packages'
              ? 'bg-forest-700 text-white shadow-sm'
              : 'text-forest-700 hover:bg-forest-100/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Safari Tiers ({packages.length})</span>
        </button>
      </div>

      {/* Tab Contents: CLIENT BOOKINGS */}
      {activeTab === 'bookings' && (() => {
        const filteredBookings = bookings.filter(b => {
          const query = bookingSearch.trim().toLowerCase();
          if (!query) return true;
          return (
            b.id.toLowerCase().includes(query) ||
            b.fullName.toLowerCase().includes(query) ||
            b.email.toLowerCase().includes(query) ||
            (b.packageName && b.packageName.toLowerCase().includes(query))
          );
        });

        const searchedBooking = bookingSearch.trim()
          ? (bookings.find(b => 
              b.id.toLowerCase() === bookingSearch.trim().toLowerCase() ||
              b.id.replace('HGR-', '').toLowerCase() === bookingSearch.trim().toLowerCase() ||
              b.id.split('_')[1]?.toLowerCase() === bookingSearch.trim().toLowerCase()
            ) || bookings.find(b => 
              b.id.toLowerCase().includes(bookingSearch.trim().toLowerCase())
            ) || null)
          : null;

         return (
          <div id="tab-bookings-content" className="bg-white rounded-3xl border border-forest-100 shadow-lg shadow-forest-900/5 overflow-hidden animate-in fade-in duration-300">
            {/* Header with quick search */}
            <div className="p-6 md:p-8 border-b border-forest-100 bg-sand-50/30 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                  Ranger Database
                </span>
                <h3 className="font-serif text-2xl font-bold text-forest-950">Gorilla Permits & Safari Roster</h3>
                <p className="text-xs text-stone-500 leading-normal font-light">
                  Active monitoring database. Verify guest tracker certificates and update permit statuses instantly.
                </p>
              </div>
              
              {/* Added high-visibility booking search / tracking bar */}
              <div className="w-full lg:max-w-md shrink-0">
                <label htmlFor="admin-booking-search-input" className="block text-[10px] font-bold text-forest-900 uppercase tracking-wider mb-2">
                  Track & Verify Active Permit Key
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-forest-600">
                    <Search className="w-4.5 h-4.5" />
                  </span>
                  <input
                    id="admin-booking-search-input"
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. HGR-...), Name, or Email"
                    className="w-full pl-10 pr-20 py-2.5 bg-white hover:border-forest-400 focus:bg-white border-2 border-forest-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-forest-700 focus:border-transparent transition-all placeholder:text-stone-400 shadow-inner font-mono font-medium tracking-wide"
                  />
                  {bookingSearch ? (
                    <button
                      onClick={() => setBookingSearch('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-stone-400 hover:text-forest-800 text-[10px] uppercase font-bold tracking-wider cursor-pointer transition"
                    >
                      Clear
                    </button>
                  ) : (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-300 pointer-events-none text-[9px] font-mono select-none">
                      Search key
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Verification Spotlight Section */}
            {searchedBooking ? (
              <div className="m-6 md:m-8 p-6 bg-gradient-to-br from-emerald-950 via-forest-950 to-stone-950 text-white border border-forest-800 rounded-3xl space-y-6 shadow-xl relative overflow-hidden animate-in slide-in-from-top-3 duration-300">
                {/* Background decorative forest details */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-800/80 pb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/15 rounded-xl border border-emerald-500/30 text-emerald-400 shrink-0">
                      <ShieldCheck className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase font-mono tracking-widest text-emerald-400">
                        Permit Verification Terminal Output
                      </h4>
                      <p className="text-[10px] text-stone-400 font-light mt-0.5">
                        Authentic digital record parsed and certified from active cloud storage
                      </p>
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full text-[10px] font-extrabold uppercase font-mono tracking-widest shadow-sm border ${
                    searchedBooking.status === 'Confirmed'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : searchedBooking.status === 'Cancelled'
                      ? 'bg-red-500/10 text-red-300 border-red-500/30'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30 font-bold animate-pulse'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      searchedBooking.status === 'Confirmed'
                        ? 'bg-emerald-400'
                        : searchedBooking.status === 'Cancelled'
                        ? 'bg-red-400'
                        : 'bg-amber-400'
                    }`}></span>
                    {searchedBooking.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10 text-xs text-left">
                  <div className="space-y-1.5 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Permit Serial Track ID</span>
                    <p className="font-mono text-emerald-400 font-bold bg-black/40 px-2.5 py-1.5 rounded-lg border border-forest-800 break-all select-all text-[11px] tracking-wide shadow-inner">
                      {searchedBooking.id}
                    </p>
                  </div>
                  
                  <div className="space-y-1 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Primary Tracker Guest</span>
                    <p className="font-serif text-sm font-bold text-stone-100">{searchedBooking.fullName}</p>
                    <p className="text-[11px] text-stone-300 font-mono mt-1">{searchedBooking.email}</p>
                    <p className="text-[11px] text-stone-400 font-mono">{searchedBooking.phone}</p>
                  </div>
                  
                  <div className="space-y-1 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Itinerary Package</span>
                    <p className="font-bold text-stone-100 text-xs line-clamp-1">{searchedBooking.packageName}</p>
                    <div className="flex items-center gap-1.5 mt-2 bg-emerald-950/40 p-1.5 rounded border border-emerald-900/30 text-stone-300 font-mono text-[10px]">
                      <span>Date: {searchedBooking.travelDate}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono block mt-1">{searchedBooking.passengerCount} Seat(s) Allocated</span>
                  </div>
                  
                  <div className="space-y-1 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Financial Transaction</span>
                    <p className="text-lg font-bold text-emerald-400 font-mono tracking-tight">
                      {formatCostInUSD(searchedBooking.totalCost)}
                    </p>
                    <p className="text-[9.5px] text-stone-400 leading-normal font-light">
                      Environmental fees, trekking permissions and park taxes calculated in USD.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-forest-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-xs">
                  <div className="flex items-center gap-2 text-stone-300">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-[10.5px] font-light">
                      Verified tracker passport matches this database record. Update status as required:
                    </span>
                  </div>
                  <div className="flex gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={() => handleToggleStatus(searchedBooking.id, 'Confirmed')}
                      disabled={searchedBooking.status === 'Confirmed'}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-30 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer border border-emerald-500 shadow-md shadow-emerald-955/20"
                    >
                      Approve & Issue Certificate
                    </button>
                    <button
                      onClick={() => handleToggleStatus(searchedBooking.id, 'Cancelled')}
                      disabled={searchedBooking.status === 'Cancelled'}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-red-650 hover:bg-red-550 active:bg-red-750 disabled:opacity-30 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer border border-red-500 shadow-md shadow-red-955/20"
                    >
                      Void / Cancel Permit
                    </button>
                  </div>
                </div>
              </div>
            ) : bookingSearch.trim() ? (
              <div className="mx-6 md:mx-8 p-5 bg-stone-50 border border-stone-200 rounded-2xl text-center space-y-2 animate-in slide-in-from-top-2">
                <span className="inline-block p-1 px-2.5 bg-amber-100 text-amber-800 rounded text-[9px] font-mono uppercase font-bold tracking-wider">
                  Verification Audit Status
                </span>
                <p className="text-xs text-stone-600 font-medium">
                  No explicit matching permit found for "<span className="font-mono text-stone-900 font-bold">{bookingSearch}</span>" in active spotlight finder.
                </p>
                <p className="text-[10.5px] text-stone-550">
                  Try entering the full, precise tracking serial key from the permit voucher directly.
                </p>
              </div>
            ) : null}

            <div className="overflow-x-auto w-full">
              {filteredBookings.length === 0 ? (
                <div className="py-20 text-center text-xs text-stone-500 font-light space-y-3">
                  <p className="text-sm font-semibold text-stone-600">No client itineraries registered</p>
                  <p className="text-xs max-w-sm mx-auto text-stone-400">
                    No active safaris match your search filter constraints. Use the navigation sidebar or clear the search criteria above.
                  </p>
                  {bookingSearch && (
                    <button
                      onClick={() => setBookingSearch('')}
                      className="text-forest-750 hover:text-forest-950 font-bold underline text-xs block mx-auto cursor-pointer"
                    >
                      Clear Search Parameters
                    </button>
                  )}
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-forest-100 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                      <th className="p-5 font-mono">ID / KEY</th>
                      <th className="p-5">CUSTODIAN INFO</th>
                      <th className="p-5">TRAVEL ITINERARY</th>
                      <th className="p-5">TIMING & PEOPLE</th>
                      <th className="p-5">FEE OUTCOME</th>
                      <th className="p-5 text-center">TICKET STATUS</th>
                      <th className="p-5 text-right">OPERATIONS CONTROL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredBookings.map(b => (
                      <tr 
                        id={`booking-terminal-row-${b.id}`}
                        key={b.id} 
                        className="hover:bg-sand-50/20 transition-all duration-150"
                      >
                        <td className="p-5 font-mono font-bold text-forest-700 text-[10px] select-all cursor-pointer" title="Double click to select/copy full serial ID">
                          <span className="bg-sand-100/60 p-1 px-1.5 rounded border border-sand-200/50 block w-fit">
                            {b.id.substring(0, 14)}...
                          </span>
                        </td>
                        <td className="p-5 space-y-1 text-left">
                          <p className="font-bold text-forest-950 font-sans text-xs">{b.fullName}</p>
                          <p className="text-[10px] text-stone-500 font-mono font-light leading-none">{b.email}</p>
                          <p className="text-[10px] text-stone-400 font-mono font-light leading-none">{b.phone}</p>
                          {b.specialRequests && (
                            <div className="bg-stone-50 p-2 rounded-lg border border-stone-150 text-[9px] mt-1.5 max-w-xs text-stone-700 flex items-start gap-1.5 shadow-sm">
                              <MessageSquare className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                              <span className="italic leading-normal select-text">"{b.specialRequests}"</span>
                            </div>
                          )}
                        </td>
                        <td className="p-5 text-left">
                          <span className="font-extrabold bg-stone-100 text-stone-850 py-0.5 px-2 rounded-md border border-stone-200 uppercase text-[9.5px] tracking-wide inline-block">
                            {b.packageName}
                          </span>
                        </td>
                        <td className="p-5 space-y-1 text-left">
                          <p className="font-mono text-[10.5px] font-bold text-forest-900">{b.travelDate}</p>
                          <p className="text-[10px] text-stone-500">{b.passengerCount} Pax</p>
                        </td>
                        <td className="p-5 font-bold font-mono text-stone-900 font-medium">
                          {formatCostInUSD(b.totalCost)}
                        </td>
                        <td className="p-5 text-center">
                          <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : b.status === 'Cancelled'
                              ? 'bg-red-50 text-red-800 border-red-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${
                              b.status === 'Confirmed' ? 'bg-emerald-500' : b.status === 'Cancelled' ? 'bg-red-500' : 'bg-amber-500'
                            }`}></span>
                            {b.status || 'Pending'}
                          </span>
                        </td>
                        <td className="p-5 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            id={`btn-confirm-${b.id}`}
                            onClick={() => handleToggleStatus(b.id, 'Confirmed')}
                            disabled={b.status === 'Confirmed'}
                            className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-505 hover:shadow text-white rounded-lg text-[10px] font-bold cursor-pointer transition disabled:opacity-30 shrink-0"
                          >
                            Approve
                          </button>
                          <button
                            id={`btn-cancel-${b.id}`}
                            onClick={() => handleToggleStatus(b.id, 'Cancelled')}
                            disabled={b.status === 'Cancelled'}
                            className="p-1 px-2.5 bg-red-650 hover:bg-red-600 hover:shadow text-white rounded-lg text-[10px] font-bold cursor-pointer transition disabled:opacity-30 shrink-0"
                          >
                            Void
                          </button>
                          <button
                            id={`btn-delete-bk-${b.id}`}
                            onClick={() => handleDeleteBooking(b.id)}
                            title="Permanent wipe"
                            className="p-1.5 bg-white border border-stone-200 hover:border-red-200 text-stone-400 hover:text-red-750 rounded-lg cursor-pointer transition shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      })()}

      {/* Tab Contents: TRAVEL LOCATIONS CRUD */}
      {activeTab === 'destinations' && (
        <div id="tab-destinations-content" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
          
          {/* Write parameter form */}
          <form onSubmit={handleSaveDest} className="lg:col-span-4 bg-white p-6 rounded-2xl border border-forest-100 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-forest-900 border-b border-forest-100 pb-3">
              {editingDest ? 'Modify National Park' : 'Add National Park'}
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-widest mb-1">
                  Unique Document ID *
                </label>
                <input
                  id="dest-id-crud"
                  type="text"
                  value={destId}
                  onChange={(e) => setDestId(e.target.value)}
                  placeholder="e.g. volcanoes-np"
                  disabled={editingDest}
                  className="w-full p-2 py-1.5 bg-white border border-forest-150 rounded-lg text-xs font-mono disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-widest mb-1">
                  Park Display Name *
                </label>
                <input
                  id="dest-name-crud"
                  type="text"
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  placeholder="e.g. Volcanoes National Park"
                  className="w-full p-2 py-1.5 bg-white border border-forest-150 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-widest mb-1">
                  Geographical Region *
                </label>
                <input
                  id="dest-loc-crud"
                  type="text"
                  value={destLoc}
                  onChange={(e) => setDestLoc(e.target.value)}
                  placeholder="e.g. Northwestern Rwanda"
                  className="w-full p-2 py-1.5 bg-white border border-forest-150 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-widest mb-1">
                  Environmental Description *
                </label>
                <textarea
                  id="dest-desc-crud"
                  value={destDesc}
                  onChange={(e) => setDestDesc(e.target.value)}
                  rows={3}
                  placeholder="Home to mountain gorillas, bamboo forests..."
                  className="w-full p-2 py-1.5 bg-white border border-forest-150 rounded-lg text-xs leading-normal"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-widest mb-1 flex items-center justify-between">
                  <span>Highlights (comma-separated list)</span>
                  <span className="text-[8px] font-normal lowercase text-forest-600">split with commas</span>
                </label>
                <input
                  id="dest-highlights-crud"
                  type="text"
                  value={destHighlights}
                  onChange={(e) => setDestHighlights(e.target.value)}
                  placeholder="Gorilla Tracking, Mount Bisoke Hike, Caves"
                  className="w-full p-2 py-1.5 bg-white border border-forest-150 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-widest mb-1 flex items-center justify-between">
                  <span>Dominant Wildlife (comma-separated list)</span>
                  <span className="text-[8px] font-normal lowercase text-forest-600">split with commas</span>
                </label>
                <input
                  id="dest-wildlife-crud"
                  type="text"
                  value={destWildlife}
                  onChange={(e) => setDestWildlife(e.target.value)}
                  placeholder="Mountain Gorillas, Golden Monkeys, Buffalos"
                  className="w-full p-2 py-1.5 bg-white border border-forest-150 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-2 border-t border-forest-100">
              <button
                id="btn-save-dest"
                type="submit"
                className="flex-1 py-2 bg-forest-900 border border-forest-950 text-sand-50 rounded-lg text-xs font-bold uppercase cursor-pointer hover:bg-forest-850"
              >
                {editingDest ? 'Update Location' : 'Create Location'}
              </button>
              <button
                id="btn-cancel-dest-form"
                type="button"
                onClick={resetDestForm}
                className="py-2 px-3 border border-forest-200 text-forest-750 rounded-lg text-xs font-bold uppercase hover:bg-forest-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* List display */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-forest-100 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 border-b border-forest-100">
              <h3 className="font-serif text-xl font-bold text-forest-900">Current National Parks</h3>
              <p className="text-xs text-forest-650 mt-1">Edit or register destinations dynamically affecting client screen layouts</p>
            </div>

            <div className="divide-y divide-forest-100/50">
              {destinations.map(d => (
                <div 
                  id={`dest-admin-row-${d.id}`}
                  key={d.id} 
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-sand-50/40"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-forest-900 font-serif">{d.name}</h4>
                      <span className="text-[9px] font-mono bg-forest-50 text-forest-800 border border-forest-200 px-1.5 rounded uppercase">
                        {d.id}
                      </span>
                    </div>
                    <p className="text-xs text-forest-650 pr-4">{d.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {d.highlights.slice(0, 3).map((h, i) => (
                        <span key={i} className="text-[10px] bg-sand-100 text-forest-800 px-2 py-0.5 rounded border border-sand-200">
                          {h}
                        </span>
                      ))}
                      {d.highlights.length > 3 && <span className="text-[9px] text-forest-500 font-bold">+{d.highlights.length - 3} more</span>}
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      id={`btn-edit-dest-${d.id}`}
                      onClick={() => editDestForm(d)}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-3 border border-forest-200 text-forest-800 text-[10px] font-bold rounded hover:bg-forest-50 cursor-pointer transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      id={`btn-delete-dest-${d.id}`}
                      onClick={() => handleDeleteDest(d.id)}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-3 border border-red-200 text-red-650 text-[10px] font-bold rounded hover:bg-red-50 cursor-pointer transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Contents: SAFARI CONFIG CRUD */}
      {activeTab === 'packages' && (
        <div id="tab-packages-content" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
          
          {/* Write parameter form */}
          <form onSubmit={handleSavePkg} className="lg:col-span-4 bg-white p-6 rounded-2xl border border-forest-100 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-forest-900 border-b border-forest-100 pb-3">
              {editingPkg ? 'Modify Safari Tier' : 'Add Safari Tier'}
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-widest mb-1">
                  Unique Package Doc ID *
                </label>
                <input
                  id="pkg-id-crud"
                  type="text"
                  value={pkgId}
                  onChange={(e) => setPkgId(e.target.value)}
                  placeholder="e.g. pkg-budget-explorer"
                  disabled={editingPkg}
                  className="w-full p-2 py-1.5 bg-white border border-forest-150 rounded-lg text-xs font-mono disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-widest mb-1">
                  Safari Title *
                </label>
                <input
                  id="pkg-title-crud"
                  type="text"
                  value={pkgTitle}
                  onChange={(e) => setPkgTitle(e.target.value)}
                  placeholder="e.g. Budget Explorer"
                  className="w-full p-2 py-1.5 bg-white border border-forest-150 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-widest mb-1">
                    Duration Descriptor *
                  </label>
                  <input
                    id="pkg-duration-crud"
                    type="text"
                    value={pkgDuration}
                    onChange={(e) => setPkgDuration(e.target.value)}
                    placeholder="e.g. 1 Day"
                    className="w-full p-2 py-1.5 bg-white border border-forest-150 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-widest mb-1">
                    Safari Tier Group *
                  </label>
                  <select
                    id="pkg-tier-crud"
                    value={pkgTier}
                    onChange={(e) => setPkgTier(e.target.value as any)}
                    className="w-full p-2 py-1.5 bg-white border border-forest-150 rounded-lg text-xs block"
                  >
                    <option value="budget">Budget</option>
                    <option value="mid-range">Mid-Range</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-widest mb-1">
                  Baseline Cost (USD per passenger) *
                </label>
                <input
                  id="pkg-cost-crud"
                  type="number"
                  value={pkgCost || ''}
                  onChange={(e) => setPkgCost(Number(e.target.value))}
                  placeholder="e.g. 1650"
                  className="w-full p-2 py-1.5 bg-white border border-forest-150 rounded-lg text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-widest mb-1">
                  Description *
                </label>
                <textarea
                  id="pkg-desc-crud"
                  value={pkgDesc}
                  onChange={(e) => setPkgDesc(e.target.value)}
                  rows={3}
                  placeholder="An intense, single-day dash designed for travelers short on time..."
                  className="w-full p-2 py-1.5 bg-white border border-forest-150 rounded-lg text-xs leading-normal"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-forest-800 uppercase tracking-widest mb-1 flex items-center justify-between">
                  <span>Inclusions (comma-separated list)</span>
                  <span className="text-[8px] font-normal lowercase text-forest-600">splits with commas</span>
                </label>
                <input
                  id="pkg-inclusions-crud"
                  type="text"
                  value={pkgInclusions}
                  onChange={(e) => setPkgInclusions(e.target.value)}
                  placeholder="Official Gorilla Trekking Permit, Lodge Accommodation, Lunch"
                  className="w-full p-2 py-1.5 bg-white border border-forest-150 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-2 border-t border-forest-100">
              <button
                id="btn-save-pkg"
                type="submit"
                className="flex-1 py-2 bg-forest-900 border border-forest-950 text-sand-50 rounded-lg text-xs font-bold uppercase cursor-pointer hover:bg-forest-850"
              >
                {editingPkg ? 'Update Safari Tier' : 'Create Safari Tier'}
              </button>
              <button
                id="btn-cancel-pkg-form"
                type="button"
                onClick={resetPkgForm}
                className="py-2 px-3 border border-forest-200 text-forest-750 rounded-lg text-xs font-bold uppercase hover:bg-forest-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* List display */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-forest-100 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 border-b border-forest-100">
              <h3 className="font-serif text-xl font-bold text-forest-900">Current Safari Tiers</h3>
              <p className="text-xs text-forest-650 mt-1">Configure pricing baselines or durations dynamically updating client calculation cards</p>
            </div>

            <div className="divide-y divide-forest-100/50">
              {packages.map(p => (
                <div 
                  id={`pkg-admin-row-${p.id}`}
                  key={p.id} 
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-sand-50/40"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-forest-900 font-serif">{p.title}</h4>
                      <span className="text-[9px] font-mono bg-forest-50 text-forest-800 border border-forest-200 px-1.5 rounded uppercase">
                        {p.tier}
                      </span>
                    </div>
                    <p className="text-xs text-forest-650 pr-4 leading-normal">{p.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-forest-900 font-bold font-mono">
                        Cost: {formatCostInUSD(p.baselineCost)}
                      </span>
                      <span className="w-1.5 h-1.5 bg-forest-150 rounded-full"></span>
                      <span className="text-[10px] text-forest-650 font-mono">
                        Time: {p.duration}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      id={`btn-edit-pkg-${p.id}`}
                      onClick={() => editPkgForm(p)}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-3 border border-forest-200 text-forest-800 text-[10px] font-bold rounded hover:bg-forest-50 cursor-pointer transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      id={`btn-delete-pkg-${p.id}`}
                      onClick={() => handleDeletePkg(p.id)}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-3 border border-red-200 text-red-650 text-[10px] font-bold rounded hover:bg-red-50 cursor-pointer transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
