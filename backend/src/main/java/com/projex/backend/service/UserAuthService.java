package com.projex.backend.service;

import com.projex.backend.model.User;
import com.projex.backend.repository.UserRepository;
import com.projex.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil; // Inject JwtUtil to generate tokens

    @Autowired
    private CustomUserDetailsService userDetailsService;  // Inject the dedicated service

    public Map<String, String> authenticateUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty() || !passwordEncoder.matches(password, user.get().getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // ✅ Generate JWT Token
        String token = jwtUtil.generateToken(user.get());

        // ✅ Return token + user info
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.get().getId().toString());
        response.put("email", user.get().getEmail());

        return response;
    }

    public Map<String, String> registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("This email is already in use. Please try a different one.");
        }

        // Only encode password for local users
        if ("local".equals(user.getAuthProvider())) {
            if (user.getPassword() == null || user.getPassword().isBlank()) {
                throw new RuntimeException("Password is required for local users.");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            user.setPassword(null); // Ensure OAuth users have no password
        }

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", savedUser.getId().toString());
        response.put("email", savedUser.getEmail());

        return response;
    }

}
