package com.test.micro.auto.BibliotecaProject.entity;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "prestamos")
public class Prestamo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo_prestamo;

    private int codigo_cliente;
    private int codigo_libro;  
    private Date fecha_prestamo;
    private Date fecha_limite;
    private Date fecha_devolucion;
    private String observaciones;
    private boolean activo;
}
