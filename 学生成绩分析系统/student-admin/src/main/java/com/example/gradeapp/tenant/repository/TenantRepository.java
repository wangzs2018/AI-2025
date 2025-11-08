package com.example.gradeapp.tenant.repository;

import com.example.gradeapp.tenant.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
}
