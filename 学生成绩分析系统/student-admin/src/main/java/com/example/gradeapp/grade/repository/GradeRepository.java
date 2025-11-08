package com.example.gradeapp.grade.repository;

import com.example.gradeapp.grade.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GradeRepository extends JpaRepository<Grade, Long> {
}
