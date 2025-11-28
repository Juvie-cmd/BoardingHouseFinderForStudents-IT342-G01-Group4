package com.boardinghouse.controller;

import com.boardinghouse.service.GeocodingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for geocoding operations using Nominatim (OpenStreetMap)
 */
@RestController
@RequestMapping("/api/geocoding")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class GeocodingController {

    private final GeocodingService geocodingService;

    /**
     * Search for location suggestions
     * GET /api/geocoding/search?q=address
     */
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchLocations(@RequestParam String q) {
        List<Map<String, Object>> results = geocodingService.searchLocations(q);
        return ResponseEntity.ok(results);
    }

    /**
     * Geocode an address to coordinates
     * GET /api/geocoding/geocode?address=address
     */
    @GetMapping("/geocode")
    public ResponseEntity<Map<String, Double>> geocodeAddress(@RequestParam String address) {
        Map<String, Double> result = geocodingService.geocodeAddress(address);
        if (result.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Reverse geocode coordinates to address
     * GET /api/geocoding/reverse?lat=0.0&lon=0.0
     */
    @GetMapping("/reverse")
    public ResponseEntity<Map<String, String>> reverseGeocode(
            @RequestParam double lat,
            @RequestParam double lon) {
        String address = geocodingService.reverseGeocode(lat, lon);
        if (address.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("address", address));
    }

    /**
     * Calculate distance between two points
     * GET /api/geocoding/distance?lat1=0&lon1=0&lat2=0&lon2=0
     */
    @GetMapping("/distance")
    public ResponseEntity<Map<String, Double>> calculateDistance(
            @RequestParam double lat1,
            @RequestParam double lon1,
            @RequestParam double lat2,
            @RequestParam double lon2) {
        double distance = geocodingService.calculateDistance(lat1, lon1, lat2, lon2);
        return ResponseEntity.ok(Map.of("distanceKm", distance));
    }
}
