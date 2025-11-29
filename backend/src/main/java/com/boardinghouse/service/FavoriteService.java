package com.boardinghouse.service;

import com.boardinghouse.dto.FavoriteResponse;
import com.boardinghouse.entity.Favorite;
import com.boardinghouse.entity.Listing;
import com.boardinghouse.entity.User;
import com.boardinghouse.repository.FavoriteRepository;
import com.boardinghouse.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ListingRepository listingRepository;

    public Favorite addFavorite(Long listingId, User user) {
        // Check if already favorited
        if (favoriteRepository.existsByUser_IdAndListing_Id(user.getId(), listingId)) {
            throw new IllegalStateException("Listing already in favorites");
        }

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        Favorite favorite = Favorite.builder()
                .user(user)
                .listing(listing)
                .build();

        return favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long listingId, User user) {
        if (!favoriteRepository.existsByUser_IdAndListing_Id(user.getId(), listingId)) {
            throw new RuntimeException("Favorite not found");
        }
        favoriteRepository.deleteByUser_IdAndListing_Id(user.getId(), listingId);
    }

    public List<Favorite> getFavoritesByUser(Long userId) {
        return favoriteRepository.findByUser_IdOrderByCreatedAtDesc(userId);
    }

    public boolean isFavorite(Long userId, Long listingId) {
        return favoriteRepository.existsByUser_IdAndListing_Id(userId, listingId);
    }

    public FavoriteResponse toResponse(Favorite favorite) {
        FavoriteResponse response = new FavoriteResponse();
        response.setId(favorite.getId());
        response.setListingId(favorite.getListing().getId());
        response.setListingTitle(favorite.getListing().getTitle());
        response.setListingImage(favorite.getListing().getImage());
        response.setListingLocation(favorite.getListing().getLocation());
        response.setListingPrice(favorite.getListing().getPrice());
        response.setCreatedAt(favorite.getCreatedAt().toString());
        return response;
    }

    public List<FavoriteResponse> toResponseList(List<Favorite> favorites) {
        return favorites.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
