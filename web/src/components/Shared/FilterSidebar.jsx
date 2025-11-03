// src/components/Shared/FilterSidebar.jsx

import React from 'react';
import './styles/FilterSidebar.css';

// Helper component for a clean layout
function FilterSection({ title, children }) {
  return (
    <div className="filter-section">
      <h3>{title}</h3>
      {children}
      <hr className="separator" />
    </div>
  );
}

// Helper for Checkbox items
function FilterCheckboxItem({ id, label, checked, onCheckedChange }) {
  return (
    <div className="filter-checkbox-item">
      <input 
        type="checkbox" 
        id={id} 
        checked={checked} 
        onChange={onCheckedChange} 
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export function FilterSidebar({ filters, setFilters, onClearAll }) {

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters({ 
      ...filters, 
      priceRange: name === 'min' 
        ? [Number(value), filters.priceRange[1]] 
        : [filters.priceRange[0], Number(value)]
    });
  };

  const handleRoomTypeChange = (type) => {
    setFilters({
      ...filters,
      roomTypes: { ...filters.roomTypes, [type]: !filters.roomTypes[type] },
    });
  };

  const handleAmenityChange = (amenity) => {
    setFilters({
      ...filters,
      amenities: { ...filters.amenities, [amenity]: !filters.amenities[amenity] },
    });
  };

  const handleDistanceChange = (distance) => {
    setFilters({
      ...filters,
      distance: { ...filters.distance, [distance]: !filters.distance[distance] },
    });
  };

IS_LANDING_PAGE
  return (
    <div className="card filter-sidebar">
      <div className="filter-sidebar-header">
        <h2>Filters</h2>
        <button className="button-link" onClick={onClearAll}>
          Clear All
        </button>
      </div>

      <div className="filter-sidebar-content">
        <FilterSection title="Price Range">
          <div className="price-range-inputs">
            <div className="form-group">
              <label htmlFor="min-price">Min</label>
              <input 
                type="number" 
                id="min-price" 
                name="min"
                value={filters.priceRange[0]} 
                onChange={handlePriceChange}
                className="input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="max-price">Max</label>
              <input 
                type="number" 
                id="max-price" 
                name="max"
                value={filters.priceRange[1]} 
                onChange={handlePriceChange}
                className="input"
              />
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Room Type">
          <FilterCheckboxItem
            id="single"
            label="Single"
            checked={filters.roomTypes.single}
            onCheckedChange={() => handleRoomTypeChange("single")}
          />
          <FilterCheckboxItem
            id="shared"
            label="Shared"
            checked={filters.roomTypes.shared}
            onCheckedChange={() => handleRoomTypeChange("shared")}
          />
          <FilterCheckboxItem
            id="studio"
            label="Studio"
            checked={filters.roomTypes.studio}
            onCheckedChange={() => handleRoomTypeChange("studio")}
          />
        </FilterSection>

        <FilterSection title="Amenities">
          <FilterCheckboxItem
            id="wifi"
            label="WiFi"
            checked={filters.amenities.wifi}
            onCheckedChange={() => handleAmenityChange("wifi")}
          />
          <FilterCheckboxItem
            id="ac"
            label="Air Conditioning"
            checked={filters.amenities.ac}
            onCheckedChange={() => handleAmenityChange("ac")}
          />
          <FilterCheckboxItem
            id="laundry"
            label="Laundry"
            checked={filters.amenities.laundry}
            onCheckedChange={() => handleAmenityChange("laundry")}
          />
           <FilterCheckboxItem
            id="kitchen"
            label="Kitchen"
            checked={filters.amenities.kitchen}
            onCheckedChange={() => handleAmenityChange("kitchen")}
          />
        </FilterSection>

        <FilterSection title="Distance from Campus">
          <FilterCheckboxItem
            id="walk"
            label="Walking (< 1km)"
            checked={filters.distance.walk}
            onCheckedChange={() => handleDistanceChange("walk")}
          />
          <FilterCheckboxItem
            id="bike"
            label="Biking (< 3km)"
            checked={filters.distance.bike}
            onCheckedChange={() => handleDistanceChange("bike")}
          />
          <FilterCheckboxItem
            id="transit"
            label="Transit (< 5km)"
            checked={filters.distance.transit}
            onCheckedChange={() => handleDistanceChange("transit")}
          />
        </FilterSection>
      </div>
    </div>
  );
}