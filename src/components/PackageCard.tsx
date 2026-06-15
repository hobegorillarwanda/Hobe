/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Package } from '../types';
import { Clock, Check, Star, Shield, ArrowRight } from 'lucide-react';

interface PackageCardProps {
  pkg: Package;
  onSelect: (pkg: Package) => void;
  isSelected?: boolean;
  key?: string;
}

export default function PackageCard({ pkg, onSelect, isSelected = false }: PackageCardProps) {
  // Styles based on tier grouping
  const getTierLayout = (tier: string) => {
    switch (tier) {
      case 'luxury':
        return {
          wrapper: 'bg-forest-900 text-white border-2 border-sand-600 relative overflow-hidden',
          badge: 'bg-sand-600 text-forest-900',
          priceUnit: 'text-sand-200',
          button: 'bg-sand-600 hover:bg-sand-700 text-forest-950 font-bold',
          circleDeco: 'bg-sand-700/10',
          accentBorder: 'border-forest-800'
        };
      case 'mid-range':
        return {
          wrapper: 'bg-white border border-forest-600/30 shadow-luxury relative overflow-hidden',
          badge: 'bg-forest-700 text-white',
          priceUnit: 'text-forest-600',
          button: 'bg-forest-700 hover:bg-forest-600 text-white font-semibold',
          circleDeco: 'bg-forest-50',
          accentBorder: 'border-forest-100'
        };
      default: // budget
        return {
          wrapper: 'bg-white border border-forest-100 shadow-sm relative overflow-hidden',
          badge: 'bg-forest-100 text-forest-800',
          priceUnit: 'text-forest-600',
          button: 'bg-forest-900 hover:bg-forest-800 text-white',
          circleDeco: 'bg-forest-50/40',
          accentBorder: 'border-forest-100'
        };
    }
  };

  const layout = getTierLayout(pkg.tier);

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cost);
  };

  return (
    <div 
      id={`package-card-${pkg.id}`}
      className={`rounded-3xl p-8 flex flex-col justify-between h-full shadow-luxury-hover transition-all ${layout.wrapper} ${isSelected ? 'ring-4 ring-sand-600 ring-offset-4 ring-offset-sand-50' : ''}`}
    >
      {/* Absolute design elements on luxury tier */}
      {pkg.tier === 'luxury' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sand-100/10 to-transparent rounded-bl-full pointer-events-none"></div>
      )}

      <div className="space-y-6">
        {pkg.imageUrl && (
          <div className="w-full h-44 overflow-hidden rounded-2xl relative border border-forest-500/10 shadow-sm">
            <img 
              src={pkg.imageUrl} 
              alt={pkg.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}

        {/* Package Header Row */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${layout.badge}`}>
                {pkg.tier}
              </span>
              {pkg.tier === 'luxury' && <Star className="w-3.5 h-3.5 text-sand-500 fill-sand-500" />}
            </div>
            
            <h3 className="font-serif text-2xl font-bold tracking-tight text-inherit">
              {pkg.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-forest-500/10 rounded-xl border border-forest-500/10 text-inherit">
            <Clock className="w-3.5 h-3.5 text-inherit" />
            <span>{pkg.duration}</span>
          </div>
        </div>

        {/* Cost Matrix display */}
        <div className="py-2">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-serif font-bold text-inherit tracking-tight font-mono">
              {formatCost(pkg.baselineCost)}
            </span>
            <span className={`text-xs ml-1 ${layout.priceUnit}`}>
              USD / passenger
            </span>
          </div>
          <p className="text-xs text-inherit opacity-70 mt-1">
            *All park permits and safety guards included in baseline cost
          </p>
        </div>

        <p className="text-sm opacity-90 leading-relaxed font-light">
          {pkg.description}
        </p>

        {/* Dynamic inclusions bullet checklist */}
        <div className={`space-y-3 pt-4 border-t ${layout.accentBorder}`}>
          <h4 className="text-xs font-bold uppercase tracking-widest text-inherit opacity-80 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>What's Included</span>
          </h4>

          <ul className="space-y-2.5">
            {pkg.inclusions && pkg.inclusions.map((inc, i) => (
              <li key={i} className="flex gap-2.5 items-start text-xs opacity-90 leading-normal">
                <span className="p-0.5 bg-sand-600/20 text-sand-700 rounded h-fit mt-0.5">
                  <Check className="w-3 h-3 text-inherit stroke-[3px]" />
                </span>
                <span>{inc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-4">
        <button
          id={`select-btn-${pkg.id}`}
          onClick={() => onSelect(pkg)}
          className={`w-full py-3 px-5 rounded-xl text-center text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-2 cursor-pointer transition ${layout.button}`}
        >
          <span>{isSelected ? 'Selected Package' : 'Select & Start Booking'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// git-sync-trigger