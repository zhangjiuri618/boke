package com.wlkz.blog.controller;

import com.wlkz.blog.entity.Article;
import com.wlkz.blog.service.ArticleService;
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
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {

        if (q.isBlank()) {
            Map<String, Object> result = new HashMap<>();
            result.put("articles", Map.of());
            result.put("total", 0);
            return ResponseEntity.ok(result);
        }

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "views"));
        Page<Article> articles = articleService.searchArticles(q, pageable);

        Map<String, Object> result = new HashMap<>();
        result.put("articles", articles.getContent());
        result.put("total", articles.getTotalElements());
        result.put("pagination", Map.of(
                "page", page,
                "limit", limit,
                "pages", articles.getTotalPages()
        ));

        return ResponseEntity.ok(result);
    }
}
