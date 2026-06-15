/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Compass, Search, Tag, Eye, CloudRain, Sun, Leaf, HelpCircle, X, Check, MapPin, TreePine, ArrowRight, ChevronDown } from 'lucide-react';
import { Destination, Package } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import DestinationDetail from './DestinationDetail';

interface DestinationsProps {
  destinations: Destination[];
  onNavigate: (view: 'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin', subRoute?: string) => void;
  activeDestinationId?: string | null;
  onSelectConfigurePkg?: (pkg: Package, setup: any) => void;
}

export default function Destinations({ destinations, onNavigate, activeDestinationId, onSelectConfigurePkg }: DestinationsProps) {
  if (activeDestinationId) {
    const chosen = destinations.find(d => d.id === activeDestinationId);
    if (chosen) {
      return (
        <DestinationDetail 
          destination={chosen}
          onNavigate={onNavigate}
          onSelectConfigurePkg={onSelectConfigurePkg}
        />
      );
    }
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWildlifeFilter, setSelectedWildlifeFilter] = useState<string | null>(null);
  const [selectedHighlightFilter, setSelectedHighlightFilter] = useState<string | null>(null);
  const [activeDetailDest, setActiveDetailDest] = useState<Destination | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Extract all unique tags for filters
  const allWildlife = Array.from(
    new Set(
      destinations.flatMap(d => d.wildlife.map(w => w.split(' (')[0].split(',')[0].trim()))
    )
  );

  const allHighlights = Array.from(
    new Set(destinations.flatMap(d => d.highlights))
  );

  // Filter conditions
  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dest.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dest.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesWildlife = !selectedWildlifeFilter || 
      dest.wildlife.some(w => w.toLowerCase().includes(selectedWildlifeFilter.toLowerCase()));

    const matchesHighlight = !selectedHighlightFilter ||
      dest.highlights.includes(selectedHighlightFilter);

    return matchesSearch && matchesWildlife && matchesHighlight;
  });

  const getHeaderIcon = (id: string, className = "w-6 h-6 text-sand-200") => {
    switch (id) {
      case 'volcanoes-np':
        return <Compass className={className} />;
      case 'akagera-np':
        return <Eye className={className} />;
      case 'nyungwe-np':
        return <TreePine className={className} />;
      default:
        return <Leaf className={className} />;
    }
  };

  const getGradientTheme = (id: string) => {
    switch (id) {
      case 'volcanoes-np':
        return 'from-forest-800 to-forest-950';
      case 'akagera-np':
        return 'from-forest-900 via-forest-800 to-sand-800';
      case 'nyungwe-np':
        return 'from-forest-800 via-forest-900 to-forest-950';
      default:
        return 'from-forest-850 to-forest-900';
    }
  };

  // Weather simulation
  const getWeatherInfo = (id: string) => {
    switch (id) {
      case 'volcanoes-np':
        return {
          temp: '14°C - 20°C',
          condition: 'Lush Cloud Mist',
          icon: <CloudRain className="w-5 h-5 text-sky-400" />,
          advice: 'Waterproof shells, thermal layers & heavy trekking boots required.'
        };
      case 'akagera-np':
        return {
          temp: '22°C - 30°C',
          condition: 'Savanna Sunlight',
          icon: <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />,
          advice: 'Sunscreen, safari brim hat, sunglasses, and lightweight shirts.'
        };
      case 'nyungwe-np':
        return {
          temp: '15°C - 22°C',
          condition: 'Humid Montane Rainier',
          icon: <CloudRain className="w-5 h-5 text-teal-400" />,
          advice: 'Mudspikes, waterproof bags for electronic cameras, light windbreakers.'
        };
      default:
        return {
          temp: '18°C - 25°C',
          condition: 'Variable Canopies',
          icon: <Sun className="w-5 h-5 text-amber-400" />,
          advice: 'Breathable active hiking clothes & trekking boots.'
        };
    }
  };

  // GEARS CHECKLIST SIMULATION
  const getGearsChecklist = (id: string) => {
    switch (id) {
      case 'volcanoes-np':
        return [
          'Official Gorilla permits paperwork',
          'Heavy garden gloves (for stingy nettles)',
          'Long gaiters or thick hiking socks to slide over trousers',
          'Trekking poles (provided at base-camp)',
          'KN95 mask (mandatory near gorillas)'
        ];
      case 'akagera-np':
        return [
          'Official identification / Passport document',
          'Insect repellents containing DEET',
          'Binoculars (optional, for visual predator scans)',
          'Neutral colored garments (beige, khaki, green; avoid blue/black)'
        ];
      case 'nyungwe-np':
        return [
          'Comfortable hiking backpack',
          'Sturdy mud-grip tracking shoes',
          'Fast dry layers for rainforest humidity',
          'Reusable water bladder flask & energy energy bars'
        ];
      default:
        return [
          'Authentic ID copies',
          'Lightweight windbreakers',
          'Sun & insect shields'
        ];
    }
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-6 space-y-12">
      
      {/* 1. SECTION TITLES */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold tracking-widest text-forest-700 uppercase bg-forest-100 px-3.5 py-1.5 rounded-full border border-forest-200/50 inline-block font-mono">
          Divine Ecosystems
        </span>
        <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-forest-900 leading-none">
          Travel Experiences
        </h1>
        <p className="text-sm text-forest-650 max-w-xl mx-auto font-light leading-relaxed">
          Rwanda features extremely diverse habitats – from high-altitude mist rainforests hosting mountain gorillas, to savannas hosting lions and rhinos. Explore them dynamically.
        </p>
      </div>

      {/* 2. SEARCH & FILTER HUB CONTROLS */}
      <div className="bg-white rounded-3xl border border-forest-100 p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Search row */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-forest-650">
            <Search className="w-5 h-5" />
          </span>
          <input
            id="park-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by park name, location, highlights, wild animals..."
            className="w-full pl-12 pr-4 py-3 bg-sand-50/50 border border-forest-150 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 transition"
          />
        </div>

        {/* Categories select dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-forest-50/50">
          
          {/* Wildlife Filter Select */}
          <div className="space-y-2">
            <label htmlFor="filter-wildlife-select" className="text-[10px] font-bold text-forest-800 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Tag className="w-3.5 h-3.5 text-sand-700" />
              <span>Filter by Key Wildlife Species</span>
            </label>
            <div className="relative">
              <select
                id="filter-wildlife-select"
                value={selectedWildlifeFilter || ''}
                onChange={(e) => setSelectedWildlifeFilter(e.target.value || null)}
                className="w-full pl-4 pr-10 py-3 bg-sand-50/30 border border-forest-150 rounded-2xl text-xs font-semibold text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 transition appearance-none cursor-pointer"
              >
                <option value="">All Key Wildlife Species</option>
                {allWildlife.map((w, idx) => (
                  <option key={idx} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-forest-650">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Highlights Filter Select */}
          <div className="space-y-2">
            <label htmlFor="filter-highlight-select" className="text-[10px] font-bold text-forest-800 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Compass className="w-3.5 h-3.5 text-sand-700" />
              <span>Filter by Experience Highlight</span>
            </label>
            <div className="relative">
              <select
                id="filter-highlight-select"
                value={selectedHighlightFilter || ''}
                onChange={(e) => setSelectedHighlightFilter(e.target.value || null)}
                className="w-full pl-4 pr-10 py-3 bg-sand-50/30 border border-forest-150 rounded-2xl text-xs font-semibold text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 transition appearance-none cursor-pointer"
              >
                <option value="">All Experience Highlights</option>
                {allHighlights.map((hl, idx) => (
                  <option key={idx} value={hl}>
                    {hl}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-forest-650">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. DOCK GRID OF EXPEDITIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {filteredDestinations.length === 0 ? (
          <div className="col-span-full py-20 text-center text-xs text-forest-600 font-light bg-white border border-forest-100/50 rounded-2xl">
            No pristine sanctuaries matching those filter query combinations were discovered in the region.
          </div>
        ) : (
          filteredDestinations.map(dest => {
            const tempWeather = getWeatherInfo(dest.id);
            return (
              <div 
                id={`parks-show-card-${dest.id}`}
                key={dest.id}
                className="rounded-3xl overflow-hidden shadow-luxury shadow-luxury-hover border border-forest-100 flex flex-col justify-between text-white p-8 space-y-6 transition-all relative group bg-forest-950"
              >
                {/* Background image layer with subtle scale on hover */}
                {dest.imageUrl && (
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img 
                      src={dest.imageUrl} 
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Balanced vignette shade for excellent readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/75 to-forest-950/20"></div>
                  </div>
                )}

                <div className="space-y-6 relative z-10 text-left">
                  {/* Row */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/15">
                      {getHeaderIcon(dest.id)}
                    </div>

                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-1.5 justify-end text-xs text-sand-200 font-mono bg-white/5 py-1 px-3 rounded-full border border-white/10 w-fit ml-auto">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{dest.location.split(',')[0]}</span>
                      </div>
                      <span className="block text-[10px] text-forest-200 uppercase font-mono font-bold tracking-wider pt-0.5">
                        {dest.location.includes(',') ? dest.location.split(',')[1].trim() : ''}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-forest-100 font-light leading-relaxed">
                      {dest.description}
                    </p>
                  </div>

                  {/* Highlight Items */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-[10px] font-bold text-sand-100 uppercase tracking-widest flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Experience Highlights</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.highlights.map((h, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-lg border border-white/5 transition font-medium"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Weather Quick glance & interactive view details button */}
                <div className="pt-6 border-t border-white/10 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                      {tempWeather.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-sand-100">{tempWeather.condition} ({tempWeather.temp})</p>
                      <p className="text-[9px] text-forest-150 leading-none mt-0.5">Real-time local climate gauge</p>
                    </div>
                  </div>

                  <button
                    id={`btn-dest-explore-${dest.id}`}
                    onClick={() => onNavigate('destinations', dest.id)}
                    className="w-full sm:w-auto py-2.5 px-5 bg-white text-forest-950 hover:bg-sand-100 rounded-xl text-xs uppercase font-extrabold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <span>View Details & Safety Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 4. DETAILS EXPANSION MODAL */}
      <AnimatePresence>
        {activeDetailDest && (() => {
          const weather = getWeatherInfo(activeDetailDest.id);
          const checklist = getGearsChecklist(activeDetailDest.id);
          return (
            <motion.div
              key="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-sm"
            >
              <motion.div
                key="modal-card"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="w-full max-w-2xl bg-sand-50 rounded-3xl border border-forest-100 shadow-luxury overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Header Banner with Rich Background Image */}
                <div className="p-6 md:p-8 text-white relative flex-shrink-0 bg-forest-950 min-h-[160px] flex flex-col justify-end">
                  {activeDetailDest.imageUrl && (
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                      <img 
                        src={activeDetailDest.imageUrl} 
                        alt={activeDetailDest.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-forest-950/20"></div>
                    </div>
                  )}

                  <div className="space-y-4 pr-8 relative z-10 w-full text-left">
                    <button
                      id="close-dest-modal"
                      onClick={() => setActiveDetailDest(null)}
                      className="absolute -top-1 md:-top-3 right-0 p-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white/90 hover:text-white border border-white/5 cursor-pointer z-20"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sand-200">National Park Guide</span>
                    </div>

                    <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                      {activeDetailDest.name}
                    </h3>

                    <p className="text-xs text-forest-150 font-light leading-relaxed">
                      {activeDetailDest.description}
                    </p>
                  </div>
                </div>

                {/* Main scrollable detail contents */}
                <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                  
                  {/* Climate dynamic report card */}
                  <div className="bg-white p-4 rounded-2xl border border-forest-100/50 grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-4 flex items-center gap-3">
                      <div className="p-3 bg-forest-50 border border-forest-150 rounded-xl text-forest-700">
                        {weather.icon}
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-forest-600 tracking-wider">Climate gauge</span>
                        <p className="text-xs font-bold font-mono text-forest-900">{weather.temp}</p>
                        <p className="text-[10px] text-forest-650 leading-none font-medium text-sand-700">{weather.condition}</p>
                      </div>
                    </div>

                    <div className="sm:col-span-8 flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-forest-100/80 sm:pl-4">
                      <span className="text-[9px] font-mono uppercase text-forest-600 tracking-wider font-bold">Preparation advisory</span>
                      <p className="text-xs text-forest-800 leading-normal mt-0.5 italic">{weather.advice}</p>
                    </div>
                  </div>

                  {/* Interactive photo gallery */}
                  {activeDetailDest.gallery && activeDetailDest.gallery.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-forest-900 uppercase tracking-widest flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-sand-750 stroke-[2.5px]" />
                        <span>Interactive Wilderness Gallery</span>
                      </h4>
                      
                      {/* Active Preview */}
                      <div className="w-full h-64 overflow-hidden rounded-2xl relative border border-forest-100 shadow-sm bg-forest-950">
                        <img 
                          src={activeDetailDest.gallery[activeGalleryIndex] || activeDetailDest.imageUrl} 
                          alt={activeDetailDest.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-all duration-500"
                        />
                        <div className="absolute bottom-3 right-3 text-[9px] font-mono tracking-widest bg-forest-950/80 px-2.5 py-1 rounded text-sand-200 uppercase">
                          Image {activeGalleryIndex + 1} of {activeDetailDest.gallery.length}
                        </div>
                      </div>

                      {/* Thumbnails list */}
                      <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-forest-200">
                        {activeDetailDest.gallery.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveGalleryIndex(idx)}
                            className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                              activeGalleryIndex === idx 
                                ? 'border-sand-600 scale-95 shadow-md' 
                                : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img 
                              src={img} 
                              alt={`Thumbnail ${idx + 1}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sanctuary Description */}
                  {activeDetailDest.longDescription && (
                    <div className="space-y-2 bg-white p-4 rounded-2xl border border-forest-100/50">
                      <h4 className="text-xs font-bold text-forest-900 uppercase tracking-widest flex items-center gap-1.5">
                        <Leaf className="w-4 h-4 text-sand-750 stroke-[2.5px]" />
                        <span>About this Sanctuary</span>
                      </h4>
                      <p className="text-xs text-forest-800 leading-relaxed font-light font-sans text-left">
                        {activeDetailDest.longDescription}
                      </p>
                    </div>
                  )}

                  {/* Wildlife check */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-forest-900 uppercase tracking-widest flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-sand-700" />
                      <span>Primary Wildlife Species Profile</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDetailDest.wildlife.map((w, idx) => (
                        <span key={idx} className="text-xs bg-forest-50 hover:bg-forest-100 text-forest-850 px-3 py-1 rounded-xl border border-forest-100/80 font-medium cursor-default flex items-center gap-1.5">
                          <Leaf className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                          <span>{w}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Gears Packing Checklist checklist */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold text-forest-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-forest-100 pb-2">
                      <span className="p-1.5 bg-sand-100 border border-sand-200/50 rounded-lg text-sand-800">
                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                      </span>
                      <span>Coordinator Mandatory Packing Checklist</span>
                    </h3>

                    <ul className="space-y-2">
                      {checklist.map((item, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs text-forest-750 font-light leading-normal">
                          <span className="mt-0.5 w-4 h-4 bg-forest-50 border border-forest-150 rounded-md flex items-center justify-center shrink-0 text-forest-700">
                            <Check className="w-3 h-3 stroke-[2.5px]" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Footer buttons direct select actions */}
                <div className="p-6 border-t border-forest-100 bg-sand-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
                  <div className="text-left">
                    <span className="text-[9px] font-mono text-sand-800 font-bold uppercase tracking-wider">Secure Permits for</span>
                    <p className="text-xs font-bold text-forest-900">{activeDetailDest.name.split(' (')[0]}</p>
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      id="modal-btn-book-safari"
                      onClick={() => { setActiveDetailDest(null); onNavigate('packages'); }}
                      className="flex-1 sm:flex-initial py-2.5 px-6 bg-forest-900 text-white rounded-xl text-xs uppercase font-bold text-center cursor-pointer hover:bg-forest-850"
                    >
                      Configure Packages Tiers
                    </button>
                    <button
                      id="modal-btn-close-action"
                      onClick={() => setActiveDetailDest(null)}
                      className="py-2.5 px-4 border border-forest-200 text-forest-750 rounded-xl text-xs uppercase font-bold hover:bg-forest-50 cursor-pointer text-center"
                    >
                      Close
                    </button>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}

// git-sync-trigger