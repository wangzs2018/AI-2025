package com.example.gradeapp.student.repository;

import com.example.gradeapp.student.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Student findByStudentNo(String studentNo);
}
