import dynamic from 'next/dynamic';
import { Member, TicketItem } from '@/types/diaspora';
import { useMemo } from 'react';

const MapComponent = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-bg-primary animate-pulse flex items-center justify-center font-bold text-text-tertiary">Chargement du Kherch...</div>
});

interface MapViewProps {
  members: Member[];
  publishedTickets: TicketItem[];
  center: [number, number] | null;
  showHeatmap?: boolean;
  onEntityClick: (entity: any) => void;
}

export function MapView({ 
  members = [], 
  publishedTickets = [], 
  center, 
  showHeatmap, 
  onMemberClick 
}: any) {
  const mapEntities = useMemo(() => {
    const safeTickets = Array.isArray(publishedTickets) ? publishedTickets : [];
    const safeMembers = Array.isArray(members) ? members : [];
    
    const ticketMarkers = safeTickets
      .filter((t: any) => t && typeof t.lat === 'number' && typeof t.lng === 'number')
      .map((t) => ({
        id: t.id,
        lat: t.lat,
        lng: t.lng,
        ville: t.ville,
        pays: t.pays,
        approved: true,
        isTicket: true,
        ticketTitle: t.title,
        ticketDescription: t.description,
        ticketCategory: t.category,
        createdAt: t.createdAt,
        prenom: t.title,
        nom: '',
        profession: 'Запрос',
      }));

    return [...members, ...ticketMarkers];
  }, [members, publishedTickets]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <MapComponent 
        members={mapEntities} 
        center={center} 
        showHeatmap={showHeatmap}
        onMemberClick={onEntityClick}
      />
      {/* Premium Gradient Overlay to integrate with UI */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-bg-primary/40 via-transparent to-bg-primary/20"></div>
    </div>
  );
}
