// src/components/Shared/LocationSearchInput.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { LocationIcon, SearchIcon, CloseIcon } from './Icons';
import './styles/LocationSearchInput.css';

/**
 * LocationSearchInput - A component for searching locations using Nominatim
 * Features:
 * - Debounced search
 * - Autocomplete suggestions
 * - Returns coordinates when a location is selected
 */
export function LocationSearchInput({ 
  value = '', 
  onChange, 
  onLocationSelect,
  placeholder = 'Search for a location...',
  className = ''
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounce timer ref
  const debounceRef = useRef(null);

  // Update internal query when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Search function using Nominatim
  const searchLocations = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Use Nominatim directly from frontend for autocomplete
      const encodedQuery = encodeURIComponent(searchQuery);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const formattedResults = data.map(item => ({
          displayName: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          type: item.type || '',
          importance: item.importance || 0
        }));
        setSuggestions(formattedResults);
        setShowSuggestions(formattedResults.length > 0);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setSelectedIndex(-1);
    
    if (onChange) {
      onChange(newValue);
    }

    // Clear previous debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce timer (300ms delay)
    debounceRef.current = setTimeout(() => {
      searchLocations(newValue);
    }, 300);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.displayName);
    setShowSuggestions(false);
    setSuggestions([]);
    
    if (onChange) {
      onChange(suggestion.displayName);
    }
    
    if (onLocationSelect) {
      onLocationSelect({
        address: suggestion.displayName,
        latitude: suggestion.latitude,
        longitude: suggestion.longitude
      });
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Clear input
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (onChange) onChange('');
    if (onLocationSelect) onLocationSelect(null);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={`location-search-input ${className}`}>
      <div className="location-search-input-wrapper">
        <span className="location-search-icon">
          <LocationIcon size={18} />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="location-search-field"
          autoComplete="off"
        />
        {isLoading && (
          <span className="location-search-loading">
            <div className="spinner" />
          </span>
        )}
        {query && !isLoading && (
          <button 
            type="button" 
            className="location-search-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <CloseIcon size={16} />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul 
          ref={suggestionsRef}
          className="location-search-suggestions"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.latitude}-${suggestion.longitude}-${index}`}
              className={`location-search-suggestion ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSelectSuggestion(suggestion)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <span className="suggestion-icon">
                <LocationIcon size={14} />
              </span>
              <span className="suggestion-text">{suggestion.displayName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
