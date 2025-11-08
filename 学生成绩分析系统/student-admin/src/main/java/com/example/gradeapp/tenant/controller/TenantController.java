package com.example.gradeapp.tenant.controller;

import com.example.gradeapp.tenant.model.Tenant;
import com.example.gradeapp.tenant.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tenants")
public class TenantController {
    @Autowired
    private TenantRepository tenantRepository;

    @GetMapping
    public List<Tenant> list() {
        return tenantRepository.findAll();
    }

    @PostMapping
    public Tenant create(@RequestBody Tenant tenant) {
        return tenantRepository.save(tenant);
    }
}
