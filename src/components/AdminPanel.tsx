/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Destination, Package, Booking } from '../types';
import { AuthUser, destinationService, packageService, bookingService } from '../services';
import { ShieldCheck, Database, Layers, ClipboardList, PenTool, Plus, Trash2, Edit2, CheckCircle2, XCircle, Clock, Tag, RefreshCw, Lock, MessageSquare } from 'lucide-react';

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
          <span>Sign in with <span className="font-mono bg-white px-2 py-0.5 rounded border border-forest-200">hobegorillarwanda@gmail.com</span> to authorize.</span>
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
      {activeTab === 'bookings' && (
        <div id="tab-bookings-content" className="bg-white rounded-2xl border border-forest-100 shadow-sm overflow-hidden animate-in fade-in duration-200">
          <div className="p-6 border-b border-forest-100">
            <h3 className="font-serif text-xl font-bold text-forest-900">Gorilla Permits & Booking Terminal</h3>
            <p className="text-xs text-forest-600 mt-1">Real-time coordinator monitoring screen for all inbound customer rosters</p>
          </div>

          <div className="overflow-x-auto w-full">
            {bookings.length === 0 ? (
              <div className="py-16 text-center text-xs text-forest-600 font-light">
                No active safari transaction records reported in the database storage.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-forest-50 p-4 border-b border-forest-100 text-[10px] font-bold text-forest-800 uppercase tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Package Select</th>
                    <th className="p-4">Date & Pax</th>
                    <th className="p-4">Cost</th>
                    <th className="p-4 text-center">Permit State</th>
                    <th className="p-4 text-right">Coordination Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-100/50">
                  {bookings.map(b => (
                    <tr 
                      id={`booking-terminal-row-${b.id}`}
                      key={b.id} 
                      className="hover:bg-sand-50/40 transition"
                    >
                      <td className="p-4 font-mono font-bold text-forest-800 text-[10px]">
                        {b.id.substring(0, 14)}...
                      </td>
                      <td className="p-4 space-y-1">
                        <p className="font-bold text-forest-950">{b.fullName}</p>
                        <p className="text-[10px] text-forest-650">{b.email} | {b.phone}</p>
                        {b.specialRequests && (
                          <div className="bg-sand-100 p-2 rounded-lg border border-forest-100 text-[9px] mt-1 max-w-xs text-forest-800 flex items-start gap-1.5">
                            <MessageSquare className="w-3 h-3 text-sand-700 shrink-0 mt-0.5" />
                            <span className="italic">"{b.specialRequests}"</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold bg-forest-100 text-forest-900 py-0.5 px-2 rounded border border-forest-200 uppercase text-[10px]">
                          {b.packageName}
                        </span>
                      </td>
                      <td className="p-4 space-y-1">
                        <p className="font-mono text-[10px] font-bold text-forest-900">{b.travelDate}</p>
                        <p className="text-[10px] text-forest-600">{b.passengerCount} passsenger(s)</p>
                      </td>
                      <td className="p-4 font-bold font-mono text-forest-950">
                        {formatCostInUSD(b.totalCost)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block py-1 px-3 rounded-full text-[10px] font-extrabold uppercase ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : b.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          id={`btn-confirm-${b.id}`}
                          onClick={() => handleToggleStatus(b.id, 'Confirmed')}
                          disabled={b.status === 'Confirmed'}
                          title="Confirm Reservation"
                          className="p-1 px-2.5 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-200 border border-emerald-100 text-emerald-700 rounded text-[10px] font-bold cursor-pointer transition disabled:opacity-40"
                        >
                          Confirm
                        </button>
                        <button
                          id={`btn-cancel-${b.id}`}
                          onClick={() => handleToggleStatus(b.id, 'Cancelled')}
                          disabled={b.status === 'Cancelled'}
                          title="Void Reservation"
                          className="p-1 px-2.5 bg-red-50 hover:bg-red-100 hover:border-red-200 border border-red-100 text-red-600 rounded text-[10px] font-bold cursor-pointer transition disabled:opacity-40"
                        >
                          Cancel
                        </button>
                        <button
                          id={`btn-delete-bk-${b.id}`}
                          onClick={() => handleDeleteBooking(b.id)}
                          title="Permanent delete row"
                          className="p-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-red-650 rounded cursor-pointer transition"
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
      )}

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
