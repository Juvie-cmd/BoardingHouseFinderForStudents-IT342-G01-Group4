import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * MapClickHandler Component
 * Handles click events on the map to open Google Maps
 */
function MapClickHandler({ location }) {
  useMapEvents({
    click: () => {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
      window.open(googleMapsUrl, '_blank');
    },
  });
  return null;
}

/**
 * LocationMap Component
 *
 * Displays an interactive map with a marker for a location
 * Clicking anywhere on the map opens Google Maps
 *
 * @param {Object} props
 * @param {string} props.location - Address or location name
 * @param {Array} props.coordinates - [latitude, longitude] array
 * @param {string} props.title - Title for the marker popup
 */
export function LocationMap({ location, coordinates = [10.3157, 123.8854], title }) {
  // Default coordinates: Cebu City, Philippines
  const position = coordinates;

  const handleOpenMaps = () => {
    // Open location in Google Maps using the address
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="location-map-container">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', borderRadius: '8px', cursor: 'pointer' }}
      >
        <MapClickHandler location={location} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={position}
          eventHandlers={{
            click: handleOpenMaps,
          }}
        >
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <strong>{title}</strong>
              <br />
              <small>{location}</small>
              <br />
              <button
                onClick={handleOpenMaps}
                style={{
                  marginTop: '8px',
                  padding: '4px 12px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Open in Google Maps
              </button>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="map-overlay-info" onClick={handleOpenMaps} style={{ cursor: 'pointer' }}>
        <span className="icon">📍</span>
        <span>{location}</span>
      </div>
    </div>
  );
}
