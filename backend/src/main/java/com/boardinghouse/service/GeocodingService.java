package com.boardinghouse.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for geocoding operations using Nominatim (OpenStreetMap)
 * Note: For production use, consider implementing rate limiting and caching
 * to comply with Nominatim's usage policy.
 */
@Service
@Slf4j
public class GeocodingService {

    private static final String NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";
    private static final String NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public GeocodingService(ObjectMapper objectMapper) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = objectMapper;
    }

    /**
     * Geocode an address to coordinates using Nominatim
     * @param address The address to geocode
     * @return Map with latitude and longitude, or empty map if not found
     */
    public Map<String, Double> geocodeAddress(String address) {
        Map<String, Double> result = new HashMap<>();
        
        if (address == null || address.isBlank()) {
            return result;
        }

        try {
            String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);
            String url = String.format("%s?format=json&q=%s&limit=1", NOMINATIM_SEARCH_URL, encodedAddress);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getBody() != null) {
                JsonNode jsonArray = objectMapper.readTree(response.getBody());
                if (jsonArray.isArray() && !jsonArray.isEmpty()) {
                    JsonNode firstResult = jsonArray.get(0);
                    result.put("latitude", firstResult.get("lat").asDouble());
                    result.put("longitude", firstResult.get("lon").asDouble());
                }
            }
        } catch (Exception e) {
            log.error("Error geocoding address: {}", address, e);
        }

        return result;
    }

    /**
     * Search for location suggestions using Nominatim
     * @param query The search query
     * @return List of location suggestions
     */
    public List<Map<String, Object>> searchLocations(String query) {
        List<Map<String, Object>> results = new ArrayList<>();
        
        if (query == null || query.isBlank() || query.length() < 3) {
            return results;
        }

        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
            String url = String.format("%s?format=json&q=%s&limit=5&addressdetails=1", NOMINATIM_SEARCH_URL, encodedQuery);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getBody() != null) {
                JsonNode jsonArray = objectMapper.readTree(response.getBody());
                if (jsonArray.isArray()) {
                    for (JsonNode node : jsonArray) {
                        Map<String, Object> location = new HashMap<>();
                        location.put("displayName", node.get("display_name").asText());
                        location.put("latitude", node.get("lat").asDouble());
                        location.put("longitude", node.get("lon").asDouble());
                        location.put("type", node.has("type") ? node.get("type").asText() : "");
                        location.put("importance", node.has("importance") ? node.get("importance").asDouble() : 0.0);
                        results.add(location);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error searching locations: {}", query, e);
        }

        return results;
    }

    /**
     * Reverse geocode coordinates to an address
     * @param latitude The latitude
     * @param longitude The longitude
     * @return The address string or empty string if not found
     */
    public String reverseGeocode(double latitude, double longitude) {
        try {
            String url = String.format("%s?format=json&lat=%f&lon=%f", NOMINATIM_REVERSE_URL, latitude, longitude);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getBody() != null) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                if (jsonNode.has("display_name")) {
                    return jsonNode.get("display_name").asText();
                }
            }
        } catch (Exception e) {
            log.error("Error reverse geocoding: lat={}, lon={}", latitude, longitude, e);
        }

        return "";
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * @param lat1 Latitude of point 1
     * @param lon1 Longitude of point 1
     * @param lat2 Latitude of point 2
     * @param lon2 Longitude of point 2
     * @return Distance in kilometers
     */
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371; // Earth's radius in km

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return EARTH_RADIUS * c;
    }
}
