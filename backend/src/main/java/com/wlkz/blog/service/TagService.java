package com.wlkz.blog.service;

import com.wlkz.blog.entity.Tag;
import com.wlkz.blog.repository.TagRepository;
import com.wlkz.blog.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    public Tag getTagById(String id) {
        return tagRepository.findById(id).orElse(null);
    }

    public Tag getTagBySlug(String slug) {
        return tagRepository.findBySlug(slug).orElse(null);
    }

    public Tag createTag(String name, String slug) {
        if (tagRepository.existsByName(name)) {
            return null;
        }
        if (tagRepository.existsBySlug(slug)) {
            return null;
        }

        Tag tag = Tag.builder()
                .id(IdGenerator.generate())
                .name(name)
                .slug(slug)
                .build();

        return tagRepository.save(tag);
    }

    public long count() {
        return tagRepository.count();
    }
}
