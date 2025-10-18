package com.test.micro.auto.BibliotecaProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.test.micro.auto.BibliotecaProject.entity.Cliente;
import com.test.micro.auto.BibliotecaProject.repository.ClienteRepository;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> verClientes() {
        return clienteRepository.findAll();
    }

    public List<Cliente> guardarCliente(List<Cliente> cliente) {
        return clienteRepository.saveAll(cliente);
    }
}
