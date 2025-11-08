package com.example.gradeapp.grade.controller;

import com.example.gradeapp.grade.model.GradeApproval;
import com.example.gradeapp.grade.repository.GradeApprovalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/grade-approvals")
public class GradeApprovalController {
    @Autowired
    private GradeApprovalRepository gradeApprovalRepository;

    @GetMapping
    public List<GradeApproval> list() {
        return gradeApprovalRepository.findAll();
    }

    @GetMapping("/{id}")
    public GradeApproval get(@PathVariable Long id) {
        return gradeApprovalRepository.findById(id).orElse(null);
    }

    @PostMapping
    public GradeApproval create(@RequestBody GradeApproval approval) {
        return gradeApprovalRepository.save(approval);
    }

    @PutMapping("/{id}")
    public GradeApproval update(@PathVariable Long id, @RequestBody GradeApproval approval) {
        approval.setId(id);
        return gradeApprovalRepository.save(approval);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        gradeApprovalRepository.deleteById(id);
    }
}
