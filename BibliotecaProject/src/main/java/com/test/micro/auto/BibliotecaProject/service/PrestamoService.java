package com.test.micro.auto.BibliotecaProject.service;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.test.micro.auto.BibliotecaProject.entity.Prestamo;
import com.test.micro.auto.BibliotecaProject.entity.Cliente;
import com.test.micro.auto.BibliotecaProject.entity.Libro;
import com.test.micro.auto.BibliotecaProject.repository.PrestamoRepository;
import com.test.micro.auto.BibliotecaProject.repository.ClienteRepository;
import com.test.micro.auto.BibliotecaProject.repository.LibroRepository;

import jakarta.transaction.Transactional;

@Service
public class PrestamoService {
    @Autowired
    private PrestamoRepository prestamoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private LibroRepository libroRepository;
    
    public List<Prestamo> verPrestamos() {
        return prestamoRepository.findAll();
    }

    public ResponseEntity<Prestamo> obtenerPrestamoPorId(Long id) {
        Prestamo prestamo = prestamoRepository.findById(id).orElse(null);
        if (prestamo != null) {
            return ResponseEntity.ok(prestamo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Transactional
    public List<Prestamo> guardarPrestamo(List<Prestamo> prestamoList) {
        // 1) Validación en la misma petición: no más de 1 préstamo activo por cliente, y libros duplicados
        Map<Integer, Integer> activePerClient = new HashMap<>();
        Map<Integer, Integer> countPerBook = new HashMap<>();
        for (Prestamo p : prestamoList) {
            if (p.isActivo()) {
                int cnt = activePerClient.getOrDefault(p.getCodigoCliente(), 0) + 1;
                if (cnt > 1) {
                    throw new IllegalStateException("Se intenta crear más de un préstamo activo para el cliente " + p.getCodigoCliente() + " en la misma solicitud.");
                }
                activePerClient.put(p.getCodigoCliente(), cnt);
            }
            int bookCnt = countPerBook.getOrDefault(p.getCodigoLibro(), 0) + 1;
            if (bookCnt > 1) {
                throw new IllegalStateException("El mismo libro " + p.getCodigoLibro() + " aparece varias veces en la misma solicitud.");
            }
            countPerBook.put(p.getCodigoLibro(), bookCnt);
        }

        // 2) Validación contra la BD: cliente no debe tener préstamo activo; libro debe estar disponible
        for (Prestamo p : prestamoList) {
            // cliente existe?
            Optional<Cliente> maybeCliente = clienteRepository.findById(Long.valueOf(p.getCodigoCliente()));
            if (maybeCliente.isEmpty()) {
                throw new IllegalStateException("Cliente con id " + p.getCodigoCliente() + " no existe.");
            }

            if (p.isActivo()) {
                // Si ya existe algún préstamo activo para ese cliente -> error
                boolean clientHasActive = prestamoRepository.existsByCodigoClienteAndActivo(p.getCodigoCliente(), true);
                if (clientHasActive) {
                    throw new IllegalStateException("El cliente con id " + p.getCodigoCliente() + " ya tiene un préstamo activo.");
                }

                // libro existe y disponible?
                Optional<Libro> maybeLibro = libroRepository.findById(Long.valueOf(p.getCodigoLibro()));
                if (maybeLibro.isEmpty()) {
                    throw new IllegalStateException("Libro con id " + p.getCodigoLibro() + " no existe.");
                }
                // comprobar si hay préstamos activos que bloqueen el libro
                boolean bookHasActive = prestamoRepository.existsByCodigoLibroAndActivo(p.getCodigoLibro(), true);
                if (bookHasActive) {
                    throw new IllegalStateException("El libro con id " + p.getCodigoLibro() + " no está disponible.");
                }
            }
        }

        // 3) Guardar préstamos
        List<Prestamo> saved = prestamoRepository.saveAll(prestamoList);

        // 4) Actualizar cliente.estado y libro.disponible según los préstamos guardados
        for (Prestamo p : saved) {
            Long clientId = Long.valueOf(p.getCodigoCliente());
            clienteRepository.findById(clientId).ifPresent(cliente -> {
                boolean nuevoEstado = p.isActivo();
                cliente.setEstado(nuevoEstado);
                clienteRepository.save(cliente);
            });

            Long bookId = Long.valueOf(p.getCodigoLibro());
            libroRepository.findById(bookId).ifPresent(libro -> {
                if (p.isActivo()) {
                    libro.setDisponible(false);
                    libroRepository.save(libro);
                }
            });
        }

        return saved;
    }

    @Transactional
    public Prestamo actualizarPrestamo(Long id, Prestamo updated) {
        Prestamo existing = prestamoRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Prestamo con id " + id + " no encontrado."));

        // Guardar estado anterior para detectar cambios
        boolean wasActive = existing.isActivo();

        // Aplicar cambios
        existing.setCodigoCliente(updated.getCodigoCliente());
        existing.setCodigoLibro(updated.getCodigoLibro());
        existing.setFechaPrestamo(updated.getFechaPrestamo());
        existing.setFechaLimite(updated.getFechaLimite());
        existing.setFechaDevolucion(updated.getFechaDevolucion());
        existing.setObservaciones(updated.getObservaciones());
        existing.setActivo(updated.isActivo());

        // Validaciones: si ahora es activo=true, asegurarse que no existan otros prestamos activos del cliente
        if (existing.isActivo()) {
            List<Prestamo> activeClientLoans = prestamoRepository.findByCodigoClienteAndActivo(existing.getCodigoCliente(), true);
            List<Prestamo> otherActiveClientLoans = activeClientLoans.stream()
                    .filter(p -> !p.getCodigoPrestamo().equals(existing.getCodigoPrestamo()))
                    .collect(Collectors.toList());
            if (!otherActiveClientLoans.isEmpty()) {
                throw new IllegalStateException("El cliente con id " + existing.getCodigoCliente() + " ya tiene un préstamo activo.");
            }

            // comprobar disponibilidad del libro
            Optional<Libro> libOpt = libroRepository.findById(Long.valueOf(existing.getCodigoLibro()));
            if (libOpt.isEmpty()) {
                throw new IllegalStateException("Libro con id " + existing.getCodigoLibro() + " no existe.");
            }
            Libro libro = libOpt.get();
            List<Prestamo> activeBookLoans = prestamoRepository.findByCodigoLibroAndActivo(existing.getCodigoLibro(), true);
            List<Prestamo> otherActiveBookLoans = activeBookLoans.stream()
                    .filter(p -> !p.getCodigoPrestamo().equals(existing.getCodigoPrestamo()))
                    .collect(Collectors.toList());
            if (!libro.isDisponible() && !otherActiveBookLoans.isEmpty()) {
                throw new IllegalStateException("El libro con id " + existing.getCodigoLibro() + " no está disponible.");
            }
        }

        Prestamo saved = prestamoRepository.save(existing);

        // Efectos secundarios: actualizar cliente.estado y libro.disponible según transición
        boolean nowActive = saved.isActivo();

        // Si pasó de false -> true (se activó)
        if (!wasActive && nowActive) {
            clienteRepository.findById(Long.valueOf(saved.getCodigoCliente())).ifPresent(cliente -> {
                cliente.setEstado(true);
                clienteRepository.save(cliente);
            });
            libroRepository.findById(Long.valueOf(saved.getCodigoLibro())).ifPresent(libro -> {
                libro.setDisponible(false);
                libroRepository.save(libro);
            });
        }

        // Si pasó de true -> false (se finalizó)
        if (wasActive && !nowActive) {
            Long clId = Long.valueOf(saved.getCodigoCliente());
            List<Prestamo> activeForClient = prestamoRepository.findByCodigoClienteAndActivo(saved.getCodigoCliente(), true);
            boolean otherActiveForClient = activeForClient.stream()
                    .anyMatch(p -> !p.getCodigoPrestamo().equals(saved.getCodigoPrestamo()));
            if (!otherActiveForClient) {
                clienteRepository.findById(clId).ifPresent(cliente -> {
                    cliente.setEstado(false);
                    clienteRepository.save(cliente);
                });
            }

            Long bkId = Long.valueOf(saved.getCodigoLibro());
            List<Prestamo> activeForBook = prestamoRepository.findByCodigoLibroAndActivo(saved.getCodigoLibro(), true);
            boolean otherActiveForBook = activeForBook.stream()
                    .anyMatch(p -> !p.getCodigoPrestamo().equals(saved.getCodigoPrestamo()));
            if (!otherActiveForBook) {
                libroRepository.findById(bkId).ifPresent(libro -> {
                    libro.setDisponible(true);
                    libroRepository.save(libro);
                });
            }
        }

        return saved;
    }
}