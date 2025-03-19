package com.projex.backend.repository;

import com.projex.backend.model.Post;
import com.projex.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // Get all posts
    List<Post> findAllByOrderByIdDesc();

    // Posts by user
    List<Post> findByOwner(User owner);

    // Search posts by title or description
    @Query("SELECT p FROM Post p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))" + "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Post> searchByTitleOrDescription(@Param("keyword") String keyword);

    // Filter posts by project status
    List<Post> findByProjectStatus(String projectStatus);

    // Filter posts by technology
    @Query("SELECT p FROM Post p JOIN p.technologies t WHERE LOWER(t) LIKE LOWER(CONCAT('%', :technology, '%'))")
    List<Post> findByTechnology(@Param("technology") String technology);

    // Filter posts by role
    @Query("SELECT p FROM Post p JOIN p.roles t WHERE LOWER(t) LIKE LOWER(CONCAT('%', :roles, '%'))")
    List<Post> findByRole(@Param("role") String role);

    // Find a post by ID
    Post findById(long id);

    // Delete a post (Spring provides this by default)
    void deleteById(Long id);
}
