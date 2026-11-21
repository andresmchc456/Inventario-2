package com.sistema.inventario.service;

import com.sistema.inventario.model.Inventario;
import com.sistema.inventario.repository.InventarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventarioService {

    private final InventarioRepository inventarioRepository;

    public InventarioService(InventarioRepository inventarioRepository) {
        this.inventarioRepository = inventarioRepository;
    }

    public List<Inventario> findAll() {
        return inventarioRepository.findAll();
    }

    public Inventario findByProductoId(Long productoId) {
        return inventarioRepository.findByProductoId(productoId)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado para el producto con ID: " + productoId));
    }

    @Transactional
    public Inventario ajustarStock(Long productoId, Integer nuevaCantidad) {
        Inventario inventario = findByProductoId(productoId);
        inventario.setCantidadActual(nuevaCantidad);
        inventario.setFechaUltimaActualizacion(LocalDateTime.now());
        return inventarioRepository.save(inventario);
    }

    public List<Inventario> findBajoStock(Integer umbral) {
        int limite = (umbral != null && umbral >= 0) ? umbral : 10;
        return inventarioRepository.findBajoStock(limite);
    }
}
