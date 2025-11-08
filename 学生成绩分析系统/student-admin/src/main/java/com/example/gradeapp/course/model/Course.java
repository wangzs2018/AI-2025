package com.example.gradeapp.course.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "course")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String courseCode;
    private String name;
    private Double credit;
    private String dept;
    private String term;
    private Long teacherId;
    private Long tenantId;
    private Long campusId;
}
