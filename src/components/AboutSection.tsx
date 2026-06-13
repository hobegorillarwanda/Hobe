/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SIGNATURE_ITINERARY, SEED_METADATA } from '../data';
import { Compass, Leaf, Heart, MapPin, Milestone } from 'lucide-react';

interface AboutSectionProps {
  onNavigate: (view: 'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin', subRoute?: string) => void;
}

export default function AboutSection({ onNavigate }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 bg-white text-forest-950 relative overflow-hidden border-b border-forest-100/50">
      {/* Decorative backdrop details */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-50/60 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start text-left">
          {/* About Summary Left Columns */}
          <div className="lg:col-span-5 space-y-8">
            <span className="text-xs font-bold tracking-widest text-forest-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-forest-100 inline-block font-mono">
              Our Sanctum
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-forest-900 leading-tight">
              A Gate to the <br/>
              <span className="text-forest-750 font-serif italic">Heart of Rwanda</span>
            </h2>
            
            <p className="text-forest-800 text-base leading-relaxed font-light">
              {SEED_METADATA.aboutSummary}
            </p>

            <div className="pt-6 border-t border-forest-100 space-y-4">
              <div className="flex gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl h-fit border border-forest-100">
                  <Leaf className="w-5 h-5 text-forest-700" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-forest-900">100% Sustainable Action</h4>
                  <p className="text-xs text-forest-650 mt-1">We enforce zero-trace treks, empowering indigenous communities through tourism gains.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl h-fit border border-forest-100">
                  <Compass className="w-5 h-5 text-forest-700" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-forest-900">Expert Tracker Guides</h4>
                  <p className="text-xs text-forest-650 mt-1">Hike with seasoned park rangers sharing intimate knowledge of primate lineages.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-forest-50/50 rounded-xl border border-forest-100/80 space-y-2">
              <div className="flex items-center gap-2 text-xs text-forest-800 font-bold tracking-wider uppercase font-mono">
                <MapPin className="w-4 h-4 text-forest-600" />
                <span>Base camp headquarters</span>
              </div>
              <p className="text-xs text-forest-850 pl-6 leading-relaxed font-mono">
                {SEED_METADATA.address}
              </p>
            </div>
          </div>

          {/* Interactive Signature Route Section */}
          <div className="lg:col-span-7 bg-forest-900 p-8 rounded-3xl border border-forest-850 relative shadow-md text-white">
            <div className="flex items-center gap-3 mb-6">
              <Milestone className="w-6 h-6 text-emerald-300" />
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {SIGNATURE_ITINERARY.title}
                </h3>
                <p className="text-xs text-emerald-200 uppercase tracking-widest font-mono font-bold">
                  The Complete Primate Expedition
                </p>
              </div>
            </div>

            <div className="relative border-l border-forest-800/80 ml-4 space-y-8 py-2">
              {SIGNATURE_ITINERARY.steps.map((step, idx) => (
                <div key={idx} className="relative pl-8 group">
                  {/* Timeline Dot Indicator */}
                  <div className="absolute left-0 -translate-x-1/2 top-1.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-forest-900 group-hover:bg-white transition-colors duration-300"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-emerald-100 uppercase bg-forest-800 px-2 py-0.5 rounded border border-forest-755 inline-block max-w-fit">
                      {step.days}
                    </span>
                    <span className="text-xs font-semibold text-emerald-200">
                      {step.destination}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-white mt-1">
                    {step.activity}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-forest-800/80 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2.5 text-xs text-emerald-200">
                <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400/10" />
                <span>Private Customized Itineraries Available</span>
              </div>
              <button 
                onClick={() => onNavigate('booking')}
                className="text-xs text-emerald-200 hover:text-white font-bold underline uppercase tracking-widest transition cursor-pointer text-left font-mono"
              >
                Request Custom Quotation &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
