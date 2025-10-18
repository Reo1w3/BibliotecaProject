import { useEffect, useState } from 'react'
import './App.css'

interface Cliente {
  "codigo_cliente": number
  "dpi": string
  "nombres": string
  "primer_apellido": string
  "segundo_apellido": string
  "genero": string
  "fecha_nacimiento": string
  "idioma_materno": string
  "grupo_etnico": string
  "nivel_escolar": string
  "telefono": string
  "email": string
  "departamento_residencia": string
  "municipio_residencia": string
  "estado": boolean
}

interface Libro {
  "codigo_libro": number
  "titulo": string
  "autor": string
  "editorial": string
  "fecha_publicacion": string
  "isbn": string
  "genero": string
  "descripcion": string
}

interface Prestamo {
  "codigo_prestamo": number
  "codigo_cliente": number
  "codigo_libro": number
  "fecha_prestamo": string
  "fecha_limite": string
  "fecha_devolucion": string | null
  "observaciones": boolean | null
}
function App() {
  const [cliente, setCliente] = useState([])
  const [libro, setLibro] = useState([])
  const [prestamo, setPrestamo] = useState([])

  useEffect(() => {
    fetch('http://localhost:8080/biblioteca/clientes')
      .then(response => response.json())
      .then(data => setCliente(data))
      .catch(error => console.error('Error fetching clientes:', error))

    fetch('http://localhost:8080/biblioteca/libros')
      .then(response => response.json())
      .then(data => setLibro(data))
      .catch(error => console.error('Error fetching libros:', error))

    fetch('http://localhost:8080/biblioteca/prestamos')
      .then(response => response.json())
      .then(data => setPrestamo(data))
      .catch(error => console.error('Error fetching prestamos:', error))
  }, []);

  return (
    <>
      <h1>Biblioteca</h1>
      <h2>Clientes</h2>
      <ul>
        {cliente.map((c: Cliente) => (
          <li key={c.codigo_cliente}>{c.nombres} {c.primer_apellido}</li>
        ))}
      </ul>
      <h2>Libros</h2>
      <ul>
        {libro.map((l: Libro) => (
          <li key={l.codigo_libro}>{l.titulo} - {l.autor}</li>
        ))}
      </ul>
      <h2>Préstamos</h2>
      <ul>
        {prestamo.map((p: Prestamo) => (
          <li key={p.codigo_prestamo}>{p.codigo_cliente} - {p.codigo_libro}</li>
        ))}
      </ul>
    </>
  )
}

export default App
