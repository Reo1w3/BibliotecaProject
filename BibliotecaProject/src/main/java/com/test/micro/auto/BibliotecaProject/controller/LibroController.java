package com.test.micro.auto.BibliotecaProject.controller;

import java.io.Serializable;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.test.micro.auto.BibliotecaProject.entity.Libro;
import com.test.micro.auto.BibliotecaProject.service.LibroService;

@RestController
@RequestMapping("/api/biblioteca/libros")
public class LibroController implements Serializable{
    @Autowired
    private LibroService libroService;

    public List<Libro> getLibros() {
        return libroService.verLibros();
    }
}
