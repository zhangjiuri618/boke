package com.wlkz.blog.service;

import com.wlkz.blog.repository.ArticleRepository;
import com.wlkz.blog.repository.CategoryRepository;
import com.wlkz.blog.repository.ViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;
    private final ViewRepository viewRepository;

    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("articleCount", articleRepository.count());
        stats.put("categoryCount", categoryRepository.count());
        stats.put("viewCount", viewRepository.count());
        return stats;
    }
}
