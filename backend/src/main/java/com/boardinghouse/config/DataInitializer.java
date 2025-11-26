package com.boardinghouse. config;

import com.boardinghouse. entity.User;
import com.boardinghouse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String...  args) {
        createAdminIfNotExists();
    }

    private void createAdminIfNotExists() {
        String adminEmail = "admin@boardinghouse.com";
        
        // Check if admin already exists
        if (userRepository.existsByEmail(adminEmail)) {
            log.info("Admin account already exists: {}", adminEmail);
            return;
        }

        // Create admin account
        User admin = User.builder()
                .name("System Administrator")
                .email(adminEmail)
                .password(passwordEncoder.encode("admin123"))  // Password: admin123
                . role("admin")
                .authProvider("LOCAL")
                .active(true)
                .build();

        userRepository.save(admin);
        log.info("✅ Admin account created successfully!");
        log.info("   Email: {}", adminEmail);
        log.info("   Password: admin123");
        log.info("   ⚠️  Please change this password in production!");
    }
}