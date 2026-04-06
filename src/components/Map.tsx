"use client";

import { useEffect, useState, Fragment } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMap, GeoJSON, Circle, Polygon } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import diasporaBorders from '@/data/diaspora_borders.json';
import { DIASPORA_HUBS } from '@/data/diaspora_hubs';
import { HOMELAND_POINTS, CHECHNYA_BORDER_POINTS } from '@/data/chechen_homeland';

// Custom Premium Marker Icon (Modern Dot) replacing the old GPS pin
const premiumDotIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<div style="width: 14px; height: 14px; background-color: #007AFF; border-radius: 50%; box-shadow: 0 0 12px rgba(0, 122, 255, 0.8); border: 2px solid white;"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// City Label Icon for Diaspora (Blue)
const cityLabelIcon = (name: string) => L.divIcon({
  className: 'bg-transparent',
  html: `<div class="flex flex-col items-center">
           <div class="w-1.5 h-1.5 bg-blue-600 rounded-full border border-white shadow-xs"></div>
           <span class="text-[9px] font-semibold text-blue-800 whitespace-nowrap bg-white/70 px-0.5 rounded select-none opacity-80">${name}</span>
         </div>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0]
});

// Homeland Label Icon (Green) for Chechnya
const homelandLabelIcon = (name: string, type: string) => L.divIcon({
  className: 'bg-transparent',
  html: `<div class="flex flex-col items-center">
           <div class="${type === 'city' ? 'w-3 h-3 bg-green-700 shadow-[0_0_10px_rgba(22,101,52,0.8)]' : 'w-2 h-2 bg-green-500'} rounded-full border-2 border-white mb-1"></div>
           <span class="text-[10px] ${type === 'city' ? 'font-black scale-110' : 'font-bold'} text-green-900 whitespace-nowrap bg-white/95 px-1 rounded shadow-md border border-green-200 select-none">${name}</span>
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
          const diasporaCountriesMap: { [key: string]: string[] } = {
            'France': ['France'],
            'Germany': ['Germany'],
            'Austria': ['Austria'],
            'Belgium': ['Belgium'],
            'Norway': ['Norway'],
            'Turkey': ['Turkey'],
            'Jordan': ['Jordan'],
            'Russia': ['Russia', 'Russian Federation'],
            'UK': ['United Kingdom', 'Great Britain'],
            'USA': ['United States of America', 'United States', 'USA'],
            'Netherlands': ['Netherlands'],
            'Syria': ['Syria', 'Syrian Arab Republic'],
            'Kazakhstan': ['Kazakhstan'],
            'Iraq': ['Iraq'],
            'Egypt': ['Egypt'],
            'Switzerland': ['Switzerland'],
            'Denmark': ['Denmark'],
            'Sweden': ['Sweden'],
            'Poland': ['Poland'],
            'Canada': ['Canada']
          };
          
          const allTargetNames = Object.values(diasporaCountriesMap).flat();
          
          const filtered = {
            ...data,
            features: data.features.filter((f: any) => {
              const name = f.properties.ADMIN || f.properties.name || f.properties.NAME;
              return allTargetNames.includes(name);
            })
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
            
            {/* City Names over tracers & Automatic Contours */}
            {DIASPORA_HUBS.map(hub => {
              const uniqueKey = `${hub.name}-${hub.country}`;
              return (
                <Fragment key={uniqueKey}>
                  {/* City Label Marker */}
                  <Marker 
                    position={[hub.lat, hub.lng]}
                    icon={cityLabelIcon(hub.name)}
                    interactive={false}
                  />
                </Fragment>
              );
            })}

            {/* --- HOMELAND (CHECHNYA) SPECIAL HIGHLIGHT --- */}
            
            {/* Republic Boundary Highlight in Green */}
            <Polygon
              positions={CHECHNYA_BORDER_POINTS}
              pathOptions={{
                color: '#16a34a', // Emerald 600
                weight: 3.5, // Even thicker for prominence
                opacity: 0.9,
                fillColor: '#16a34a',
                fillOpacity: 0.1,
              }}
            />

            {/* Homeland Cities & Ayuls (Villages) */}
            {HOMELAND_POINTS.map(point => (
              <Marker 
                key={`homeland-${point.name}`}
                position={[point.lat, point.lng]}
                icon={homelandLabelIcon(point.name, point.type)}
                interactive={true}
              >
                {/* Visual Glow for Homeland Points */}
                <Circle 
                  center={[point.lat, point.lng]}
                  radius={point.type === 'city' ? 3000 : 1500}
                  pathOptions={{
                    color: '#16a34a',
                    weight: 1,
                    opacity: 0.4,
                    fillColor: '#16a34a',
                    fillOpacity: 0.1
                  }}
                />
              </Marker>
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
