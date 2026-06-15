/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Destination, Package, AppMetadata } from './types';

import mountainGorillaImg from './assets/images/mountain_gorilla.jpg';
import goldenMonkeyImg from './assets/images/golden_monkey.jpg';
import chimpanzeeNyungweImg from './assets/images/chimpanzee_nyungwe.jpg';
import akageraSafariImg from './assets/images/akagera_safari.jpg';
import nyungweForestImg from './assets/images/nyungwe_forest.jpg';
import lakeKivuSunsetImg from './assets/images/lake_kivu_sunset.jpg';
import twinLakesRwandaImg from './assets/images/twin_lakes_rwanda.jpg';
import luxuryLodgeImg from './assets/images/luxury_lodge.jpg';

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
    imageUrl: mountainGorillaImg,
    longDescription: 'Volcanoes National Park spans five of the eight inactive volcanoes of the magnificent Virunga Mountains, clothed in dense bamboo forests and mist. Visited by thousands seeking a deep spiritual connection with our closest evolutionary cousins, it is one of the only places on Earth where you can safely stand feet away from the gentle, endangered mountain gorilla in their natural sanctuary.',
    gallery: [
      mountainGorillaImg,
      goldenMonkeyImg,
      luxuryLodgeImg
    ]
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
    imageUrl: akageraSafariImg,
    longDescription: 'Spanning eastern Rwanda, Akagera National Park stands as a beautiful testament to successful environmental rehabilitation. Characterized by scenic low hills and flat savanna grasslands interlaced with a labyrinth of swampy lakes, Akagera now supports thriving populations of all the "Big Five" (lions, leopards, rhinos, elephants, buffaloes)—which can be encountered during morning game drives or evening boat safaris along Lake Ihema.',
    gallery: [
      akageraSafariImg,
      lakeKivuSunsetImg,
      luxuryLodgeImg
    ]
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
    imageUrl: nyungweForestImg,
    longDescription: 'As one of Africa’s oldest montane rainforests, Nyungwe National Park is a spectacular cradle of biodiversity, supporting over 1,000 biological species of plants, 13 diverse primates (including giant troops of colobus and wild chimpanzees), and more than 300 bird species. Its crown jewel is the steel canopy walkway suspension bridge, letting you walk 70 meters high above ancient tree crowns.',
    gallery: [
      nyungweForestImg,
      chimpanzeeNyungweImg,
      twinLakesRwandaImg
    ]
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
    imageUrl: goldenMonkeyImg,
    longDescription: 'Gishwati-Mukura represents Rwanda’s newest national reserve and is an inspirational success story in ecological forest restoration. Once almost entirely deforested, it is now protected and replanted to unite isolated primate populations. Visitors can engage in highly exclusive guided forest trails, chimpanzee watches, and intimate local cultural events that directly fund native conservationists.',
    gallery: [
      goldenMonkeyImg,
      nyungweForestImg,
      mountainGorillaImg
    ]
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
    imageUrl: mountainGorillaImg
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
    imageUrl: akageraSafariImg
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
    imageUrl: luxuryLodgeImg
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

// git-sync-trigger