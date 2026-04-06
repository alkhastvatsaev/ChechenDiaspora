"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet.heat'; // Add heatmap plugin

// Custom Marker Icon for a more professional look
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  members?: any[];
  center?: [number, number] | null;
  onMemberClick?: (member: any) => void;
  showHeatmap?: boolean;
}

function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    // Heatmap instance
    const heatLayer = (L as any).heatLayer(points, {
      radius: 35,
      blur: 20,
      maxZoom: 14,
      minOpacity: 0.4,
      gradient: { 
        0.2: '#10B981', // Emerald Medium
        0.5: '#059669', // Dark Emerald
        0.8: '#1C6B42', // Chechen Green
        1.0: '#064E3B'  // Deep Forest
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

function ChangeView({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function Map({ members = [], center, onMemberClick, showHeatmap = true }: MapProps) {
  return (
    <div className="w-full h-full absolute top-0 left-0 z-0 bg-gray-100">
      <MapContainer 
        center={center || [43.318, 45.694]} 
        zoom={3} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        {center && <ChangeView center={center} />}
        
        {/* Heatmap Layer */}
        {showHeatmap && (
          <HeatmapLayer 
            points={members.map(m => [m.lat, m.lng, 0.5])} 
          />
        )}

        <ZoomControl position="bottomright" />
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {!showHeatmap && (
          <MarkerClusterGroup
            chunkedLoading
            showCoverageOnHover={false}
            maxClusterRadius={50}
          >
            {members.map(member => (
              <Marker 
                key={member.id} 
                position={[member.lat, member.lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => onMemberClick?.(member)
                }}
              >
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>
    </div>
  );
}
