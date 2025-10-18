package com.test.micro.auto.BibliotecaProject.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.test.micro.auto.BibliotecaProject.entity.Prestamo;

public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {

}
