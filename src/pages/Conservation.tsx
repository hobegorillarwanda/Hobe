/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Shield, Sparkles, Heart, HelpCircle, Check, MapPin, Award, TreePine } from 'lucide-react';
import { motion } from 'motion/react';

interface ConservationProps {
  onNavigate: (view: 'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin') => void;
}

export default function Conservation({ onNavigate }: ConservationProps) {
  const [activeTab, setActiveTab] = useState<'rules' | 'trekking-etiquette' | 'stats'>('rules');
  const [selectedParkStat, setSelectedParkStat] = useState<string>('volcanoes');

  // Gorilla rules and regulations
  const conservationRules = [
    {
      title: 'Maintain strict 7-Meter (21 ft) Distance',
      description: 'Protects wild gorillas from feeling cornered and prevents cross-infection of human respiratory pathorgens.',
      icon: '📏'
    },
    {
      title: 'KN95 Protective Masks are Mandatory',
      description: 'Because humans and mountain gorillas share 98% DNA, gorillas are susceptible to COVID-19, colds, and flu.',
      icon: '😷'
    },
    {
      title: 'Maximum 8 Persons Per Gorilla Family',
      description: 'Limits environmental compression on the forest path and avoids overstimulating family silverbacks.',
      icon: '👥'
    },
    {
      title: 'Strict Hour-Long Observation Limit',
      description: 'Once contact is made, clients are capped at exactly 60 minutes of observation time to prevent modifying animal behavior.',
      icon: '⏱'
    },
    {
      title: 'No Flash Photography Allowed',
      description: 'Flashes are strictly prohibited. The bright light can register as a threat or startle silverbacks, leading to defense behavior.',
      icon: '📸'
    },
    {
      title: 'Stay Calm If a Gorilla Charges',
      description: 'Never run. Crouch low, lower your eyes, avoid direct eye contact, and let the experienced rangers vocalize reassurance.',
      icon: '🦍'
    }
  ];

  // Population history data points
  const gorillaPopHistory = [
    { year: 1989, pop: 320, label: 'Post-Dian Fossey era' },
    { year: 1998, pop: 354, label: 'Intense anti-poaching patrol setup' },
    { year: 2003, pop: 380, label: 'Official park extension registries' },
    { year: 2010, pop: 480, label: '10% Revenue Share system launch' },
    { year: 2018, pop: 604, label: 'Virunga mountains multi-lateral census' },
    { year: 2026, pop: 1063, label: 'Current Peak Conservation Milestone' }
  ];

  // Park specific conservation datasets
  const parkStats: Record<string, {
    title: string;
    rangersCount: number;
    sizeSqKm: number;
    researchCrews: number;
    achievements: string[];
  }> = {
    volcanoes: {
      title: 'Volcanoes Forest Protection Unit',
      rangersCount: 420,
      sizeSqKm: 160,
      researchCrews: 12,
      achievements: [
        'Recorded zero poaching deaths over the past 8 consecutive years.',
        'Established full-stack community clinic funding paid entirely via tracking permits.',
        'Successfully tracked and expanded 12 habituated gorilla families for eco-visitation.'
      ]
    },
    nyungwe: {
      title: 'Nyungwe Rainforest Sanctuary Unit',
      rangersCount: 280,
      sizeSqKm: 1013,
      researchCrews: 8,
      achievements: [
        'Restored over 140 kilometers of biological wildlife corridors.',
        'Sustained continuous research mapping of chimpanzee genetic lines.',
        'Maintained full canopy tracking towers matching ancient montane profiles.'
      ]
    },
    akagera: {
      title: 'Akagera Mixed Savanna Conservancy',
      rangersCount: 310,
      sizeSqKm: 1122,
      researchCrews: 6,
      achievements: [
        'Successfully reintroduced Eastern Black Rhinos into the Eastern savannas.',
        'Constructed complete boundary carnivore-proof solar fencing.',
        'Maintained 100% telemetry collar grids on translocated lion prides.'
      ]
    }
  };

  const stat = parkStats[selectedParkStat];

  // SVG dimensions for gorilla population timeline chart
  const paddingLeft = 60;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 40;
  const chartWidth = 600;
  const chartHeight = 240;

  // Render SVG points based on mathematical scale
  const getSvgCoordinates = () => {
    const minYear = 1989;
    const maxYear = 2026;
    const minPop = 280;
    const maxPop = 1100;

    return gorillaPopHistory.map(d => {
      const x = paddingLeft + ((d.year - minYear) / (maxYear - minYear)) * (chartWidth - paddingLeft - paddingRight);
      const y = chartHeight - paddingBottom - ((d.pop - minPop) / (maxPop - minPop)) * (chartHeight - paddingTop - paddingBottom);
      return { x, y, data: d };
    });
  };

  const coordPoints = getSvgCoordinates();

  // Create SVG path d lines
  const linePathD = coordPoints.reduce((acc, p, idx) => {
    return acc + `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y} `;
  }, '');

  // Complete the polygon for the underlying shaded area
  const areaPathD = linePathD
    ? `${linePathD} L ${coordPoints[coordPoints.length - 1].x} ${chartHeight - paddingBottom} L ${coordPoints[0].x} ${chartHeight - paddingBottom} Z`
    : '';

  return (
    <div className="py-16 max-w-7xl mx-auto px-6 space-y-16 text-left">
      
      {/* 1. HERO TITLE */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold tracking-widest text-forest-700 uppercase bg-forest-100 px-3.5 py-1.5 rounded-full border border-forest-200/50 inline-block font-mono">
          Guardians of the Mists
        </span>
        <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-forest-900 leading-none">
          Conservation Hub
        </h1>
        <p className="text-sm text-forest-650 max-w-xl mx-auto font-light leading-relaxed">
          Rwanda represents a global standard in sustainable tourism. Real-time conservation ensures that tracking permits actively finance gorilla veterinary support, community schools, and anti-poaching rangers.
        </p>
      </div>

      {/* 2. CHOSEN SUBVIEW BUTTONS */}
      <div className="flex justify-center border-b border-forest-150 pb-px">
        <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar py-2">
          {[
            { id: 'rules', label: 'Mandatory Forest Regulations', icon: <Shield className="w-4 h-4" /> },
            { id: 'stats', label: 'Eco-Tracker Operations Logs', icon: <TreePine className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3.5 text-xs uppercase font-extrabold tracking-wider border-b-2 cursor-pointer transition whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-forest-700 text-forest-900 font-extrabold' 
                  : 'border-transparent text-forest-600 hover:text-forest-850 hover:border-forest-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. DOCK SUBVIEWS ON TOGGLE */}
      <div>
        {activeTab === 'rules' && (
          <div className="space-y-12">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-forest-100 shadow-luxury grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-forest-900 leading-tight">
                  Official Visitor Code of Conduct
                </h3>
                <p className="text-xs text-forest-650 font-light leading-relaxed">
                  These laws are strictly enforced by the accompanying Rwanda Development Board (RDB) park rangers. Failure to conform leads to immediate extraction from the sanctuary with zero permit refunds. We ask for deep respect toward primate intelligence.
                </p>
              </div>

              <div className="md:col-span-4 p-5 bg-sand-100 rounded-2xl border border-sand-200 space-y-3">
                <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Award className="w-4.5 h-4.5 text-sand-700" />
                  <span>The 10% Revenue Share</span>
                </h4>
                <p className="text-[11px] text-forest-750 font-light leading-relaxed">
                  10% of your permit cost goes back to direct development infrastructure surrounding Volcanoes NP. Over $2.1M distributed into local school clinics and water grids of Rwanda.
                </p>
              </div>
            </div>

            {/* Rules Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conservationRules.map((rule, idx) => (
                <div 
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-forest-100 shadow-luxury space-y-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 bg-forest-50/50 rounded-bl-3xl flex items-center justify-center text-lg pointer-events-none">
                    {rule.icon}
                  </div>
                  <h4 className="font-serif text-lg font-bold text-forest-900 pr-8">{rule.title}</h4>
                  <p className="text-xs text-forest-655 font-light leading-relaxed">{rule.description}</p>
                </div>
              ))}
            </div>

            {/* Timelines statistics chart layout */}
            <div className="bg-white p-6 md:p-10 rounded-3xl border border-forest-100 shadow-luxury grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left text statistics */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-[#94743b] font-bold uppercase block">Population Evolution</span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-forest-900 tracking-tight leading-snug">
                  The Great Primate Recovery Timeline
                </h3>
                <p className="text-xs text-forest-650 font-light leading-relaxed">
                  In 1989, less than 320 mountain gorillas remained on the volcanic Virunga range. Thanks to intense anti-poaching, ranger health clinics, and the active contributions of the $1,500 permit network, populations have surpassed 1,063 wild primates.
                </p>
                <div className="p-4 bg-sand-50 rounded-2xl border border-forest-100 flex items-center gap-3">
                  <span className="text-3xl">💹</span>
                  <div>
                    <h4 className="text-xs font-bold text-forest-900 leading-tight">IUCN Registry Status</h4>
                    <p className="text-[10px] text-forest-600 font-normal mt-0.5">Elevated from "Critically Endangered" to "Endangered" in 2018.</p>
                  </div>
                </div>
              </div>

              {/* Right: pure interactive responsive SVG Chart */}
              <div className="lg:col-span-7 bg-sand-50/50 p-6 rounded-2xl border border-forest-100/60 overflow-x-auto shadow-inner">
                <div className="min-w-[500px] text-center font-mono text-[10px] text-forest-700">
                  <span className="text-xs font-bold font-sans text-forest-900 block mb-2 text-left pl-3 uppercase tracking-wider">
                    Mountain Gorilla Census History
                  </span>
                  
                  {/* SVG Canvas */}
                  <svg 
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                    className="w-full h-auto overflow-visible select-none"
                  >
                    {/* Horizontal helper lines */}
                    {[300, 500, 700, 900, 1100].map((pop, i) => {
                      const minPop = 280;
                      const maxPop = 1100;
                      const y = chartHeight - paddingBottom - ((pop - minPop) / (maxPop - minPop)) * (chartHeight - paddingTop - paddingBottom);
                      return (
                        <g key={i}>
                          <line 
                            x1={paddingLeft} 
                            y1={y} 
                            x2={chartWidth - paddingRight} 
                            y2={y} 
                            stroke="#e2ede7" 
                            strokeWidth="1" 
                            strokeDasharray="4 4" 
                          />
                          <text 
                            x={paddingLeft - 10} 
                            y={y + 3} 
                            textAnchor="end" 
                            className="fill-forest-600 font-mono text-[9px]"
                          >
                            {pop}
                          </text>
                        </g>
                      );
                    })}

                    {/* Timeline shaded area polygon */}
                    <path 
                      d={areaPathD} 
                      fill="url(#chartGrad)" 
                      className="opacity-40"
                    />

                    {/* Timeline line path */}
                    <path 
                      d={linePathD} 
                      fill="none" 
                      stroke="#2c5e43" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                    />

                    {/* Data Points as circles & labels */}
                    {coordPoints.map((p, idx) => (
                      <g key={idx} className="group">
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r="5.5" 
                          fill="#2c5e43" 
                          stroke="#e8dcb9"
                          strokeWidth="2"
                        />
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r="12" 
                          fill="transparent" 
                          className="hover:fill-forest-600/10 cursor-pointer" 
                        />
                        <text 
                          x={p.x} 
                          y={p.y - 12} 
                          textAnchor="middle" 
                          className="fill-forest-900 font-bold font-mono text-[10px]"
                        >
                          {p.data.pop}
                        </text>
                        <text 
                          x={p.x} 
                          y={chartHeight - 20} 
                          textAnchor="middle" 
                          className="fill-forest-600 font-mono text-[9px]"
                        >
                          {p.data.year}
                        </text>
                      </g>
                    ))}

                    {/* Def gradient fillers */}
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2c5e43" />
                        <stop offset="100%" stopColor="#fbf9f4" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <p className="text-[10px] text-stone-500 font-light mt-3 italic text-left pl-3">
                    * Data vetted by the Greater Virunga Transboundary Collaboration (GVTC).
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Nav menu selector list */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-serif text-xl font-bold text-forest-900 uppercase tracking-tight">Active Warden Stations</h3>
              <p className="text-[11px] text-forest-600 leading-normal font-light">Select an authorized wildlife protection base unit in Rwanda to view deployment stats:</p>
              
              <div className="space-y-2">
                {[
                  { id: 'volcanoes', name: 'Volcanoes Mt. Gorilla Base', park: 'Volcanoes NP' },
                  { id: 'nyungwe', name: 'Nyungwe Rain forest Agency', park: 'Nyungwe NP' },
                  { id: 'akagera', name: 'Akagera Savannah Ranger post', park: 'Akagera NP' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedParkStat(item.id)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition ${
                      selectedParkStat === item.id 
                        ? 'border-forest-600 bg-forest-750 text-white font-bold' 
                        : 'border-forest-150 bg-white hover:border-forest-200 text-forest-800'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold leading-none">{item.name}</h4>
                      <p className={`text-[10px] ${selectedParkStat === item.id ? 'text-forest-100' : 'text-forest-600'}`}>{item.park}</p>
                    </div>
                    <span className="text-xl">🛡</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Selected Warden deployment dossier */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-forest-100 shadow-luxury space-y-6">
              <div className="flex items-center gap-3 border-b border-forest-100 pb-4">
                <div className="p-3 bg-forest-50 border border-forest-150 rounded-xl text-forest-700">
                  <Shield className="w-5.5 h-5.5" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-sand-700 font-bold">Warden Operations Unit Log</span>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-forest-900 leading-tight">
                    {stat.title}
                  </h3>
                </div>
              </div>

              {/* Counter grids */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-sand-50 rounded-2xl border border-forest-100/50">
                  <span className="text-2xl font-mono font-bold text-forest-800 block">{stat.rangersCount}</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-500">Active Patrolling Rangers</span>
                </div>
                <div className="p-4 bg-sand-50 rounded-2xl border border-forest-100/50">
                  <span className="text-2xl font-mono font-bold text-forest-800 block">{stat.sizeSqKm} km²</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-500">Total Sanctuary Zone</span>
                </div>
                <div className="p-4 bg-sand-50 rounded-2xl border border-forest-100/50">
                  <span className="text-2xl font-mono font-bold text-forest-800 block">{stat.researchCrews} teams</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-500">Scientific Research Crews</span>
                </div>
              </div>

              {/* Achievements Bullet point details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-forest-900 uppercase tracking-widest border-l-2 border-sand-600 pl-2.5">
                  Recent Milestone Achievements
                </h4>
                <div className="space-y-3">
                  {stat.achievements.map((ach, idx) => (
                    <div key={idx} className="flex gap-3 items-start text-xs text-forest-750 font-light leading-relaxed">
                      <span className="mt-1 w-2.5 h-2.5 bg-sand-700 rounded-full shrink-0"></span>
                      <p>{ach}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA overlay */}
              <div className="p-4 bg-forest-50/50 rounded-2xl border border-forest-100/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light">
                <p className="text-forest-750 pr-4">Active tracking permits are capped at 96 individual entries per day for Volcanoes Base. Pre-apply today to prevent waiting.</p>
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full sm:w-auto py-2.5 px-6 bg-forest-900 hover:bg-forest-850 text-white font-bold rounded-xl uppercase text-[10px] tracking-wider transition whitespace-nowrap cursor-pointer"
                >
                  Verify Permits Availability
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
