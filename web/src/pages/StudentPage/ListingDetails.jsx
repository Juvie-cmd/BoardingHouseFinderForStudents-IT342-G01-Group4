// src/pages/StudentPage/ListingDetails.jsx
import { useState, useEffect } from 'react';
import API from '../../api/api';
import { ImageWithFallback } from '../../components/Shared/ImageWithFallback';
import { Map } from '../../components/Shared/Map';
import { LinkIcon, StarIcon, UsersIcon, CalendarIcon, CheckIcon, LocationIcon, ArrowLeftIcon } from '../../components/Shared/Icons';
import './styles/ListingDetails.css';

export function ListingDetails({ listingId, onBack }) {
  const [listing, setListing] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!listingId) {
      setError("No listing id provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    API.get(`/student/listing/${listingId}`)
      .then((res) => {
        const data = res.data;
        // convert amenities from comma string to array if needed
        if (typeof data.amenities === 'string') {
          data.amenities = data.amenities ? data.amenities.split(',').map(s => s.trim()) : [];
        }
        // ensure coordinates shape for Map component
        if (data.latitude && data.longitude) {
          data.coordinates = [data.latitude, data.longitude];
        } else if (!data.coordinates) {
          data.coordinates = [0, 0];
        }
        setListing(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load listing', err);
        setError('Failed to load listing');
      })
      .finally(() => setLoading(false));
  }, [listingId]);

  if (loading) {
    return (
      <div className="details-page">
        <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
          <p>Loading listing...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="details-page" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <h2>{error || 'Listing not found'}</h2>
          <button onClick={onBack} className="button button-primary">Back to Search</button>
        </div>
      </div>
    );
  }

  // build images (backend may provide only one image)
  const images = [listing.image, ...(listing.imageList ? listing.imageList.split(',') : [])].filter(Boolean);

  return (
    <div className="details-page">
      <div className="details-header-bar">
        <div className="container">
          <button variant="ghost" onClick={onBack} className="details-back-button">
            <span className="icon"><ArrowLeftIcon size={16} /></span>
            Back to Search
          </button>
        </div>
      </div>

      <div className="container">
        <div className="details-grid">
          <div className="details-main-col">
            {/* Image Gallery */}
            <div className="card gallery-card">
              <div className="gallery-main-image-wrapper">
                <ImageWithFallback
                  src={images[selectedImage] || listing.image}
                  alt={listing.title}
                  className="gallery-main-image"
                />
                <div className="gallery-actions">
                  <button
                    className={`button button-secondary button-icon favorite-button ${isFavorite ? 'active' : ''}`}
                    onClick={() => setIsFavorite(!isFavorite)}
                  />
                  <button className="button button-secondary button-icon">
                    <span className="icon"><LinkIcon size={16} /></span>
                  </button>
                </div>
                {listing.available && (
                  <span className="badge">Available Now</span>
                )}
              </div>

              <div className="gallery-thumbnails">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`gallery-thumbnail ${selectedImage === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${listing.title} - ${idx + 1}`}
                      className="gallery-thumbnail-image"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="card details-content-card">
              <div className="details-header">
                <div className="details-header-info">
                  <h1>{listing.title}</h1>
                  <div className="rating">
                    <span className="icon"><StarIcon size={16} fill="#FFD700" color="#FFD700" /></span>
                    <span>{listing.rating}</span>
                    <span className="light-text">({listing.reviews} reviews)</span>
                  </div>
                </div>
                <div className="details-header-price">
                  <div className="price">₱{listing.price}</div>
                  <div className="period">per month</div>
                </div>
              </div>

              <hr className="separator" />

              <div className="details-section">
                <h3>Room Details</h3>
                <div className="details-grid-2-col">
                  <div className="details-item">
                    <div className="label">Room Type</div>
                    <div className="value">
                      <span className="icon"><UsersIcon size={16} /></span>
                      <span>{listing.roomType}</span>
                    </div>
                  </div>
                  <div className="details-item">
                    <div className="label">Available From</div>
                    <div className="value">
                      <span className="icon"><CalendarIcon size={16} /></span>
                      <span>{listing.availableFrom || 'Immediate'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="separator" />

              <div className="details-section">
                <h3>Amenities</h3>
                <div className="details-grid-2-col">
                  {Array.isArray(listing.amenities) ? listing.amenities.map((amenity) => (
                    <div key={amenity} className="amenity-item">
                      <span className="icon"><CheckIcon size={16} color="#22c55e" /></span>
                      <span>{amenity}</span>
                    </div>
                  )) : <div className="text-muted">No amenities listed</div>}
                </div>
              </div>

              <hr className="separator" />

              {/* Tabs */}
              <div className="tabs">
                <div className="tabs-list">
                  <button onClick={() => setActiveTab('description')} className={activeTab === 'description' ? 'active' : ''}>Description</button>
                  <button onClick={() => setActiveTab('rules')} className={activeTab === 'rules' ? 'active' : ''}>House Rules</button>
                  <button onClick={() => setActiveTab('location')} className={activeTab === 'location' ? 'active' : ''}>Location</button>
                </div>

                <div className="tabs-content">
                  {activeTab === 'description' && (
                    <div className="description-content">
                      <p>{listing.description || 'No description available.'}</p>
                    </div>
                  )}
                  {activeTab === 'rules' && (
                    <div className="rules-content">
                      <div className="house-rule-item">
                        <span className="icon"><CheckIcon size={16} color="#22c55e" /></span>
                        <span>No smoking inside the premises</span>
                      </div>
                      <div className="house-rule-item">
                        <span className="icon"><CheckIcon size={16} color="#22c55e" /></span>
                        <span>Guests allowed with prior notice</span>
                      </div>
                    </div>
                  )}
                  {activeTab === 'location' && (
                    <div className="location-content">
                      <div className="location-info">
                        <h4>Address</h4>
                        <p>{listing.location}</p>
                        <h4 style={{ marginTop: '1rem' }}>Nearby Schools</h4>
                        <p>{listing.nearbySchools}</p>
                        <p className="distance-info">
                          <span className="icon"><LocationIcon size={16} /></span>
                          <span>{listing.distance}</span>
                        </p>
                      </div>
                      <Map
                        coordinates={listing.coordinates}
                        title={listing.title}
                        location={listing.location}
                      />
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          <div className="details-sidebar">
            {/* Contact Card */}
            <div className="card contact-card">
              <div className="landlord-info">
                <div className="avatar">LL</div>
                <div>
                  <div className="name">{listing.landlord?.name || 'Landlord Name'}</div>
                  <div className="role">Property Owner</div>
                </div>
              </div>

              <hr className="separator" />

              <div className="contact-buttons">
                <button className="button button-primary button-full-width">Send Message</button>
                <button className="button button-secondary button-full-width">Call</button>
                <button className="button button-secondary button-full-width">Email</button>
              </div>

              <hr className="separator" />

              <form className="visit-form" onSubmit={(e) => { e.preventDefault(); alert('Visit requested (demo)'); }}>
                <h4>Schedule a Visit</h4>
                <div className="form-group">
                  <label htmlFor="visit-date">Preferred Date</label>
                  <input id="visit-date" type="date" className="input" />
                </div>
                <div className="form-group">
                  <label htmlFor="visit-time">Preferred Time</label>
                  <input id="visit-time" type="time" className="input" />
                </div>
                <div className="form-group">
                  <label htmlFor="visit-notes">Additional Notes</label>
                  <textarea id="visit-notes" placeholder="Any specific requirements..." rows={3} className="textarea" />
                </div>
                <button type="submit" className="button button-primary button-full-width">Request Visit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
