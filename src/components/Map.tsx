"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMap, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import diasporaBorders from '@/data/diaspora_borders.json';
import { DIASPORA_HUBS } from '@/data/diaspora_hubs';

// Custom Premium Marker Icon (Modern Dot) replacing the old GPS pin
const premiumDotIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div style="width: 14px; height: 14px; background-color: #007AFF; border-radius: 50%; box-shadow: 0 0 12px rgba(0, 122, 255, 0.8); border: 2px solid white;"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// Custom Icon for City Labels
const cityLabelIcon = (name: string) => L.divIcon({
  className: 'bg-transparent',
  html: `<div style="display: flex; flex-direction: column; align-items: center;">
          <div style="width: 8px; height: 8px; background-color: #007AFF; border-radius: 50%; border: 1.5px solid white;"></div>
          <div style="margin-top: 2px; font-weight: 700; font-size: 10px; color: #1C1C1E; text-shadow: 0 0 4px white, 0 0 4px white; white-space: nowrap; pointer-events: none; opacity: 0.8;">${name}</div>
         </div>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0]
});

// Custom Premium Cluster Icon
const createClusterCustomIcon = function (cluster: any) {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div style="width: 40px; height: 40px; background-color: rgba(28, 28, 30, 0.9); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: inherit; font-size: 14px; border: 2px solid #007AFF; backdrop-filter: blur(8px); box-shadow: 0 6px 16px rgba(0,0,0,0.15);">${count}</div>`,
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
  const [countryGeoJson, setCountryGeoJson] = useState<any>(null);

  useEffect(() => {
    if (showHeatmap) {
      // Fetch simplified world boundaries
      fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(res => res.json())
        .then(data => {
          // List of countries with significant Chechen population based on DIASPORA_HUBS and history
          const diasporaCountries = [
            'France', 'Germany', 'Austria', 'Belgium', 'Norway', 'Turkey', 'Jordan', 
            'Russia', 'United Kingdom', 'United States of America', 'Netherlands', 
            'Syria', 'Kazakhstan', 'Iraq', 'Egypt', 'Switzerland', 'Denmark', 
            'Sweden', 'Poland', 'Canada'
          ];
          
          const filtered = {
            ...data,
            features: data.features.filter((f: any) => 
               diasporaCountries.includes(f.properties.ADMIN) || 
               diasporaCountries.includes(f.properties.name) ||
               (f.properties.ADMIN === 'Russia' && diasporaCountries.includes('Russia'))
            )
          };
          setCountryGeoJson(filtered);
        })
        .catch(err => console.error("Failed to load country borders", err));
    }
  }, [showHeatmap]);
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
        
        {/* Diaspora Hub Borders representing exact municipal/administrative limits */}
        {showHeatmap && (
          <>
            {/* Country Outlines (Discreet and Transparent) */}
            {countryGeoJson && (
              <GeoJSON 
                data={countryGeoJson}
                style={{
                  color: '#333333',
                  weight: 1,
                  opacity: 0.25,
                  fillColor: 'transparent',
                  fillOpacity: 0
                }}
              />
            )}

            {/* @ts-ignore */}
            <GeoJSON 
              data={diasporaBorders as any}
              style={{
                color: '#007AFF',
                weight: 2,
                opacity: 0.9,
                fillColor: '#007AFF',
                fillOpacity: 0.1,
                // Solid line requested by user rather than dashed
              }}
            />
            
            {/* City Names over tracers */}
            {DIASPORA_HUBS.map(hub => (
              <Marker 
                key={`${hub.name}-${hub.country}`}
                position={[hub.lat, hub.lng]}
                icon={cityLabelIcon(hub.name)}
                interactive={false}
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
