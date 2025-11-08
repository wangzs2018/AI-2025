package com.example.gradeapp.notification.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long tenantId;
    private Long campusId;
    private String type;
    private String title;
    private String content;
    private String targetRole;
    private Long targetId;
    private LocalDateTime createdAt;
    private Boolean readFlag;
}
