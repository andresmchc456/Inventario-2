package com.sistema.inventario.controller;

import com.sistema.inventario.dto.InventarioAjusteDTO;
import com.sistema.inventario.model.Inventario;
import com.sistema.inventario.service.InventarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventarios")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @GetMapping
    public ResponseEntity<List<Inventario>> listar() {
        return ResponseEntity.ok(inventarioService.findAll());
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<Inventario> obtenerPorProductoId(@PathVariable Long productoId) {
        return ResponseEntity.ok(inventarioService.findByProductoId(productoId));
    }

    @PutMapping("/producto/{productoId}/ajustar")
    public ResponseEntity<Inventario> ajustarStock(
            @PathVariable Long productoId,
            @Valid @RequestBody InventarioAjusteDTO dto) {
        return ResponseEntity.ok(inventarioService.ajustarStock(productoId, dto.getNuevaCantidad()));
    }

    @GetMapping("/bajo-stock")
    public ResponseEntity<List<Inventario>> listarBajoStock(@RequestParam(defaultValue = "10") Integer umbral) {
        return ResponseEntity.ok(inventarioService.findBajoStock(umbral));
    }
}
