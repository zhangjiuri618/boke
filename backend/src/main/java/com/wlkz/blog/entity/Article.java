package com.wlkz.blog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "article")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Article {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @Column(length = 500)
    private String coverImage;

    @Column(nullable = false)
    @Builder.Default
    private Boolean published = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean featured = false;

    @Column(nullable = false)
    @Builder.Default
    private Integer views = 0;

    @Column(nullable = false, length = 64)
    private String categoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryId", insertable = false, updatable = false)
    private Category category;

    @Column(nullable = false, length = 64)
    private String authorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "authorId", insertable = false, updatable = false)
    private User author;

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL)
    @Builder.Default
    private List<ArticleTag> tags = new ArrayList<>();

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
