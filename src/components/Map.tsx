"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMap, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import { DIASPORA_HUBS } from '@/data/diaspora_hubs';

// Custom Premium Marker Icon (Modern Dot) replacing the old GPS pin
const premiumDotIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div style="width: 14px; height: 14px; background-color: #007A33; border-radius: 50%; box-shadow: 0 0 12px rgba(0, 122, 51, 0.8); border: 2px solid white;"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// Custom Premium Cluster Icon
const createClusterCustomIcon = function (cluster: any) {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div style="width: 40px; height: 40px; background-color: rgba(28, 28, 30, 0.9); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: inherit; font-size: 14px; border: 2px solid #007A33; backdrop-filter: blur(8px); box-shadow: 0 6px 16px rgba(0,0,0,0.15);">${count}</div>`,
    className: 'bg-transparent',
    iconSize: L.point(40, 40, true),
  });
};

interface MapProps {
  members?: any[];
  center?: [number, number] | null;
  onMemberClick?: (member: any) => void;
  showHeatmap?: boolean;
}

// Heatmap logic is removed. We use explicitly designated boundaries.

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
    <div className="w-full h-full absolute top-0 left-0 z-0 bg-apple-light">
      <MapContainer 
        center={center || [43.318, 45.694]} 
        zoom={3} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        {center && <ChangeView center={center} />}
        
        {/* Diaspora Hub Borders representing exact city limits/frontiers */}
        {showHeatmap && (
          <>
            {DIASPORA_HUBS.map((hub, idx) => (
              <Circle
                key={idx}
                center={[hub.lat, hub.lng]}
                radius={20000} // 20KM border to highlight the city area massively
                pathOptions={{
                  color: '#007A33',
                  opacity: 0.8,
                  weight: 2,
                  fillColor: '#007A33',
                  fillOpacity: 0.05,
                  dashArray: '8, 8' // Gives a 'frontier / border' style
                }}
              />
            ))}
          </>
        )}

        <ZoomControl position="bottomright" />
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          attribution=""
          className="map-tiles-premium"
        />

        {!showHeatmap && (
          <MarkerClusterGroup
            chunkedLoading
            showCoverageOnHover={false}
            maxClusterRadius={50}
            iconCreateFunction={createClusterCustomIcon}
          >
            {members.map(member => (
              <Marker 
                key={member.id} 
                position={[member.lat, member.lng]}
                icon={premiumDotIcon}
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
