"use client";

import { useEffect, useState, useMemo, Fragment } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMap, GeoJSON, Circle, Polygon } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import diasporaBorders from '@/data/diaspora_borders.json';
import { DIASPORA_HUBS } from '@/data/diaspora_hubs';
import { HOMELAND_POINTS, CHECHNYA_BORDER_POINTS } from '@/data/chechen_homeland';

function ChangeView({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

interface MapProps {
  members?: any[];
  center?: [number, number] | null;
  onMemberClick?: (member: any) => void;
  showHeatmap?: boolean;
}

export default function Map({ members = [], center, onMemberClick, showHeatmap = true }: MapProps) {
  const [countryGeoJson, setCountryGeoJson] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const icons = useMemo(() => {
    if (typeof window === 'undefined') return null;

    return {
      cityLabel: (name: string) => L.divIcon({
        className: 'bg-transparent',
        html: `<div class="flex flex-col items-center">
                 <div class="w-1.5 h-1.5 bg-blue-600 rounded-full border border-white shadow-xs"></div>
                 <span class="text-[9px] font-semibold text-blue-800 whitespace-nowrap bg-white/70 px-0.5 rounded select-none opacity-80">${name}</span>
               </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      }),
      homelandLabel: (name: string, type: string) => L.divIcon({
        className: 'bg-transparent',
        html: `<div class="flex flex-col items-center">
                 <div class="${type === 'city' ? 'w-3 h-3 bg-green-700 shadow-[0_0_10px_rgba(22,101,52,0.8)]' : 'w-2 h-2 bg-green-500'} rounded-full border-2 border-white mb-1"></div>
                 <span class="text-[10px] ${type === 'city' ? 'font-black scale-110' : 'font-bold'} text-green-900 whitespace-nowrap bg-white/95 px-1 rounded shadow-md border border-green-200 select-none">${name}</span>
               </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      }),
      memberAvatar: (member: any) => {
        const initials = `${member.prenom?.[0] || ''}${member.nom?.[0] || ''}`.toUpperCase();
        const isExpert = member.isLegalDefender || member.isTranslator || member.isGuide || member.openToMentorship;
        let ExpertColor = '';
        if (member.isLegalDefender) ExpertColor = '#ef4444';
        else if (member.isTranslator) ExpertColor = '#3b82f6';
        else if (member.isGuide) ExpertColor = '#10b981';
        else if (member.openToMentorship) ExpertColor = '#f59e0b';

        const borderColor = member.isLive ? '#10b981' : 'white';
        const shadowColor = member.isLive ? 'rgba(16, 185, 129, 0.6)' : 'rgba(0, 0, 0, 0.1)';

        return L.divIcon({
          className: 'bg-transparent',
          html: `
            <div class="relative group">
              ${member.isLive ? `<div class="absolute -inset-2 bg-emerald-500/20 rounded-full animate-ping opacity-75"></div>` : ''}
              <div class="relative w-12 h-12 bg-white rounded-2xl shadow-2xl border-2 flex items-center justify-center overflow-hidden transform hover:scale-110 active:scale-95 transition-all duration-300 ease-out" 
                   style="border-color: ${borderColor}; box-shadow: 0 8px 24px ${shadowColor};">
                ${member.imageUrl 
                  ? `<img src="${member.imageUrl}" class="w-full h-full object-cover" />`
                  : `<span class="text-xs font-black text-slate-800 tracking-tighter">${initials}</span>`
                }
                ${isExpert ? `
                  <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full shadow-lg border-2 border-white" style="background-color: ${ExpertColor};">
                  </div>
                ` : ''}
              </div>
              <div class="absolute -top-1 -right-1 w-3 h-3 ${member.isLive ? 'bg-emerald-500' : 'bg-gray-300'} border-2 border-white rounded-full shadow-sm"></div>
            </div>
          `,
          iconSize: [48, 48],
          iconAnchor: [24, 24]
        });
      },
      clusterCustom: (cluster: any) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div style="width: 40px; height: 40px; background-color: rgba(28, 28, 30, 0.9); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: inherit; font-size: 14px; border: 2px solid #007AFF; backdrop-filter: blur(8px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); font-smoothing: antialiased;">${count}</div>`,
          className: 'bg-transparent',
          iconSize: L.point(40, 40, true),
        });
      }
    };
  }, []);

  useEffect(() => {
    if (showHeatmap && isMounted) {
      fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(res => res.json())
        .then(data => {
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
  }, [showHeatmap, isMounted]);

  if (!isMounted || !icons) {
    return <div className="w-full h-full bg-apple-light flex items-center justify-center font-bold text-gray-400">Инициализация...</div>;
  }

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
        
        {showHeatmap && (
          <>
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

            <GeoJSON 
              data={diasporaBorders as any}
              style={{
                color: '#007AFF',
                weight: 2,
                opacity: 0.9,
                fillColor: '#007AFF',
                fillOpacity: 0.1,
              }}
            />
            
            {DIASPORA_HUBS.map(hub => (
              <Marker 
                key={`${hub.name}-${hub.country}`}
                position={[hub.lat, hub.lng]}
                icon={icons.cityLabel(hub.name)}
                interactive={false}
              />
            ))}

            <Polygon
              positions={CHECHNYA_BORDER_POINTS}
              pathOptions={{
                color: '#16a34a',
                weight: 3.5,
                opacity: 0.9,
                fillColor: '#16a34a',
                fillOpacity: 0.1,
              }}
            />

            {HOMELAND_POINTS.map(point => (
              <Marker 
                key={`homeland-${point.name}`}
                position={[point.lat, point.lng]}
                icon={icons.homelandLabel(point.name, point.type)}
                interactive={true}
              >
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

        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          maxClusterRadius={50}
          iconCreateFunction={icons.clusterCustom}
        >
          {members.map(member => (
            <Marker 
              key={member.id} 
              position={[member.lat, member.lng]}
              icon={icons.memberAvatar(member)}
              eventHandlers={{
                click: () => onMemberClick?.(member)
              }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
