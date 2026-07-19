package com.wlkz.blog.controller;

import com.wlkz.blog.entity.Tag;
import com.wlkz.blog.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<List<Tag>> getTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @PostMapping
    public ResponseEntity<?> createTag(@RequestBody Tag request) {
        Tag tag = tagService.createTag(request.getName(), request.getSlug());
        if (tag == null) {
            return ResponseEntity.badRequest().body("{\"success\": false, \"message\": \"标签名称或别名已存在\"}");
        }
        return ResponseEntity.ok("{\"success\": true, \"tag\": " + tag + "}");
    }
}
