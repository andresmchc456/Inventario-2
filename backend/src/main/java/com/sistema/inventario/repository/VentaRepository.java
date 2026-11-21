package com.sistema.inventario.repository;

import com.sistema.inventario.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findAllByOrderByFechaVentaDesc();

    @Query("SELECT COALESCE(SUM(v.total), 0) FROM Venta v")
    BigDecimal sumTotalVentas();

    @Query("SELECT v FROM Venta v ORDER BY v.fechaVenta DESC LIMIT 5")
    List<Venta> findTop5RecentVentas();
}
