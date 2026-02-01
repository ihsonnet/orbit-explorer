import md5 from 'md5';

export type PostCategory = 
  | 'leo' 
  | 'meo' 
  | 'geo' 
  | 'heo' 
  | 'gps' 
  | 'weather' 
  | 'communications' 
  | 'earth-observation'
  | 'launches'
  | 'missions'
  | 'discoveries';

export type PostStatus = 'pending' | 'approved' | 'rejected';

export interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

export interface SpacePost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorEmail: string;
  authorName: string;
  category: PostCategory;
  tags: string[];
  status: PostStatus;
  createdAt: string;
  publishedAt?: string;
  comments?: Comment[];
}

export const categoryLabels: Record<PostCategory, string> = {
  'leo': 'LEO (Low Earth Orbit)',
  'meo': 'MEO (Medium Earth Orbit)',
  'geo': 'GEO (Geostationary)',
  'heo': 'HEO (Highly Elliptical)',
  'gps': 'GPS & Navigation',
  'weather': 'Weather Satellites',
  'communications': 'Communications',
  'earth-observation': 'Earth Observation',
  'launches': 'Launches',
  'missions': 'Missions',
  'discoveries': 'Discoveries',
};

export const categoryGroups = {
  'Orbit Types': ['leo', 'meo', 'geo', 'heo'] as PostCategory[],
  'Applications': ['gps', 'weather', 'communications', 'earth-observation'] as PostCategory[],
  'Space News': ['launches', 'missions', 'discoveries'] as PostCategory[],
};

// Gravatar helper
export function getGravatarUrl(email: string, size: number = 80): string {
  const trimmedEmail = email.trim().toLowerCase();
  const hash = md5(trimmedEmail);
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}
