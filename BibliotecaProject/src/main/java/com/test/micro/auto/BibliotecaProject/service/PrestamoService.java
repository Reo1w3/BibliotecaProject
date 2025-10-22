package com.test.micro.auto.BibliotecaProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.test.micro.auto.BibliotecaProject.entity.Prestamo;
import com.test.micro.auto.BibliotecaProject.repository.PrestamoRepository;

@Service
public class PrestamoService {
    @Autowired
    private PrestamoRepository prestamoRepository;
    
    public List<Prestamo> verPrestamos() {
        return prestamoRepository.findAll();
    }

    public ResponseEntity<Prestamo> obtenerPrestamoPorId(Long id) {
        Prestamo prestamo = prestamoRepository.findById(id).orElse(null);
        if (prestamo != null) {
            return ResponseEntity.ok(prestamo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public List<Prestamo> guardarPrestamo(List<Prestamo> prestamo) {
        return prestamoRepository.saveAll(prestamo);
    }
}
