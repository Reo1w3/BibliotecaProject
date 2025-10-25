package com.test.micro.auto.BibliotecaProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    public ResponseEntity<Libro> obtenerLibroPorId(Long id) {
        Libro libro = libroRepository.findById(id).orElse(null);
        if (libro != null) {
            return ResponseEntity.ok(libro);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<Libro> actualizarLibro(Long id, Libro libroActualizado) {
        return libroRepository.findById(id)
                .map(libro -> {
                    libro.setTitulo(libroActualizado.getTitulo());
                    libro.setAutor(libroActualizado.getAutor());
                    libro.setGenero(libroActualizado.getGenero());
                    libro.setFecha_publicacion(libroActualizado.getFecha_publicacion());
                    libro.setEditorial(libroActualizado.getEditorial());
                    Libro updatedLibro = libroRepository.save(libro);
                    return ResponseEntity.ok(updatedLibro);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public List<Libro> guardarLibro(List<Libro> libro) {
        return libroRepository.saveAll(libro);
    }
    
}
