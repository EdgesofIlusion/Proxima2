import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Lieu } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet avec React
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Icône différente pour le nouveau marqueur
const newMarkerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41" width="25" height="41">
      <path fill="#e74c3c" stroke="#000" stroke-width="1" d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z"/>
      <circle fill="#fff" cx="12.5" cy="12.5" r="7"/>
      <text x="12.5" y="17" font-family="Arial" font-size="12" text-anchor="middle" fill="#e74c3c">+</text>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface MapProps {
  lieux: Lieu[];
  onLocationSelect?: (lat: number, lng: number) => void;
  isSelecting?: boolean;
  selectedLocation?: { lat: number; lng: number } | null;
}

// Composant pour gérer les clics sur la carte
const LocationSelector = ({ onLocationSelect, isSelecting }: { 
  onLocationSelect?: (lat: number, lng: number) => void;
  isSelecting?: boolean;
}) => {
  useMapEvents({
    click: (e) => {
      if (isSelecting && onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const MapComponent: React.FC<MapProps> = ({ 
  lieux, 
  onLocationSelect, 
  isSelecting = false, 
  selectedLocation 
}) => {
  return (
    <div style={{ height: '400px', width: '100%', marginTop: '1rem' }}>
      <MapContainer
        center={[46.603354, 1.888334]} // Centre de la France
        zoom={6}
        style={{ 
          height: '100%', 
          width: '100%',
          cursor: isSelecting ? 'crosshair' : 'grab'
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        
        {/* Composant pour gérer les clics */}
        <LocationSelector onLocationSelect={onLocationSelect} isSelecting={isSelecting} />
        
        {/* Marqueurs des lieux existants */}
        {lieux.map(lieu => (
          <Marker key={lieu.id} position={[lieu.latitude, lieu.longitude]}>
            <Popup>
              <div>
                <strong>{lieu.titre}</strong><br />
                <em>{lieu.ville}</em><br />
                📍 {lieu.latitude.toFixed(4)}, {lieu.longitude.toFixed(4)}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Marqueur temporaire pour la sélection */}
        {isSelecting && selectedLocation && (
          <Marker 
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={newMarkerIcon}
          >
            <Popup>
              <div>
                <strong>📍 Nouveau lieu</strong><br />
                Position : {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}<br />
                <em>Cliquez ailleurs pour repositionner</em>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {isSelecting && (
        <div style={{
          backgroundColor: '#3498db',
          color: 'white',
          padding: '0.5rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          marginTop: '0.5rem',
	  marginBottom: '2rem',
          borderRadius: '4px'
        }}>
          🎯 Cliquez sur la carte pour choisir l'emplacement du lieu
          {selectedLocation && ' • Position sélectionnée !'}
        </div>
      )}
    </div>
  );
};

export default MapComponent;