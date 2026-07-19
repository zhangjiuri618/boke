package com.wlkz.blog.controller;

import com.wlkz.blog.dto.ApiResponse;
import com.wlkz.blog.dto.CommentRequest;
import com.wlkz.blog.entity.Comment;
import com.wlkz.blog.entity.User;
import com.wlkz.blog.service.AuthService;
import com.wlkz.blog.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@RequestParam(required = false) String articleId) {
        if (articleId != null) {
            return ResponseEntity.ok(commentService.getCommentsByArticleId(articleId));
        }
        return ResponseEntity.ok(List.of());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Comment>> createComment(
            @Valid @RequestBody CommentRequest request,
            @RequestHeader(value = "Authorization", required = false) String token) {

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(ApiResponse.error("请先登录"));
        }

        String jwtToken = token.replace("Bearer ", "");
        User user = authService.getUserByToken(jwtToken);

        if (user == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("请先登录"));
        }

        Comment comment = commentService.createComment(request, user.getId());
        return ResponseEntity.ok(ApiResponse.success("评论成功", comment));
    }
}
