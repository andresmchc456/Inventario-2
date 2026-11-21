package com.sistema.inventario.repository;

import com.sistema.inventario.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Long> {
    Optional<Inventario> findByProductoId(Long productoId);

    @Query("SELECT i FROM Inventario i WHERE i.cantidadActual <= :umbral ORDER BY i.cantidadActual ASC")
    List<Inventario> findBajoStock(Integer umbral);
}
