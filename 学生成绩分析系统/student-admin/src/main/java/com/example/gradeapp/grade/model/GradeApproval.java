package com.example.gradeapp.grade.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "grade_approval")
public class GradeApproval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long gradeId;
    private Integer version;
    private Long submitterId;
    private Long reviewerId;
    private String status;
    private LocalDateTime submitAt;
    private LocalDateTime reviewAt;
    private String comment;
}
