package com.wlkz.blog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {
    @NotBlank(message = "分类名称不能为空")
    private String name;

    @NotBlank(message = "分类别名不能为空")
    private String slug;
}
