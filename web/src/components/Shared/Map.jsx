// src/components/Shared/Map.jsx

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom SVG icon for map marker
const customIcon = L.divIcon({
  className: 'custom-marker-icon',
  html: `
    <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16C0 27.5 16 42 16 42C16 42 32 27.5 32 16C32 7.163 24.837 0 16 0Z" fill="#FF4444"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
});

export function Map({ coordinates, title, location }) {
  // Default to Cebu City center if no coordinates provided
  const position = coordinates && coordinates.length === 2
    ? coordinates
    : [10.3157, 123.8854]; // Cebu City center

  return (
    <div className="map-container">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <strong>{title}</strong><br />
            {location}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
