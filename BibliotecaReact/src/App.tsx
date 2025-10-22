import { useEffect, useState } from 'react'
import './App.css'

interface Clientes{
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

interface Libros{
  "codigo_libro": number
  "titulo": string
  "autor": string
  "editorial": string
  "fecha_publicacion": string
  "isbn": string
  "genero": string
  "descripcion": string
}

interface Prestamos{
  "codigo_prestamo": number
  "codigo_cliente": number
  "codigo_libro": number
  "fecha_prestamo": string
  "fecha_limite": string
  "fecha_devolucion": string | null
  "observaciones": boolean | null
}
function App() {
    const [activo, setActivo] = useState("")
    const [cliente, setCliente] = useState([])
    const [libro, setLibro] = useState([])
    const [prestamo, setPrestamo] = useState([])

    useEffect(()=>{
      fetch('http://localhost:8080/api/biblioteca/clientes')
      .then(response => response.json())
      .then(data => setCliente(data))
      .catch(error =>{
        console.error("No se ha podido obtener data", error);
      })

      fetch('http://localhost:8080/api/biblioteca/libros')
      .then(response => response.json())
      .then(data => setLibro(data))
      .catch(error =>{
        console.error("No se ha podido obtener data", error);
      })

      fetch('http://localhost:8080/api/biblioteca/prestamos')
      .then(response => response.json())
      .then(data => setPrestamo(data))
      .catch(error =>{
        console.error("No se ha podido obtener data", error);
      })
    },
    []

  );

  
  
  return (
    <>
      <div className="parent">
        <div className="div1"> 
          <h1 className='titulo'>Biblioteca</h1>
          <button className="button" onClick={() => setActivo("Clientes")}>Clientes</button> <br></br>
          <button className="button" onClick={() => setActivo("Libros")}>Libros</button> <br></br>
          <button className="button" onClick={() => setActivo("Prestamos")}>Préstamos</button> <br></br>
        </div>

        {activo === "" && (
          <div className="divDatos">
            <h1>Bienvenido a la Biblioteca</h1>
            <p>Seleccione una opción del menú para comenzar.</p>
            
          </div>
        )}

        {activo === "Clientes" && (
          <div className={"divClientes"}>
          <h1>Clientes</h1>
          <button className='button'onClick={() => setActivo("setClientes")}>Agregar</button>
          <button className='button'onClick={() => setActivo("getClientes")}>Ver</button>
          
        </div>
        )}

        {activo === "getClientes" &&  (
          <div className={"divClientes"}>
          
            <h1>Mostrar Clientes</h1>
            
            {cliente.map((c: Clientes) => (
            <div key={c.codigo_cliente} className='datosClientes'>
              <h2>{c.nombres} {c.primer_apellido} {c.segundo_apellido}</h2>
              <p>Código Cliente: {c.codigo_cliente}</p>
              <p>DPI: {c.dpi}</p>
              <p>Teléfono: {c.telefono}</p>
              <p>Email: {c.email}</p>
            </div>
          ))}
        </div>
        )}

        {activo === "Libros" && (
          <div className={"divLibros"}>
          <h1>Libros</h1>
          <button className='button'onClick={() => setActivo("setLibros")}>Agregar</button>
          <button className='button'onClick={() => setActivo("getLibros")}>Ver</button>

        </div>
        )}

        {activo === "getLibros" && (
          <div className={"divLibros"}>
          <h1>Mostrar Libros</h1>
          {libro.map((l: Libros) => (

            <div key={l.codigo_libro} className='datosLibros'>
              <h2>{l.titulo}</h2>
              <p>Autor: {l.autor}</p>
              <p>Editorial: {l.editorial}</p>
              <p>Fecha de Publicación: {l.fecha_publicacion}</p>
              <p>ISBN: {l.isbn}</p>
              <p>Género: {l.genero}</p>
              <p>Descripción: {l.descripcion}</p>
            </div>
          ))}
        </div>
        )}

        {activo === "Prestamos" && (
          <div className={"divPrestamos"}>
          <h1>Préstamos</h1>
          <button className='button'onClick={() => setActivo("setPrestamos")}>Agregar</button>
          <button className='button'onClick={() => setActivo("getPrestamos")}>Ver</button>

        </div>
        )}

        {activo === "getPrestamos" && (
          <div className={"divPrestamos"}>
          <h1>Mostrar Préstamos</h1>
          {prestamo.map((p: Prestamos) => (
            <div key={p.codigo_prestamo} className='datosPrestamos'>
              
              <h2>Préstamo #{p.codigo_prestamo}</h2>
              <p>Cliente: {p.codigo_cliente}</p>
              <p>Libro: {p.codigo_libro}</p>
              <p>Fecha de Préstamo: {p.fecha_prestamo}</p>
              <p>Fecha Límite: {p.fecha_limite}</p>
              <p>Fecha de Devolución: {p.fecha_devolucion}</p>
              <p>Observaciones: {p.observaciones ? 'Sí' : 'No'}</p>
            </div>
          ))}
        </div>
        )}
        
        
      </div>
    </>
  )
}

export default App
