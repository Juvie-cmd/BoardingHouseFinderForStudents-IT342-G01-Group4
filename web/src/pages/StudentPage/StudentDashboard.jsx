import { useState, useEffect, useCallback } from "react";
import API from "../../api/api";
import { ImageWithFallback } from "../../components/Shared/ImageWithFallback";
import { LocationSearchInput } from "../../components/Shared/LocationSearchInput";
import { ListingsMap } from "../../components/Shared/ListingsMap";
import { useToast } from "../../components/UI";
import { useListingSync, useInquirySync, useFavoriteSync } from "../../hooks/useRealtimeSync";
import {
  LocationIcon,
  HomeIcon,
  BedIcon,
  WifiIcon,
  StarIcon,
  HeartIcon,
  MessageIcon,
  CalendarIcon
} from "../../components/Shared/Icons";

import "./styles/StudentDashboard.css";

export function StudentDashboard({ onViewDetails }) {
  const toast = useToast();
  // Tab state
  const [activeTab, setActiveTab] = useState("search");

  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  
  // Favorites data with full listing details
  const [favoritesData, setFavoritesData] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  
  // Inquiries data
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);

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

  // ⭐ LOAD USER FAVORITES (for heart icon state)
  useEffect(() => {
    API.get("/student/favorites")
      .then((res) => {
        const data = res.data || [];
        const favoriteIds = new Set(data.map(f => f.listingId));
        setFavorites(favoriteIds);
        // Also set favoritesData for use in favorites tab
        setFavoritesData(data);
      })
      .catch((err) => {
        // User might not be logged in, ignore error
        console.log("Could not load favorites:", err.response?.status);
      });
  }, []);

  // ⭐ REFRESH FAVORITES DATA when My Favorites tab becomes active
  useEffect(() => {
    if (activeTab === "favorites") {
      setFavoritesLoading(true);
      API.get("/student/favorites")
        .then((res) => {
          const data = res.data || [];
          setFavoritesData(data);
          // Keep favorites set in sync
          setFavorites(new Set(data.map(f => f.listingId)));
        })
        .catch((err) => {
          console.error("Error loading favorites data:", err);
        })
        .finally(() => {
          setFavoritesLoading(false);
        });
    }
  }, [activeTab]);

  // ⭐ LOAD INQUIRIES when My Inquiries tab is active
  useEffect(() => {
    if (activeTab === "inquiries") {
      setInquiriesLoading(true);
      API.get("/student/inquiries")
        .then((res) => {
          setInquiries(res.data || []);
        })
        .catch((err) => {
          console.error("Error loading inquiries:", err);
        })
        .finally(() => {
          setInquiriesLoading(false);
        });
    }
  }, [activeTab]);

  // ⭐ REAL-TIME SYNC - Refresh data when changes happen in other tabs
  const refreshListings = useCallback(() => {
    API.get("/student/listings")
      .then((res) => {
        const normalized = (res.data || []).map((l) => {
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
      .catch((err) => console.error("Error refreshing listings:", err));
  }, []);

  const refreshFavorites = useCallback(() => {
    API.get("/student/favorites")
      .then((res) => {
        const data = res.data || [];
        setFavoritesData(data);
        setFavorites(new Set(data.map(f => f.listingId)));
      })
      .catch((err) => console.error("Error refreshing favorites:", err));
  }, []);

  const refreshInquiries = useCallback(() => {
    if (activeTab === "inquiries") {
      API.get("/student/inquiries")
        .then((res) => setInquiries(res.data || []))
        .catch((err) => console.error("Error refreshing inquiries:", err));
    }
  }, [activeTab]);

  // Set up real-time sync listeners
  const { broadcastAdd: broadcastFavoriteAdd, broadcastRemove: broadcastFavoriteRemove } = useFavoriteSync(refreshFavorites);
  useListingSync(refreshListings);
  const { broadcastCreate: broadcastInquiryCreate } = useInquirySync(refreshInquiries);

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
        // Also update favoritesData if on favorites tab
        setFavoritesData(prev => prev.filter(f => f.listingId !== listingId));
        // Broadcast favorite removal to other tabs
        broadcastFavoriteRemove(listingId);
      } else {
        await API.post('/student/favorite', { listingId });
        setFavorites(prev => new Set([...prev, listingId]));
        // Broadcast favorite addition to other tabs
        broadcastFavoriteAdd(listingId);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.warning("Please log in as a student to save favorites");
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'REPLIED': return 'badge-success';
      case 'NEW': return 'badge-primary';
      case 'SCHEDULED': return 'badge-warning';
      case 'CLOSED': return 'badge-secondary';
      default: return 'badge-primary';
    }
  };

  // Get inquiry type badge class
  const getTypeBadgeClass = (type) => {
    return type === 'VISIT_REQUEST' ? 'badge-warning' : 'badge-primary';
  };

  return (
    <div className="search-map-page">
      {/* NAVIGATION TABS */}
      <div className="dashboard-tabs-wrapper">
        <div className="container">
          <div className="dashboard-tabs">
            <button
              className={`dashboard-tab ${activeTab === "search" ? "active" : ""}`}
              onClick={() => setActiveTab("search")}
            >
              Search
            </button>
            <button
              className={`dashboard-tab ${activeTab === "favorites" ? "active" : ""}`}
              onClick={() => setActiveTab("favorites")}
            >
              <HeartIcon size={16} />
              My Favorites
              {favorites.size > 0 && (
                <span className="tab-badge">{favorites.size}</span>
              )}
            </button>
            <button
              className={`dashboard-tab ${activeTab === "inquiries" ? "active" : ""}`}
              onClick={() => setActiveTab("inquiries")}
            >
              <MessageIcon size={16} />
              My Inquiries
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH TAB CONTENT */}
      {activeTab === "search" && (
        <>
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
        </>
      )}

      {/* MY FAVORITES TAB CONTENT */}
      {activeTab === "favorites" && (
        <div className="favorites-section">
          <div className="container">
            <div className="section-header">
              <div className="section-header-left">
                <h2>My Favorites</h2>
                <p className="text-muted">
                  {favoritesData.length} saved {favoritesData.length === 1 ? 'listing' : 'listings'}
                </p>
              </div>
            </div>

            {favoritesLoading ? (
              <div className="loading-state">
                <p>Loading your favorites...</p>
              </div>
            ) : favoritesData.length > 0 ? (
              <div className="grid-3-col">
                {favoritesData.map((fav) => (
                  <div
                    key={fav.id}
                    className="card listing-card card-hover"
                    onClick={() => onViewDetails(fav.listingId)}
                  >
                    <div className="listing-image-wrapper">
                      <ImageWithFallback
                        src={fav.listingImage}
                        alt={fav.listingTitle}
                        className="listing-image"
                      />
                      <button 
                        className="favorite-button active"
                        onClick={(e) => toggleFavorite(e, fav.listingId)}
                        title="Remove from favorites"
                      >
                        <HeartIcon 
                          size={18} 
                          color="#ef4444" 
                          fill="#ef4444"
                        />
                      </button>
                    </div>

                    <div className="listing-card-content">
                      <div className="listing-info-header">
                        <h3>{fav.listingTitle}</h3>
                        <div className="listing-info">
                          <span className="icon">
                            <LocationIcon size={16} />
                          </span>{" "}
                          {fav.listingLocation}
                        </div>
                      </div>

                      <div className="listing-card-footer">
                        <div className="listing-price">
                          <span className="price">₱{fav.listingPrice}</span>
                          <span className="period">/month</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(fav.listingId);
                          }}
                          className="button button-primary"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <HeartIcon size={48} color="#94a3b8" />
                </div>
                <h3>No saved listings yet</h3>
                <p>Browse listings and click the heart icon to save your favorites.</p>
                <button
                  className="button button-primary"
                  onClick={() => setActiveTab("search")}
                >
                  Browse Listings
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MY INQUIRIES TAB CONTENT */}
      {activeTab === "inquiries" && (
        <div className="inquiries-section">
          <div className="container">
            <div className="section-header">
              <div className="section-header-left">
                <h2>My Inquiries</h2>
                <p className="text-muted">
                  Track your messages and visit requests to landlords
                </p>
              </div>
            </div>

            {inquiriesLoading ? (
              <div className="loading-state">
                <p>Loading your inquiries...</p>
              </div>
            ) : inquiries.length > 0 ? (
              <div className="inquiries-list">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="inquiry-card card">
                    <div className="inquiry-card-header">
                      <div className="inquiry-listing-info">
                        <HomeIcon size={20} color="#2563eb" />
                        <div>
                          <h4 
                            className={`inquiry-listing-title${inquiry.listing?.id ? ' clickable' : ''}`}
                            onClick={inquiry.listing?.id ? () => onViewDetails(inquiry.listing.id) : undefined}
                            style={{ cursor: inquiry.listing?.id ? 'pointer' : 'default' }}
                          >
                            {inquiry.listing?.title || 'Listing'}
                          </h4>
                          {inquiry.listing?.location && (
                            <span className="inquiry-listing-location">
                              <LocationIcon size={14} />
                              {inquiry.listing.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="inquiry-badges">
                        <span className={`badge ${getTypeBadgeClass(inquiry.type)}`}>
                          {inquiry.type === 'VISIT_REQUEST' ? (
                            <><CalendarIcon size={12} /> Visit Request</>
                          ) : (
                            <><MessageIcon size={12} /> Message</>
                          )}
                        </span>
                        <span className={`badge ${getStatusBadgeClass(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                      </div>
                    </div>

                    <div className="inquiry-card-body">
                      {/* Student's original message */}
                      <div className="inquiry-message-section">
                        <div className="inquiry-label">
                          <MessageIcon size={16} />
                          Your {inquiry.type === 'VISIT_REQUEST' ? 'Visit Request' : 'Message'}:
                        </div>
                        <div className="inquiry-message">
                          {/* message is for MESSAGE type, notes is for VISIT_REQUEST type */}
                          {inquiry.message || inquiry.notes || 'No message provided'}
                        </div>
                        {inquiry.type === 'VISIT_REQUEST' && (inquiry.visitDate || inquiry.visitTime) && (
                          <div className="inquiry-visit-details">
                            <CalendarIcon size={14} />
                            Requested: {inquiry.visitDate} {inquiry.visitTime && `at ${inquiry.visitTime}`}
                          </div>
                        )}
                        <div className="inquiry-date">
                          {/* Backend returns createdAt, dateSent is an alias for compatibility */}
                          Sent: {formatDate(inquiry.createdAt || inquiry.dateSent)}
                        </div>
                      </div>

                      {/* Landlord's reply */}
                      {inquiry.reply && (
                        <div className="inquiry-reply-section">
                          <div className="inquiry-label reply-label">
                            💬 Landlord Replied:
                          </div>
                          <div className="inquiry-reply-box">
                            <div className="inquiry-reply-text">
                              {inquiry.reply}
                            </div>
                            <div className="inquiry-reply-date">
                              - {formatDate(inquiry.repliedAt)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="inquiry-card-footer">
                      {inquiry.listing?.id && (
                        <button
                          className="button button-secondary"
                          onClick={() => onViewDetails(inquiry.listing.id)}
                        >
                          View Listing
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <MessageIcon size={48} color="#94a3b8" />
                </div>
                <h3>No inquiries yet</h3>
                <p>Send a message or schedule a visit to start a conversation with landlords.</p>
                <button
                  className="button button-primary"
                  onClick={() => setActiveTab("search")}
                >
                  Browse Listings
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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