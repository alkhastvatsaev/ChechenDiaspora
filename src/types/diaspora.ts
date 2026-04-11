export type ExpertType = 'isLegalDefender' | 'isTranslator' | 'isGuide' | 'openToMentorship' | 'isBusiness' | null;

export interface Member {
  id: string;
  prenom: string;
  nom?: string;
  profession?: string;
  ville?: string;
  pays?: string;
  village?: string;
  teip?: string;
  lat?: number;
  lng?: number;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  tag?: string;
  hasActiveTicket?: boolean;
  isLive?: boolean;
  approved?: boolean;
  vouchCount?: number;
  vouchedBy?: string[];
  isLegalDefender?: boolean;
  isTranslator?: boolean;
  isGuide?: boolean;
  openToMentorship?: boolean;
  isBusiness?: boolean;
  businessName?: string;
  businessDescription?: string;
  message?: string;
  hasStory?: boolean;
  storyContent?: {
    type: string;
    title: string;
    text: string;
    date: string;
  };
  isTraveling?: boolean;
  routePoints?: [number, number][];
}

export interface TicketItem {
  id: string;
  title: string;
  description: string;
  category: string;
  ville: string;
  pays: string;
  lat?: number;
  lng?: number;
  audioUrl?: string;
  audioPath?: string;
  createdAt: number;
  status: 'new' | 'published' | 'closed';
  isEmergency?: boolean;
}

export type ActiveTab = 'map' | 'hub' | 'council';
export type ActiveModal = 'amanat' | 'perevozchik' | 'administrative' | 'mentorship' | 'union-son' | 'union-daughter' | 'berkat-form' | 'roadmap' | null;
