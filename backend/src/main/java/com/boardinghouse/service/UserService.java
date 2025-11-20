package com.boardinghouse.service;

import com.boardinghouse.entity.User;
import com.boardinghouse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * Retrieve the full User entity by email (or id) to ensure we have a managed entity
     * (useful when Authentication principal might be a proxy or a lightweight object).
     */
    public User getCurrentUser(Authentication authentication) {
        if (authentication == null) return null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof User) {
            User u = (User) principal;
            // re-fetch from DB to get a managed entity (optional but safe)
            return userRepository.findById(u.getId()).orElse(u);
        }
        return null;
    }
}
