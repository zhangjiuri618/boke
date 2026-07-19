package com.wlkz.blog.service;

import com.wlkz.blog.dto.CategoryRequest;
import com.wlkz.blog.entity.Category;
import com.wlkz.blog.repository.CategoryRepository;
import com.wlkz.blog.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(String id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public Category getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug).orElse(null);
    }

    public Category createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            return null;
        }
        if (categoryRepository.existsBySlug(request.getSlug())) {
            return null;
        }

        Category category = Category.builder()
                .id(IdGenerator.generate())
                .name(request.getName())
                .slug(request.getSlug())
                .build();

        return categoryRepository.save(category);
    }

    public long count() {
        return categoryRepository.count();
    }
}
