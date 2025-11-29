import { useState, useEffect } from "react";
import API from "../../api/api";
import { ImageWithFallback } from "../../components/Shared/ImageWithFallback";
import { LocationSearchInput } from "../../components/Shared/LocationSearchInput";
import { ListingsMap } from "../../components/Shared/ListingsMap";
import {
  LocationIcon,
  MoneyIcon,
  HomeIcon,
  BedIcon,
  WifiIcon,
  StarIcon,
  HeartIcon
} from "../../components/Shared/Icons";

import "./styles/StudentDashboard.css";

export function StudentDashboard({ onViewDetails }) {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  const [location, setLocation] = useState("");
  const [searchLocation, setSearchLocation] = useState(null); // {latitude, longitude}
  const [distanceRadius, setDistanceRadius] = useState("any");
  const [budget, setBudget] = useState("any");
  const [roomType, setRoomType] = useState("any");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // ⭐ LOAD LISTINGS FROM BACKEND
  useEffect(() => {
    API.get("/student/listings")
      .then((res) => {
        const normalized = (res.data || []).map((l) => {
          // Convert amenities string → array
          if (typeof l.amenities === "string") {
            l.amenities = l.amenities
              ? l.amenities.split(",").map((a) => a.trim())
              : [];
          }
          return {
            ...l,
            image: l.image || "/placeholder.jpg",
            roomType: l.roomType || "N/A",
            distance: l.distance || "",
            location: l.location || "",
            title: l.title || "Untitled",
            rating: l.rating || 0,
            reviews: l.reviews || 0
          };
        });

        setListings(normalized);
        setFilteredListings(normalized);
      })
      .catch((err) => console.error("Error loading listings:", err));
  }, []);

  // ⭐ LOAD USER FAVORITES
  useEffect(() => {
    API.get("/student/favorites")
      .then((res) => {
        const favoriteIds = new Set((res.data || []).map(f => f.listingId));
        setFavorites(favoriteIds);
      })
      .catch((err) => {
        // User might not be logged in, ignore error
        console.log("Could not load favorites:", err.response?.status);
      });
  }, []);

  // ⭐ TOGGLE FAVORITE
  const toggleFavorite = async (e, listingId) => {
    e.stopPropagation(); // Prevent card click
    
    try {
      if (favorites.has(listingId)) {
        await API.delete(`/student/favorite/${listingId}`);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(listingId);
          return newSet;
        });
      } else {
        await API.post('/student/favorite', { listingId });
        setFavorites(prev => new Set([...prev, listingId]));
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Please log in as a student to save favorites");
      }
    }
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // ⭐ FILTER FUNCTION
  const filterListings = () => {
    let filtered = [...listings];

    // Distance-based location filter (when coordinates are available)
    if (searchLocation && distanceRadius !== "any") {
      const radiusKm = parseFloat(distanceRadius);
      filtered = filtered.filter((l) => {
        if (!l.latitude || !l.longitude) return false;
        const distance = calculateDistance(
          searchLocation.latitude, 
          searchLocation.longitude,
          l.latitude, 
          l.longitude
        );
        return distance <= radiusKm;
      });
    } else if (location.trim() && !searchLocation) {
      // Text-based location filter (fallback)
      filtered = filtered.filter(
        (l) =>
          l.location.toLowerCase().includes(location.toLowerCase()) ||
          l.title.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (budget !== "any") {
      filtered = filtered.filter((l) => {
        if (budget === "low") return l.price < 5000;
        if (budget === "mid") return l.price >= 5000 && l.price <= 10000;
        if (budget === "high") return l.price > 10000;
        return true;
      });
    }

    if (roomType !== "any") {
      filtered = filtered.filter(
        (l) => l.roomType.toLowerCase() === roomType.toLowerCase()
      );
    }

    return filtered;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTriggered(true);
    setFilteredListings(filterListings());
  };

  const handleClearSearch = () => {
    setLocation("");
    setSearchLocation(null);
    setDistanceRadius("any");
    setBudget("any");
    setRoomType("any");
    setSearchTriggered(false);
    setShowMap(false);
    setFilteredListings(listings);
  };

  // Handle location selection from search
  const handleLocationSelect = (locationData) => {
    if (locationData) {
      setSearchLocation({
        latitude: locationData.latitude,
        longitude: locationData.longitude
      });
      setLocation(locationData.address);
    } else {
      setSearchLocation(null);
    }
  };

  return (
    <div className="search-map-page">
      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Find Your Perfect Student Housing</h1>
            <p>
              Discover comfortable, affordable boarding houses near your
              university. Safe, verified, and student-friendly accommodations.
            </p>
          </div>

          {/* SEARCH BOX */}
          <div className="card search-card">
            <div className="card-content">
              <form className="search-grid" onSubmit={handleSearch}>
                <div className="search-grid-item" style={{ flexGrow: 2 }}>
                  <label className="form-label">Location</label>
                  <LocationSearchInput
                    value={location}
                    onChange={setLocation}
                    onLocationSelect={handleLocationSelect}
                    placeholder="Search for an address or area..."
                  />
                </div>

                <div className="search-grid-item">
                  <label className="form-label">Distance Radius</label>
                  <select
                    className="select"
                    value={distanceRadius}
                    onChange={(e) => setDistanceRadius(e.target.value)}
                    disabled={!searchLocation}
                    title={!searchLocation ? "Select a location first to enable distance filtering" : ""}
                  >
                    <option value="any">Any Distance</option>
                    <option value="1">Within 1 km</option>
                    <option value="3">Within 3 km</option>
                    <option value="5">Within 5 km</option>
                    <option value="10">Within 10 km</option>
                  </select>
                </div>

                <div className="search-grid-item">
                  <label className="form-label">Budget</label>
                  <select
                    className="select"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  >
                    <option value="any">Any Budget</option>
                    <option value="low">Under ₱5,000</option>
                    <option value="mid">₱5,000 - ₱10,000</option>
                    <option value="high">₱10,000+</option>
                  </select>
                </div>

                <div className="search-grid-item-button">
                  <button
                    type="submit"
                    className="button button-primary button-full-width"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* LISTINGS SECTION */}
      <div className="featured-listings-section">
        <div className="container">
          <div className="section-header">
            <div className="section-header-left">
              <h2>
                {searchTriggered ? "Search Results" : "Featured Boarding Houses"}
              </h2>
              <p className="text-muted">
                {searchTriggered
                  ? `Found ${filteredListings.length} ${
                      filteredListings.length === 1
                        ? "property"
                        : "properties"
                    }${searchLocation && distanceRadius !== "any" ? ` within ${distanceRadius} km` : ""}`
                  : "Popular choices among students"}
              </p>
            </div>
            <div className="section-header-right">
              <button
                type="button"
                className={`button ${showMap ? 'button-primary' : 'button-secondary'}`}
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>
          </div>

          {/* MAP VIEW */}
          {showMap && (
            <div className="listings-map-wrapper">
              <ListingsMap
                listings={filteredListings}
                searchLocation={searchLocation}
                searchRadius={distanceRadius !== "any" ? parseFloat(distanceRadius) : null}
                onListingClick={onViewDetails}
                height="400px"
              />
            </div>
          )}

          {/* SHOW LISTINGS */}
          <div className="grid-3-col">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="card listing-card card-hover"
                onClick={() => onViewDetails(listing.id)}
              >
                <div className="listing-image-wrapper">
                  <ImageWithFallback
                    src={listing.image}
                    alt={listing.title}
                    className="listing-image"
                  />
                  <span className="badge featured-badge">Featured</span>
                  <button 
                    className={`favorite-button ${favorites.has(listing.id) ? 'active' : ''}`}
                    onClick={(e) => toggleFavorite(e, listing.id)}
                  >
                    <HeartIcon 
                      size={18} 
                      color="#ef4444" 
                      fill={favorites.has(listing.id) ? "#ef4444" : "none"} 
                    />
                  </button>
                </div>

                <div className="listing-card-content">
                  <div className="listing-info-header">
                    <h3>{listing.title}</h3>

                    <div className="listing-info">
                      <span className="icon">
                        <LocationIcon size={16} />
                      </span>{" "}
                      {listing.location}
                    </div>

                    <div className="listing-info">
                      <span className="icon">
                        <HomeIcon size={16} />
                      </span>{" "}
                      {listing.distance}
                    </div>
                  </div>

                  <div className="listing-amenities">
                    <div className="listing-amenity-item">
                      <span className="icon">
                        <BedIcon size={16} />
                      </span>
                      <span>{listing.roomType}</span>
                    </div>

                    <div className="listing-amenity-item">
                      <span className="icon">
                        <WifiIcon size={16} />
                      </span>
                      <span>WiFi</span>
                    </div>

                    <div className="listing-amenity-item listing-rating">
                      <span className="icon">
                        <StarIcon size={16} fill="#FFD700" />
                      </span>
                      <span>{listing.rating}</span>
                      <span className="text-muted">({listing.reviews})</span>
                    </div>
                  </div>

                  <div className="listing-card-footer">
                    <div className="listing-price">
                      <span className="price">₱{listing.price}</span>
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

          {/* NO RESULTS */}
          {filteredListings.length === 0 && (
            <div className="no-results-box">
              <h3>No properties found</h3>
              <button
                onClick={handleClearSearch}
                className="button button-primary"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>© 2025 BoardingHouseFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}