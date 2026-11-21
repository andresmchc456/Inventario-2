package com.sistema.inventario.controller;

import com.sistema.inventario.model.Admin;
import com.sistema.inventario.repository.AdminRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminRepository adminRepository;

    public AdminController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @GetMapping
    public ResponseEntity<List<Admin>> listar() {
        return ResponseEntity.ok(adminRepository.findAll());
    }
}
