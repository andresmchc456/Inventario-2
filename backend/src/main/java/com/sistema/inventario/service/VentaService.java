package com.sistema.inventario.service;

import com.sistema.inventario.dto.VentaItemDTO;
import com.sistema.inventario.dto.VentaRequestDTO;
import com.sistema.inventario.model.*;
import com.sistema.inventario.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;
    private final FacturaRepository facturaRepository;

    public VentaService(
            VentaRepository ventaRepository,
            ClienteRepository clienteRepository,
            ProductoRepository productoRepository,
            InventarioRepository inventarioRepository,
            FacturaRepository facturaRepository) {
        this.ventaRepository = ventaRepository;
        this.clienteRepository = clienteRepository;
        this.productoRepository = productoRepository;
        this.inventarioRepository = inventarioRepository;
        this.facturaRepository = facturaRepository;
    }

    public List<Venta> findAll() {
        return ventaRepository.findAllByOrderByFechaVentaDesc();
    }

    public Venta findById(Long id) {
        return ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con ID: " + id));
    }

    @Transactional
    public Venta registrarVenta(VentaRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + dto.getClienteId()));

        Venta venta = new Venta(cliente, LocalDateTime.now(), BigDecimal.ZERO);
        BigDecimal totalCalculado = BigDecimal.ZERO;

        for (VentaItemDTO itemDTO : dto.getItems()) {
            Producto producto = productoRepository.findById(itemDTO.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + itemDTO.getProductoId()));

            Inventario inventario = inventarioRepository.findByProductoId(producto.getId())
                    .orElseThrow(() -> new RuntimeException("Inventario no disponible para el producto: " + producto.getNombre()));

            if (inventario.getCantidadActual() < itemDTO.getCantidad()) {
                throw new RuntimeException(String.format("Stock insuficiente para '%s'. Disponible: %d, Solicitado: %d",
                        producto.getNombre(), inventario.getCantidadActual(), itemDTO.getCantidad()));
            }

            // Descontar inventario
            inventario.setCantidadActual(inventario.getCantidadActual() - itemDTO.getCantidad());
            inventario.setFechaUltimaActualizacion(LocalDateTime.now());
            inventarioRepository.save(inventario);

            // Crear detalle
            DetalleVenta detalle = new DetalleVenta(
                    venta,
                    producto,
                    itemDTO.getCantidad(),
                    producto.getPrecioUnitario()
            );

            venta.addDetalle(detalle);
            totalCalculado = totalCalculado.add(detalle.getSubtotal());
        }

        venta.setTotal(totalCalculado);
        Venta savedVenta = ventaRepository.save(venta);

        // Generar Factura correlativa automáticamente
        long totalFacturas = facturaRepository.count();
        String correlativo = String.format("FAC-%s-%06d",
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMM")),
                totalFacturas + 1);

        Factura factura = new Factura(savedVenta, correlativo, LocalDateTime.now());
        facturaRepository.save(factura);
        savedVenta.setFactura(factura);

        return savedVenta;
    }
}
