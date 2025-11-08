package com.example.gradeapp.auth.controller;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        // 示例：直接返回token，实际应校验用户名密码
        Map<String, Object> result = new HashMap<>();
        result.put("token", "mock-jwt-token");
        result.put("user", body.get("username"));
        return result;
    }

    @PostMapping("/refresh")
    public Map<String, Object> refresh() {
        Map<String, Object> result = new HashMap<>();
        result.put("token", "mock-jwt-token-refreshed");
        return result;
    }

    @PostMapping("/logout")
    public Map<String, Object> logout() {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        return result;
    }
}
