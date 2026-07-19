package com.wlkz.blog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleRequest {
    @NotBlank(message = "标题不能为空")
    private String title;

    private String summary;

    @NotBlank(message = "内容不能为空")
    private String content;

    private String coverImage;

    @NotBlank(message = "分类不能为空")
    private String categoryId;

    private Boolean featured;

    private List<String> tags;
}
