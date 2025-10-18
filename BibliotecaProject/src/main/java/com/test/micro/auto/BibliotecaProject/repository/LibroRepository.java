package com.test.micro.auto.BibliotecaProject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.test.micro.auto.BibliotecaProject.entity.Libro;

public interface LibroRepository extends JpaRepository<Libro, Long> {

}
