package com.boardinghouse.service;

import com.boardinghouse.entity.User;
import com.boardinghouse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("No user found with email: " + email)
                );

        // If user is Google OAuth user but login attempt is via email/password
        if ("GOOGLE".equalsIgnoreCase(user.getAuthProvider()) && (user.getPassword() == null || user.getPassword().isBlank())) {
            throw new UsernameNotFoundException("This account uses Google Login. Use 'Login with Google'.");
        }

        return user; // User implements UserDetails → fully valid
    }
}
