/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileText, ShieldAlert, CheckSquare, Coins, HelpCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface TermsProps {
  onNavigate: (view: 'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin' | 'privacy' | 'terms') => void;
}

export default function Terms({ onNavigate }: TermsProps) {
  return (
    <div className="bg-sand-50/40 min-h-screen py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Breadcrumb & Navigation Back */}
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-widest">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-forest-800 transition cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-forest-900">Terms & Conditions</span>
        </div>

        {/* Hero Section */}
        <div className="text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-amber-800">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Official Booking Regulations</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-black text-forest-950 tracking-tight leading-none">
            Terms & Conditions
          </h1>
          <p className="text-sm md:text-base text-stone-600 font-light max-w-2xl leading-relaxed">
            By booking a mountain gorilla trekking package or allocating digital tracking vouchers under Hobe Gorilla Rwanda, you explicitly consent to the park rules, RDB permit frameworks, and travel reschedules outlined below.
          </p>
          <p className="text-xs text-stone-400 font-mono">
            Last Updated: June 14, 2026
          </p>
        </div>

        {/* Terms Content Body */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-md p-8 md:p-12 space-y-10 text-left">
          
          <div className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-forest-950 flex items-center gap-2">
              <Coins className="w-5 h-5 text-forest-700 font-bold" />
              1. Permit Deposits & Fee Policies
            </h2>
            <div className="text-xs md:text-sm text-stone-600 space-y-3 leading-relaxed font-light">
              <p>
                Rwandan mountain gorilla trekking permits are strictly limited and controlled directly by the Rwanda Development Board (RDB). To secure these passes on behalf of clients, Hobe Gorilla Rwanda must purchase vouchers immediately.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Permit Allocation:</strong> Vouchers and permits are strictly personal and non-transferable once registered with the park authorities.
                </li>
                <li>
                  <strong>Pricing & Tariffs:</strong> Standard prices include environmental levies, park protection taxes, and conservation support. Quoted costs represent the actual value computed with the requested hospitality tier.
                </li>
                <li>
                  <strong>Deposit Requirements:</strong> Full payment or verified deposit is required to lock in the specified calendar date.
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-stone-100" />

          <div className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-forest-950 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-forest-700" />
              2. Rescheduling & Travel Date Changes
            </h2>
            <div className="text-xs md:text-sm text-stone-600 space-y-3 leading-relaxed font-light">
              <p>
                We understand that travel itineraries shift due to flights or regional variations. Our rescheduling parameters are designed to be as generous as possible while staying compliant with park slots:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Coordinator Modification:</strong> Date adjustments must be assigned via the administrative dashboard and confirmed by checking slot availability.
                </li>
                <li>
                  <strong>Notification Window:</strong> Requests to change dates should ideally occur at least 15 days in advance of the registered travel date.
                </li>
                <li>
                  <strong>No-Show Rule:</strong> Registrations unclaimed at park entry checkpoints on the active voucher day without prior agreement will be voided without refund.
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-stone-100" />

          <div className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-forest-950 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-forest-700" />
              3. Conservation Directives & Conduct
            </h2>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-light">
              All trackers must strictly adhere to the guidelines set forth on our <strong>Conservation Studies</strong> tab, including maintaining a minimum 7-meter distance from gorilla groups, wearing respiratory protection, and staying in organized tracking groups of maximum 8 people. Rangers and coordinators reserve the supreme right to terminate tracking early for any guest exhibiting disruptive, aggressive, or dangerous behaviors targeting the wildlife or surrounding flora.
            </p>
          </div>

          <hr className="border-stone-100" />

          <div className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-forest-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-forest-700" />
              4. Disclaimer of Liability
            </h2>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-light">
              While gorilla sightings in Volcanoes National Park are over 98% successful due to sophisticated ranger patrols, mountain gorillas remain wild primates in their natural biome. Hobe Gorilla Rwanda under no circumstances guarantees specific animal behaviors or close-interaction scenarios during your trekking hours.
            </p>
          </div>

        </div>

        {/* Home navigation card */}
        <div className="p-8 bg-stone-100 border border-stone-200 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-bold text-forest-950">Ready to configure your ideal safari itinerary?</h4>
            <p className="text-xs text-stone-550 font-light leading-normal max-w-xl">
              Calculate accurate lodging prices, upgrade to private guides, and submit tracking permits instantly using our built-in calculator engine.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('packages')}
            className="w-full md:w-auto px-6 py-3 bg-forest-900 hover:bg-forest-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
          >
            <span>Interactive Calculator</span>
            <ArrowRight className="w-4 h-4 text-sand-500" />
          </button>
        </div>

      </div>
    </div>
  );
}
