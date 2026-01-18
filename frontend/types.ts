
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
  nodes: SocialNode;
  avatarUrl: string;
  capturedImage?: string;
}

export type ViewState = 'signup' | 'editor' | 'live';
