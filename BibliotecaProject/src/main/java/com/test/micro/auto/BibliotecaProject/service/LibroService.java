package com.test.micro.auto.BibliotecaProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.test.micro.auto.BibliotecaProject.entity.Libro;
import com.test.micro.auto.BibliotecaProject.repository.LibroRepository;

@Service
public class LibroService {
    @Autowired
    private LibroRepository libroRepository;
    
    public List<Libro> verLibros() {
        return libroRepository.findAll();
    }
}
