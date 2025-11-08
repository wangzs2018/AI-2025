package com.example.gradeapp.campus.controller;

import com.example.gradeapp.campus.model.Campus;
import com.example.gradeapp.campus.repository.CampusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/campuses")
public class CampusController {
    @Autowired
    private CampusRepository campusRepository;

    @GetMapping
    public List<Campus> list() {
        return campusRepository.findAll();
    }

    @PostMapping
    public Campus create(@RequestBody Campus campus) {
        return campusRepository.save(campus);
    }
}
