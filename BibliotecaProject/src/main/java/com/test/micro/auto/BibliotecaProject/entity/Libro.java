package com.test.micro.auto.BibliotecaProject.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "libros")

public class Libro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo_libro;

    private String titulo;
    private String autor;
    private String editorial;
    private String fecha_publicacion;
    private String isbn;
    private String genero;
    private String descripcion;
}
