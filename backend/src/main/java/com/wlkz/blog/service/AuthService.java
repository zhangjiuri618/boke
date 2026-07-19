package com.wlkz.blog.service;

import com.wlkz.blog.dto.AuthResponse;
import com.wlkz.blog.dto.LoginRequest;
import com.wlkz.blog.dto.RegisterRequest;
import com.wlkz.blog.entity.User;
import com.wlkz.blog.repository.UserRepository;
import com.wlkz.blog.util.IdGenerator;
import com.wlkz.blog.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailOrName(request.getUsername(), request.getUsername())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("用户名或密码错误")
                    .build();
        }

        String token = jwtUtil.generateToken(user.getId(), user.getName(), user.getRole());

        return AuthResponse.builder()
                .success(true)
                .token(token)
                .username(user.getName())
                .role(user.getRole())
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByName(request.getUsername())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("用户名已被注册")
                    .build();
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("邮箱已被注册")
                    .build();
        }

        User user = User.builder()
                .id(IdGenerator.generate())
                .name(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("author")
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getName(), user.getRole());

        return AuthResponse.builder()
                .success(true)
                .token(token)
                .username(user.getName())
                .build();
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public User getUserByToken(String token) {
        try {
            String userId = jwtUtil.getUserId(token);
            return userRepository.findById(userId).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }
}
