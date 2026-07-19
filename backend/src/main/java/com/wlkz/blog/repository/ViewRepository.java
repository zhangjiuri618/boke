package com.wlkz.blog.repository;

import com.wlkz.blog.entity.View;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ViewRepository extends JpaRepository<View, String> {
    void deleteByArticleId(String articleId);
}
