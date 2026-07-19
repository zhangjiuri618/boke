package com.wlkz.blog.service;

import com.wlkz.blog.dto.CommentRequest;
import com.wlkz.blog.entity.Comment;
import com.wlkz.blog.repository.CommentRepository;
import com.wlkz.blog.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public List<Comment> getCommentsByArticleId(String articleId) {
        return commentRepository.findByArticleIdOrderByCreatedAtDesc(articleId);
    }

    public Comment createComment(CommentRequest request, String authorId) {
        Comment comment = Comment.builder()
                .id(IdGenerator.generate())
                .content(request.getContent())
                .articleId(request.getArticleId())
                .authorId(authorId)
                .build();

        return commentRepository.save(comment);
    }

    public void deleteComment(String id) {
        commentRepository.deleteById(id);
    }

    public long count() {
        return commentRepository.count();
    }
}
