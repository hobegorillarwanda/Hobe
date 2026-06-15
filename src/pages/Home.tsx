/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Compass, Leaf, Milestone, Star, Award, Heart, HelpCircle, Check, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from '../components/Logo';
import { Destination, Package } from '../types';
import AboutSection from '../components/AboutSection';

import mountainGorillaImg from '../assets/images/mountain_gorilla.jpg';
import goldenMonkeyImg from '../assets/images/golden_monkey.jpg';
import chimpanzeeNyungweImg from '../assets/images/chimpanzee_nyungwe.jpg';
import akageraSafariImg from '../assets/images/akagera_safari.jpg';
import nyungweForestImg from '../assets/images/nyungwe_forest.jpg';
import lakeKivuSunsetImg from '../assets/images/lake_kivu_sunset.jpg';
import twinLakesRwandaImg from '../assets/images/twin_lakes_rwanda.jpg';
import luxuryLodgeImg from '../assets/images/luxury_lodge.jpg';

interface ShowcaseItem {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  destinationId?: string;
}

const SHOWCASE_WILDLIFE: ShowcaseItem[] = [
  {
    id: 'w-gorilla',
    name: 'Mountain Gorilla Group',
    location: 'Volcanoes National Park',
    description: 'The legendary gentle giant primates nesting in high-altitude bamboo mist canopies.',
    imageUrl: mountainGorillaImg,
    destinationId: 'volcanoes-np'
  },
  {
    id: 'w-monkey',
    name: 'Golden Monkey',
    location: 'Volcanoes National Park Foothills',
    description: 'High-energy, rare bamboo-dwelling monkeys covered in dense, striking sunset orange fur.',
    imageUrl: goldenMonkeyImg,
    destinationId: 'volcanoes-np'
  },
  {
    id: 'w-chimp',
    name: 'Eastern Chimpanzee',
    location: 'Nyungwe & Gishwati Montane Canopy',
    description: 'Intelligent, deeply expressive social primate communities swinging in rich tree crowns.',
    imageUrl: chimpanzeeNyungweImg,
    destinationId: 'nyungwe-np'
  },
  {
    id: 'w-elephant',
    name: 'Savanna Giants (Elephants)',
    location: 'Akagera National Park',
    description: 'Ancient, majestic family herds roaming lakeside woodlands alongside zebras and rhinos.',
    imageUrl: akageraSafariImg,
    destinationId: 'akagera-np'
  }
];

const SHOWCASE_PLACES: ShowcaseItem[] = [
  {
    id: 'p-canopy',
    name: 'Nyungwe Canopy Walkway',
    location: 'Southwestern Rainforest',
    description: 'A spectacular steel suspension bridge high above ancient dense tree crowns.',
    imageUrl: nyungweForestImg,
    destinationId: 'nyungwe-np'
  },
  {
    id: 'p-kivu',
    name: 'Lake Kivu Horizon',
    location: 'Rubavu & Karongi Coastline',
    description: 'Speckled volcanic lakeside beaches where traditional three-hulled fishing boats chant at sunset.',
    imageUrl: lakeKivuSunsetImg,
    destinationId: 'volcanoes-np'
  },
  {
    id: 'p-twin',
    name: 'Misty Twin Lakes',
    location: 'Burera & Ruhondo Hills',
    description: 'Vibrant volcanic water craters cradled softly under rolling emerald-green terraced farms.',
    imageUrl: twinLakesRwandaImg,
    destinationId: 'volcanoes-np'
  },
  {
    id: 'p-resort',
    name: 'Wilderness Eco-Lodge',
    location: 'Sabyinyo Foothills',
    description: 'Stunning luxury volcanic stone cottages designed sustainably around mist-covered peaks.',
    imageUrl: luxuryLodgeImg,
    destinationId: 'volcanoes-np'
  }
];

interface HomeProps {
  destinations: Destination[];
  packages: Package[];
  onNavigate: (view: 'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin', subRoute?: string) => void;
  onSelectPackage: (pkg: Package) => void;
}

export default function Home({ destinations, packages, onNavigate, onSelectPackage }: HomeProps) {
  // Showcase Tab State
  const [showcaseTab, setShowcaseTab] = useState<'wildlife' | 'places'>('wildlife');
  
  // Primate Safari Finder Quiz States
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizRecommendation, setQuizRecommendation] = useState<{
    dest: Destination;
    pkg: Package;
  } | null>(null);

  const quizQuestions = [
    {
      id: 'focus',
      title: 'What is your primary wildlife goal?',
      options: [
        { label: 'Mountain Gorilla encounter – The mist-covered bamboo forests', value: 'gorilla' },
        { label: 'The African "Big Five" – Lions, rhinos, elephants, leopards, buffalos', value: 'bigfive' },
        { label: 'Chimpanzee communities & canopies of the rainforest', value: 'chimp' },
      ],
    },
    {
      id: 'duration',
      title: 'How long is your ideal expedition?',
      options: [
        { label: 'Single-day express – Focused and intense tracking', value: 'express' },
        { label: '2-3 Days weekend gateway – Balancing tracking & local culture', value: 'medium' },
        { label: '7-Day complete Rwanda loop – Crossing mountains, forests & savannas', value: 'loop' },
      ],
    },
    {
      id: 'pace',
      title: 'What is your preferred travel comfort tier?',
      options: [
        { label: 'Sustainable Budget – Essential focus on adventure and direct local benefit', value: 'budget' },
        { label: 'Elegantly Mid-Range – Comfortable lodges & authentic local experiences', value: 'mid-range' },
        { label: 'Eco-Luxury – High-end private villas, gourmet meals & wellness spas', value: 'luxury' },
      ],
    },
  ];

  const handleSelectAnswer = (questionId: string, value: string) => {
    const updatedAnswers = { ...answers, [questionId]: value };
    setAnswers(updatedAnswers);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate Recommendations based on answers
      calculateQuizRecommendation(updatedAnswers);
    }
  };

  const calculateQuizRecommendation = (finalAnswers: Record<string, string>) => {
    // Default fallback values
    let recommendedDest = destinations[0] || destinations.find(d => d.id === 'volcanoes-np');
    let recommendedPkg = packages[0] || packages.find(p => p.tier === 'budget');

    const focus = finalAnswers.focus;
    const duration = finalAnswers.duration;
    const pace = finalAnswers.pace;

    // Pick Destination
    if (focus === 'bigfive') {
      recommendedDest = destinations.find(d => d.id === 'akagera-np') || recommendedDest;
    } else if (focus === 'chimp') {
      recommendedDest = destinations.find(d => d.id === 'nyungwe-np') || recommendedDest;
    } else {
      recommendedDest = destinations.find(d => d.id === 'volcanoes-np') || recommendedDest;
    }

    // Pick Package Tier
    if (pace === 'luxury' || duration === 'loop') {
      recommendedPkg = packages.find(p => p.tier === 'luxury') || recommendedPkg;
    } else if (pace === 'mid-range' || duration === 'medium') {
      recommendedPkg = packages.find(p => p.tier === 'mid-range') || recommendedPkg;
    } else {
      recommendedPkg = packages.find(p => p.id === 'pkg-budget-explorer' || p.tier === 'budget') || recommendedPkg;
    }

    setQuizRecommendation({
      dest: recommendedDest!,
      pkg: recommendedPkg!,
    });
    setQuizStep(quizQuestions.length);
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setAnswers({});
    setQuizRecommendation(null);
  };

  const handleSelectRecommendedPkg = (pkg: Package) => {
    onSelectPackage(pkg);
    onNavigate('booking');
  };

  // Dynamic typewriter texts for showcasing more places/primates of Rwanda
  const wordsToShowcase = [
    "Mountain Gorillas",
    "Akagera Savannas",
    "Nyungwe Canopy",
    "Volcanoes National Park",
    "Golden Monkeys",
    "Misty Twin Lakes",
    "Gishwati Forests"
  ];
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: any;
    const activeText = wordsToShowcase[wordIndex];

    const tick = () => {
      if (!isDeleting) {
        setCurrentText(activeText.substring(0, currentText.length + 1));
        if (currentText === activeText) {
          timer = setTimeout(() => setIsDeleting(true), 2100);
          return;
        }
      } else {
        setCurrentText(activeText.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % wordsToShowcase.length);
          return;
        }
      }

      const speed = isDeleting ? 35 : 75;
      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, isDeleting ? 40 : 110);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex]);

  return (
    <div className="space-y-0">
      
      {/* 1. HERO HEADER */}
      <header className="relative bg-emerald-100 text-forest-950 min-h-[95vh] flex items-center justify-center px-6 py-24 overflow-hidden">
        {/* Real Mountain Gorilla Background Image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src={mountainGorillaImg} 
            alt="Majestic Mountain Gorilla" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-100 object-center brightness-110 contrast-105"
          />
        </div>
        {/* Soft, thin vibrant tint that guarantees the mountain environment looks lush, verdant and bright */}
        <div className="absolute inset-0 bg-emerald-900/10 z-10"></div>
        {/* Decorative ambient blur elements */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/10 w-120 h-120 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl mx-auto text-center relative z-20 space-y-8 bg-emerald-50/90 backdrop-blur-md border border-white/80 p-8 md:p-12 rounded-[2rem] shadow-luxury">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <span className="text-xs font-bold tracking-widest text-forest-800 bg-emerald-100/70 px-4 py-1.5 rounded-full border border-forest-200/50 uppercase font-mono">
              Authorized Eco-Luxury Safari Partner
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-forest-950 leading-[1.1]"
          >
            Witness the Majesty of <br/>
            <span className="text-forest-850 font-serif italic inline-flex items-center min-h-[1.25em]">
              {currentText}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-xs md:text-sm text-forest-800 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Embark on a soul-stirring, fully customized safari through Rwanda's mist-shrouded bamboo rainforests and pristine savanna horizons. Led by certified park guides.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => onNavigate('destinations')}
              className="w-full sm:w-auto px-8 py-3.5 bg-forest-800 hover:bg-forest-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all text-center cursor-pointer"
            >
              Explore National Parks
            </button>
            <button
              onClick={() => onNavigate('packages')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-forest-50 border border-forest-200 text-forest-900 font-bold rounded-xl text-xs uppercase tracking-wider transition text-center cursor-pointer"
            >
              View Safari Tiers
            </button>
          </motion.div>

          {/* Social Proof badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-forest-200/50 text-xs font-mono text-forest-750"
          >
            <div className="space-y-1">
              <span className="block text-lg font-extrabold font-serif text-forest-900">100%</span>
              <span className="uppercase tracking-wider text-[9px]">Zero-Trace Trek</span>
            </div>
            <div className="space-y-1">
              <span className="block text-lg font-extrabold font-serif text-forest-900">$1,500</span>
              <span className="uppercase tracking-wider text-[9px]">Permits Fee</span>
            </div>
            <div className="space-y-1">
              <span className="block text-lg font-extrabold font-serif text-forest-900">1/3</span>
              <span className="uppercase tracking-wider text-[9px]">Primate Share</span>
            </div>
            <div className="space-y-1">
              <span className="block text-lg font-extrabold font-serif text-forest-900">24hr</span>
              <span className="uppercase tracking-wider text-[9px]">Fast Docket</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 2. CANOPY ABOUT SECTION */}
      <AboutSection onNavigate={onNavigate} />

      {/* EXEXCLUSIVE WILDLIFE & LANDSCAPE PORTFOLIO SHOWCASE */}
      <section className="py-24 bg-forest-950 text-white relative overflow-hidden border-b border-forest-900/40">
        {/* Ambient atmospheric highlights */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-120 h-120 bg-[#a9ca94]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-4 max-w-xl text-left border-l-2 border-sand-600/50 pl-5">
              <span className="text-[10px] font-mono tracking-widest text-[#a9ca94] font-bold uppercase bg-forest-900/85 px-3.5 py-1.5 rounded-full border border-forest-800 inline-block">
                The Rwanda Portfolio
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Scenic Wonders & <br/>
                <span className="text-sand-400 font-serif italic">Wild Sanctuary</span>
              </h2>
              <p className="text-xs text-forest-200 font-light leading-relaxed">
                Peer inside the incredible biological diversity of Rwanda. Witness ancient high-altitude primates alongside breathtaking fresh volcanic water basins and savanna wetlands.
              </p>
            </div>

            {/* Premium Tab Toggles - adjusted style for green bg */}
            <div className="flex bg-forest-905 border border-forest-800 p-1.5 rounded-2xl w-fit self-start shadow-inner">
              <button
                type="button"
                onClick={() => setShowcaseTab('wildlife')}
                className={`py-2 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  showcaseTab === 'wildlife' 
                    ? 'bg-sand-605 text-forest-950 font-extrabold shadow-sm' 
                    : 'text-forest-200 hover:text-white'
                }`}
              >
                Rare Wildlife
              </button>
              <button
                type="button"
                onClick={() => setShowcaseTab('places')}
                className={`py-2 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  showcaseTab === 'places' 
                    ? 'bg-sand-605 text-forest-950 font-extrabold shadow-sm' 
                    : 'text-forest-200 hover:text-white'
                }`}
              >
                Sacred Places
              </button>
            </div>
          </div>

          {/* Grid Layout of the Tab Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="wait">
              {(showcaseTab === 'wildlife' ? SHOWCASE_WILDLIFE : SHOWCASE_PLACES).map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="group relative bg-forest-900 border border-forest-800/80 rounded-3xl overflow-hidden shadow-luxury transition-all duration-300 flex flex-col justify-between h-[420px] hover:border-sand-600/40"
                >
                  {/* Photo Layer */}
                  <div className="h-60 overflow-hidden relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent"></div>
                    <span className="absolute bottom-3 left-4 text-[9px] font-mono tracking-wider font-bold text-sand-200 uppercase bg-forest-950/90 py-1.5 px-3 rounded shadow-sm border border-forest-800">
                      {item.location}
                    </span>
                  </div>

                  {/* Text Details Layer */}
                  <div className="p-5 flex-1 flex flex-col justify-between text-left">
                    <div className="space-y-1.5">
                      <h4 className="font-serif text-lg font-bold text-white group-hover:text-sand-300 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-forest-200 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => onNavigate('destinations', item.destinationId)}
                      className="text-[10px] font-mono tracking-widest font-bold text-sand-400 hover:text-sand-200 uppercase flex items-center gap-1.5 transition-colors self-start cursor-pointer mt-3"
                    >
                      <span>Explore Region</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC INTERACTIVE SAFARI MATCHING QUIZ */}
      <section className="py-24 bg-forest-50/50 border-y border-forest-100/50 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          <div className="space-y-4">
            <span className="text-xs font-bold tracking-widest text-forest-700 uppercase bg-forest-100 px-3.5 py-1.5 rounded-full border border-forest-200/50 inline-block font-mono">
              Expert Finder Tool
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-forest-900 leading-tight">
              Interactive Safari Matcher
            </h2>
            <p className="text-xs text-forest-650 max-w-md mx-auto font-light leading-relaxed">
              Answer 3 brief questions curated by our head park wardens to find the perfect Rwandan adventure matching your ecological and physical style.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-forest-100/65 shadow-luxury p-8 md:p-10 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sand-50 rounded-bl-full pointer-events-none"></div>

            <AnimatePresence mode="wait">
              {quizStep < quizQuestions.length ? (
                <motion.div
                  key={quizStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center text-xs font-mono text-sand-700 font-bold border-b border-forest-100 pb-3">
                    <span>STEP {quizStep + 1} OF 3</span>
                    <span>{Math.round(((quizStep) / 3) * 100)}% COMPLETE</span>
                  </div>

                  <h3 className="font-serif text-xl md:text-2xl font-bold text-forest-900">
                    {quizQuestions[quizStep].title}
                  </h3>

                  <div className="grid grid-cols-1 gap-3.5 pt-2">
                    {quizQuestions[quizStep].options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectAnswer(quizQuestions[quizStep].id, opt.value)}
                        className="w-full text-left p-4 rounded-2xl border border-forest-100 hover:border-forest-600 hover:bg-forest-50/20 text-xs font-medium text-forest-850 flex items-center justify-between cursor-pointer transition duration-200 group"
                      >
                        <span className="group-hover:text-forest-900">{opt.label}</span>
                        <span className="w-5 h-5 rounded-full border border-forest-200 bg-white group-hover:border-forest-600 flex items-center justify-center text-[10px]">
                          {i + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 text-center py-4"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl border border-forest-100 flex items-center justify-center mx-auto text-forest-750 p-2">
                    <Logo size={56} />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-sand-700">Perfect Match Formulated</span>
                    <h3 className="font-serif text-3xl font-bold text-forest-900">
                      The {quizRecommendation?.pkg.title} in {quizRecommendation?.dest.name.split(' (')[0]}
                    </h3>
                    <p className="text-xs text-forest-650 max-w-lg mx-auto font-light leading-relaxed">
                      We have custom-matched your preferences. This safari package features private guides, direct wildlife preservation, and appropriate accommodations for you.
                    </p>
                  </div>

                  {quizRecommendation && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4 text-left">
                      <div className="p-5 bg-sand-50 rounded-2xl border border-forest-100/60 space-y-2.5">
                        <div className="flex items-center gap-2 font-serif text-lg font-bold text-forest-900">
                          <MapPin className="w-4.5 h-4.5 text-sand-600" />
                          <span>{quizRecommendation.dest.name.split(' (')[0]}</span>
                        </div>
                        <p className="text-xs text-forest-650 font-light leading-normal">{quizRecommendation.dest.description}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {quizRecommendation.dest.highlights.slice(0, 3).map((h, i) => (
                            <span key={i} className="text-[9px] bg-white border border-forest-100 px-2 py-0.5 rounded text-forest-800">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-5 bg-forest-900 text-white rounded-2xl border border-forest-800 space-y-2.5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full"></div>
                        <span className="text-[9px] font-mono uppercase bg-sand-600 text-forest-950 font-bold px-2 py-0.2 rounded inline-block">
                          {quizRecommendation.pkg.tier}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-sand-100 leading-tight">
                          {quizRecommendation.pkg.title} ({quizRecommendation.pkg.duration})
                        </h4>
                        <p className="text-xs text-forest-100 font-light leading-normal">
                          {quizRecommendation.pkg.description.slice(0, 85)}...
                        </p>
                        <div className="text-base font-bold text-sand-200 pt-1 flex items-baseline gap-1 font-mono">
                          <span>${quizRecommendation.pkg.baselineCost}</span>
                          <span className="text-[9px] text-forest-200 uppercase tracking-widest font-sans font-normal">USD / Pax</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-forest-100 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      id="quiz-book-now"
                      onClick={() => quizRecommendation && handleSelectRecommendedPkg(quizRecommendation.pkg)}
                      className="w-full sm:w-auto py-3 px-8 bg-sand-600 hover:bg-sand-700 text-forest-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
                    >
                      Process Permits & Book Now
                    </button>
                    <button
                      id="quiz-reset"
                      onClick={resetQuiz}
                      className="w-full sm:w-auto py-3 px-8 border border-forest-200 text-forest-750 hover:bg-forest-50 font-semibold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      Retake Finder Quiz
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </section>

      {/* 4. VALUE PROPOSITION STATEMENTS */}
      <div className="bg-forest-900 text-white py-24 border-y border-forest-800/80 relative overflow-hidden">
        {/* Dynamic ambient vector details */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sand-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <section className="max-w-7xl mx-auto px-6 space-y-16 relative z-10">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold tracking-widest text-sand-300 uppercase bg-forest-950/80 px-3.5 py-1.5 rounded-full border border-forest-800 inline-block font-mono">
              Unrivaled Quality
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white">
              Why Expedition with Hobe Gorilla
            </h2>
            <p className="text-xs text-forest-200 max-w-md mx-auto font-light leading-relaxed">
              Highly personalized luxury hospitality designed synchronously around severe environmental conservation rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-forest-950 p-8 rounded-3xl border border-forest-800/50 shadow-luxury space-y-5 hover:border-sand-600/30 transition-all duration-300">
              <div className="w-12 h-12 bg-forest-900 border border-forest-800 rounded-2xl flex items-center justify-center text-sand-400">
                <Star className="w-6 h-6 fill-sand-400/20" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white tracking-tight">Eco-Luxury Lodging</h3>
              <p className="text-xs text-forest-200 leading-relaxed font-light">
                Rest inside five-star luxury villas in direct proximity of the National parks. Immersive jungle environments with private massage decks, fireplaces, and chef service.
              </p>
            </div>

            <div className="bg-forest-950 p-8 rounded-3xl border border-forest-800/50 shadow-luxury space-y-5 hover:border-sand-600/30 transition-all duration-300">
              <div className="w-12 h-12 bg-forest-900 border border-forest-800 rounded-2xl flex items-center justify-center text-sand-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white tracking-tight">Hassle-Free Booking</h3>
              <p className="text-xs text-forest-200 leading-relaxed font-light">
                Tracking licenses are capped daily inside Rwanda to protect gorillas. We secure your verified legal tracking permits under the official park records within 24 hours.
              </p>
            </div>

            <div className="bg-forest-950 p-8 rounded-3xl border border-forest-800/50 shadow-luxury space-y-5 hover:border-sand-600/30 transition-all duration-300">
              <div className="w-12 h-12 bg-forest-900 border border-forest-800 rounded-2xl flex items-center justify-center text-sand-400">
                <Heart className="w-6 h-6 text-[#e06666] fill-[#e06666]/10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white tracking-tight">Community Investment</h3>
              <p className="text-xs text-forest-200 leading-relaxed font-light">
                Over 10% of revenue goes back directly to local forest rangers, tracking trackers, and building schools in surrounding communities, creating a fully aligned circular economy.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 5. PARALLAX CALL-TO-ACTION */}
      <section className="bg-gradient-to-br from-emerald-50 to-sand-100/60 text-forest-950 py-20 px-6 relative overflow-hidden border-t border-forest-100/50">
        <div className="absolute inset-0 bg-transparent opacity-80 pointer-events-none"></div>
        {/* Ambient atmospheric highlights */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sand-200/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-forest-900 tracking-tight">
            Ready to Stand in the Mists of Virunga?
          </h2>
          <p className="text-sm text-forest-750 max-w-xl mx-auto leading-relaxed font-normal">
            Permits are strictly limited to protect mountain gorillas and often book out 4-6 months in advance. Secure your tracking permits now under the premium guidance of authorized conservation coordinators.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onNavigate('booking')}
              className="py-3.5 px-8 bg-forest-800 hover:bg-forest-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              Start Permits Application
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

// git-sync-trigger