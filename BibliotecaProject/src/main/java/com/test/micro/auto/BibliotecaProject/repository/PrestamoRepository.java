package com.test.micro.auto.BibliotecaProject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.test.micro.auto.BibliotecaProject.entity.Prestamo;

public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {
    // Usar int para los códigos de cliente/libro, coherente con la entidad Prestamo
    boolean existsByCodigoClienteAndActivo(int codigoCliente, boolean activo);
    List<Prestamo> findByCodigoClienteAndActivo(int codigoCliente, boolean activo);

    boolean existsByCodigoLibroAndActivo(int codigoLibro, boolean activo);
    List<Prestamo> findByCodigoLibroAndActivo(int codigoLibro, boolean activo);
}