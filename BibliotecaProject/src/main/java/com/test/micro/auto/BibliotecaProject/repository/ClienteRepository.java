package com.test.micro.auto.BibliotecaProject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.test.micro.auto.BibliotecaProject.entity.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long>{

}
