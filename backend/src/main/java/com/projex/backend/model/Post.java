package com.projex.backend.model;

import jakarta.persistence.*;
import lombok.*;

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


    private String name;


    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // FK to link project to a user
    private User owner;
}
