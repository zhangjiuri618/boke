package com.wlkz.blog.repository;

import com.wlkz.blog.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, String> {
    Page<Article> findByPublishedTrue(Pageable pageable);
    Page<Article> findByPublishedTrueAndCategoryId(String categoryId, Pageable pageable);
    Page<Article> findByPublishedTrueAndFeaturedTrue(Pageable pageable);
    List<Article> findByPublishedTrueOrderByViewsDesc();
    
    @Query("SELECT a FROM Article a WHERE a.published = true AND (a.title LIKE %:keyword% OR a.summary LIKE %:keyword% OR a.content LIKE %:keyword%)")
    Page<Article> search(@Param("keyword") String keyword, Pageable pageable);
    
    @Modifying
    @Query("UPDATE Article a SET a.views = a.views + 1 WHERE a.id = :id")
    void incrementViews(@Param("id") String id);
}
