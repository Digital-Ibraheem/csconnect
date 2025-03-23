package com.projex.backend.util;

import com.projex.backend.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 3; // 3 hours

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes()); // Secure signing key
    }

    /**
     * Generates a JWT token containing user information.
     */
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId()); // Store userId in claims
        claims.put("username", user.getUsername());
        claims.put("fullName", user.getFullName());
        claims.put("profilePicture", user.getProfilePictureUrl());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail()) // Use email as subject
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extracts the email (subject) from the JWT token.
     */
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    /**
     * Extracts the user ID from the JWT token.
     */
    public Long extractUserId(String token) {
        Claims claims = extractClaims(token);
        return claims.get("id", Long.class); // Extract userId from claims
    }

    /**
     * Extracts all claims (id, username, fullName, profilePicture) from the JWT token.
     */
    public Claims extractClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new JwtException("⚠️ Token expired: " + e.getMessage());
        } catch (JwtException e) {
            throw new JwtException("❌ Invalid Token: " + e.getMessage());
        }
    }

    /**
     * Validates a JWT token.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("❌ Invalid Token: " + e.getMessage());
            return false;
        }
    }
}
