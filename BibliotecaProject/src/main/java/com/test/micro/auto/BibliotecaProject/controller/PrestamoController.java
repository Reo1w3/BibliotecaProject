package com.test.micro.auto.BibliotecaProject.controller;

import java.io.Serializable;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.test.micro.auto.BibliotecaProject.entity.Prestamo;
import com.test.micro.auto.BibliotecaProject.service.PrestamoService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/biblioteca/prestamos")
public class PrestamoController implements Serializable{
    @Autowired
    private PrestamoService prestamoService;

    @GetMapping()
    public List<Prestamo> getPrestamos() {
        return prestamoService.verPrestamos();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Prestamo> getPrestamoPorId(@PathVariable Long id) {
        return prestamoService.obtenerPrestamoPorId(id);
    }

    @PostMapping()
    public List<Prestamo> guardarPrestamo(@RequestBody List<Prestamo> prestamo) {
        return prestamoService.guardarPrestamo(prestamo);
    }
    
    
}
