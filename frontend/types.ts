
export interface SocialNode {
  type: 'website' | 'twitter' | 'linkedin' | 'custom';
  url: string;
  label: string;
}

export interface Profile {
  fullName: string;
  handle: string;
  email: string;
  status: string;
  bio: string;
  location: string;
  isVerified: boolean;
  isAvailable: boolean;
  link: string; // any url
  avatarUrl: string;
  capturedImage?: string;
}

export type Match = {
  x: number
  y: number
  scale: number
  profile: Profile
}

export type ViewState = 'signup' | 'editor' | 'live';
