package com.sistema.inventario.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class VentaRequestDTO {
    @NotNull(message = "El cliente es obligatorio")
    private Long clienteId;

    @NotEmpty(message = "La venta debe contener al menos un producto")
    @Valid
    private List<VentaItemDTO> items;

    public VentaRequestDTO() {}

    public VentaRequestDTO(Long clienteId, List<VentaItemDTO> items) {
        this.clienteId = clienteId;
        this.items = items;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public List<VentaItemDTO> getItems() {
        return items;
    }

    public void setItems(List<VentaItemDTO> items) {
        this.items = items;
    }
}
