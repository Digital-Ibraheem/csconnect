package com.projex.backend.controller;

import com.projex.backend.model.User;
import com.projex.backend.service.UserAuthService;
import com.projex.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserAuthService userAuthService;

    @Autowired
    private UserService userService;

    /**
     * Register a new user.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            Map<String, String> response = userAuthService.registerUser(user);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Register a new user via Google OAuth.
     */
    @PostMapping("/register-google")
    public ResponseEntity<?> registerGoogleUser(@RequestBody User user) {
        try {
            // Ensure this user is marked as a Google user
            user.setAuthProvider("google");
            user.setPassword(null); // Google users don't need a password

            // Validate required fields
            if (user.getEmail() == null || user.getUsername() == null || user.getFullName() == null || user.getProfilePictureUrl() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Missing required fields"));
            }

            Map<String, String> response = userAuthService.registerUser(user);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }


    /**
     * Authenticate user and return JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Email and password are required"));
        }

        try {
            Map<String, String> response = userAuthService.authenticateUser(email, password);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }


    /**
     * Get details of the logged-in user.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> user = userService.getUserByEmail(email);
        return user.isPresent() ? ResponseEntity.ok(user.get()) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
    }
}
