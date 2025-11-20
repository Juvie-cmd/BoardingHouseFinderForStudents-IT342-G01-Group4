import { useState, useEffect } from "react";
import API from "../../api/api";
import { ImageWithFallback } from "../../components/Shared/ImageWithFallback";
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

  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("any");
  const [roomType, setRoomType] = useState("any");
  const [searchTriggered, setSearchTriggered] = useState(false);

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

  // ⭐ FILTER FUNCTION
  const filterListings = () => {
    let filtered = [...listings];

    if (location.trim()) {
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
    setBudget("any");
    setRoomType("any");
    setSearchTriggered(false);
    setFilteredListings(listings);
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
                  <div className="search-grid-item-icon-wrapper">
                    <span className="icon">
                      <LocationIcon size={18} />
                    </span>
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
            <h2>
              {searchTriggered ? "Search Results" : "Featured Boarding Houses"}
            </h2>
            <p className="text-muted">
              {searchTriggered
                ? `Found ${filteredListings.length} ${
                    filteredListings.length === 1
                      ? "property"
                      : "properties"
                  }`
                : "Popular choices among students"}
            </p>
          </div>

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
                  <button className="favorite-button">
                    <HeartIcon size={18} color="#ef4444" />
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