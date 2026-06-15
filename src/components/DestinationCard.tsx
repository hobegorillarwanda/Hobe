/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Destination } from '../types';
import { Leaf, Eye, Compass, TreePine, Map, Tag } from 'lucide-react';
import { getAdaptiveImageUrl } from '../services';

interface DestinationCardProps {
  destination: Destination;
  key?: string;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  // Get icon based on destination ID
  const getHeaderIcon = (id: string) => {
    switch (id) {
      case 'volcanoes-np':
        return <Compass className="w-6 h-6 text-sand-200" />;
      case 'akagera-np':
        return <Eye className="w-6 h-6 text-sand-200" />;
      case 'nyungwe-np':
        return <TreePine className="w-6 h-6 text-sand-200" />;
      default:
        return <Leaf className="w-6 h-6 text-sand-200" />;
    }
  };

  // Get gradient backdrop based on ID to represent the mood
  const getGradientTheme = (id: string) => {
    switch (id) {
      case 'volcanoes-np': // volcanic mist
        return 'from-forest-800 to-forest-900';
      case 'akagera-np': // savanna sunset
        return 'from-forest-900 via-forest-800 to-sand-800';
      case 'nyungwe-np': // deep forest canopies
        return 'from-forest-800 via-forest-900 to-forest-950';
      default: // newest lush woodlands
        return 'from-forest-850 to-forest-900';
    }
  };

  return (
    <div 
      id={`destination-${destination.id}`}
      className={`rounded-2xl overflow-hidden shadow-luxury shadow-luxury-hover border border-forest-100 flex flex-col h-full bg-gradient-to-br ${getGradientTheme(destination.id)} text-white p-6 justify-between transition-all relative group`}
    >
      {/* Background Image layer with subtle movement on group hover */}
      {destination.imageUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl pointer-events-none">
          <img 
            src={getAdaptiveImageUrl(destination.imageUrl)} 
            alt={destination.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle vignette shade */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent"></div>
        </div>
      )}

      <div className="space-y-6 relative z-10">
        {/* Header containing name & icon badge */}
        <div className="flex justify-between items-start">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/15">
            {getHeaderIcon(destination.id)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-sand-200 font-mono bg-white/5 py-1 px-2.5 rounded-full border border-white/10">
            <Map className="w-3.5 h-3.5" />
            <span>{destination.location}</span>
          </div>
        </div>

        {/* Content detail */}
        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-bold tracking-tight text-white leading-tight">
            {destination.name}
          </h3>
          <p className="text-xs text-forest-100 font-light leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* Dynamic highlights list */}
        {destination.highlights && destination.highlights.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-sand-100 uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Key Highlights</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {destination.highlights.map((h, i) => (
                <span 
                  key={i} 
                  className="text-[10px] sm:text-xs bg-white/10 hover:bg-white/15 px-2 py-1 rounded-md text-white/90 border border-white/5 transition"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Wildlife tracking highlights */}
      {destination.wildlife && destination.wildlife.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10 space-y-2 relative z-10">
          <h4 className="text-xs font-bold text-sand-200 uppercase tracking-widest flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span>Primary Wildlife</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {destination.wildlife.map((w, i) => (
              <span 
                key={i} 
                className="text-[10px] bg-sand-200/10 text-sand-100 font-medium font-mono px-2 py-0.5 rounded border border-sand-200/10"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// git-sync-trigger