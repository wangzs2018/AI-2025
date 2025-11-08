package com.example.gradeapp.grade.repository;

import com.example.gradeapp.grade.model.GradeApproval;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GradeApprovalRepository extends JpaRepository<GradeApproval, Long> {
}
