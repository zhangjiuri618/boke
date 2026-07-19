package com.wlkz.blog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "article_tag")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleTag {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String articleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "articleId", insertable = false, updatable = false)
    private Article article;

    @Column(nullable = false, length = 64)
    private String tagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tagId", insertable = false, updatable = false)
    private Tag tag;
}
