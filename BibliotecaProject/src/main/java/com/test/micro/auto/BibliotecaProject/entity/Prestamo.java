package com.test.micro.auto.BibliotecaProject.entity;

import java.sql.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonAlias;

@Data
@Entity
@Table(name = "prestamos")
public class Prestamo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codigo_prestamo")
    private Long codigoPrestamo;

    @Column(name = "codigo_cliente")
    private int codigoCliente;

    @Column(name = "codigo_libro")
    private int codigoLibro;
    
    @Column(name = "fecha_prestamo")
    private Date fechaPrestamo;

    @Column(name = "fecha_limite")
    private Date fechaLimite;

    @Column(name = "fecha_devolucion")
    private Date fechaDevolucion;

    private String observaciones;

    @JsonAlias({"Activo", "activo"})
    private boolean activo;

    // Explicit getters and setters (in case Lombok is not processed)
    public Long getCodigoPrestamo() {
        return codigoPrestamo;
    }

    public void setCodigoPrestamo(Long codigoPrestamo) {
        this.codigoPrestamo = codigoPrestamo;
    }

    public int getCodigoCliente() {
        return codigoCliente;
    }

    public void setCodigoCliente(int codigoCliente) {
        this.codigoCliente = codigoCliente;
    }

    public int getCodigoLibro() {
        return codigoLibro;
    }

    public void setCodigoLibro(int codigoLibro) {
        this.codigoLibro = codigoLibro;
    }

    public Date getFechaPrestamo() {
        return fechaPrestamo;
    }

    public void setFechaPrestamo(Date fechaPrestamo) {
        this.fechaPrestamo = fechaPrestamo;
    }

    public Date getFechaLimite() {
        return fechaLimite;
    }

    public void setFechaLimite(Date fechaLimite) {
        this.fechaLimite = fechaLimite;
    }

    public Date getFechaDevolucion() {
        return fechaDevolucion;
    }

    public void setFechaDevolucion(Date fechaDevolucion) {
        this.fechaDevolucion = fechaDevolucion;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}