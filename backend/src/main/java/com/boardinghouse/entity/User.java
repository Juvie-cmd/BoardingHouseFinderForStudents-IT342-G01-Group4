package com.boardinghouse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(min = 2, max = 100) @Column(nullable = false) private String name;
    @NotBlank @Email @Column(nullable = false, unique = true) private String email;
    @NotBlank @Column(nullable = false) private String password;
    @NotBlank @Column(nullable = false, length = 20) private String role; // student, landlord, admin

    // Common fields
    @Column(length = 20) private String phone;
    @Column(columnDefinition = "TEXT") private String bio;

    // Student-specific
    @Column(length = 100) private String university;
    @Column(length = 20) private String yearOfStudy;
    private Integer budget;
    @Column(length = 100) private String preferredLocation;
    @Column(length = 20) private String roomType;

    // Landlord-specific
    @Column(length = 100) private String businessName;
    @Column(columnDefinition = "TEXT") private String businessAddress;
    @Column(length = 50) private String taxId;
    @Column(length = 50) private String bankAccount;
    @Column(length = 255) private String website;
    private Integer experience;

    // Admin-specific
    @Column(length = 50) private String department;
    @Column(length = 50) private String employeeId;

    // Audit fields
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // UserDetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
    }

    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return active; }
}
