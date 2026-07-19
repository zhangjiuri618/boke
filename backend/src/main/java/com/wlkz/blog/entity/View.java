package com.wlkz.blog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "view")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class View {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String articleId;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime date = LocalDateTime.now();
}
