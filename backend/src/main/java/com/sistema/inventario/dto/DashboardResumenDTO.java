package com.sistema.inventario.dto;

import com.sistema.inventario.model.Inventario;
import com.sistema.inventario.model.Venta;
import java.math.BigDecimal;
import java.util.List;

public class DashboardResumenDTO {
    private BigDecimal totalVentasIngresos;
    private Long cantidadVentas;
    private Long totalProductos;
    private Long productosBajoStock;
    private List<Inventario> listaBajoStock;
    private List<Venta> ultimasVentas;

    public DashboardResumenDTO() {}

    public BigDecimal getTotalVentasIngresos() {
        return totalVentasIngresos;
    }

    public void setTotalVentasIngresos(BigDecimal totalVentasIngresos) {
        this.totalVentasIngresos = totalVentasIngresos;
    }

    public Long getCantidadVentas() {
        return cantidadVentas;
    }

    public void setCantidadVentas(Long cantidadVentas) {
        this.cantidadVentas = cantidadVentas;
    }

    public Long getTotalProductos() {
        return totalProductos;
    }

    public void setTotalProductos(Long totalProductos) {
        this.totalProductos = totalProductos;
    }

    public Long getProductosBajoStock() {
        return productosBajoStock;
    }

    public void setProductosBajoStock(Long productosBajoStock) {
        this.productosBajoStock = productosBajoStock;
    }

    public List<Inventario> getListaBajoStock() {
        return listaBajoStock;
    }

    public void setListaBajoStock(List<Inventario> listaBajoStock) {
        this.listaBajoStock = listaBajoStock;
    }

    public List<Venta> getUltimasVentas() {
        return ultimasVentas;
    }

    public void setUltimasVentas(List<Venta> ultimasVentas) {
        this.ultimasVentas = ultimasVentas;
    }
}
