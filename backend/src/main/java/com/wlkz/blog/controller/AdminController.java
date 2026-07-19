package com.wlkz.blog.controller;

import com.wlkz.blog.dto.ApiResponse;
import com.wlkz.blog.dto.ArticleRequest;
import com.wlkz.blog.entity.Article;
import com.wlkz.blog.entity.User;
import com.wlkz.blog.repository.UserRepository;
import com.wlkz.blog.service.ArticleService;
import com.wlkz.blog.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ArticleService articleService;
    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/articles")
    public ResponseEntity<Map<String, Object>> getArticles(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Article> articles = articleService.getAllArticles(pageable);

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

    @GetMapping("/articles/{id}")
    public ResponseEntity<Article> getArticle(@PathVariable String id) {
        Article article = articleService.getArticleById(id);
        if (article == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(article);
    }

    @PostMapping("/articles")
    public ResponseEntity<ApiResponse<Article>> createArticle(
            @RequestBody ArticleRequest request,
            @RequestHeader("Authorization") String token) {

        String jwtToken = token.replace("Bearer ", "");
        User user = authService.getUserByToken(jwtToken);

        if (user == null || !"admin".equals(user.getRole())) {
            return ResponseEntity.status(401).body(ApiResponse.error("需要管理员权限"));
        }

        Article article = articleService.createArticle(request, user.getId());
        return ResponseEntity.ok(ApiResponse.success("创建成功", article));
    }

    @PutMapping("/articles/{id}")
    public ResponseEntity<ApiResponse<Article>> updateArticle(
            @PathVariable String id,
            @RequestBody ArticleRequest request) {

        Article article = articleService.updateArticle(id, request);
        if (article == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.success("更新成功", article));
    }

    @DeleteMapping("/articles/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteArticle(@PathVariable String id) {
        articleService.deleteArticle(id);
        return ResponseEntity.ok(ApiResponse.success("删除成功", null));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(
            @PathVariable String id,
            @RequestBody Map<String, Object> request) {

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if ("admin-001".equals(id) && !"admin".equals(request.get("role"))) {
            return ResponseEntity.badRequest().body(ApiResponse.error("不能修改超级管理员角色"));
        }

        if (request.containsKey("name")) {
            user.setName((String) request.get("name"));
        }
        if (request.containsKey("email")) {
            user.setEmail((String) request.get("email"));
        }
        if (request.containsKey("role") && !"admin-001".equals(id)) {
            user.setRole((String) request.get("role"));
        }
        if (request.containsKey("password")) {
            user.setPassword(passwordEncoder.encode((String) request.get("password")));
        }

        user = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("更新成功", user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        if ("admin-001".equals(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("不能删除超级管理员"));
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("删除成功", null));
    }
}
