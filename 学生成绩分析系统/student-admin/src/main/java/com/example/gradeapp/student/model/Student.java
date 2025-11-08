package com.example.gradeapp.student.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String studentNo;
    private String name;
    private String gender;
    private Long classId;
    private String status;
    private Integer enrollYear;
    private Long tenantId;
    private Long campusId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
