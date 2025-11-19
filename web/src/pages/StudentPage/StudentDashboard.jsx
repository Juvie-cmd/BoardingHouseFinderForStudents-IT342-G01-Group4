// src/pages/StudentPage/SearchMap.jsx

import { useState } from 'react';
// Corrected import paths (two levels up)
import { listings } from '../../data/listings';
import { ImageWithFallback } from '../../components/Shared/ImageWithFallback';
import { LocationIcon, MoneyIcon, HomeIcon, BedIcon, WifiIcon, StarIcon, HeartIcon } from '../../components/Shared/Icons';
import './styles/StudentDashboard.css';


export function StudentDashboard({ onViewDetails }) {
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [roomType, setRoomType] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Filter listings based on search criteria
  const filterListings = () => {
    let filtered = [...listings];

    // Filter by location (search in title and location)
    if (location.trim()) {
      filtered = filtered.filter(listing =>
        listing.location.toLowerCase().includes(location.toLowerCase()) ||
        listing.title.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by budget
    if (budget && budget !== 'any') {
      filtered = filtered.filter(listing => {
        const price = listing.price;
        if (budget === 'low') return price < 5000;
        if (budget === 'mid') return price >= 5000 && price <= 10000;
        if (budget === 'high') return price > 10000;
        return true;
      });
    }

    // Filter by room type
    if (roomType && roomType !== 'any') {
      filtered = filtered.filter(listing =>
        listing.roomType.toLowerCase() === roomType.toLowerCase()
      );
    }

    return filtered;
  };

  // Get filtered or featured listings - show all 15 listings when not searching
  const displayListings = searchTriggered ? filterListings() : listings;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTriggered(true);
  };

  const handleClearSearch = () => {
    setLocation('');
    setBudget('');
    setRoomType('');
    setSearchTriggered(false);
  };

  return (
    <div className="search-map-page">
      {/* Hero Section - Blue Background */}
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Find Your Perfect Student Housing</h1>
            <p>
              Discover comfortable, affordable boarding houses near your university. Safe, verified, and student-friendly accommodations.
            </p>
          </div>

          {/* White Search Box */}
          <div className="card search-card">
            <div className="card-content">
              <form className="search-grid" onSubmit={handleSearch}>
                <div className="search-grid-item" style={{ flexGrow: 2 }}>
                  <label className="form-label">Location</label>
                  <div className="search-grid-item-icon-wrapper">
                    <span className="icon"><LocationIcon size={18} /></span>
                    <input
                      placeholder="Enter an address or area"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="input input-with-icon"
                    />
                  </div>
                </div>

                <div className="search-grid-item">
                  <label className="form-label">Budget</label>
                  <select className="select" value={budget} onChange={(e) => setBudget(e.target.value)}>
                    <option value="any">Any Budget</option>
                    <option value="low">Under ₱5,000</option>
                    <option value="mid">₱5,000 - ₱10,000</option>
                    <option value="high">₱10,000+</option>
                  </select>
                </div>

                <div className="search-grid-item-button">
                  <button type="submit" className="button button-primary button-full-width">
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      {/* <div className="why-choose-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Boarding House Finder?</h2>
            <p className="text-muted">We make finding student housing hassle-free, safe, and stress-free</p>
          </div>

          <div className="grid-3-col">
            <div className="feature-item">
              <div className="feature-icon-wrapper blue">🛡️</div>
              <h3>Verified Properties</h3>
              <p>All listings are verified and inspected for safety and comfort standards</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrapper green">✔️</div>
              <h3>Student Focused</h3>
              <p>Designed specifically for students with study-friendly environments</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrapper purple">📍</div>
              <h3>Near Universities</h3>
              <p>All properties are conveniently located near major universities</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Featured Listings */}
      <div className="featured-listings-section">
        <div className="container">
          <div className="section-header">
            <h2>{searchTriggered ? 'Search Results' : 'Featured Boarding Houses'}</h2>
            <p className="text-muted">
              {searchTriggered
                ? `Found ${displayListings.length} ${displayListings.length === 1 ? 'property' : 'properties'}`
                : 'Popular choices among students'
              }
            </p>
          </div>

          {searchTriggered && displayListings.length > 0 && (
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={handleClearSearch}
                className="button button-secondary button-small"
              >
                Clear Search
              </button>
              {location && <span className="badge badge-outline"><LocationIcon size={14} /> {location}</span>}
              {budget && budget !== 'any' && (
                <span className="badge badge-outline">
                  <MoneyIcon size={14} /> {budget === 'low' ? 'Under ₱5,000' : budget === 'mid' ? '₱5,000-₱10,000' : '₱10,000+'}
                </span>
              )}
            </div>
          )}

          {displayListings.length === 0 && searchTriggered ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <h3>No properties found</h3>
              <p className="text-muted">Try adjusting your search criteria</p>
              <button
                onClick={handleClearSearch}
                className="button button-primary"
                style={{ marginTop: '1rem' }}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid-3-col">
              {displayListings.map((listing) => (
              <div key={listing.id} className="card listing-card card-hover" onClick={() => onViewDetails(listing.id)}>
                <div className="listing-image-wrapper">
                  <ImageWithFallback
                    src={listing.image}
                    alt={listing.title}
                    className="listing-image"
                  />
                  <span className="badge" style={{position: 'absolute', top: '0.75rem', left: '0.75rem', backgroundColor: 'var(--green-color)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem'}}>Featured</span>
                  <button className="favorite-button"><HeartIcon size={18} color="#ef4444" /></button>
                </div>

                <div className="listing-card-content">
                  <div className="listing-info-header">
                    <h3>{listing.title}</h3>
                    <div className="listing-info">
                      <span className="icon"><LocationIcon size={16} /></span> {listing.location}
                    </div>
                    <div className="listing-info">
                      <span className="icon"><HomeIcon size={16} /></span> {listing.distance} from campus
                    </div>
                  </div>

                  <div className="listing-amenities">
                    <div className="listing-amenity-item">
                      <span className="icon"><BedIcon size={16} /></span>
                      <span>{listing.roomType}</span>
                    </div>
                    <div className="listing-amenity-item">
                      <span className="icon"><WifiIcon size={16} /></span>
                      <span>WiFi</span>
                    </div>
                    <div className="listing-amenity-item listing-rating">
                      <span className="icon"><StarIcon size={16} fill="#FFD700" color="#FFD700" /></span>
                      <span>{listing.rating}</span>
                      <span className="text-muted">({listing.reviews})</span>
                    </div>
                  </div>

                  <div className="listing-card-footer">
                    <div className="listing-price">
                      <span className="price">₱{listing.price.toLocaleString()}</span>
                      <span className="period">/month</span>
                    </div>
                    <button
                      onClick={() => onViewDetails(listing.id)}
                      className="button button-primary"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      {/* <div className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p className="text-muted">
              Find your perfect student housing in 3 simple steps
            </p>
          </div>

          <div className="grid-3-col">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3>Search & Filter</h3>
              <p>Use our advanced search to find properties that match your budget, location, and preferences</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h3>Visit & Compare</h3>
              <p>Schedule visits to your favorite properties and compare amenities, locations, and prices</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h3>Book & Move In</h3>
              <p>Complete your booking online and get ready to move into your new student housing</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Footer from original file */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>BoardingHouseFinder</h4>
              <p>Making student housing search safe, comfortable, and affordable since 2025.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 BoardingHouseFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}