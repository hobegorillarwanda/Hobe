/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Shield, Sparkles, Heart, HelpCircle, Check, MapPin, Award, TreePine, Ruler, HeartPulse, Users, Clock, Camera, TrendingUp, Coins, ShieldAlert } from 'lucide-react';
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
      icon: 'distance'
    },
    {
      title: 'KN95 Protective Masks are Mandatory',
      description: 'Because humans and mountain gorillas share 98% DNA, gorillas are susceptible to COVID-19, colds, and flu.',
      icon: 'mask'
    },
    {
      title: 'Maximum 8 Persons Per Gorilla Family',
      description: 'Limits environmental compression on the forest path and avoids overstimulating family silverbacks.',
      icon: 'group'
    },
    {
      title: 'Strict Hour-Long Observation Limit',
      description: 'Once contact is made, clients are capped at exactly 60 minutes of observation time to prevent modifying animal behavior.',
      icon: 'time'
    },
    {
      title: 'No Flash Photography Allowed',
      description: 'Flashes are strictly prohibited. The bright light can register as a threat or startle silverbacks, leading to defense behavior.',
      icon: 'camera'
    },
    {
      title: 'Stay Calm If a Gorilla Charges',
      description: 'Never run. Crouch low, lower your eyes, avoid direct eye contact, and let the experienced rangers vocalize reassurance.',
      icon: 'charge'
    }
  ];

  const getRuleIcon = (iconKey: string) => {
    switch (iconKey) {
      case 'distance':
        return <Ruler className="w-5 h-5 text-forest-700" />;
      case 'mask':
        return <HeartPulse className="w-5 h-5 text-forest-700" />;
      case 'group':
        return <Users className="w-5 h-5 text-forest-700" />;
      case 'time':
        return <Clock className="w-5 h-5 text-forest-700" />;
      case 'camera':
        return <Camera className="w-5 h-5 text-forest-700" />;
      case 'charge':
        return <ShieldAlert className="w-5 h-5 text-forest-700" />;
      default:
        return <HelpCircle className="w-5 h-5 text-forest-700" />;
    }
  };

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
    <div className="space-y-0 text-left bg-sand-50/10">
      
      {/* 1. HERO TITLE & TABS BLOCK */}
      <div className="bg-gradient-to-b from-[#e3ede8]/60 to-white pt-16 border-b border-forest-100/50">
        <div className="max-w-7xl mx-auto px-6 pb-6 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold tracking-widest text-forest-750 uppercase bg-forest-100/80 px-3.5 py-1.5 rounded-full border border-forest-200/50 inline-block font-mono">
              Guardians of the Mists
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-forest-950 leading-none">
              Conservation Hub
            </h1>
            <p className="text-xs md:text-sm text-forest-750 max-w-xl mx-auto font-light leading-relaxed">
              Rwanda represents a global standard in sustainable tourism. Real-time conservation ensures that tracking permits actively finance gorilla veterinary support, community schools, and anti-poaching rangers.
            </p>
          </div>

          {/* 2. CHOSEN SUBVIEW BUTTONS */}
          <div className="flex justify-center border-b border-forest-100/60 pb-px">
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
                      ? 'border-forest-800 text-forest-950 font-extrabold pb-3' 
                      : 'border-transparent text-forest-600 hover:text-forest-850 hover:border-forest-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. DOCK SUBVIEWS ON TOGGLE */}
      <div>
        {activeTab === 'rules' && (
          <div className="space-y-0">
            {/* a) Regulations & Conduct intro (gorgeous deep forest green section!) */}
            <div className="bg-forest-950 text-white py-24 border-b border-forest-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10">
                <div className="bg-forest-900 p-6 md:p-10 rounded-3xl border border-forest-800/80 shadow-luxury grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-8 space-y-4 text-left">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">
                      Official Visitor Code of Conduct
                    </h3>
                    <p className="text-xs text-forest-200 font-light leading-relaxed">
                      These laws are strictly enforced by the accompanying Rwanda Development Board (RDB) park rangers. Failure to conform leads to immediate extraction from the sanctuary with zero permit refunds. We ask for deep respect toward primate intelligence.
                    </p>
                  </div>

                  <div className="md:col-span-4 p-5 bg-forest-950 rounded-2xl border border-forest-800 space-y-3 text-left">
                    <h4 className="text-xs font-bold text-sand-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Award className="w-4.5 h-4.5 text-sand-400" />
                      <span>The 10% Revenue Share</span>
                    </h4>
                    <p className="text-[11px] text-forest-200 font-light leading-relaxed">
                      10% of your permit cost goes back to direct development infrastructure surrounding Volcanoes NP. Over $2.1M distributed into local school clinics and water grids of Rwanda.
                    </p>
                  </div>
                </div>

                {/* Rules Cards Grid inside deep green forest backdrop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {conservationRules.map((rule, idx) => (
                    <div 
                      key={idx}
                      className="bg-forest-900 p-6 rounded-3xl border border-forest-800/80 shadow-luxury space-y-3 relative overflow-hidden hover:border-sand-600/30 transition-all duration-300"
                    >
                      <div className="absolute top-3 right-3 w-10 h-10 bg-forest-950 border border-forest-800 rounded-2xl flex items-center justify-center pointer-events-none text-sand-400">
                        {getRuleIcon(rule.icon)}
                      </div>
                      <h4 className="font-serif text-lg font-bold text-white pr-8 text-left">{rule.title}</h4>
                      <p className="text-xs text-forest-200 font-light leading-relaxed text-left">{rule.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* b) Primate Recovery Timeline (clean white/cream background for extreme SVG chart legibility!) */}
            <div className="bg-white py-24 border-b border-forest-100/50">
              <div className="max-w-7xl mx-auto px-6">
                <div className="p-6 md:p-10 rounded-3xl border border-forest-150/80 bg-forest-50/10 shadow-luxury grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left text statistics */}
                  <div className="lg:col-span-5 space-y-4 text-left">
                    <span className="text-[10px] font-mono tracking-widest text-[#94743b] font-bold uppercase block">Population Evolution</span>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-forest-950 tracking-tight leading-snug">
                      The Great Primate Recovery Timeline
                    </h3>
                    <p className="text-xs text-forest-700 font-light leading-relaxed">
                      In 1989, less than 320 mountain gorillas remained on the volcanic Virunga range. Thanks to intense anti-poaching, ranger health clinics, and the active contributions of the $1,500 permit network, populations have surpassed 1,063 wild primates.
                    </p>
                    <div className="p-4 bg-sand-50/50 rounded-2xl border border-forest-100 flex items-center gap-3">
                      <div className="p-2 bg-emerald-100/80 border border-emerald-200 rounded-xl text-forest-850 shrink-0">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-forest-950 leading-tight">IUCN Registry Status</h4>
                        <p className="text-[10px] text-forest-600 font-normal mt-0.5">Elevated from "Critically Endangered" to "Endangered" in 2018.</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: pure interactive responsive SVG Chart */}
                  <div className="lg:col-span-7 bg-sand-50/50 p-6 rounded-2xl border border-forest-100/60 overflow-x-auto shadow-inner">
                    <div className="min-w-[500px] text-center font-mono text-[10px] text-forest-700">
                      <span className="text-xs font-bold font-sans text-forest-950 block mb-2 text-left pl-3 uppercase tracking-wider">
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

                      <p className="text-[10px] text-stone-550 font-light mt-3 italic text-left pl-3">
                        * Data vetted by the Greater Virunga Transboundary Collaboration (GVTC).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          /* c) Active Protection Warden Stations (Beautiful dark nature forest theme) */
          <div className="bg-forest-950 py-24 border-b border-forest-900 text-white relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Nav menu selector list */}
                <div className="lg:col-span-4 space-y-6 text-left">
                  <span className="text-[10px] font-mono tracking-widest text-[#a9ca94] font-bold uppercase bg-forest-900/80 px-3 py-1.5 rounded-full border border-forest-800 inline-block">
                    Sanctuary Bases
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                    Active Warden Stations
                  </h3>
                  <p className="text-xs text-forest-200 leading-normal font-light">
                    Select an authorized wildlife protection base unit in Rwanda to view live personnel deployment and operational stats:
                  </p>
                  
                  <div className="space-y-2.5 pt-2">
                    {[
                      { id: 'volcanoes', name: 'Volcanoes Mt. Gorilla Base', park: 'Volcanoes NP' },
                      { id: 'nyungwe', name: 'Nyungwe Rainforest Agency', park: 'Nyungwe NP' },
                      { id: 'akagera', name: 'Akagera Savannah Ranger Post', park: 'Akagera NP' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedParkStat(item.id)}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all duration-200 ${
                          selectedParkStat === item.id 
                            ? 'border-sand-500/50 bg-forest-900 text-white font-bold shadow-md' 
                            : 'border-forest-800 bg-forest-950 hover:bg-forest-900/40 text-forest-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold leading-none">{item.name}</h4>
                          <p className={`text-[10px] ${selectedParkStat === item.id ? 'text-sand-300' : 'text-forest-400'}`}>{item.park}</p>
                        </div>
                        <Shield className={`w-4 h-4 shrink-0 transition-colors ${selectedParkStat === item.id ? 'text-sand-400' : 'text-forest-500'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Selected Warden deployment dossier */}
                <div className="lg:col-span-8 bg-forest-900 p-6 md:p-8 rounded-3xl border border-forest-800 shadow-luxury space-y-6 text-left">
                  <div className="flex items-center gap-3 border-b border-forest-800/85 pb-4">
                    <div className="p-3 bg-forest-950 border border-forest-800 rounded-xl text-sand-405">
                      <Shield className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#a9ca94] font-bold">Active Warden Station Summary</span>
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-white leading-tight">
                        {stat.title}
                      </h3>
                    </div>
                  </div>

                  {/* Counter grids */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-forest-950 rounded-2xl border border-forest-800/80">
                      <span className="text-2xl font-mono font-bold text-sand-200 block">{stat.rangersCount}</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-forest-350">Active Patrolling Rangers</span>
                    </div>
                    <div className="p-4 bg-forest-950 rounded-2xl border border-forest-800/80">
                      <span className="text-2xl font-mono font-bold text-sand-200 block">{stat.sizeSqKm} km²</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-forest-350">Total Sanctuary Zone</span>
                    </div>
                    <div className="p-4 bg-forest-950 rounded-2xl border border-forest-800/80">
                      <span className="text-2xl font-mono font-bold text-sand-200 block">{stat.researchCrews} teams</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-forest-350">Scientific Research Crews</span>
                    </div>
                  </div>

                  {/* Achievements Bullet point details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#a9ca94] uppercase tracking-widest border-l-2 border-sand-600 pl-2.5">
                      Recent Milestone Achievements
                    </h4>
                    <div className="space-y-3">
                      {stat.achievements.map((ach, idx) => (
                        <div key={idx} className="flex gap-3 items-start text-xs text-forest-200 font-light leading-relaxed text-left animate-in duration-200">
                          <span className="mt-1.5 w-2 h-2 bg-sand-500 rounded-full shrink-0"></span>
                          <p>{ach}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA overlay */}
                  <div className="p-4 bg-forest-950/80 rounded-2xl border border-forest-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light">
                    <p className="text-forest-200 pr-4">Active tracking permits are capped at 96 individual entries per day for Volcanoes Base. Pre-apply today to prevent waiting.</p>
                    <button
                      onClick={() => onNavigate('booking')}
                      className="w-full sm:w-auto py-2.5 px-6 bg-sand-605 hover:bg-sand-505 text-forest-950 font-extrabold rounded-xl uppercase text-[10px] tracking-wider transition whitespace-nowrap cursor-pointer shadow-sm"
                    >
                      Verify Permits Availability
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );;
}
