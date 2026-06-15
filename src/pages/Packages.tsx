/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Package } from '../types';
import { Compass, HelpCircle, Check, Info, Users, ArrowRight, DollarSign, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface PackagesProps {
  packages: Package[];
  onNavigate: (view: 'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin') => void;
  onSelectConfigurePkg: (pkg: Package, configuration: {
    passengers: number;
    addons: string[];
    tierLevel: 'standard' | 'vip' | 'elite';
    calculatedTotal: number;
  }) => void;
}

interface AddonItem {
  id: string;
  name: string;
  price: number; // Flat or per person
  isPerPerson: boolean;
  description: string;
}

export default function Packages({ packages, onNavigate, onSelectConfigurePkg }: PackagesProps) {
  // Calculator states
  const [selectedPkgId, setSelectedPkgId] = useState<string>(packages[0]?.id || 'pkg-budget-explorer');
  const [passengers, setPassengers] = useState<number>(2);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [tierLevel, setTierLevel] = useState<'standard' | 'vip' | 'elite'>('standard');

  const selectedPkg = packages.find(p => p.id === selectedPkgId) || packages[0];

  // Fix the luxury safari baseline cost to be realistic in UI if seed has 650.
  const getCleanBaselineCost = (pkg: Package) => {
    if (pkg.id === 'pkg-luxury-safari' && pkg.baselineCost < 1000) {
      return 5800; // Correct typographical placeholder or use default
    }
    return pkg.baselineCost;
  };

  const addonsList: AddonItem[] = [
    {
      id: 'porter-support',
      name: 'Professional Porter Support',
      price: 80,
      isPerPerson: true,
      description: 'Provides local support carrying backpacks, equipment, and steady guidance on mud hills.'
    },
    {
      id: 'safari-jeep-upgrade',
      name: 'Private 4x4 Safari Jeep Upgrade',
      price: 350,
      isPerPerson: false,
      description: 'Exclusive, customized 4x4 Land Cruiser vehicle with specialized sliding top scopes.'
    },
    {
      id: 'golden-monkey',
      name: 'Golden Monkey Tracking Add-on',
      price: 150,
      isPerPerson: true,
      description: 'Integrates an extra physical trekking day targeting endemic Golden Monkeys.'
    },
    {
      id: 'private-dining',
      name: 'Elite Conservation Dinner Service',
      price: 200,
      isPerPerson: false,
      description: 'Candlelight three-course private dinner featuring an educational chat with a senior gorilla tracker.'
    }
  ];

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  // Grand Total Calculation details
  const baselineCost = getCleanBaselineCost(selectedPkg);
  let tourSubtotal = baselineCost * passengers;

  // Tier multipliers / flat premium adder
  let tierPremium = 0;
  if (tierLevel === 'vip') {
    tierPremium = 400 * passengers; // $400 additional premium per client
  } else if (tierLevel === 'elite') {
    tierPremium = 1200 * passengers; // $1200 additional premium per client
  }

  // Add-on Cost calculation
  let addonsCost = 0;
  addonsList.forEach(addon => {
    if (selectedAddons.includes(addon.id)) {
      if (addon.isPerPerson) {
        addonsCost += (addon.price * passengers);
      } else {
        addonsCost += addon.price;
      }
    }
  });

  // official permits are often the main driver:
  // Usually baselineCost either includes permit ($1500 value) depending on standard.
  // For safety calculations, let's make sure our math is extremely granular and clear to the user!
  const hasPermitIncluded = selectedPkg.inclusions.some(inc => inc.toLowerCase().includes('permit'));
  
  // Let's specify that Gorilla Permit is $1500 USD per person.
  // We'll calculate a breakdown:
  // Base Lodge & Guide fee: baselineCost - 1500 (capped at 150 at minimum)
  const baseLodgeFeePerPax = Math.max(150, baselineCost - 1500);
  const gorillaPermitFeePerPax = 1500;

  const totalExpeditionCost = tourSubtotal + tierPremium + addonsCost;

  const handleCommitConfigResult = () => {
    onSelectConfigurePkg(selectedPkg, {
      passengers,
      addons: selectedAddons,
      tierLevel,
      calculatedTotal: totalExpeditionCost
    });
    onNavigate('booking');
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-6 space-y-16">
      
      {/* 1. HEADER SECTION */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold tracking-widest text-forest-700 uppercase bg-forest-100 px-3.5 py-1.5 rounded-full border border-forest-200/50 inline-block font-mono">
          Safari Trip Options
        </span>
        <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-forest-900 leading-none">
          Expedition Packages
        </h1>
        <p className="text-sm text-forest-650 max-w-xl mx-auto font-light leading-relaxed">
          Select and customize tour formulas. Use the interactive planner to customize your visitors count, luxury upgrades, and conservation support.
        </p>
      </div>

      {/* 2. BASE PACKAGES SHOW Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map(pkg => {
          const isSelected = selectedPkgId === pkg.id;
          const pkgBaseline = getCleanBaselineCost(pkg);
          return (
            <div 
              key={pkg.id}
              onClick={() => setSelectedPkgId(pkg.id)}
              className={`rounded-3xl border p-8 space-y-6 flex flex-col justify-between cursor-pointer transition shadow-luxury text-left relative overflow-hidden ${
                isSelected 
                  ? 'border-forest-600 bg-forest-900 text-white' 
                  : 'border-forest-150 bg-white hover:border-forest-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-sand-600 text-forest-950 text-[10px] font-mono uppercase font-bold py-1 px-3.5 rounded-bl-3xl">
                  Active Focus
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${isSelected ? 'text-sand-200' : 'text-sand-700'}`}>
                    {pkg.tier}
                  </span>
                  <h3 className="font-serif text-2xl font-bold">{pkg.title}</h3>
                  <div className={`text-xs ${isSelected ? 'text-forest-200' : 'text-forest-650'}`}>
                    ⏱ Expedition Duration: {pkg.duration}
                  </div>
                </div>

                <p className={`text-xs font-light leading-relaxed ${isSelected ? 'text-forest-100' : 'text-forest-750'}`}>
                  {pkg.description}
                </p>

                <div className="border-t border-forest-100/10 my-4"></div>

                {/* Inclusions list */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#94743b]">
                    Guaranteed Inclusions
                  </h4>
                  <ul className="space-y-1.5">
                    {pkg.inclusions.map((inc, i) => (
                      <li key={i} className="flex gap-2 items-start text-[11px] font-light leading-normal">
                        <span className={`mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/10 text-sand-200 border border-white/10' : 'bg-forest-50 text-forest-700 border border-forest-100/30'}`}>
                          <Check className="w-2.5 h-2.5 stroke-[2.5px]" />
                        </span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price Tag and selection button */}
              <div className="pt-6 border-t border-forest-100/10 flex items-center justify-between">
                <div>
                  <span className={`block text-[9px] font-mono uppercase tracking-wider ${isSelected ? 'text-forest-200' : 'text-forest-600'}`}>
                    Baseline Cost
                  </span>
                  <p className="text-xl font-bold font-mono text-sand-600">
                    ${pkgBaseline} <span className="text-xs font-light font-sans text-stone-400">USD</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPkgId(pkg.id);
                  }}
                  className={`py-2 px-4 rounded-xl text-xs uppercase font-extrabold transition cursor-pointer ${
                    isSelected 
                      ? 'bg-sand-600 hover:bg-sand-700 text-forest-950' 
                      : 'bg-forest-900 hover:bg-forest-850 text-white'
                  }`}
                >
                  Select This
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* 3. DYNAMIC INTERACTIVE MATRIX CALCULATOR */}
      <section className="bg-white rounded-3xl border border-forest-150 shadow-luxury overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Parameters Form */}
        <div className="lg:col-span-7 p-6 md:p-10 space-y-8 bg-sand-50/15">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-sand-700 font-bold uppercase block">Interactive Estimations</span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-forest-900 tracking-tight">
              Expedition Cost Calculator
            </h3>
            <p className="text-xs text-forest-650 font-light">
              Fine-tune variables to visualize instant quotes. Fully aligned with official Rwanda Environment and tracking permit fees.
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Passenger selection details */}
            <div className="space-y-3">
              <label htmlFor="pax-counter" className="text-xs font-bold text-forest-900 uppercase tracking-wider flex justify-between items-center">
                <span>Number of Travelers (Guests)</span>
                <span className="text-sand-700 font-mono font-bold text-sm bg-sand-100 px-3 py-1 rounded-lg border border-sand-200">
                  {passengers} Guests
                </span>
              </label>
              
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-forest-100">
                <button
                  type="button"
                  disabled={passengers <= 1}
                  onClick={() => setPassengers(p => Math.max(1, p - 1))}
                  className="w-10 h-10 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 disabled:opacity-50 flex items-center justify-center font-bold text-lg select-none cursor-pointer border border-forest-150"
                >
                  -
                </button>
                <input
                  id="pax-counter"
                  type="range"
                  min="1"
                  max="12"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value) || 2)}
                  className="flex-1 accent-forest-700 h-1 rounded-lg cursor-pointer"
                />
                <button
                  type="button"
                  disabled={passengers >= 12}
                  onClick={() => setPassengers(p => Math.min(12, p + 1))}
                  className="w-10 h-10 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 disabled:opacity-50 flex items-center justify-center font-bold text-lg select-none cursor-pointer border border-forest-150"
                >
                  +
                </button>
              </div>
            </div>

            {/* VIP Tiers Upgrades selection */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
                Expedition Hospitality Tier Level
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'standard', name: 'Standard Lodge', desc: 'As described above', charge: '$0 added' },
                  { value: 'vip', name: 'Premium VIP', desc: 'Private campsite, chef & tracking gaiters package', charge: '+$400/pax' },
                  { value: 'elite', name: 'Elite Conservationist', desc: 'Private villa + custom guide + private tracker fireside q&a', charge: '+$1,200/pax' },
                ].map(tier => (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => setTierLevel(tier.value as any)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-1 cursor-pointer transition ${
                      tierLevel === tier.value 
                        ? 'border-forest-600 bg-forest-50/25 ring-2 ring-forest-600' 
                        : 'border-forest-150 bg-white hover:border-forest-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-forest-900 leading-tight">{tier.name}</h4>
                      <p className="text-[10px] text-forest-600 leading-normal mt-0.5 font-light">{tier.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-sand-700 pt-2 block md:mt-1">{tier.charge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Add-ons Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
                Exclusive Wilderness Add-ons (Optional)
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {addonsList.map(addon => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div 
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon.id)}
                      className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer select-none transition ${
                        isChecked 
                          ? 'border-forest-650 bg-forest-50/20' 
                          : 'border-forest-150 bg-white hover:border-forest-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Controlled by outer div onClick
                        className="mt-1 accent-forest-750 cursor-pointer h-4 w-4 shrink-0"
                      />
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="text-xs font-bold text-forest-900 leading-tight">{addon.name}</h4>
                        </div>
                        <p className="text-[9.5px] text-forest-600 font-light leading-normal">{addon.description}</p>
                        <span className="text-[10px] font-mono font-bold text-sand-800 block pt-1.5">
                          ${addon.price} {addon.isPerPerson ? '/ pax' : '(flat fee)'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Detailed live calculator receipt summary */}
        <div className="lg:col-span-5 p-6 md:p-10 bg-forest-900 text-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-forest-800 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-bl-full pointer-events-none"></div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono uppercase tracking-widest text-sand-300">Live Invoice Breakdown</span>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-sand-100">Expedition Estimation</h3>
              <p className="text-[10.5px] text-forest-200 font-light">
                Quoted calculations for requested tier setups under direct Hobe Gorilla regulations.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10 text-xs font-mono">
              
              {/* Selected package name */}
              <div className="flex justify-between items-center text-forest-200">
                <span>Selected Base Tour:</span>
                <span className="font-sans font-bold text-white text-right break-words max-w-[60%]">
                  {selectedPkg.title}
                </span>
              </div>

              {/* Passenger detailed count */}
              <div className="flex justify-between items-center text-forest-200">
                <span>Total Client Count:</span>
                <span className="font-sans font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                  {passengers} Pax
                </span>
              </div>

              {/* Official Permit Pricing */}
              {hasPermitIncluded && (
                <div className="flex justify-between items-start text-forest-200 border-b border-white/5 pb-2">
                  <div>
                    <span className="block">Govt Gorilla Permits:</span>
                    <span className="text-[9px] text-[#b59453] uppercase font-light">Mandatory Conservation Charge</span>
                  </div>
                  <span className="text-white font-sans font-bold">
                    ${gorillaPermitFeePerPax * passengers} USD
                  </span>
                </div>
              )}

              {/* Base Lodge Fees */}
              <div className="flex justify-between items-center text-forest-200">
                <span>Lodge & Guides Base:</span>
                <span className="text-hover-effect">
                  ${baseLodgeFeePerPax * passengers} USD
                </span>
              </div>

              {/* Hospitality setup upgrade charge */}
              {tierLevel !== 'standard' && (
                <div className="flex justify-between items-center text-[#e8dcb9]">
                  <span className="capitalize">{tierLevel} Upgrade Prem:</span>
                  <span>
                    +${tierPremium} USD
                  </span>
                </div>
              )}

              {/* Combined addons itemized list */}
              {selectedAddons.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-white/5 pb-2">
                  <div className="flex justify-between items-center text-sand-200 font-bold">
                    <span>Individual Services Addons:</span>
                    <span>${addonsCost} USD</span>
                  </div>
                  <div className="pl-3 space-y-0.5 text-[9.5px] text-forest-300">
                    {addonsList.filter(a => selectedAddons.includes(a.id)).map(a => (
                      <div key={a.id} className="flex justify-between">
                        <span>• {a.name}:</span>
                        <span>${a.isPerPerson ? `${a.price} x ${passengers}` : a.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="pt-8 border-t border-white/10 space-y-5 mt-10">
            {/* Grand Total tag */}
            <div className="flex justify-between items-baseline gap-2">
              <div>
                <span className="block text-[10px] font-mono uppercase text-sand-300 tracking-wider">Estimated Grand Total</span>
                <span className="text-[8px] text-forest-300 leading-tight block">All corporate taxes & service fees included.</span>
              </div>
              <div className="text-right">
                <span className="text-2xl md:text-3xl font-bold font-mono text-sand-200 block">
                  ${totalExpeditionCost}
                </span>
                <span className="text-[10px] font-mono text-stone-400 font-light block uppercase">US Dollars</span>
              </div>
            </div>

            <button
              id="calculator-commit-button"
              onClick={handleCommitConfigResult}
              className="w-full py-4 bg-sand-600 hover:bg-sand-700 text-forest-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-black/20"
            >
              <span>Apply & Lock-in Permit Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}

// git-sync-trigger