/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Lock, Eye, CheckCircle, FileText, Globe, Server } from 'lucide-react';
import { motion } from 'motion/react';

interface PrivacyProps {
  onNavigate: (view: 'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin' | 'privacy' | 'terms') => void;
}

export default function Privacy({ onNavigate }: PrivacyProps) {
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
          <span className="text-forest-900">Privacy Policy</span>
        </div>

        {/* Hero Section */}
        <div className="text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-800">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Custodian Trust Pledge</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-black text-forest-950 tracking-tight leading-none">
            Privacy Policy
          </h1>
          <p className="text-sm md:text-base text-stone-600 font-light max-w-2xl leading-relaxed">
            Hobe Gorilla Rwanda is committed to protecting your personal data, gorilla tracking permit vouchers, and financial transaction records. Learn how we secure your data in compliance with Rwandan and international information security tenets.
          </p>
          <p className="text-xs text-stone-400 font-mono">
            Last Updated: June 14, 2026
          </p>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-stone-200/60 shadow-sm space-y-3">
            <div className="p-2.5 bg-forest-50 text-forest-750 w-fit rounded-2xl border border-forest-100">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm font-bold text-forest-950">Bank-Grade Encryption</h3>
            <p className="text-xs text-stone-500 leading-normal font-light">
              We encrypt phone numbers, guest passport details, and travel booking files directly within secure databanks.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-stone-200/60 shadow-sm space-y-3">
            <div className="p-2.5 bg-forest-50 text-forest-750 w-fit rounded-2xl border border-forest-100">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm font-bold text-forest-950">Zero Telemetry Sales</h3>
            <p className="text-xs text-stone-500 leading-normal font-light">
              No tracking logic or cookies are sold to third-party travel brokers or external marketing agencies.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-stone-200/60 shadow-sm space-y-3">
            <div className="p-2.5 bg-forest-50 text-forest-750 w-fit rounded-2xl border border-forest-100">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-sm font-bold text-forest-950">Rwandan compliance</h3>
            <p className="text-xs text-stone-500 leading-normal font-light">
              Managed under the Law No. 058/2021 relating to the Protection of Personal Data and Privacy in Rwanda.
            </p>
          </div>
        </div>

        {/* Legal Text Sections */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-md p-8 md:p-12 space-y-10 text-left">
          
          <div className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-forest-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-forest-700" />
              1. Information We Collect
            </h2>
            <div className="text-xs md:text-sm text-stone-600 space-y-3 leading-relaxed font-light">
              <p>
                To secure authorized gorilla certificates and park entries managed by the Rwanda Development Board (RDB), we ask for specific and verified information at the point of scheduling:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Personal Identity:</strong> Your legal full name, email address, phone number, and physical billing address.
                </li>
                <li>
                  <strong>Travel Specifics:</strong> Requested date of tracking, preferred package tier, group size, and custom diet or accommodation requirements block.
                </li>
                <li>
                  <strong>Required Government Identification:</strong> When necessary for issuing park permit vouchers, passport details may be requested securely for ranger check-in verification.
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-stone-100" />

          <div className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-forest-950 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-forest-700" />
              2. How We Utilize Your Data
            </h2>
            <div className="text-xs md:text-sm text-stone-600 space-y-3 leading-relaxed font-light">
              <p>
                We do not sell, rent, or trade your private records. Collected data is processed strictly to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Register reservations or assign requested tracking permits with mountain guides.</li>
                <li>Dispatch automated digital reservation receipts, verification vouchers, and safari alerts.</li>
                <li>Perform critical financial audits related to environmental park levying under custom-vetted security roles.</li>
                <li>Notify park emergency units in extreme biological safety events during wildlife safaris.</li>
              </ul>
            </div>
          </div>

          <hr className="border-stone-100" />

          <div className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-forest-950 flex items-center gap-2">
              <Lock className="w-5 h-5 text-forest-700" />
              3. Protection & Cloud Databank Security
            </h2>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-light">
              Your permit reservations are written safely onto isolated, cloud-hosted Google Firebase databanks. Client-side authentication uses standard token cryptography to block unauthorized third-party snooping. Administrative changes, date assignments, and permit overrides are protected by verified, role-guarded security rule structures that verify the active operational session before processing database mutations.
            </p>
          </div>

          <hr className="border-stone-100" />

          <div className="space-y-4">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-forest-950 flex items-center gap-2">
              <Globe className="w-5 h-5 text-forest-700" />
              4. Your Personal Rights & Choices
            </h2>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-light">
              As an honored tracker, you retain absolute authority over your records. You may log into the <strong>Bookings Hub</strong> to monitor active vouchers, request a date reschedule, or withdraw outdated applications. For deep account removal or manual record scrub overrides, contact our coordinators desk immediately at <strong>hobegorillarwanda@gmail.com</strong>.
            </p>
          </div>

        </div>

        {/* Bottom CTA Block */}
        <div className="p-8 bg-gradient-to-br from-forest-950 via-forest-900 to-stone-900 text-white rounded-3xl text-center space-y-4 shadow-xl">
          <h3 className="font-serif text-xl font-bold">Have questions about our data security?</h3>
          <p className="text-xs text-forest-200 max-w-lg mx-auto font-light leading-relaxed">
            Our park coordinators and compliance leads are standing by to explain our data vaults, permit procedures, and environmental compliance frameworks.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => onNavigate('home')}
              className="px-6 py-2.5 bg-white text-forest-950 font-bold rounded-xl text-xs hover:bg-sand-100 cursor-pointer transition text-center"
            >
              Return Home
            </button>
            <a 
              href="mailto:hobegorillarwanda@gmail.com" 
              className="px-6 py-2.5 bg-forest-800 hover:bg-forest-700 border border-forest-700 text-white font-bold rounded-xl text-xs cursor-pointer transition text-center block"
            >
              Contact compliance
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
