package com.wlkz.blog.service;

import com.wlkz.blog.dto.ArticleRequest;
import com.wlkz.blog.entity.Article;
import com.wlkz.blog.entity.ArticleTag;
import com.wlkz.blog.entity.View;
import com.wlkz.blog.repository.ArticleRepository;
import com.wlkz.blog.repository.ArticleTagRepository;
import com.wlkz.blog.repository.CommentRepository;
import com.wlkz.blog.repository.ViewRepository;
import com.wlkz.blog.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final ArticleTagRepository articleTagRepository;
    private final ViewRepository viewRepository;
    private final CommentRepository commentRepository;

    public Page<Article> getArticles(Pageable pageable) {
        return articleRepository.findByPublishedTrue(pageable);
    }

    public Page<Article> getArticlesByCategory(String categoryId, Pageable pageable) {
        return articleRepository.findByPublishedTrueAndCategoryId(categoryId, pageable);
    }

    public Page<Article> searchArticles(String keyword, Pageable pageable) {
        return articleRepository.search(keyword, pageable);
    }

    @Transactional
    public Article getArticleById(String id) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article != null && article.getPublished()) {
            articleRepository.incrementViews(id);
            View view = View.builder()
                    .id(IdGenerator.generate())
                    .articleId(id)
                    .build();
            viewRepository.save(view);
        }
        return article;
    }

    @Transactional
    public Article createArticle(ArticleRequest request, String authorId) {
        Article article = Article.builder()
                .id(IdGenerator.generate())
                .title(request.getTitle())
                .summary(request.getSummary())
                .content(request.getContent())
                .coverImage(request.getCoverImage())
                .categoryId(request.getCategoryId())
                .authorId(authorId)
                .published(true)
                .featured(request.getFeatured() != null && request.getFeatured())
                .views(0)
                .build();

        article = articleRepository.save(article);

        if (request.getTags() != null && !request.getTags().isEmpty()) {
            for (String tagId : request.getTags()) {
                ArticleTag articleTag = ArticleTag.builder()
                        .id(IdGenerator.generate())
                        .articleId(article.getId())
                        .tagId(tagId)
                        .build();
                articleTagRepository.save(articleTag);
            }
        }

        return article;
    }

    @Transactional
    public Article updateArticle(String id, ArticleRequest request) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) return null;

        if (request.getTitle() != null) article.setTitle(request.getTitle());
        if (request.getSummary() != null) article.setSummary(request.getSummary());
        if (request.getContent() != null) article.setContent(request.getContent());
        if (request.getCoverImage() != null) article.setCoverImage(request.getCoverImage());
        if (request.getCategoryId() != null) article.setCategoryId(request.getCategoryId());
        if (request.getFeatured() != null) article.setFeatured(request.getFeatured());

        article = articleRepository.save(article);

        if (request.getTags() != null) {
            articleTagRepository.deleteByArticleId(id);
            for (String tagId : request.getTags()) {
                ArticleTag articleTag = ArticleTag.builder()
                        .id(IdGenerator.generate())
                        .articleId(article.getId())
                        .tagId(tagId)
                        .build();
                articleTagRepository.save(articleTag);
            }
        }

        return article;
    }

    @Transactional
    public void deleteArticle(String id) {
        articleTagRepository.deleteByArticleId(id);
        commentRepository.deleteByArticleId(id);
        viewRepository.deleteByArticleId(id);
        articleRepository.deleteById(id);
    }

    public Page<Article> getAllArticles(Pageable pageable) {
        return articleRepository.findAll(pageable);
    }

    public long count() {
        return articleRepository.count();
    }
}
