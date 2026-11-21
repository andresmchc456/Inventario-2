package com.sistema.inventario.service;

import com.sistema.inventario.dto.ProductoDTO;
import com.sistema.inventario.model.Inventario;
import com.sistema.inventario.model.Producto;
import com.sistema.inventario.repository.InventarioRepository;
import com.sistema.inventario.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;

    public ProductoService(ProductoRepository productoRepository, InventarioRepository inventarioRepository) {
        this.productoRepository = productoRepository;
        this.inventarioRepository = inventarioRepository;
    }

    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    public Producto findById(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    }

    @Transactional
    public Producto create(ProductoDTO dto) {
        if (productoRepository.existsBySku(dto.getSku())) {
            throw new RuntimeException("Ya existe un producto con el SKU: " + dto.getSku());
        }

        Producto producto = new Producto(
                dto.getNombre(),
                dto.getDescripcion(),
                dto.getPrecioUnitario(),
                dto.getSku()
        );

        Producto savedProducto = productoRepository.save(producto);

        // Crear registro de inventario inicial
        int stockInicial = dto.getStockInicial() != null ? dto.getStockInicial() : 0;
        Inventario inventario = new Inventario(savedProducto, stockInicial);
        inventarioRepository.save(inventario);
        savedProducto.setInventario(inventario);

        return savedProducto;
    }

    @Transactional
    public Producto update(Long id, ProductoDTO dto) {
        Producto producto = findById(id);

        if (!producto.getSku().equals(dto.getSku()) && productoRepository.existsBySku(dto.getSku())) {
            throw new RuntimeException("Ya existe otro producto con el SKU: " + dto.getSku());
        }

        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecioUnitario(dto.getPrecioUnitario());
        producto.setSku(dto.getSku());

        return productoRepository.save(producto);
    }

    @Transactional
    public void delete(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }
        productoRepository.deleteById(id);
    }
}
