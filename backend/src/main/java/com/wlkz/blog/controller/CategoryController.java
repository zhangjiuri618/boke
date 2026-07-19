package com.wlkz.blog.controller;

import com.wlkz.blog.dto.ApiResponse;
import com.wlkz.blog.dto.CategoryRequest;
import com.wlkz.blog.entity.Category;
import com.wlkz.blog.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Category>> createCategory(@Valid @RequestBody CategoryRequest request) {
        Category category = categoryService.createCategory(request);
        if (category == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("分类名称或别名已存在"));
        }
        return ResponseEntity.ok(ApiResponse.success("创建成功", category));
    }
}
