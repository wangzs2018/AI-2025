package com.example.gradeapp.course.repository;

import com.example.gradeapp.course.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Course findByCourseCode(String courseCode);
}
