package com.projex.backend.controller;

import com.projex.backend.model.Post;
import com.projex.backend.model.User;
import com.projex.backend.service.PostService;
import com.projex.backend.util.JwtUtil;
import com.projex.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    // Get all posts (for Explore Page)
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // Get all posts by a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(postService.getPostsByUser(userId));
    }

    // Get a single post by ID
    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable Long postId) {
        Optional<Post> post = postService.getPostById(postId);
        return post.isPresent() ? ResponseEntity.ok(post.get()) :
                ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
    }

    // Search posts by keyword (title or description)
    @GetMapping("/search")
    public ResponseEntity<List<Post>> searchPosts(@RequestParam String keyword) {
        return ResponseEntity.ok(postService.searchPosts(keyword));
    }

    // Filter posts by project status
    @GetMapping("/filter/status")
    public ResponseEntity<List<Post>> filterByStatus(@RequestParam String status) {
        return ResponseEntity.ok(postService.getPostsByStatus(status));
    }

    // Filter posts by technology
    @GetMapping("/filter/technology")
    public ResponseEntity<List<Post>> filterByTechnology(@RequestParam String technology) {
        return ResponseEntity.ok(postService.getPostsByTechnology(technology));
    }

    // Filter posts by role
    @GetMapping("/filter/role")
    public ResponseEntity<List<Post>> filterByRole(@RequestParam String role) {
        return ResponseEntity.ok(postService.getPostsByRole(role));
    }

    // Create a new post (Auth required)
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post, Authentication authentication) {
        try {
            // Extract email from the Authentication object
            String email = authentication.getName();
            
            // Find the user by email
            Optional<User> user = userRepository.findByEmail(email);
            if (!user.isPresent()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            
            Long userId = user.get().getId();
            Post newPost = postService.createPost(post, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(newPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Update an existing post (Auth + Ownership required)
    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable Long postId, @RequestBody Post updatedPost, Authentication authentication) {
        try {
            // Extract email from the Authentication object
            String email = authentication.getName();
            
            // Find the user by email
            Optional<User> user = userRepository.findByEmail(email);
            if (!user.isPresent()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            
            Long userId = user.get().getId();
            Post updated = postService.updatePost(postId, userId, updatedPost);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Delete a post (Auth + Ownership required)
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId, Authentication authentication) {
        try {
            // Extract email from the Authentication object
            String email = authentication.getName();
            
            // Find the user by email
            Optional<User> user = userRepository.findByEmail(email);
            if (!user.isPresent()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            
            Long userId = user.get().getId();
            postService.deletePost(postId, userId);
            return ResponseEntity.ok("Post deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
