// src/components/Shared/LocationPicker.jsx

import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationSearchInput } from './LocationSearchInput';
import { LocationIcon } from './Icons';
import './styles/LocationPicker.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const markerIcon = L.divIcon({
  className: 'location-picker-marker',
  html: `
    <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16C0 27.5 16 42 16 42C16 42 32 27.5 32 16C32 7.163 24.837 0 16 0Z" fill="#ef4444"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
});

// Component to handle map click events
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      
      // Reverse geocode to get address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          { headers: { 'Accept': 'application/json' } }
        );
        
        if (response.ok) {
          const data = await response.json();
          onLocationSelect({
            address: data.display_name || '',
            latitude: lat,
            longitude: lng
          });
        } else {
          onLocationSelect({
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            latitude: lat,
            longitude: lng
          });
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error);
        onLocationSelect({
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          latitude: lat,
          longitude: lng
        });
      }
    }
  });
  
  return null;
}

// Component to handle map centering when location changes
function MapCenterHandler({ position }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
  }, [position, map]);
  
  return null;
}

/**
 * LocationPicker Component
 * 
 * Allows users to search for a location or click on the map to select coordinates
 * 
 * @param {Object} props
 * @param {string} props.address - Current address value
 * @param {number} props.latitude - Current latitude value
 * @param {number} props.longitude - Current longitude value
 * @param {Function} props.onLocationChange - Callback when location changes
 */
export function LocationPicker({ 
  address = '',
  latitude = null,
  longitude = null,
  onLocationChange,
  className = ''
}) {
  const [mapCenter, setMapCenter] = useState([10.3157, 123.8854]); // Default: Cebu City
  const [markerPosition, setMarkerPosition] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(address);

  // Initialize marker position from props
  useEffect(() => {
    if (latitude && longitude) {
      const newPos = [latitude, longitude];
      setMarkerPosition(newPos);
      setMapCenter(newPos);
    }
  }, [latitude, longitude]);

  // Update address from props
  useEffect(() => {
    setCurrentAddress(address);
  }, [address]);

  // Handle location selection (from search or map click)
  const handleLocationSelect = useCallback((location) => {
    if (location) {
      const newPos = [location.latitude, location.longitude];
      setMarkerPosition(newPos);
      setMapCenter(newPos);
      setCurrentAddress(location.address);
      
      if (onLocationChange) {
        onLocationChange({
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude
        });
      }
    }
  }, [onLocationChange]);

  // Handle address text change
  const handleAddressChange = (newAddress) => {
    setCurrentAddress(newAddress);
    if (onLocationChange) {
      onLocationChange({
        address: newAddress,
        latitude: markerPosition ? markerPosition[0] : null,
        longitude: markerPosition ? markerPosition[1] : null
      });
    }
  };

  // Clear location
  const handleClear = () => {
    setMarkerPosition(null);
    setCurrentAddress('');
    setMapCenter([10.3157, 123.8854]);
    
    if (onLocationChange) {
      onLocationChange({
        address: '',
        latitude: null,
        longitude: null
      });
    }
  };

  return (
    <div className={`location-picker ${className}`}>
      <div className="location-picker-search">
        <LocationSearchInput
          value={currentAddress}
          onChange={handleAddressChange}
          onLocationSelect={handleLocationSelect}
          placeholder="Search for an address or click on the map..."
        />
      </div>

      <div className="location-picker-map">
        <MapContainer
          center={mapCenter}
          zoom={14}
          style={{ height: '300px', width: '100%', borderRadius: '8px' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          <MapCenterHandler position={markerPosition} />
          
          {markerPosition && (
            <Marker position={markerPosition} icon={markerIcon} />
          )}
        </MapContainer>
        
        <p className="location-picker-hint">
          <LocationIcon size={14} />
          Click on the map to set the exact location
        </p>
      </div>

      {markerPosition && (
        <div className="location-picker-coords">
          <div className="coords-info">
            <span className="coords-label">Coordinates:</span>
            <span className="coords-value">
              {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
            </span>
          </div>
          <button 
            type="button" 
            className="button button-secondary button-sm"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
