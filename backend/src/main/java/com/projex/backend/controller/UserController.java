package com.projex.backend.controller;

import com.projex.backend.model.User;
import com.projex.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.isPresent() ? ResponseEntity.ok(user.get()) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> user = userService.getUserByEmail(email);
        return user.isPresent() ? ResponseEntity.ok(user.get()) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Long id,
            @RequestBody User updatedUser,
            Authentication authentication) {

        String authenticatedEmail = authentication.getName();
        Optional<User> userOpt = userService.getUserById(id);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();

        // Ensure only the authenticated user can update their profile
        if (!user.getEmail().equals(authenticatedEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Unauthorized to update this profile"));
        }

        // Update all fields only if they are provided (not null or empty)
        if (updatedUser.getFullName() != null && !updatedUser.getFullName().isEmpty()) {
            user.setFullName(updatedUser.getFullName());
        }

        if (updatedUser.getUsername() != null && !updatedUser.getUsername().isEmpty()) {
            user.setUsername(updatedUser.getUsername());
        }

        if (updatedUser.getProfilePictureUrl() != null && !updatedUser.getProfilePictureUrl().isEmpty()) {
            user.setProfilePictureUrl(updatedUser.getProfilePictureUrl());
        }

        if (updatedUser.getAuthProvider() != null && !updatedUser.getAuthProvider().isEmpty()) {
            user.setAuthProvider(updatedUser.getAuthProvider());
        }

        if (updatedUser.getBio() != null) {
            user.setBio(updatedUser.getBio());
        }

        if (updatedUser.getLocation() != null) {
            user.setLocation(updatedUser.getLocation());
        }

        if (updatedUser.getSkills() != null) {
            user.setSkills(updatedUser.getSkills());
        }

        if (updatedUser.getGithubUrl() != null) {
            user.setGithubUrl(updatedUser.getGithubUrl());
        }

        if (updatedUser.getLinkedinUrl() != null) {
            user.setLinkedinUrl(updatedUser.getLinkedinUrl());
        }

        userService.saveUser(user);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }


    @PutMapping("/{id}/update-password")
    public ResponseEntity<?> updatePassword(
            @PathVariable Long id,
            @RequestParam String oldPassword,
            @RequestParam String newPassword,
            Authentication authentication) {

        String authenticatedEmail = authentication.getName();
        Optional<User> userOpt = userService.getUserById(id);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        if (!user.getEmail().equals(authenticatedEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Unauthorized to change this password"));
        }

        boolean passwordUpdated = userService.updatePassword(user, oldPassword, newPassword);
        if (!passwordUpdated) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Incorrect old password"));
        }

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    @PutMapping("/{id}/update-avatar")
    public ResponseEntity<?> updateProfilePicture(
            @PathVariable Long id,
            @RequestParam String newProfilePictureUrl,
            Authentication authentication) {

        String authenticatedEmail = authentication.getName();
        Optional<User> userOpt = userService.getUserById(id);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        if (!user.getEmail().equals(authenticatedEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Unauthorized to update this profile picture"));
        }

        user.setProfilePictureUrl(newProfilePictureUrl);
        userService.saveUser(user);
        return ResponseEntity.ok(Map.of("message", "Profile picture updated successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String skills,
            @RequestParam(required = false) String location) {

        List<User> users = userService.searchUsers(username, skills, location);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}/projects")
    public ResponseEntity<?> getUserProjects(@PathVariable Long id) {
        Optional<User> userOpt = userService.getUserById(id);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        return ResponseEntity.ok(Map.of("message", "Fetching user projects (feature not yet implemented)"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication authentication) {
        String authenticatedEmail = authentication.getName();
        Optional<User> userOpt = userService.getUserById(id);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        if (!user.getEmail().equals(authenticatedEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Unauthorized to delete this user"));
        }

        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsernameAvailability(@RequestParam String username) {
        boolean usernameExists = userService.existsByUsername(username);
        return ResponseEntity.ok(Map.of("usernameTaken", usernameExists));
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailAvailability(@RequestParam String email) {
        boolean emailExists = userService.existsByEmail(email);
        return ResponseEntity.ok(Map.of("emailTaken", emailExists));
    }

}
