package com.example.gradeapp.campus.repository;

import com.example.gradeapp.campus.model.Campus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampusRepository extends JpaRepository<Campus, Long> {
}
