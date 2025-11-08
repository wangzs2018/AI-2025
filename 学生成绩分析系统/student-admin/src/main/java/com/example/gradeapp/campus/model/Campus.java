package com.example.gradeapp.campus.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "campus")
public class Campus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long tenantId;
    private String name;
    private String address;
    private String status;
}
