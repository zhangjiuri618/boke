package com.wlkz.blog.repository;

import com.wlkz.blog.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findBySlug(String slug);
    boolean existsByName(String name);
    boolean existsBySlug(String slug);
}
