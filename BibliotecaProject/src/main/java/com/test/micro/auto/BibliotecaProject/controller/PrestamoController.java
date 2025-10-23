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
import org.springframework.web.bind.annotation.PutMapping;
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
    public ResponseEntity<?> guardarPrestamo(@RequestBody List<Prestamo> prestamo) {
        try {
            List<Prestamo> saved = prestamoService.guardarPrestamo(prestamo);
            return ResponseEntity.ok(saved);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPrestamo(@PathVariable Long id, @RequestBody Prestamo prestamo) {
        try {
            Prestamo updated = prestamoService.actualizarPrestamo(id, prestamo);
            return ResponseEntity.ok(updated);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno: " + e.getMessage());
        }
    }
}