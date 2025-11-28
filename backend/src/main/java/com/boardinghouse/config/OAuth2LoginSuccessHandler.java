package com.boardinghouse.config;

import com.boardinghouse.entity.User;
import com.boardinghouse.repository.UserRepository;
import com.boardinghouse.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        log.info("OAuth2 login success for email: {}", email);

        // Find existing user
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // Create new OAuth User
            user = User.builder()
                    .email(email)
                    .name(name)
                    .role("student")               // Default role
                    .password(passwordEncoder.encode(UUID.randomUUID().toString())) // Random password
                    .authProvider("GOOGLE")
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
        } else {
            // Update existing OAuth user info if provider is Google
            user.setName(name);
            user.setAuthProvider("GOOGLE");
            user.setUpdatedAt(LocalDateTime.now());
        }

        // Save user
        user = userRepository.save(user);

        // Generate JWT
        String token = jwtService.generateToken(user);

        // Get the first allowed origin for redirect (frontend URL)
        String frontendUrl = "http://localhost:5173"; // Default fallback
        if (allowedOrigins != null && !allowedOrigins.trim().isEmpty()) {
            frontendUrl = allowedOrigins.split(",")[0].trim();
        }

        // Redirect with token and user info
        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/login")
                .queryParam("token", token)
                .queryParam("id", user.getId())
                .queryParam("email", user.getEmail())
                .queryParam("name", user.getName())
                .queryParam("role", user.getRole())
                .queryParam("picture", picture != null ? picture : "")
                .build()
                .toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
