package com.wlkz.blog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {
    @NotBlank(message = "文章ID不能为空")
    private String articleId;

    @NotBlank(message = "评论内容不能为空")
    private String content;
}
