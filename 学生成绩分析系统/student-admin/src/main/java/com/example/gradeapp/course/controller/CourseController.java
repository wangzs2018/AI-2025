package com.example.gradeapp.course.controller;

import com.example.gradeapp.course.model.Course;
import com.example.gradeapp.course.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {
    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public List<Course> list() {
        return courseRepository.findAll();
    }

    @GetMapping("/{id}")
    public Course get(@PathVariable Long id) {
        return courseRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Course create(@RequestBody Course course) {
        return courseRepository.save(course);
    }

    @PutMapping("/{id}")
    public Course update(@PathVariable Long id, @RequestBody Course course) {
        course.setId(id);
        return courseRepository.save(course);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        courseRepository.deleteById(id);
    }
}
