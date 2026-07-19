package com.wlkz.blog.repository;

import com.wlkz.blog.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {
    List<Comment> findByArticleIdOrderByCreatedAtDesc(String articleId);
    void deleteByArticleId(String articleId);
}
