package com.example.gradeapp.student.controller;

import com.example.gradeapp.student.model.Student;
import com.example.gradeapp.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {
    @Autowired
    private StudentRepository studentRepository;

    @GetMapping
    public List<Student> list() {
        return studentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Student get(@PathVariable Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Student create(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @RequestBody Student student) {
        student.setId(id);
        return studentRepository.save(student);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        studentRepository.deleteById(id);
    }
}
