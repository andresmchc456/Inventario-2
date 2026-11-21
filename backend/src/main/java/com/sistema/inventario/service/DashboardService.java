package com.sistema.inventario.service;

import com.sistema.inventario.dto.DashboardResumenDTO;
import com.sistema.inventario.model.Inventario;
import com.sistema.inventario.model.Venta;
import com.sistema.inventario.repository.InventarioRepository;
import com.sistema.inventario.repository.ProductoRepository;
import com.sistema.inventario.repository.VentaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;

    public DashboardService(
            VentaRepository ventaRepository,
            ProductoRepository productoRepository,
            InventarioRepository inventarioRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
        this.inventarioRepository = inventarioRepository;
    }

    public DashboardResumenDTO getResumen() {
        DashboardResumenDTO resumen = new DashboardResumenDTO();

        BigDecimal ingresosTotales = ventaRepository.sumTotalVentas();
        resumen.setTotalVentasIngresos(ingresosTotales != null ? ingresosTotales : BigDecimal.ZERO);

        resumen.setCantidadVentas(ventaRepository.count());
        resumen.setTotalProductos(productoRepository.count());

        List<Inventario> bajoStock = inventarioRepository.findBajoStock(10);
        resumen.setProductosBajoStock((long) bajoStock.size());
        resumen.setListaBajoStock(bajoStock);

        List<Venta> ultimasVentas = ventaRepository.findTop5RecentVentas();
        resumen.setUltimasVentas(ultimasVentas);

        return resumen;
    }
}
