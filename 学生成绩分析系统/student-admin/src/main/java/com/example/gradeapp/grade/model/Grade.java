package com.example.gradeapp.grade.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "grade")
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long studentId;
    private Long courseId;
    private String term;
    private Double scoreRaw;
    private Double scoreFinal;
    private Double gradePoint;
    private String status;
    private String approvalState;
    private Long tenantId;
    private Long campusId;
    private String auditState;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
