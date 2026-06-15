/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  CloudRain, 
  Sun, 
  Leaf, 
  Check, 
  Clock, 
  Heart, 
  Sparkles, 
  Compass, 
  Eye, 
  ChevronRight, 
  ChevronDown,
  DollarSign, 
  Users, 
  ShieldCheck, 
  Camera, 
  Map, 
  UtensilsCrossed, 
  PlaneTakeoff,
  HelpCircle
} from 'lucide-react';
import { Destination, Package } from '../types';
import { SEED_PACKAGES } from '../data';

interface DestinationDetailProps {
  destination: Destination;
  onNavigate: (view: 'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin', subRoute?: string) => void;
  onSelectConfigurePkg?: (pkg: Package, setup: {
    passengers: number;
    addons: string[];
    tierLevel: 'standard' | 'vip' | 'elite';
    calculatedTotal: number;
  }) => void;
}

export default function DestinationDetail({ destination, onNavigate, onSelectConfigurePkg }: DestinationDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'checklist' | 'faq'>('overview');
  const [expandedFaqIndices, setExpandedFaqIndices] = useState<number[]>([]);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Customizer States
  const [tier, setTier] = useState<'standard' | 'vip' | 'elite'>('standard');
  const [passengers, setPassengers] = useState<number>(2);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([...destination.highlights.slice(0, 2)]);
  const [guideTier, setGuideTier] = useState<'ranger' | 'vip-guide' | 'scientist'>('ranger');
  const [helicopterTransfer, setHelicopterTransfer] = useState(false);
  const [luxuryVehicles, setLuxuryVehicles] = useState(true);
  const [localFeast, setLocalFeast] = useState(false);

  // Dynamic calculations
  const [basePermitCost, setBasePermitCost] = useState(1500); // Default gorilla tracking permit is $1500 in Rwanda

  useEffect(() => {
    // Set custom base permit pricing matching the park highlights
    if (destination.id === 'volcanoes-np') {
      setBasePermitCost(1500); // Volcanoes Gorilla trekking is $1,500
    } else if (destination.id === 'nyungwe-np') {
      setBasePermitCost(200);   // Nyungwe Chimpanzee trekking is $200
    } else if (destination.id === 'akagera-np') {
      setBasePermitCost(100);   // Savanna entry & boat tour is $100
    } else {
      setBasePermitCost(150);
    }
  }, [destination]);

  // Activity prices
  const getActivityCost = (activity: string): number => {
    const act = activity.toLowerCase();
    if (act.includes('gorilla')) return 1500;
    if (act.includes('monkey') || act.includes('chimpanzee') || act.includes('chimp')) return 150;
    if (act.includes('climb') || act.includes('hike') || act.includes('crater') || act.includes('trek')) return 100;
    if (act.includes('boat') || act.includes('lake') || act.includes('safari') || act.includes('drive')) return 120;
    if (act.includes('caves') || act.includes('community')) return 50;
    return 80;
  };

  // Live total computation
  const calculateTotalCost = () => {
    // Lodging cost per traveler per night
    let lodgingCost = 150; // Standard
    if (tier === 'vip') lodgingCost = 450; // VIP Eco Suite
    if (tier === 'elite') lodgingCost = 980; // Elite Wilderness Sanctuary

    // Activities sum
    const activitiesCost = selectedActivities.reduce((acc, curr) => acc + getActivityCost(curr), 0);

    // Guide cost per group
    let guideCost = 0;
    if (guideTier === 'vip-guide') guideCost = 150;
    if (guideTier === 'scientist') guideCost = 280;

    // Upgrades
    const transferCost = helicopterTransfer ? 1200 : 0;
    const vehicleCost = luxuryVehicles ? 180 * 2 : 0; // 2 days default
    const communityBanner = localFeast ? 80 : 0;

    // Total Calculation
    const totalPerPerson = lodgingCost * 2 + activitiesCost + communityBanner; // Multiplied by 2 nights
    const collectiveCosts = (totalPerPerson * passengers) + guideCost + transferCost + vehicleCost;

    return collectiveCosts;
  };

  const finalCostTotal = calculateTotalCost();

  const handleToggleActivity = (activity: string) => {
    if (selectedActivities.includes(activity)) {
      if (selectedActivities.length > 1) {
        setSelectedActivities(selectedActivities.filter(a => a !== activity));
      }
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const handleConfirmCustomization = () => {
    // Formulate a custom dynamic safari Package to load on the Booking Form
    const customConfiguredPkg: Package = {
      id: `custom-pkg-${destination.id}-${Date.now()}`,
      title: `Customized Expedition: ${destination.name.split(' (')[0]}`,
      duration: '3 Days / 2 Nights',
      tier: tier === 'standard' ? 'budget' : tier === 'vip' ? 'mid-range' : 'luxury',
      baselineCost: Math.round(finalCostTotal / passengers),
      description: `A fully personalized eco-safari into ${destination.name.split(' (')[0]}. Tailored with: Preferred Lodging, customized activity checklist, and private guide options.`,
      inclusions: [
        `${tier.toUpperCase()} Wilderness Accommodation`,
        `${passengers} Dedicated Travelers`,
        ...selectedActivities.map(act => `${act} Permit`),
        guideTier === 'ranger' ? 'Standard Park Ranger Guide' : guideTier === 'vip-guide' ? 'Expert Wildlife Photographer Guide' : 'Scientific Field Biologist Guide',
        helicopterTransfer ? 'Private Helicopter Transfer Included' : 'Standard Land transfer',
        luxuryVehicles ? 'Luxury Land-Cruiser Transport' : 'Compact AWD transport'
      ],
      imageUrl: destination.imageUrl
    };

    if (onSelectConfigurePkg) {
      onSelectConfigurePkg(customConfiguredPkg, {
        passengers,
        addons: [
          ...selectedActivities,
          `Accommodation Tiers: ${tier}`,
          `Guide Priority: ${guideTier}`,
          helicopterTransfer ? 'Helicopter Transfer Service' : '',
          localFeast ? 'Local Community Banner & Culinary Feast' : ''
        ].filter(Boolean),
        tierLevel: tier,
        calculatedTotal: finalCostTotal
      });
    }

    onNavigate('booking');
  };

  // Weather profiling details
  const parkClimate = (() => {
    switch (destination.id) {
      case 'volcanoes-np':
        return {
          avgTemp: '12°C - 19°C',
          humidity: '85%',
          rainfall: 'High Montane Aerosols',
          bestSeason: 'June to September (Dry season)',
          statusText: 'Humid, cool misty winds.'
        };
      case 'akagera-np':
        return {
          avgTemp: '21°C - 29°C',
          humidity: '55%',
          rainfall: 'Seasonal Savanna Dryness',
          bestSeason: 'Year-round; ideal birding Nov-April',
          statusText: 'Lush savanna, hot sun.'
        };
      case 'nyungwe-np':
        return {
          avgTemp: '14°C - 21°C',
          humidity: '95%',
          rainfall: 'Perennial Rainforest Cloudbursts',
          bestSeason: 'January - March, June - August',
          statusText: 'High canopy humidity, frequent showers.'
        };
      default:
        return {
          avgTemp: '16°C - 24°C',
          humidity: '75%',
          rainfall: 'Moderate showers',
          bestSeason: 'Dry season sweetspots',
          statusText: 'Temperate forest ecosystem.'
        };
    }
  })();

  // Hourly Trek Diary
  const trekDiary = (() => {
    switch (destination.id) {
      case 'volcanoes-np':
        return [
          { time: '05:30 AM', event: 'Breakfast & Briefing', desc: 'Pre-trek briefing and hot tea with local rangers at Kinigi headquarters. Allocation of gorilla tracking family groups.' },
          { time: '07:30 AM', event: 'Trailhead Departure', desc: 'Arrive at the park boundary stone wall. Porters hired, walking sticks gathered, and climb begins.' },
          { time: '09:00 AM - 12:00 PM', event: 'Bamboo Jungle Ascent', desc: 'Trekking deep inside pristine volcanic mist. Tracking wild nests left by gorillas last night.' },
          { time: '12:30 PM', event: 'The Golden Hour Encounter', desc: 'One full hour sitting silent, feet away from the Silverback and play family. Unforgettable cameras rolling.' },
          { time: '03:00 PM', event: 'Basecamp Descent', desc: 'Return safely to trail base. Received Gorilla Tracking Certificates signed by park wardens.' }
        ];
      case 'akagera-np':
        return [
          { time: '06:00 AM', event: 'Sunrise Savanna Drive', desc: 'Dawn drive through northern plains to catch active leopards, lions, and spotting hyenas feeding.' },
          { time: '09:30 AM', event: 'Hippos & Crocodiles Watch', desc: 'Off-road exploration of the lakeside thickets watching giraffes feeding on high acacias.' },
          { time: '01:30 PM', event: 'Lake Ihema Boat Safari', desc: 'Board the exclusive boat cruiser to watch giant herds of bathing elephants, nesting fish eagles, and crocodiles.' },
          { time: '04:30 PM', event: 'Conservation Behind-the-Scenes', desc: 'Visit to Akagera HQ to learn about advanced anti-poaching canines, smart monitoring Collars, and rhinos reintroduction.' }
        ];
      default:
        return [
          { time: '05:00 AM', event: 'Canopy Suspensions Dawn', desc: 'Catching sunrise above the mist canopy suspension walkway dangling 70 meters high.' },
          { time: '08:30 AM', event: 'Chimp Nesting Sites', desc: 'Hiking through the ancient mahogany trees, guided by specialized primate auditory trackers.' },
          { time: '12:00 PM', event: 'Waterfall Picnic Lunch', desc: 'Resting by the booming Isumo waterfall with fresh organic lunch boxes prepared by lodging chefs.' },
          { time: '03:00 PM', event: 'Tea Harvesting Tour', desc: 'Visit to Gisakura Tea-Pluckers Cooperative. Hand-picking local tea leaves and tasting award-winning Rwandan tea.' }
        ];
    }
  })();

  return (
    <div className="py-12 bg-sand-50/30">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* Back Link Header Bar */}
        <div className="flex items-center justify-between border-b border-forest-100 pb-5">
          <button
            onClick={() => onNavigate('destinations')}
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-forest-700 hover:text-forest-950 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-forest-600" />
            <span>Back to All Sanctuaries</span>
          </button>

          <span className="text-xs text-forest-500 font-mono flex items-center gap-1.5 bg-emerald-50 border border-forest-100/50 px-3.5 py-1.5 rounded-full">
            <Leaf className="w-3.5 h-3.5 text-forest-700 font-bold" />
            <span>Eco-Preservation Verified Option</span>
          </span>
        </div>

        {/* Top Feature Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Large imagery showcase */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="relative h-[340px] md:h-[450px] w-full overflow-hidden rounded-[2.5rem] border border-forest-100 bg-forest-950 shadow-md">
              <img 
                src={destination.gallery[activeGalleryIndex] || destination.imageUrl} 
                alt={destination.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent p-6 md:p-8 text-left text-white">
                <span className="text-[10px] font-mono uppercase bg-sand-600 text-forest-950 font-bold px-3 py-1 rounded tracking-wider">
                  {destination.location}
                </span>
                <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mt-3 leading-tight">
                  {destination.name}
                </h1>
              </div>
            </div>

            {/* Gallery Thumbnails List */}
            {destination.gallery && destination.gallery.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {destination.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveGalleryIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 cursor-pointer ${
                      activeGalleryIndex === idx 
                        ? 'border-sand-600 scale-95 shadow-lg' 
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Sanctuary Angle ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core At-a-glance Climate & Stats Panel */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[2.5rem] border border-forest-100 shadow-luxury flex flex-col justify-between text-left space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase bg-emerald-50 border border-forest-100 text-forest-800 font-bold px-3 py-1 rounded inline-block">
                Ecosystem Almanac
              </span>
              <h2 className="font-serif text-2xl font-bold text-forest-900 tracking-tight leading-none">
                Active Environment Status
              </h2>
              <p className="text-xs text-forest-600 font-light leading-relaxed">
                Our base guides monitor meteorological forest parameters hourly to guarantee safe primate routes. Please check the ecosystem climate dashboard before custom configurations:
              </p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-forest-50/70 border border-forest-100/60 rounded-2xl relative">
                <CloudRain className="w-5 h-5 text-forest-700 mb-2" />
                <span className="block text-[9px] font-mono text-forest-500 uppercase">Avg Temperature</span>
                <span className="text-sm font-extrabold font-mono text-forest-900 mt-0.5">{parkClimate.avgTemp}</span>
              </div>

              <div className="p-4 bg-forest-50/70 border border-forest-100/60 rounded-2xl">
                <Sun className="w-5 h-5 text-amber-600 mb-2" />
                <span className="block text-[9px] font-mono text-forest-500 uppercase">Optimal Season</span>
                <span className="text-xs font-bold text-forest-900 leading-snug mt-1 inline-block">{parkClimate.bestSeason}</span>
              </div>

              <div className="p-4 bg-forest-50/70 border border-forest-100/60 rounded-2xl">
                <Compass className="w-5 h-5 text-teal-700 mb-2" />
                <span className="block text-[9px] font-mono text-forest-500 uppercase">Atmosphere</span>
                <span className="text-xs font-bold text-forest-900 leading-none mt-1 inline-block">{parkClimate.statusText}</span>
              </div>

              <div className="p-4 bg-forest-50/70 border border-forest-100/60 rounded-2xl">
                <Users className="w-5 h-5 text-sand-700 mb-2" />
                <span className="block text-[9px] font-mono text-forest-500 uppercase">Canopy Moisture</span>
                <span className="text-sm font-extrabold font-mono text-forest-900 mt-0.5">{parkClimate.humidity}</span>
              </div>
            </div>

            {/* General context statement */}
            <div className="pt-4 border-t border-forest-100/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-forest-800 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wide">Authorized Safety Code</h4>
                <p className="text-[10px] text-forest-650 leading-normal">
                  All treks require double validation profiles and matching certifications. Local permit allocations are managed securely under official Rwanda governance.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-forest-100 gap-6 w-full text-left overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-xs uppercase tracking-wider font-bold transition-all relative cursor-pointer shrink-0 ${
              activeTab === 'overview' ? 'text-forest-900 scale-102 border-b-2 border-forest-800' : 'text-forest-500 hover:text-forest-800'
            }`}
          >
            Sanctuary Profile & Flora
          </button>
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`pb-4 text-xs uppercase tracking-wider font-bold transition-all relative cursor-pointer shrink-0 ${
              activeTab === 'itinerary' ? 'text-forest-900 scale-102 border-b-2 border-forest-800' : 'text-forest-500 hover:text-forest-800'
            }`}
          >
            Trek Ranger Diary
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-4 text-xs uppercase tracking-wider font-bold transition-all relative cursor-pointer shrink-0 ${
              activeTab === 'checklist' ? 'text-forest-900 scale-102 border-b-2 border-forest-800' : 'text-forest-500 hover:text-forest-800'
            }`}
          >
            Mandatory Gear List
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-4 text-xs uppercase tracking-wider font-bold transition-all relative cursor-pointer shrink-0 ${
              activeTab === 'faq' ? 'text-forest-900 scale-102 border-b-2 border-forest-800' : 'text-forest-500 hover:text-forest-800'
            }`}
          >
            Wildlife & Park FAQs
          </button>
        </div>

        {/* Dynamic Multi-column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Vast Details based on Active Tab */}
          <div className="lg:col-span-7 space-y-6">
            
            {activeTab === 'overview' && (
              <div className="space-y-6 text-left">
                {/* Long description essay */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-forest-100 shadow-sm space-y-4">
                  <h3 className="font-serif text-xl font-bold text-forest-900 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-forest-750" />
                    <span>Biological Canopy Narrative & Core History</span>
                  </h3>
                  <p className="text-xs text-forest-750 leading-relaxed font-light">
                    {destination.longDescription}
                  </p>
                  <p className="text-xs text-forest-750 leading-relaxed font-light pt-2">
                    The reserve has historically been the epicenter of evolutionary biological field studies in central Africa, protecting unique biological zones and creating dynamic, circular-economy local ecosystems that prevent poaching. Through the coordination of authorized rangers, travelers are guided alongside native trackers, guaranteeing safe, high-integrity wildlife monitoring with absolutely zero impact on native habits.
                  </p>
                </div>

                {/* Primate Profiles */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-forest-100 shadow-sm space-y-4">
                  <h3 className="font-serif text-xl font-bold text-forest-900 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    <span>Ecosystem Primate & Large Animal Profiles</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {destination.wildlife.map((w, idx) => (
                      <div key={idx} className="p-4 bg-forest-50/50 border border-forest-100/50 rounded-xl flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-forest-800 text-white flex items-center justify-center text-[11px] font-mono font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-forest-950 leading-tight">{w}</p>
                          <p className="text-[10px] text-forest-500 font-mono">Protected native species</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-forest-100 shadow-sm space-y-8 text-left">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-forest-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-forest-700" />
                    <span>Trekking Hour-by-Hour Diary</span>
                  </h3>
                  <p className="text-xs text-forest-650 font-light">
                    This timeline outlines what travelers can expect from morning check-in to return. Times are estimate profiles depending on actual gorilla troop moves:
                  </p>
                </div>

                <div className="relative border-l-2 border-forest-100 pl-6 space-y-8 ml-3">
                  {trekDiary.map((item, idx) => (
                    <div key={idx} className="relative space-y-1">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 bg-forest-800 text-white border-2 border-white rounded-full flex items-center justify-center text-[8px] font-mono leading-none">
                        {idx + 1}
                      </span>
                      <span className="text-[10px] font-mono text-sand-800 font-extrabold bg-sand-100/70 border border-sand-200/50 px-2 py-0.5 rounded">
                        {item.time}
                      </span>
                      <h4 className="font-serif text-base font-bold text-forest-900 pt-1">{item.event}</h4>
                      <p className="text-xs text-forest-650 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'checklist' && (
              <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-forest-100 shadow-sm space-y-6 text-left">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-forest-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-forest-750" />
                    <span>Mandatory Packing Advisory Sheet</span>
                  </h3>
                  <p className="text-xs text-forest-650 font-light">
                    The environment features dense volcanic undergrowth with stinging nettles and wet conditions. The following gear items are strictly required:
                  </p>
                </div>

                <div className="space-y-4.5 pt-2">
                  <div className="p-4 bg-amber-50/70 border border-amber-200/50 rounded-xl flex items-start gap-3">
                    <Camera className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-amber-900">Gorilla Photography Safety Protocol</p>
                      <p className="text-[10px] text-amber-800 leading-normal">
                        Absolutely no camera flash is permitted. Keep cameras at an estimated 10 meters distance from gorillas, chimps, and monkeys.
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3.5 pl-1">
                    {/* Hardcoded checklist detail blocks depending on destination */}
                    {destination.highlights.map((h, i) => (
                      <li key={i} className="flex gap-3 items-start text-xs text-forest-750 font-sans leading-normal">
                        <span className="w-5 h-5 bg-forest-50 border border-forest-200 rounded-lg flex items-center justify-center shrink-0 text-forest-800 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        </span>
                        <div>
                          <p className="font-bold text-forest-900">Trek gear for {h}</p>
                          <p className="text-[10px] text-forest-600">Ensure heavy trail boots and active wear layers are packed.</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (() => {
              // FAQ database mapping corresponding to our active destination ID
              const originalFaqs = (() => {
                switch (destination.id) {
                  case 'volcanoes-np':
                    return [
                      {
                        q: 'What is the physical difficulty level for Mountain Gorilla Tracking?',
                        a: 'Gorilla tracking is moderate to demanding. Paths climb through steep volcanic ridges, tangled bamboo, and altitudes ranging from 2,500m to over 3,000m. Treks can last anywhere from 1 to 6 hours depending on daily movements.'
                      },
                      {
                        q: 'What is the minimum age required, and are kids allowed in Volcanoes?',
                        a: 'Due to safety procedures and strict primate health guides, the minimum age limits are set at 15 years old. Children are more prone to common childhood transmittable infections which could devastate gorilla families.'
                      },
                      {
                        q: 'Is there a limit to how close we can stand near the gorillas?',
                        a: 'Yes, rangers enforce a strict 7-meter (22 feet) safety buffer. If a gorilla comes closer, remain stationary, do not make direct eye-contact, and let the ranger direct you.'
                      },
                      {
                        q: 'What are Golden Monkeys, and can we track them also?',
                        a: 'Golden Monkeys are colorful, swift, and rare primates endemic to the Virunga canopy. Golden monkey tracking is separate and takes place in the bamboo slopes. It is a lower altitude, shorter, and highly energetic trek.'
                      },
                      {
                        q: 'Is hiring a local trek porter recommended?',
                        a: 'Highly recommended! Hiring a native porter ($15-$20) carries your equipment and offers a helpful hand up slippery slopes. Most porters are former poachers; your wage gives them an honorable livelihood.'
                      },
                      {
                        q: 'What should I do if a Mountain Gorilla charges at our group?',
                        a: 'Never run. Running stimulates their chase reflex. Crouch down, look at the ground to signal submissiveness, and listen to the comforting vocal grunts of your armed park ranger.'
                      }
                    ];
                  case 'akagera-np':
                    return [
                      {
                        q: 'Are all of the "Big Five" animals present and active in Akagera?',
                        a: 'Yes! Thanks to intensive repatriation projects, Akagera hosts Lions, Rhinos, Elephants, Leopards, and Buffalos. While rhinos and leopards are nocturnal and difficult to spot, elephants and buffalos are viewed daily, and lion prides are fully tracked by radio collaring.'
                      },
                      {
                        q: 'Are the Lake Ihema Boat Safaris safe for children?',
                        a: 'Cruises are highly secure and conducted on sturdy, double-decked, ranger-steered motorized boats. Swimming in Lake Ihema is strictly banned due to abundant crocodile and hippopotamus populations.'
                      },
                      {
                        q: 'Is off-road game driving permitted inside Akagera?',
                        a: 'Off-road exploration is strictly forbidden to preserve fragile savanna flora, nests of ground birds, and avoid surprising protective buffalo herds. Drivers must stay on designated paths.'
                      },
                      {
                        q: 'When is the best season for migratory bird tracking?',
                        a: 'Akagera boasts 480+ bird species. Migratory birds fly down from November through April, coinciding with the lush green season. The dry peak (June-Sept) is better for large savanna predators.'
                      },
                      {
                        q: 'Are there anti-poaching forces protecting Akagera?',
                        a: 'Yes, Akagera is guarded on land and air. A specialized canine tracking team and solar electrified boundaries are active 24/7, reducing poaching incident rates to near-zero.'
                      }
                    ];
                  case 'nyungwe-np':
                    return [
                      {
                        q: 'How physical is Chimpanzee tracking compared to Gorillas?',
                        a: 'Chimpanzee tracking relies on keen listening as chimps are agile, travel in high forest nests, and cover steep territory quickly. While less vertical than Volcanoes tracking, it involves swift hiking on wet mahogany soil.'
                      },
                      {
                        q: 'How high is the Canopy Walkway bridge and is it safe?',
                        a: 'The metal walkway suspends 70 meters (230 feet) high over pristine river beds. It is certified by rigorous structural parameters and is very safe, though children under 6 are restricted.'
                      },
                      {
                        q: 'Does it rain constantly during Nyungwe treks?',
                        a: 'Nyungwe receives over 2,000mm of rain annually. Showers must be anticipated daily. We require sturdy rain shells, wet proof pouches for camera lenses, and secure gripping hiking boots.'
                      },
                      {
                        q: 'What other monkeys are common to spot?',
                        a: 'Nyungwe protects 13 primate species! Popular species include L’Hoest’s monkeys (often seen on roadsides), blue monkeys, and giant troupes of up to 400 acrobatic black-and-white colobus monkeys.'
                      },
                      {
                        q: 'Is Gisakura Tea harvesting visit included in Nyungwe outings?',
                        a: 'We can easily customize tea farm harvesting tours! You can pick tea leaves alongside specialists, followed by a fire-roasted tea infusion tasting.'
                      }
                    ];
                  default:
                    return [
                      {
                        q: 'What is the conservation history of Gishwati-Mukura?',
                        a: 'Gishwati-Mukura is Rwanda’s newest reserve and a marvel of landscape restoration. Deforested by historical crop farming, planting native tree corridors has successfully reconnected isolated chimpanzees, golden monkeys, and local cats.'
                      },
                      {
                        q: 'Are solo walks allowed, or is an armed ranger required?',
                        a: 'Solo walking is illegal in all Rwanda national reserves. For protection, biology education, and route navigation, armed park wardens accompany all guest groups.'
                      },
                      {
                        q: 'Do local communities benefit from Gishwati tourism?',
                        a: 'Incredibly so! Local dancers, organic honey bee cooperatives, and handcraft makers are fully integrated into itineraries, and permit funds directly sustain village development projects.'
                      }
                    ];
                }
              })();

              // Filter based on search query
              const filteredFaqs = originalFaqs.filter(
                f => f.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) || 
                     f.a.toLowerCase().includes(faqSearchQuery.toLowerCase())
              );

              const toggleFaq = (idx: number) => {
                if (expandedFaqIndices.includes(idx)) {
                  setExpandedFaqIndices(expandedFaqIndices.filter(i => i !== idx));
                } else {
                  setExpandedFaqIndices([...expandedFaqIndices, idx]);
                }
              };

              return (
                <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-forest-100 shadow-sm space-y-6 text-left">
                  {/* Title & Introduction */}
                  <div className="space-y-2 border-b border-forest-50 pb-4">
                    <h3 className="font-serif text-xl font-bold text-forest-900 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-forest-750" />
                      <span>Ecosystem FAQ & Common Questions</span>
                    </h3>
                    <p className="text-xs text-forest-650 font-light">
                      Official rules, safe wildlife interactions, weather preparations, and community questions regarding {destination.name.split(' (')[0]}.
                    </p>
                  </div>

                  {/* Interactive Search Bar */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-forest-400">
                      <HelpCircle className="w-4 h-4" />
                    </span>
                    <input
                      id="faq-search-input"
                      type="text"
                      className="w-full pl-9 pr-4 py-2.5 bg-forest-50/50 border border-forest-150 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest-600 transition"
                      placeholder="Search common questions about animals or itinerary guidelines..."
                      value={faqSearchQuery}
                      onChange={(e) => setFaqSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Frequently Asked Questions list Accordion */}
                  <div className="space-y-3.5 pt-2">
                    {filteredFaqs.length === 0 ? (
                      <p className="text-xs text-forest-500 italic text-center py-6">
                        No official answers matched that precise question query. Try searching for broader terms like "permit", "weather", or "chimpanzee".
                      </p>
                    ) : (
                      filteredFaqs.map((faq, idx) => {
                        const isExpanded = expandedFaqIndices.includes(idx);
                        return (
                          <div 
                            key={idx}
                            className={`rounded-2xl border transition-all duration-300 ${
                              isExpanded 
                                ? 'border-forest-200 bg-forest-50/20 shadow-xs' 
                                : 'border-forest-100 bg-white hover:border-forest-150'
                            }`}
                          >
                            {/* Accordion trigger header */}
                            <button
                              type="button"
                              onClick={() => toggleFaq(idx)}
                              className="w-full p-4 flex items-center justify-between text-left cursor-pointer select-none"
                            >
                              <span className="text-xs font-semibold text-forest-900 pr-4 flex items-start gap-1.5 leading-snug">
                                <span className="font-mono text-[10px] text-forest-500 bg-forest-50 border border-forest-100 rounded px-1.5 py-0.5 mt-0.5 shrink-0 select-none">Q</span>
                                <span>{faq.q}</span>
                              </span>
                              <ChevronDown 
                                className={`w-4 h-4 text-forest-600 shrink-0 transition-transform duration-300 ${
                                  isExpanded ? 'transform rotate-180 text-forest-900' : ''
                                }`} 
                              />
                            </button>

                            {/* Accordion collapsable reply */}
                            {isExpanded && (
                              <div className="px-4 pb-4.5 pt-0 border-t border-forest-50/80 animate-in fade-in duration-200">
                                <p className="text-xs text-forest-750 font-light leading-relaxed pl-7 pt-3 flex items-start gap-1.5">
                                  <span className="font-mono font-bold text-forest-800 shrink-0">Answer:</span>
                                  <span>{faq.a}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Safety & Local Community Seal */}
                  <div className="p-4 bg-[#e8f3ee] rounded-2xl border border-emerald-150 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-forest-800 shrink-0" />
                    <div>
                      <h4 className="text-[11px] font-bold text-forest-950 uppercase tracking-wider">Hobe Safety Pledge</h4>
                      <p className="text-[10px] text-forest-700 leading-normal font-light">
                        Our native guides maintain direct radio feeds with RDB tracking stations. Your safety and full alignment with Rwanda protection systems are fully verified.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>

          {/* Right Side: Interactive Safari Variety Customizer Panel */}
          <div className="lg:col-span-5 bg-forest-950 text-white rounded-[2rem] border border-forest-900 p-6 md:p-8 space-y-6 sticky top-6 shadow-luxury text-left">
            <div className="space-y-1 pb-4 border-b border-forest-900">
              <span className="text-[8px] font-mono tracking-widest text-[#a9ca94] font-extrabold uppercase">
                COORDINATOR COST CALCULATOR
              </span>
              <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                Safari Builder Panel
              </h3>
              <p className="text-[11px] text-forest-200 leading-relaxed font-light">
                Configure your tailored permit, guide upgrade, and lodging options. Updates are computed dynamically.
              </p>
            </div>

            {/* Customizer Option 1: Accommodation Tiers */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-[#a9ca94] tracking-widest uppercase font-bold flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>1. Luxury Lodging Selection</span>
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTier('standard')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    tier === 'standard' 
                      ? 'bg-forest-900 border-sand-500 text-white' 
                      : 'bg-forest-900/40 border-forest-900 text-forest-200 hover:border-forest-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase leading-none">Standard Eco-Banda</span>
                    <span className="text-xs font-mono font-bold text-sand-200">+$150 / Night</span>
                  </div>
                  <p className="text-[10px] text-forest-200 mt-1 leading-snug">Sustainable local bungalows near the base headquarters.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('vip')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    tier === 'vip' 
                      ? 'bg-forest-900 border-sand-500 text-white' 
                      : 'bg-forest-900/40 border-forest-900 text-forest-200 hover:border-forest-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase leading-none">Luxury Safari Canopy Suite</span>
                    <span className="text-xs font-mono font-bold text-sand-200">+$450 / Night</span>
                  </div>
                  <p className="text-[10px] text-forest-200 mt-1 leading-snug">Exclusive eco-accommodation featuring forest valley views & spa access.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('elite')}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    tier === 'elite' 
                      ? 'bg-forest-900 border-sand-500 text-white' 
                      : 'bg-forest-900/40 border-forest-900 text-forest-200 hover:border-forest-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase leading-none">Elite Wilderness Sanctuary Villa</span>
                    <span className="text-xs font-mono font-bold text-sand-200">+$980 / Night</span>
                  </div>
                  <p className="text-[10px] text-forest-200 mt-1 leading-snug">Private volcanic stone villa with a wellness tub, fireplace, and private chef.</p>
                </button>
              </div>
            </div>

            {/* Customizer Option 2: Active Highlights permits */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-[#a9ca94] tracking-widest uppercase font-bold flex items-center gap-1.5">
                <Map className="w-3.5 h-3.5" />
                <span>2. Core Highlights Permits</span>
              </label>
              <div className="space-y-2">
                {destination.highlights.map((h, i) => {
                  const cost = getActivityCost(h);
                  const isSelected = selectedActivities.includes(h);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleToggleActivity(h)}
                      className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs font-bold ${
                        isSelected 
                          ? 'bg-forest-900/80 border-sand-600 text-white' 
                          : 'bg-forest-950/40 border-forest-900 text-forest-300 hover:border-forest-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-sand-500 border-sand-600 text-forest-950' : 'border-forest-700 bg-transparent'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                        </span>
                        <span>{h}</span>
                      </div>
                      <span className="font-mono text-sand-400 font-bold">${cost} Permit Included</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customizer Option 3: Travelers Count */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-[#a9ca94] tracking-widest uppercase font-bold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>3. Number of Eco-Travelers</span>
              </label>
              <div className="flex items-center gap-4 bg-forest-900/60 p-1 rounded-2xl border border-forest-900 w-fit">
                <button
                  type="button"
                  onClick={() => setPassengers(p => Math.max(1, p - 1))}
                  className="w-10 h-10 rounded-xl bg-forest-950/60 flex items-center justify-center font-bold font-mono hover:bg-forest-800 transition cursor-pointer"
                >
                  -
                </button>
                <span className="font-mono font-bold text-sm w-8 text-center">{passengers}</span>
                <button
                  type="button"
                  onClick={() => setPassengers(p => Math.min(10, p + 1))}
                  className="w-10 h-10 rounded-xl bg-forest-950/60 flex items-center justify-center font-bold font-mono hover:bg-forest-800 transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Customizer Option 4: Guide Tier */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-[#a9ca94] tracking-widest uppercase font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>4. Ranger / Expert Guide Priority</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setGuideTier('ranger')}
                  className={`p-2.5 rounded-xl border text-center text-[10px] font-bold uppercase transition ${
                    guideTier === 'ranger' ? 'bg-forest-900 border-sand-500 text-white' : 'bg-forest-900/40 border-forest-900 hover:border-forest-800'
                  }`}
                >
                  Standard Ranger
                  <span className="block text-[8px] text-forest-300 transform scale-90 mt-0.5">$0/Day</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGuideTier('vip-guide')}
                  className={`p-2.5 rounded-xl border text-center text-[10px] font-bold uppercase transition ${
                    guideTier === 'vip-guide' ? 'bg-forest-900 border-sand-500 text-white' : 'bg-forest-900/40 border-forest-900 hover:border-forest-800'
                  }`}
                >
                  VIP Tracker
                  <span className="block text-[8px] text-[#a9ca94] transform scale-90 mt-0.5">+$150/Day</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGuideTier('scientist')}
                  className={`p-2.5 rounded-xl border text-center text-[10px] font-bold uppercase transition ${
                    guideTier === 'scientist' ? 'bg-forest-900 border-sand-500 text-white' : 'bg-forest-900/40 border-forest-900 hover:border-forest-800'
                  }`}
                >
                  Biologist
                  <span className="block text-[8px] text-[#a9ca94] transform scale-90 mt-0.5">+$280/Day</span>
                </button>
              </div>
            </div>

            {/* Customizer Option 5: Executive Add-on toggles */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-[#a9ca94] tracking-widest uppercase font-bold flex items-center gap-1.5">
                <PlaneTakeoff className="w-3.5 h-3.5" />
                <span>5. Premium VIP Add-ons</span>
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setHelicopterTransfer(!helicopterTransfer)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between text-[11px] font-bold ${
                    helicopterTransfer ? 'bg-forest-900/80 border-sand-600' : 'bg-forest-950/40 border-forest-900 hover:border-forest-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      helicopterTransfer ? 'bg-sand-500 border-sand-600 text-forest-950' : 'border-forest-700'
                    }`}>
                      {helicopterTransfer && <Check className="w-3 h-3 stroke-[3px]" />}
                    </span>
                    <span>Helicopter Transfer from Kigali</span>
                  </div>
                  <span className="font-mono text-sand-300">+$1,200</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLocalFeast(!localFeast)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between text-[11px] font-bold ${
                    localFeast ? 'bg-forest-900/80 border-sand-600' : 'bg-forest-950/40 border-forest-900 hover:border-forest-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      localFeast ? 'bg-sand-500 border-sand-600 text-forest-950' : 'border-forest-700'
                    }`}>
                      {localFeast && <Check className="w-3 h-3 stroke-[3px]" />}
                    </span>
                    <span>Cultural Village Gourmet Banquet</span>
                  </div>
                  <span className="font-mono text-sand-300">+$80</span>
                </button>
              </div>
            </div>

            {/* Simulated Live Cost Summary */}
            <div className="p-4 bg-forest-900 rounded-2xl border border-forest-850 text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-forest-300 font-sans font-medium">Estimated Configuration Base:</span>
                <span className="font-mono text-forest-200">2 Nights stay • Group booking</span>
              </div>
              <div className="flex justify-between items-end border-t border-forest-850 pt-2.5 mt-1.5">
                <div>
                  <span className="text-[9px] font-mono uppercase bg-[#a9ca94] text-forest-950 font-bold px-2 py-0.5 rounded">
                    Total Estimated Group Cost
                  </span>
                  <p className="text-[10px] text-forest-300 mt-1 font-sans leading-none font-light">Includes all selected activity permits</p>
                </div>
                <div className="text-right font-mono text-2xl font-extrabold text-[#dfcfab] flex items-baseline gap-1">
                  <span>${finalCostTotal.toLocaleString()}</span>
                  <span className="text-xs text-forest-300 font-sans font-normal uppercase">USD</span>
                </div>
              </div>
            </div>

            {/* Confirm action button */}
            <button
              onClick={handleConfirmCustomization}
              className="w-full py-4 bg-sand-600 hover:bg-sand-700 text-forest-950 font-extrabold rounded-xl text-xs uppercase tracking-wider text-center transition cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 shrink-0 fill-forest-950/20" />
              <span>Validate & Apply Dynamic Itinerary</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

// git-sync-trigger