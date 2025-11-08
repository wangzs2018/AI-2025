package com.example.gradeapp.notification.repository;

import com.example.gradeapp.notification.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
