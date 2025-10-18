package com.test.micro.auto.BibliotecaProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
}
