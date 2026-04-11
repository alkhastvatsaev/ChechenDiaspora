"use client";

import { useEffect, useState, useMemo, Fragment } from 'react';
import { MapContainer, TileLayer, Marker, useMap, GeoJSON, Circle, Polygon, Polyline } from 'react-leaflet';
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
    if (center && map) {
      try {
        map.setView(center, map.getZoom());
      } catch (e) {
        // Silent catch if map isn't ready
      }
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
  const [zoom, setZoom] = useState(3);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  function ZoomHandler() {
    const map = useMap();
    useEffect(() => {
      const onZoom = () => setZoom(map.getZoom());
      map.on('zoomend', onZoom);
      map.on('click', () => setSelectedCity(null));
      return () => { 
        map.off('zoomend', onZoom); 
        map.off('click');
      };
    }, [map]);
    return null;
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const icons = useMemo(() => {
    if (typeof window === 'undefined') return null;

    return {
      cityLabel: (name: string, isSelected: boolean) => L.divIcon({
        className: 'bg-transparent',
        html: `<div class="flex flex-col items-center">
                 ${isSelected ? `
                 <div class="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 mb-2 animate-in fade-in zoom-in duration-300">
                   <span class="text-[11px] font-black text-apple-dark tracking-tight uppercase select-none">${name}</span>
                 </div>
                 ` : ''}
                 <div class="w-2.5 h-2.5 ${isSelected ? 'bg-chechen-blue scale-125' : 'bg-chechen-blue/40'} rounded-full border-2 border-white shadow-sm transition-all duration-300"></div>
               </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      }),
      homelandLabel: (point: any) => {
        const isHistorical = point.type === 'historical';
        const isCity = point.type === 'city';
        
        // Premium Tower SVG for historical points
        const towerSvg = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 21h16"/>
            <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
            <path d="M9 3v4"/>
            <path d="M15 3v4"/>
            <path d="M12 3v4"/>
            <path d="M12 11v4"/>
          </svg>
        `;

        return L.divIcon({
          className: 'bg-transparent transition-all duration-500 hover:scale-110',
          html: `<div class="flex flex-col items-center group">
                   <div class="px-2 py-0.5 ${isHistorical ? 'bg-amber-600/90' : isCity ? 'bg-green-700/95' : 'bg-green-600/80'} backdrop-blur-md rounded-lg shadow-xl border border-white/30 mb-1 flex items-center gap-1.5 transform transition-all group-hover:-translate-y-1">
                     ${isHistorical ? `<span class="text-white">${towerSvg}</span>` : ''}
                     <div class="flex flex-col leading-tight">
                       <span class="text-[9px] font-black text-white tracking-widest uppercase select-none">${point.nativeName || point.name}</span>
                       ${point.nativeName && point.nativeName !== point.name ? `<span class="text-[7px] font-medium text-white/70 italic -mt-0.5">${point.name}</span>` : ''}
                     </div>
                   </div>
                   <div class="relative">
                     <div class="w-1.5 h-1.5 ${isHistorical ? 'bg-amber-400' : 'bg-green-400'} rounded-full border border-white shadow-md"></div>
                     ${isCity ? '<div class="absolute inset-0 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></div>' : ''}
                   </div>
                 </div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
      },
      memberAvatar: (member: any) => {
        const initials = `${member.prenom?.[0] || ''}${member.nom?.[0] || ''}`.toUpperCase();
        
        return L.divIcon({
          className: 'bg-transparent',
          html: `
            <div class="relative group">
              <div class="w-10 h-10 bg-brand-blue/10 backdrop-blur-[2px] rounded-full shadow-sm border-2 border-brand-blue flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all duration-300 ease-out">
                <span class="text-[11px] font-black text-brand-blue tracking-widest">${initials}</span>
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });
      },
      transporter: (name: string) => L.divIcon({
        className: 'bg-transparent',
        html: `
          <div class="relative group flex flex-col items-center">
            <div class="px-1.5 py-0.5 bg-white/80 backdrop-blur-sm rounded-md shadow-sm border border-brand-blue/10 mb-1">
              <span class="text-[6px] font-bold text-brand-blue/60 tracking-wider uppercase select-none">${name}</span>
            </div>
            <div class="w-9 h-9 bg-[#ecfdf5] rounded-xl shadow-lg border-2 border-[#10b981]/30 flex items-center justify-center transform group-hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
                <path d="M15 18H9"></path>
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
                <circle cx="17" cy="18" r="2"></circle>
                <circle cx="7" cy="18" r="2"></circle>
              </svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      }),
      clusterCustom: (cluster: any) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div class="w-10 h-10 bg-white/90 text-brand-blue rounded-full flex items-center justify-center font-black text-xs border-2 border-brand-blue shadow-lg transform active:scale-90 transition-all">${count}</div>`,
          className: 'bg-transparent',
          iconSize: L.point(40, 40, true),
        });
      }
    };
  }, []);

  const activeCountries = useMemo(() => {
    const countries = new Set<string>();
    members.forEach(m => { if (m.pays) countries.add(m.pays); });
    return countries;
  }, [members]);

  useEffect(() => {
    if (isMounted) {
      // Fetch full global data to handle 'graying out' inactive countries
      fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(res => res.json())
        .then(data => {
          setCountryGeoJson(data);
        })
        .catch(err => console.error("Failed to load global borders", err));
    }
  }, [isMounted]);

  const countryStyle = (feature: any) => {
    const name = feature.properties.ADMIN || feature.properties.name || feature.properties.NAME;
    
    // Normalize names for comparison
    const isActive = Array.from(activeCountries).some(c => 
      name.toLowerCase().includes(c.toLowerCase()) || 
      c.toLowerCase().includes(name.toLowerCase())
    );

    if (isActive) {
      return {
        color: '#007AFF',
        weight: 1,
        opacity: 0.3,
        fillColor: 'transparent',
        fillOpacity: 0
      };
    }

    return {
      color: '#d1d5db',
      weight: 0.5,
      opacity: 0.1,
      fillColor: '#f9fafb',
      fillOpacity: 0.85
    };
  };

  if (!isMounted || !icons) {
    return (
      <div className="w-full h-full bg-bg-secondary flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
        <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest animate-pulse">Инициализация карты...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full absolute top-0 left-0 z-0 bg-bg-secondary">
      <MapContainer 
        key="diaspora-map-main"
        center={center || [43.318, 45.694]} 
        zoom={3} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <ZoomHandler />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution=""
          className="map-tiles-premium grayscale-[20%] contrast-[110%]"
        />

        {center && <ChangeView center={center} />}
        
        {showHeatmap && (
          <Fragment>
            {countryGeoJson && (
              <GeoJSON 
                key={`countries-focus-${activeCountries.size}`}
                data={countryGeoJson}
                style={countryStyle}
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

            {HOMELAND_POINTS.map(point => {
              // Zoom logic: only show homeland points when closely zoomed in
              const isCityVisible = point.type === 'city' && zoom >= 6;
              const isAyulVisible = point.type === 'ayul' && zoom >= 8;
              const isHistVisible = point.type === 'historical' && zoom >= 9;
              
              if (!isCityVisible && !isAyulVisible && !isHistVisible) return null;

              return (
                <Fragment key={`homeland-group-${point.name}`}>
                  <Marker 
                    position={[point.lat, point.lng]}
                    icon={icons.homelandLabel(point)}
                    interactive={true}
                    eventHandlers={{
                      click: (e) => {
                        L.DomEvent.stopPropagation(e);
                      }
                    }}
                  />
                  <Circle 
                    center={[point.lat, point.lng]}
                    radius={point.type === 'city' ? 3500 : 1800}
                    pathOptions={{
                      color: point.type === 'historical' ? '#f59e0b' : '#16a34a',
                      weight: 1,
                      opacity: 0.2,
                      fillColor: point.type === 'historical' ? '#f59e0b' : '#16a34a',
                      fillOpacity: 0.05
                    }}
                  />
                </Fragment>
              );
            })}
            
            {/* Trajectories for transporters */}
            {members && members.filter(m => m.isTraveling && m.routePoints).map(m => (
              <Fragment key={`trajectory-${m.id}`}>
                <Polyline 
                  positions={m.routePoints}
                  pathOptions={{
                    color: '#10b981',
                    weight: 2,
                    opacity: 0.6,
                    dashArray: '5, 8',
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />
                <Marker 
                  position={[m.lat, m.lng]}
                  icon={icons.transporter(m.prenom || 'Transporter')}
                  zIndexOffset={1000}
                />
              </Fragment>
            ))}
          </Fragment>
        )}


        
        <MarkerClusterGroup
          chunkedLoading={true}
          showCoverageOnHover={false}
          maxClusterRadius={50}
          iconCreateFunction={icons.clusterCustom}
        >
          {members && members.filter(m => m.lat !== undefined && m.lng !== undefined && !m.isTraveling).map(member => (
            <Marker 
              key={`member-${member.id}`} 
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
