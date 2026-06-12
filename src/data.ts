/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Destination, Package, AppMetadata } from './types';

export const SEED_METADATA: AppMetadata = {
  phone: '+250 788653917',
  email: 'hobegorillarwanda@gmail.com',
  address: 'Kigali City, Gasabo District, Remera, Giporoso',
  aboutSummary: 'HOBE GORILLA RWANDA is your gateway to the heart of Rwanda. We craft personalized itineraries for unforgettable wildlife and cultural experiences. We promote sustainable tourism that benefits local communities and the environment.'
};

export const SEED_DESTINATIONS: Destination[] = [
  {
    id: 'volcanoes-np',
    name: 'Volcanoes National Park (Parc National des Volcans)',
    location: 'Northwestern Rwanda, Virunga Mountains',
    description: 'Home to the endangered mountain gorillas, dramatic volcanic landscapes, and rich bamboo rainforests.',
    highlights: [
      'Gorilla Treking',
      'Golden Monkey Tracking',
      'Musanze Caves Exploration',
      'Mount Bisoke Crater Lake Hike',
      'Dian Fossey Tombs Trek'
    ],
    wildlife: [
      'Mountain Gorillas (30% of global population)',
      'Golden Monkeys',
      'Buffaloes',
      'Forest Elephants',
      'Rare Bird Species'
    ],
    imageUrl: '/assets/images/mountain_gorilla_1781279668251.jpg'
  },
  {
    id: 'akagera-np',
    name: 'Akagera National Park',
    location: 'Eastern Rwanda Border',
    description: 'A classic African savanna landscape characterized by rolling hills, acacia woodlands, and a vast labyrinth of lakes.',
    highlights: [
      'Big Five Game Drives',
      'Lake Ihema Boat Safaris',
      'Night Game Drives',
      'Behind-the-Scenes Conservation Tours'
    ],
    wildlife: [
      'Lions',
      'Leopards',
      'Black Rhinos',
      'Elephants',
      'Buffalos',
      'Giraffes',
      'Zebras',
      'Hippos'
    ],
    imageUrl: '/assets/images/akagera_safari_1781279684583.jpg'
  },
  {
    id: 'nyungwe-np',
    name: 'Nyungwe National Park',
    location: 'Southwestern Rwanda',
    description: 'One of the oldest and largest montane rainforests in Central Africa, celebrated for its spectacular biodiversity.',
    highlights: [
      'Chimpanzee Tracking',
      'Canopy Walkway Experience',
      'Isumo Waterfall Trail Hike',
      'Gisakura Tea Estate Tours'
    ],
    wildlife: [
      'Chimpanzees',
      'L\'Hoest\'s Monkeys',
      'Black and White Colobus Monkeys',
      'Over 300 Bird Species'
    ],
    imageUrl: '/assets/images/nyungwe_forest_1781279699629.jpg'
  },
  {
    id: 'gishwati-mukura',
    name: 'Gishwati-Mukura National Park',
    location: 'Western Rwanda',
    description: 'Rwanda\'s newest national park, representing a stunning turnaround story of environmental forest restoration and ecotourism.',
    highlights: [
      'Guided Nature Walks',
      'Community Cultural Visits',
      'Chimpanzee and Monkey Viewing'
    ],
    wildlife: [
      'Chimpanzees',
      'Golden Monkeys',
      'Blue Monkeys',
      'East African Golden Cats'
    ],
    imageUrl: '/assets/images/golden_monkey_1781279732182.jpg'
  }
];

export const SEED_PACKAGES: Package[] = [
  {
    id: 'pkg-budget-explorer',
    title: 'Budget Explorer',
    duration: '1 Day',
    tier: 'budget',
    baselineCost: 1650,
    description: 'An intense, single-day dash designed for travelers short on time who want an unforgettable encounter with the mountain gorillas.',
    inclusions: [
      'Official Gorilla Trekking Permit ($1,500 value)',
      'Park Entrance Fees',
      'Round-trip Transport from Kigali',
      'Lunch and Bottled Water',
      'Experienced Park Ranger Guide'
    ],
    imageUrl: '/assets/images/mountain_gorilla_1781279668251.jpg'
  },
  {
    id: 'pkg-mid-range-adventurer',
    title: 'Mid-Range Adventurer',
    duration: '2 Days / 1 Night',
    tier: 'mid-range',
    baselineCost: 2750,
    description: 'A balanced tour blending the iconic gorilla trek with local cultural immersion and comfortable overnight stays.',
    inclusions: [
      'Official Gorilla Trekking Permit',
      '1 Night Mid-Range Lodge Accommodation',
      'All Meals & Bottled Water',
      'Private Transport',
      'Cultural Village Experience Tour',
      'Local Expert Guide'
    ],
    imageUrl: '/assets/images/akagera_safari_1781279684583.jpg'
  },
  {
    id: 'pkg-luxury-safari',
    title: 'Luxury Safari',
    duration: '3 Days / 2 Nights',
    tier: 'luxury',
    baselineCost: 5800,
    description: 'An all-inclusive premium expedition featuring elite luxury eco-lodges, private 4x4 transport, and personalized high-end safari hospitality.',
    inclusions: [
      'Official Gorilla Trekking Permit',
      '2 Nights Luxury Eco-Lodge Stay',
      'Gourmet Meals & Fine Beverages',
      'Private Luxury 4x4 Safari Vehicle',
      'Dedicated Private Tour Guide',
      'Spa Access & Wellness Amenities'
    ],
    imageUrl: '/assets/images/luxury_lodge_1781279715722.jpg'
  }
];

export const SIGNATURE_ITINERARY = {
  title: '7-Day Signature Route',
  steps: [
    {
      days: 'Days 1-2',
      destination: 'Volcanoes National Park',
      activity: 'Gorilla & Golden Monkey trekking, Musanze Caves'
    },
    {
      days: 'Day 3',
      destination: 'Mount Bisoke or Culture',
      activity: 'Bisoke Hike or Cultural Village Experience'
    },
    {
      days: 'Days 4-5',
      destination: 'Nyungwe National Park',
      activity: 'Transfer to Nyungwe NP (Canopy Walk & Chimp Tracking)'
    },
    {
      days: 'Days 6-7',
      destination: 'Akagera National Park',
      activity: 'Drive to Akagera NP (Big Five Savanna Safari + Lake Ihema Boat Tour)'
    }
  ]
};
