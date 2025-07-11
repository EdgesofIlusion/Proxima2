import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

interface MapProps {
  lieux: Lieu[];
}

const MapComponent: React.FC<MapProps> = ({ lieux }) => {
  return (
    <div style={{ height: '400px', width: '100%', marginTop: '1rem' }}>
      <MapContainer
        center={[46.603354, 1.888334]} // Centre de la France
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
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
      </MapContainer>
    </div>
  );
};

export default MapComponent;