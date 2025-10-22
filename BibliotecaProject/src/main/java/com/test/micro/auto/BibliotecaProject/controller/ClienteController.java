package com.test.micro.auto.BibliotecaProject.controller;

import java.io.Serializable;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.test.micro.auto.BibliotecaProject.entity.Cliente;
import com.test.micro.auto.BibliotecaProject.service.ClienteService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/biblioteca/clientes")

public class ClienteController implements Serializable {
   
    @Autowired
    private ClienteService clienteService;

    @GetMapping()
    public List<Cliente> getClientes() {
        return clienteService.verClientes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getClientePorId(@PathVariable Long id) {
        return clienteService.obtenerClientePorId(id);
    }

    @PostMapping()
    public List<Cliente> crearCliente(@RequestBody List<Cliente> cliente) {
        return clienteService.guardarCliente(cliente);
    }
    
}
