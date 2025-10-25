package com.test.micro.auto.BibliotecaProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    public ResponseEntity<Cliente> obtenerClientePorId(Long id) {
        Cliente cliente = clienteRepository.findById(id).orElse(null);
        if (cliente != null) {
            return ResponseEntity.ok(cliente);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<Cliente> actualizarCliente(Long id, Cliente clienteActualizado) {
        return clienteRepository.findById(id)
                .map(cliente -> {
                    cliente.setNombres(clienteActualizado.getNombres());
                    cliente.setPrimer_apellido(clienteActualizado.getPrimer_apellido());
                    cliente.setSegundo_apellido(clienteActualizado.getSegundo_apellido());
                    cliente.setTelefono(clienteActualizado.getTelefono());
                    cliente.setDepartamento_residencia(clienteActualizado.getDepartamento_residencia());
                    cliente.setMunicipio_residencia(clienteActualizado.getMunicipio_residencia());
                    cliente.setNivel_escolar(clienteActualizado.getNivel_escolar());
                    cliente.setEmail(clienteActualizado.getEmail());
                    Cliente updatedCliente = clienteRepository.save(cliente);
                    return ResponseEntity.ok(updatedCliente);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public List<Cliente> guardarCliente(List<Cliente> cliente) {
        return clienteRepository.saveAll(cliente);
    }
}
