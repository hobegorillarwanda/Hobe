/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SIGNATURE_ITINERARY, SEED_METADATA } from '../data';
import { Compass, Leaf, Heart, MapPin, Milestone } from 'lucide-react';

interface AboutSectionProps {
  onNavigate: (view: 'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin') => void;
}

export default function AboutSection({ onNavigate }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 bg-forest-900 text-white relative overflow-hidden">
      {/* Decorative backdrop details */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-forest-800/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sand-700/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* About Summary Left Columns */}
          <div className="lg:col-span-5 space-y-8">
            <span className="text-xs font-bold tracking-widest text-sand-200 uppercase bg-forest-800/80 px-3.5 py-1.5 rounded-full border border-forest-700/60 inline-block">
              Our Sanctum
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-sand-50 leading-tight">
              A Gate to the <br/>
              <span className="text-sand-100 font-serif italic">Heart of Rwanda</span>
            </h2>
            
            <p className="text-forest-100 text-base leading-relaxed font-light">
              {SEED_METADATA.aboutSummary}
            </p>

            <div className="pt-6 border-t border-forest-800 space-y-4">
              <div className="flex gap-4">
                <div className="p-3 bg-forest-800 rounded-xl h-fit border border-forest-700">
                  <Leaf className="w-5 h-5 text-sand-200" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-medium text-sand-100">100% Sustainable Action</h4>
                  <p className="text-xs text-forest-200 mt-1">We enforce zero-trace treks, empowering indigenous communities through tourism gains.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 bg-forest-800 rounded-xl h-fit border border-forest-700">
                  <Compass className="w-5 h-5 text-sand-200" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-medium text-sand-100">Expert Tracker Guides</h4>
                  <p className="text-xs text-forest-200 mt-1">Hike with seasoned park rangers sharing intimate knowledge of primate lineages.</p>
                </div>
              </div>
            </div>

            {/* Premium Partner Eco-Lodge Image */}
            <div className="w-full h-40 overflow-hidden rounded-xl border border-forest-800 shadow-lg relative">
              <img 
                src="/src/assets/images/luxury_lodge_1781279715722.jpg" 
                alt="Luxury Eco-Lodge Rwanda" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-95"
              />
              <span className="absolute bottom-2.5 right-2.5 text-[9px] font-mono tracking-widest font-bold uppercase bg-forest-950/80 px-2.5 py-1 rounded text-sand-200 border border-forest-800/40 backdrop-blur-sm">
                Partner Eco-Lodge
              </span>
            </div>

            <div className="p-4 bg-forest-800/50 rounded-xl border border-forest-700/50 space-y-2">
              <div className="flex items-center gap-2 text-xs text-sand-200 font-bold tracking-wider uppercase">
                <MapPin className="w-4 h-4" />
                <span>Base camp headquarters</span>
              </div>
              <p className="text-xs text-forest-100 pl-6 leading-relaxed font-mono">
                {SEED_METADATA.address}
              </p>
            </div>
          </div>

          {/* Interactive Signature Route Section */}
          <div className="lg:col-span-7 bg-forest-800/40 p-8 rounded-2xl border border-forest-700/50 relative">
            <div className="flex items-center gap-3 mb-6">
              <Milestone className="w-6 h-6 text-sand-200" />
              <div>
                <h3 className="font-serif text-2xl font-bold text-sand-100">
                  {SIGNATURE_ITINERARY.title}
                </h3>
                <p className="text-xs text-forest-200 uppercase tracking-widest font-bold">
                  The Complete Primate Expedition
                </p>
              </div>
            </div>

            <div className="relative border-l border-forest-700/80 ml-4 space-y-8 py-2">
              {SIGNATURE_ITINERARY.steps.map((step, idx) => (
                <div key={idx} className="relative pl-8 group">
                  {/* Timeline Dot Indicator */}
                  <div className="absolute left-0 -translate-x-1/2 top-1.5 w-3 h-3 bg-sand-600 rounded-full border-2 border-forest-900 group-hover:bg-sand-200 transition-colors duration-300"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1.5">
                    <span className="font-mono text-xs font-bold text-sand-200 uppercase bg-forest-800 px-2 py-0.5 rounded border border-forest-700 inline-block max-w-fit">
                      {step.days}
                    </span>
                    <span className="text-xs font-semibold text-forest-300">
                      {step.destination}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-white mt-1">
                    {step.activity}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-forest-750/30 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2.5 text-xs text-forest-200">
                <Heart className="w-4 h-4 text-sand-600 fill-sand-600 animate-pulse" />
                <span>Private Customized Itineraries Available</span>
              </div>
              <button 
                onClick={() => onNavigate('booking')}
                className="text-xs text-sand-200 hover:text-white font-bold underline uppercase tracking-widest transition cursor-pointer text-left"
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
