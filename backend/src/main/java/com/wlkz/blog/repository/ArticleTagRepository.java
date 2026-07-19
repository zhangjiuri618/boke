package com.wlkz.blog.repository;

import com.wlkz.blog.entity.ArticleTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleTagRepository extends JpaRepository<ArticleTag, String> {
    List<ArticleTag> findByArticleId(String articleId);
    void deleteByArticleId(String articleId);
    void deleteByArticleIdAndTagId(String articleId, String tagId);
}
