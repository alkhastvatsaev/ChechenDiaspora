"use client";

import { useEffect, useState, useMemo, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X } from 'lucide-react';
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
        const hasTicket = member.hasActiveTicket;
        
        return L.divIcon({
          className: 'bg-transparent',
          html: `
            <div class="relative group">
              <div class="w-10 h-10 bg-brand-blue/10 backdrop-blur-[2px] rounded-full shadow-sm border-2 border-brand-blue flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all duration-300 ease-out">
                <span class="text-[11px] font-black text-brand-blue tracking-widest">${initials}</span>
              </div>
              ${hasTicket ? `
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse flex items-center justify-center shadow-lg">
                  <span class="text-[7px] text-white font-black">!</span>
                </div>
              ` : ''}
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
            <!-- Curved Name Badge with White Halo -->
            <svg class="absolute -top-1 w-16 h-10 overflow-visible pointer-events-none">
              <path id="curve-${name}" d="M 10,24 A 22,22 0 0,1 54,24" fill="transparent" />
              <!-- White Halo (Background) -->
              <text class="text-[7px] font-black tracking-[0.1em] uppercase fill-white stroke-white stroke-[3px]">
                <textPath xlink:href="#curve-${name}" startOffset="50%" text-anchor="middle">
                  ${name}
                </textPath>
              </text>
              <!-- Primary Text -->
              <text class="text-[7px] font-black tracking-[0.1em] uppercase fill-[#059669]">
                <textPath xlink:href="#curve-${name}" startOffset="50%" text-anchor="middle">
                  ${name}
                </textPath>
              </text>
            </svg>
            
            <div class="w-9 h-9 bg-[#ecfdf5] rounded-xl shadow-lg border-2 border-[#10b981]/30 flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 mt-1">
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
        iconSize: [40, 48],
        iconAnchor: [20, 24]
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

  useEffect(() => {
    if (isMounted) {
      // Reverting to the high-end clean diaspora-only borders
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
            'Uzbekistan': ['Uzbekistan'],
            'Kyrgyzstan': ['Kyrgyzstan'],
            'Iraq': ['Iraq'],
            'Egypt': ['Egypt'],
            'Switzerland': ['Switzerland'],
            'Denmark': ['Denmark'],
            'Sweden': ['Sweden'],
            'Poland': ['Poland'],
            'Canada': ['Canada'],
            'Georgia': ['Georgia'],
            'Finland': ['Finland']
          };
          
          const allTargetNames = Object.values(diasporaCountriesMap).flat();
          const filtered = {
            ...data,
            features: data.features.filter((f: any) => {
              const name = f.properties.ADMIN || f.properties.name || f.properties.NAME || "";
              return allTargetNames.some(tn => name.includes(tn) || tn.includes(name));
            })
          };
          setCountryGeoJson(filtered);
        })
        .catch(err => console.error("Failed to load map data", err));
    }
  }, [isMounted]);

  const [selectedCountryInfo, setSelectedCountryInfo] = useState<{name: string, count: string} | null>(null);

  const DIASPORA_REGIONS = [
    // France
    { name: 'Paris & Région', count: '25,000+', lat: 48.8566, lng: 2.3522, radius: 80000 },
    { name: 'Nice & Riviera', count: '12,000+', lat: 43.7102, lng: 7.2620, radius: 60000 },
    { name: 'Strasbourg & Grand Est', count: '10,000+', lat: 48.5734, lng: 7.7521, radius: 50000 },
    // Turquie
    { name: 'Istanbul & Yalova', count: '45,000+', lat: 41.0082, lng: 28.9784, radius: 120000 },
    { name: 'Sivas & Anatolie Central', count: '15,000+', lat: 39.7505, lng: 37.0150, radius: 100000 },
    // Kazakhstan
    { name: 'Almaty & Sud', count: '20,000+', lat: 43.2220, lng: 76.8512, radius: 150000 },
    { name: 'Astana & Nord', count: '15,000+', lat: 51.1605, lng: 71.4272, radius: 120000 },
    { name: 'Karaganda', count: '10,000+', lat: 49.8019, lng: 73.1021, radius: 80000 },
    // Jordanie
    { name: 'Amman & Zarqa', count: '15,000+', lat: 31.9454, lng: 35.9284, radius: 70000 },
    // Géorgie
    { name: 'Pankissi (Duisi)', count: '8,000+', lat: 42.1866, lng: 45.2443, radius: 40000 },
    // Allemagne
    { name: 'Bremen & Hambourg', count: '15,000+', lat: 53.0793, lng: 8.8017, radius: 90000 },
    { name: 'Berlin', count: '12,000+', lat: 52.5200, lng: 13.4050, radius: 70000 },
    // Autriche
    { name: 'Vienne & Linz', count: '25,000+', lat: 48.2082, lng: 16.3738, radius: 90000 },
    // Belgique
    { name: 'Bruxelles & Anvers', count: '15,000+', lat: 50.8503, lng: 4.3517, radius: 60000 },
    // Norvège
    { name: 'Oslo Region', count: '8,000+', lat: 59.9139, lng: 10.7522, radius: 60000 },
    // USA
    { name: 'NJ & New York', count: '5,000+', lat: 40.7128, lng: -74.0060, radius: 100000 },
  ];

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
        worldCopyJump={false}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
        minZoom={2}
      >
        <ZoomHandler />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png"
          attribution=""
          className="map-tiles-premium contrast-[105%] brightness-[102%]"
          noWrap={true}
        />

        {center && <ChangeView center={center} />}
        
        {showHeatmap && (
          <Fragment>
            {/* Organic Diaspora Outlines (Simulated Administrative Boundaries) */}
            {DIASPORA_REGIONS.map((region, idx) => {
              // Creating a rough irregular polygon around the center to simulate real city borders
              const points = 8;
              const coords: [number, number][] = [];
              for (let i = 0; i < points; i++) {
                const angle = (i * 360) / points;
                // Use a pseudo-random fixed offset based on idx to make it irregular but stable
                const seed = (idx * 1337 + i * 42) % 100;
                const offset = 0.85 + (seed / 400); // 0.85 to 1.1
                const r = region.radius * offset;
                const dx = (r / 111320) * Math.cos(angle * (Math.PI / 180));
                const dy = (r / (111320 * Math.cos(region.lat * (Math.PI / 180)))) * Math.sin(angle * (Math.PI / 180));
                coords.push([region.lat + dx, region.lng + dy]);
              }

              return (
                <Polygon
                  key={`zone-${idx}`}
                  positions={coords}
                  pathOptions={{
                    color: '#007AFF', // Solid administrative line
                    weight: 2,
                    opacity: 0.9,
                    fillColor: '#007AFF',
                    fillOpacity: 0.1,
                  }}
                  eventHandlers={{
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      setSelectedCountryInfo({ name: region.name, count: region.count });
                    }
                  }}
                />
              );
            })}

            <GeoJSON 
              data={diasporaBorders as any}
              style={{
                color: '#007AFF',
                weight: 2,
                opacity: 0.9,
                fillColor: '#007AFF',
                fillOpacity: 0.1,
              }}
              onEachFeature={(feature, layer) => {
                layer.on({
                  click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    const name = feature.properties.name || "Zone d'influence";
                    setSelectedCountryInfo({ name, count: "Forte concentration" });
                  }
                });
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

      {/* Demographic Insight Card (Premium Apple Style) */}
      <AnimatePresence>
        {selectedCountryInfo && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-6 inset-x-6 z-[1000] pointer-events-none"
          >
            <div className="max-w-md mx-auto glass-premium rounded-[2.5rem] p-6 border border-white/40 shadow-2xl flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue">
                  <Globe size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-1">Присутствие диаспоры</h4>
                  <div className="text-xl font-black text-text-primary tracking-tight">{selectedCountryInfo.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-brand-blue tracking-tighter">~{selectedCountryInfo.count}</div>
                <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-tight">Вайнех</div>
              </div>
              <button 
                onClick={() => setSelectedCountryInfo(null)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
