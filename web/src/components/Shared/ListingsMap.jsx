// src/components/Shared/ListingsMap.jsx

import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import './styles/ListingsMap.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom SVG icon for listing markers
const listingIcon = L.divIcon({
  className: 'custom-listing-marker',
  html: `
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#3b82f6"/>
      <circle cx="14" cy="14" r="5" fill="white"/>
    </svg>
  `,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -36],
});

// Custom icon for user's search location
const searchLocationIcon = L.divIcon({
  className: 'search-location-marker',
  html: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#ef4444" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Component to handle map centering
function MapCenterHandler({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  
  return null;
}

// Component to fit bounds to all markers
function FitBoundsHandler({ listings, searchLocation }) {
  const map = useMap();
  
  useEffect(() => {
    const points = [];
    
    if (searchLocation) {
      points.push([searchLocation.latitude, searchLocation.longitude]);
    }
    
    listings.forEach(listing => {
      if (listing.latitude && listing.longitude) {
        points.push([listing.latitude, listing.longitude]);
      }
    });
    
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [listings, searchLocation, map]);
  
  return null;
}

/**
 * ListingsMap Component
 * 
 * Displays an interactive map with markers for all listings
 * 
 * @param {Object} props
 * @param {Array} props.listings - Array of listing objects with latitude/longitude
 * @param {Object} props.searchLocation - Optional user search location {latitude, longitude}
 * @param {number} props.searchRadius - Optional search radius in km
 * @param {Function} props.onListingClick - Callback when a listing marker is clicked
 */
export function ListingsMap({ 
  listings = [], 
  searchLocation = null,
  searchRadius = null,
  onListingClick,
  height = '400px',
  className = ''
}) {
  // Default center (Cebu City, Philippines)
  const defaultCenter = [10.3157, 123.8854];
  
  // Calculate center based on search location or listings
  const getCenter = () => {
    if (searchLocation && searchLocation.latitude && searchLocation.longitude) {
      return [searchLocation.latitude, searchLocation.longitude];
    }
    
    const validListings = listings.filter(l => l.latitude && l.longitude);
    if (validListings.length > 0) {
      const avgLat = validListings.reduce((sum, l) => sum + l.latitude, 0) / validListings.length;
      const avgLon = validListings.reduce((sum, l) => sum + l.longitude, 0) / validListings.length;
      return [avgLat, avgLon];
    }
    
    return defaultCenter;
  };

  const center = getCenter();
  const validListings = listings.filter(l => l.latitude && l.longitude);

  return (
    <div className={`listings-map-container ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Fit bounds to show all markers */}
        {(validListings.length > 0 || searchLocation) && (
          <FitBoundsHandler listings={validListings} searchLocation={searchLocation} />
        )}

        {/* Search location marker and radius circle */}
        {searchLocation && searchLocation.latitude && searchLocation.longitude && (
          <>
            <Marker 
              position={[searchLocation.latitude, searchLocation.longitude]}
              icon={searchLocationIcon}
            >
              <Popup>
                <div className="search-location-popup">
                  <strong>Your Search Location</strong>
                  {searchRadius && (
                    <p>Search radius: {searchRadius} km</p>
                  )}
                </div>
              </Popup>
            </Marker>
            
            {/* Search radius circle */}
            {searchRadius && (
              <Circle
                center={[searchLocation.latitude, searchLocation.longitude]}
                radius={searchRadius * 1000} // Convert km to meters
                pathOptions={{
                  color: '#3b82f6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.1,
                  weight: 2
                }}
              />
            )}
          </>
        )}

        {/* Listing markers */}
        {validListings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.latitude, listing.longitude]}
            icon={listingIcon}
            eventHandlers={{
              click: () => onListingClick && onListingClick(listing.id)
            }}
          >
            <Popup>
              <div className="listing-popup">
                {listing.image && (
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="listing-popup-image"
                  />
                )}
                <div className="listing-popup-content">
                  <h4>{listing.title}</h4>
                  <p className="listing-popup-location">{listing.location}</p>
                  <p className="listing-popup-price">₱{listing.price}/month</p>
                  {onListingClick && (
                    <button 
                      className="listing-popup-button"
                      onClick={() => onListingClick(listing.id)}
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map legend */}
      <div className="listings-map-legend">
        <div className="legend-item">
          <span className="legend-marker listing"></span>
          <span>Listings ({validListings.length})</span>
        </div>
        {searchLocation && (
          <div className="legend-item">
            <span className="legend-marker search"></span>
            <span>Your Location</span>
          </div>
        )}
      </div>
    </div>
  );
}
