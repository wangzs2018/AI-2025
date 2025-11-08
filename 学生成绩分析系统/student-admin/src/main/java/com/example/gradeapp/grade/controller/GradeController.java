package com.example.gradeapp.grade.controller;

import com.example.gradeapp.grade.model.Grade;
import com.example.gradeapp.grade.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/grades")
public class GradeController {
    @Autowired
    private GradeRepository gradeRepository;

    @GetMapping
    public List<Grade> list() {
        return gradeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Grade get(@PathVariable Long id) {
        return gradeRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Grade create(@RequestBody Grade grade) {
        return gradeRepository.save(grade);
    }

    @PutMapping("/{id}")
    public Grade update(@PathVariable Long id, @RequestBody Grade grade) {
        grade.setId(id);
        return gradeRepository.save(grade);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        gradeRepository.deleteById(id);
    }
}
