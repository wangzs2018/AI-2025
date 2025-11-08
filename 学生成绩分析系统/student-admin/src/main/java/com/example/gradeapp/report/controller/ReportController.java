package com.example.gradeapp.report.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportGrades() {
        // 示例：导出CSV内容
        String csv = "学号,姓名,课程,成绩\n20230001,张三,程序设计基础,95\n20230002,李四,程序设计基础,88\n";
        byte[] data = csv.getBytes(StandardCharsets.UTF_8);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "grades.csv");
        return ResponseEntity.ok().headers(headers).body(data);
    }
}
