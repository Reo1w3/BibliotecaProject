package com.test.micro.auto.BibliotecaProject.controller;

import java.io.Serializable;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.test.micro.auto.BibliotecaProject.entity.Prestamo;
import com.test.micro.auto.BibliotecaProject.service.PrestamoService;

@RestController
@RequestMapping("/api/biblioteca/prestamos")
public class PrestamoController implements Serializable{
    @Autowired
    private PrestamoService prestamoService;

    public List<Prestamo> getPrestamos() {
        return prestamoService.verPrestamos();
    }
}
