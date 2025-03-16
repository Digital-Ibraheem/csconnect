package com.projex.backend.service;

import com.projex.backend.model.User;
import com.projex.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * Save user profile updates.
     */
    public void saveUser(User user) {
        userRepository.save(user);
    }

    /**
     * Update user password with validation.
     */
    public boolean updatePassword(User user, String oldPassword, String newPassword) {
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return false; // Old password is incorrect
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    /**
     * Search users by username, skills, or location.
     */
    public List<User> searchUsers(String username, String skills, String location) {
        List<User> users = userRepository.findAll();

        return users.stream()
                .filter(user -> (username == null || user.getUsername().toLowerCase().contains(username.toLowerCase())) &&
                        (skills == null || user.getSkills().contains(skills)) &&
                        (location == null || (user.getLocation() != null && user.getLocation().toLowerCase().contains(location.toLowerCase()))))
                .collect(Collectors.toList());
    }

    /**
     * Delete user by ID.
     */
    public void deleteUser(Long id) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            userRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("User not found.");
        }
    }
}
