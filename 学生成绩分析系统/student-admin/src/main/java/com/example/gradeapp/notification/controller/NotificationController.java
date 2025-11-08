package com.example.gradeapp.notification.controller;

import com.example.gradeapp.notification.model.Notification;
import com.example.gradeapp.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public List<Notification> list() {
        return notificationRepository.findAll();
    }

    @GetMapping("/{id}")
    public Notification get(@PathVariable Long id) {
        return notificationRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Notification create(@RequestBody Notification notification) {
        return notificationRepository.save(notification);
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setReadFlag(true);
            notificationRepository.save(notification);
        }
        return notification;
    }
}
