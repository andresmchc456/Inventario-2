package com.sistema.inventario.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class InventarioAjusteDTO {
    @NotNull(message = "La nueva cantidad es obligatoria")
    @PositiveOrZero(message = "La cantidad no puede ser negativa")
    private Integer nuevaCantidad;

    public InventarioAjusteDTO() {}

    public InventarioAjusteDTO(Integer nuevaCantidad) {
        this.nuevaCantidad = nuevaCantidad;
    }

    public Integer getNuevaCantidad() {
        return nuevaCantidad;
    }

    public void setNuevaCantidad(Integer nuevaCantidad) {
        this.nuevaCantidad = nuevaCantidad;
    }
}
