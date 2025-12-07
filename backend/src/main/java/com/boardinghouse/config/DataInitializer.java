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
        createTestLandlordIfNotExists();
        createTestStudentIfNotExists();
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

    private void createTestLandlordIfNotExists() {
        String landlordEmail = "landlord@test.com";
        
        // Check if landlord already exists
        if (userRepository.existsByEmail(landlordEmail)) {
            log.info("Test landlord account already exists: {}", landlordEmail);
            return;
        }

        // Create test landlord account
        User landlord = User.builder()
                .name("Test Landlord")
                .email(landlordEmail)
                .password(passwordEncoder.encode("landlord123"))  // Password: landlord123
                .role("landlord")
                .authProvider("LOCAL")
                .active(true)
                .build();

        userRepository.save(landlord);
        log.info("✅ Test landlord account created successfully!");
        log.info("   Email: {}", landlordEmail);
        log.info("   Password: landlord123");
    }

    private void createTestStudentIfNotExists() {
        String studentEmail = "student@test.com";
        
        // Check if student already exists
        if (userRepository.existsByEmail(studentEmail)) {
            log.info("Test student account already exists: {}", studentEmail);
            return;
        }

        // Create test student account
        User student = User.builder()
                .name("Test Student")
                .email(studentEmail)
                .password(passwordEncoder.encode("student123"))  // Password: student123
                .role("student")
                .authProvider("LOCAL")
                .active(true)
                .build();

        userRepository.save(student);
        log.info("✅ Test student account created successfully!");
        log.info("   Email: {}", studentEmail);
        log.info("   Password: student123");
    }
}