package com.wlkz.blog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, length = 64)
    private String articleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "articleId", insertable = false, updatable = false)
    private Article article;

    @Column(nullable = false, length = 64)
    private String authorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "authorId", insertable = false, updatable = false)
    private User author;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
