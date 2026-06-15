/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Destination {
  id: string;
  name: string;
  location: string;
  description: string;
  highlights: string[];
  wildlife: string[];
  imageUrl?: string;
  longDescription?: string;
  gallery?: string[];
}

export interface Package {
  id: string;
  title: string;
  duration: string;
  tier: 'budget' | 'mid-range' | 'luxury';
  baselineCost: number;
  description: string;
  inclusions: string[];
  imageUrl?: string;
}

export interface Booking {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  travelDate: string;
  passengerCount: number;
  specialRequests: string;
  packageId: string;
  packageName: string;
  totalCost: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface AppMetadata {
  phone: string;
  email: string;
  address: string;
  aboutSummary: string;
}

// git-sync-trigger