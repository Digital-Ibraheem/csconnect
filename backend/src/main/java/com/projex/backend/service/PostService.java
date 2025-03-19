package com.projex.backend.service;

import com.projex.backend.model.Post;
import com.projex.backend.model.User;
import com.projex.backend.repository.PostRepository;
import com.projex.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new post
    public Post createPost(Post post, Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            post.setOwner(user.get());
            return postRepository.save(post);
        } else {
            throw new IllegalArgumentException("User not found.");
        }
    }

    // Get all posts (for Explore page)
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByIdDesc();
    }

    // Get a single post by ID
    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    // Get all posts by a specific user
    public List<Post> getPostsByUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return postRepository.findByOwner(user.get());
        } else {
            throw new IllegalArgumentException("User not found.");
        }
    }

    // Search posts by title or description
    public List<Post> searchPosts(String keyword) {
        return postRepository.searchByTitleOrDescription(keyword);
    }

    // Filter posts by project status
    public List<Post> getPostsByStatus(String status) {
        return postRepository.findByProjectStatus(status);
    }

    // Filter posts by technology
    public List<Post> getPostsByTechnology(String technology) {
        return postRepository.findByTechnology(technology);
    }

    // Filter posts by role
    public List<Post> getPostsByRole(String role) {
        return postRepository.findByRole(role);
    }

    // Update an existing post (with ownership validation)
    public Post updatePost(Long postId, Long userId, Post updatedPost) {
        Optional<Post> existingPost = postRepository.findById(postId);

        if (existingPost.isPresent()) {
            Post post = existingPost.get();

            // Ensure the user is the owner before updating
            if (!post.getOwner().getId().equals(userId)) {
                throw new IllegalArgumentException("Unauthorized: You do not own this post.");
            }

            // Update fields
            post.setTitle(updatedPost.getTitle());
            post.setDescription(updatedPost.getDescription());
            post.setProjectStatus(updatedPost.getProjectStatus());
            post.setTechnologies(updatedPost.getTechnologies());
            post.setRoles(updatedPost.getRoles());
            post.setImages(updatedPost.getImages());

            return postRepository.save(post);
        } else {
            throw new IllegalArgumentException("Post not found.");
        }
    }

    // Delete a post (with ownership validation)
    public void deletePost(Long postId, Long userId) {
        Optional<Post> post = postRepository.findById(postId);

        if (post.isPresent()) {
            // Ensure the user is the owner before deleting
            if (!post.get().getOwner().getId().equals(userId)) {
                throw new IllegalArgumentException("Unauthorized: You do not own this post.");
            }

            postRepository.deleteById(postId);
        } else {
            throw new IllegalArgumentException("Post not found.");
        }
    }
}
