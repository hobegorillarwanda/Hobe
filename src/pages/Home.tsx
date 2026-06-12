/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Compass, Leaf, Milestone, Star, Award, Heart, HelpCircle, Check, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Destination, Package } from '../types';
import AboutSection from '../components/AboutSection';

interface HomeProps {
  destinations: Destination[];
  packages: Package[];
  onNavigate: (view: 'home' | 'destinations' | 'packages' | 'booking' | 'bookings-hub' | 'conservation' | 'admin') => void;
  onSelectPackage: (pkg: Package) => void;
}

export default function Home({ destinations, packages, onNavigate, onSelectPackage }: HomeProps) {
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
      <header className="relative bg-forest-900 text-white min-h-[90vh] flex items-center justify-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-900/80 to-transparent z-10"></div>
        {/* Decorative ambient blur elements */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-forest-750/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/10 w-120 h-120 bg-sand-700/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-20 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <span className="w-1.5 h-1.5 bg-sand-600 rounded-full"></span>
            <span className="text-xs font-bold tracking-widest text-sand-200 uppercase font-mono">
              Authorized Eco-Luxury Safari Partner
            </span>
            <span className="w-1.5 h-1.5 bg-sand-600 rounded-full"></span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Witness the Majesty of <br/>
            <span className="text-sand-100 font-serif italic inline-flex items-center min-h-[1.25em]">
              {currentText}
              <span className="w-1.5 h-[0.9em] bg-sand-200 ml-2.5 animate-pulse inline-block rounded"></span>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-sm md:text-base text-forest-100 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Embark on a soul-stirring, fully customized safari through Rwanda's mist-shrouded bamboo rainforests and pristine savanna horizons. Led by certified park guides.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => onNavigate('destinations')}
              className="w-full sm:w-auto px-8 py-3.5 bg-sand-600 hover:bg-sand-700 text-forest-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all text-center cursor-pointer"
            >
              Explore National Parks
            </button>
            <button
              onClick={() => onNavigate('packages')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition text-center cursor-pointer"
            >
              Configure Safari Tiers
            </button>
          </motion.div>

          {/* Social Proof badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-white/10 text-xs font-mono text-forest-200"
          >
            <div className="space-y-1">
              <span className="block text-xl font-bold font-serif text-sand-100">100%</span>
              <span className="uppercase tracking-wider text-[10px]">Zero-Trace Ecotourism</span>
            </div>
            <div className="space-y-1">
              <span className="block text-xl font-bold font-serif text-sand-100">$1,500</span>
              <span className="uppercase tracking-wider text-[10px]">Permits Contribution</span>
            </div>
            <div className="space-y-1">
              <span className="block text-xl font-bold font-serif text-sand-100">1/3</span>
              <span className="uppercase tracking-wider text-[10px]">Global Gorilla Share</span>
            </div>
            <div className="space-y-1">
              <span className="block text-xl font-bold font-serif text-sand-100">24hr</span>
              <span className="uppercase tracking-wider text-[10px]">Swift Permits Registry</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 2. CANOPY ABOUT SECTION */}
      <AboutSection onNavigate={onNavigate} />

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
                  <div className="w-14 h-14 bg-forest-100 rounded-full border border-forest-200 flex items-center justify-center mx-auto text-forest-750">
                    <Compass className="w-7 h-7" />
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
      <section className="py-24 max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold tracking-widest text-forest-700 uppercase bg-forest-100 px-3 py-1.5 rounded-full border border-forest-200/50 inline-block font-mono">
            Unrivaled Quality
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-forest-900">
            Why Expedition with Hobe Gorilla
          </h2>
          <p className="text-xs text-forest-650 max-w-md mx-auto font-light leading-relaxed">
            Highly personalized luxury hospitality designed synchronously around severe environmental conservation rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-forest-100 shadow-luxury space-y-5">
            <div className="w-12 h-12 bg-forest-50 border border-forest-150 rounded-2xl flex items-center justify-center text-forest-700">
              <Star className="w-6 h-6 fill-forest-200" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest-900 tracking-tight">Eco-Luxury Lodging</h3>
            <p className="text-xs text-forest-650 leading-relaxed font-light">
              Rest inside five-star luxury villas in direct proximity of the National parks. Immersive jungle environments with private massage decks, fireplaces, and chef service.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-forest-100 shadow-luxury space-y-5">
            <div className="w-12 h-12 bg-forest-50 border border-forest-150 rounded-2xl flex items-center justify-center text-forest-700">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest-900 tracking-tight">Hassle-Free Booking</h3>
            <p className="text-xs text-forest-650 leading-relaxed font-light">
              Tracking licenses are capped daily inside Rwanda to protect gorillas. We secure your verified legal tracking permits under the official park records within 24 hours.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-forest-100 shadow-luxury space-y-5">
            <div className="w-12 h-12 bg-forest-50 border border-forest-150 rounded-2xl flex items-center justify-center text-forest-700">
              <Heart className="w-6 h-6 text-red-600 fill-red-500/20" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest-900 tracking-tight">Community Investment</h3>
            <p className="text-xs text-forest-650 leading-relaxed font-light">
              Over 10% of revenue goes back directly to local forest rangers, tracking trackers, and building schools in surrounding communities, creating a fully aligned circular economy.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PARALLAX CALL-TO-ACTION */}
      <section className="bg-gradient-to-br from-forest-900 to-forest-950 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-transparent opacity-80 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white tracking-tight">
            Ready to Stand in the mists of Virunga?
          </h2>
          <p className="text-sm text-forest-100 max-w-xl mx-auto leading-relaxed font-light">
            Licenses are severely limited and often book out 4-6 months in advance. Secure your tracking permits now under the premium guidance of authorized conservation coordinators.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onNavigate('booking')}
              className="py-3.5 px-8 bg-sand-600 hover:bg-sand-700 text-forest-950 font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
            >
              Start Permits Application
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
