package com.test.micro.auto.BibliotecaProject.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "clientes")

public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo_cliente;

    private String dpi;
    private String nombres;
    private String primer_apellido;
    private String segundo_apellido;
    private String genero;
    private String fecha_nacimiento;
    private String idioma_materno;
    private String grupo_etnico;
    private String nivel_escolar;
    private String telefono;
    private String email;
    private String departamento_residencia;
    private String municipio_residencia;
    private boolean estado;

}
