package com.wlkz.blog.repository;

import com.wlkz.blog.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, String> {
    Optional<Tag> findBySlug(String slug);
    boolean existsByName(String name);
    boolean existsBySlug(String slug);
}
