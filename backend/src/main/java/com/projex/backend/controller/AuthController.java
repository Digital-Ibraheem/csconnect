package com.projex.backend.controller;

import com.projex.backend.model.User;
import com.projex.backend.service.UserAuthService;
import com.projex.backend.service.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserAuthService userAuthService;

    @Autowired
    private UserService userService;

    @Value("${GOOGLE_CLIENT_ID}")
    private String GOOGLE_CLIENT_ID;

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> requestBody) {
        String idTokenString = requestBody.get("idToken");

        if (idTokenString == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "ID token is required"));
        }

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance() // ✅ Use GsonFactory
            ).setAudience(Collections.singletonList(GOOGLE_CLIENT_ID)).build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();

                Optional<User> existingUser = userService.getUserByEmail(email);

                if (existingUser.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not registered. Please sign up first."));
                }

                User user = existingUser.get();

                // Generate JWT Token
                String token = userAuthService.generateTokenForUser(user);
                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "userId", user.getId().toString(),
                        "email", user.getEmail()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid Google ID token"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Google authentication failed"));
        }
    }


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
    public ResponseEntity<?> registerGoogleUser(@RequestBody Map<String, String> requestBody) {
        String idTokenString = requestBody.get("idToken");

        if (idTokenString == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "ID token is required"));
        }

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance() // ✅ Updated to use GsonFactory
            ).setAudience(Collections.singletonList(GOOGLE_CLIENT_ID)).build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String fullName = (String) payload.get("name");
                String profilePictureUrl = (String) payload.get("picture");

                Optional<User> existingUser = userService.getUserByEmail(email);
                User user;

                if (existingUser.isPresent()) {
                    user = existingUser.get(); // If user exists, return their token
                } else {
                    // Create a new Google user
                    user = new User();
                    user.setEmail(email);
                    user.setFullName(fullName);
                    user.setProfilePictureUrl(profilePictureUrl);
                    user.setAuthProvider("google");

                    // ✅ Generate a username from the email prefix if missing
                    String generatedUsername = email.split("@")[0];
                    user.setUsername(generatedUsername);

                    userService.saveUser(user);
                }

                // Generate JWT Token
                String token = userAuthService.generateTokenForUser(user);
                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "userId", user.getId().toString(),
                        "email", user.getEmail()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid Google ID token"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Google authentication failed"));
        }
    }


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
