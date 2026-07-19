package com.wlkz.blog.repository;

import com.wlkz.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByName(String name);
    Optional<User> findByEmailOrName(String email, String name);
    boolean existsByEmail(String email);
    boolean existsByName(String name);
}
