package com.projex.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title; // Corresponds to `formData.title`

    @Column(nullable = false, length = 50)
    private String projectStatus; // Corresponds to `formData.projectStatus`

    @ElementCollection
    @CollectionTable(name = "post_technologies", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "technology")
    private List<String> technologies; // Corresponds to `formData.technologies`

    @ElementCollection
    @CollectionTable(name = "post_roles", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "role")
    private List<String> roles; // Corresponds to `formData.roles`

    @Column(nullable = false, length = 5000)
    private String description; // Corresponds to `formData.description`

    @ElementCollection
    @CollectionTable(name = "post_images", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "image_url")
    private List<String> images; // Corresponds to `formData.images`

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User owner; // The user who created the post

    @Column(nullable = false)
    private boolean isPublished = false;
}
