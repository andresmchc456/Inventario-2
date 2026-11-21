package com.sistema.inventario.config;

import com.sistema.inventario.dto.ProductoDTO;
import com.sistema.inventario.dto.VentaItemDTO;
import com.sistema.inventario.dto.VentaRequestDTO;
import com.sistema.inventario.model.Admin;
import com.sistema.inventario.model.Cliente;
import com.sistema.inventario.repository.AdminRepository;
import com.sistema.inventario.repository.ClienteRepository;
import com.sistema.inventario.service.ClienteService;
import com.sistema.inventario.service.ProductoService;
import com.sistema.inventario.service.VentaService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            AdminRepository adminRepository,
            ClienteRepository clienteRepository,
            ProductoService productoService,
            ClienteService clienteService,
            VentaService ventaService) {
        return args -> {
            // Inicializar Admin si no existe
            if (adminRepository.count() == 0) {
                Admin admin = new Admin("admin", "$2a$12$e8wZ3o9h9j3gW7p4q3m4E.eU2jW3u9yG7h5k6l7m8n9o0p1q2r3s4", "admin@sistema.local");
                adminRepository.save(admin);
            }

            // Inicializar Clientes si no existen
            if (clienteRepository.count() == 0) {
                clienteService.create(new Cliente("Empresa Alfa S.A.C.", "contacto@empresaalfa.com", "+51 987654321", "Av. Principal 123, Lima"));
                clienteService.create(new Cliente("Comercializadora Beta", "ventas@comercialbetaperu.com", "+51 912345678", "Jr. Los Olivos 456, Arequipa"));
                clienteService.create(new Cliente("Distribuidora Gamma", "adquisiciones@distribuidoragamma.com", "+51 999888777", "Calle Las Flores 789, Trujillo"));
            }

            // Inicializar Productos e Inventario si no existen
            if (productoService.findAll().isEmpty()) {
                var p1 = productoService.create(new ProductoDTO(null, "Laptop Pro 16\"", "Potente laptop para desarrollo y diseño, 32GB RAM, 1TB SSD", new BigDecimal("1850.00"), "LAP-PRO-16", 25));
                var p2 = productoService.create(new ProductoDTO(null, "Monitor UltraWide 34\"", "Monitor curvo 144Hz IPS para productividad", new BigDecimal("499.99"), "MON-UW-34", 8)); // Stock bajo (<10)
                var p3 = productoService.create(new ProductoDTO(null, "Teclado Mecánico RGB", "Switches mecánicos táctiles inalámbricos", new BigDecimal("89.50"), "TEC-MEC-RGB", 50));
                var p4 = productoService.create(new ProductoDTO(null, "Mouse Ergonómico Inalámbrico", "Sensor óptico de alta precisión recargable", new BigDecimal("45.00"), "MOU-ERG-01", 5)); // Stock bajo (<10)
                var p5 = productoService.create(new ProductoDTO(null, "Auriculares Noise Cancelling", "Cancelación de ruido activa y audio espacial", new BigDecimal("199.00"), "AUR-NC-02", 15));

                // Crear una venta inicial de prueba
                List<Cliente> clientes = clienteRepository.findAll();
                if (!clientes.isEmpty()) {
                    Cliente primerCliente = clientes.get(0);
                    VentaRequestDTO ventaDTO = new VentaRequestDTO(
                            primerCliente.getId(),
                            Arrays.asList(
                                    new VentaItemDTO(p1.getId(), 1),
                                    new VentaItemDTO(p3.getId(), 2)
                            )
                    );
                    ventaService.registrarVenta(ventaDTO);
                }
            }
        };
    }
}
