package com.wlkz.blog.controller;

import com.wlkz.blog.dto.ApiResponse;
import com.wlkz.blog.entity.Article;
import com.wlkz.blog.service.ArticleService;
import com.wlkz.blog.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getArticles(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String categorySlug) {

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Article> articles;

        if (categorySlug != null) {
            var category = categoryService.getCategoryBySlug(categorySlug);
            if (category != null) {
                articles = articleService.getArticlesByCategory(category.getId(), pageable);
            } else {
                articles = Page.empty();
            }
        } else if (categoryId != null) {
            articles = articleService.getArticlesByCategory(categoryId, pageable);
        } else {
            articles = articleService.getArticles(pageable);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("articles", articles.getContent());
        result.put("pagination", Map.of(
                "page", page,
                "limit", limit,
                "total", articles.getTotalElements(),
                "pages", articles.getTotalPages()
        ));

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticle(@PathVariable String id) {
        Article article = articleService.getArticleById(id);
        if (article == null || !article.getPublished()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(article);
    }
}
