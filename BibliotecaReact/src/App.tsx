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
  "disponible": boolean
}

interface Prestamos{
  "codigo_prestamo": number
  "codigo_cliente": number
  "codigo_libro": number
  "fecha_prestamo": string
  "fecha_limite": string
  "fecha_devolucion": string | null
  "observaciones": string | null
  "Activo": boolean
}
function App() {
    const [activo, setActivo] = useState("")
    const [cliente, setCliente] = useState<Clientes[]>([])
    const [libro, setLibro] = useState<Libros[]>([])
    const [prestamo, setPrestamo] = useState<Prestamos[]>([])

    const [nuevoCliente, setNuevoCliente] = useState<Clientes>({
      codigo_cliente: 0,
      dpi: "",
      nombres: "",
      primer_apellido: "",
      segundo_apellido: "",
      genero: "",
      fecha_nacimiento: "",
      idioma_materno: "",
      grupo_etnico: "",
      nivel_escolar: "",
      telefono: "",
      email: "",
      departamento_residencia: "",
      municipio_residencia: "",
      estado: false
    }); 
    const [nuevoLibro, setNuevoLibro] = useState<Libros>({
      codigo_libro: 0,
      titulo: "",
      autor: "",
      editorial: "",
      fecha_publicacion: "",
      isbn: "",
      genero: "",
      descripcion: "",
      disponible: true
    });

    const [nuevoPrestamo, setNuevoPrestamo] = useState<Prestamos>({
      codigo_prestamo: 0,
      codigo_cliente: 0,
      codigo_libro: 0,
      fecha_prestamo: "",
      fecha_limite: "",
      fecha_devolucion: "",
      observaciones: null,
      Activo: true
    });

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

  // ...existing code...
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    // Normalizar valor según tipo de input
    const parsedValue: any = type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? '' : Number(value)) : value);

    // Fíjate: comparamos con "setClientes", "setLibros", "setPrestamos"
    if (activo === "setClientes") {
      setNuevoCliente((prevState) => ({
        ...(prevState as any),
        [name]: parsedValue
      }));
    } else if (activo === "setLibros") {
      setNuevoLibro((prevState) => ({
        ...(prevState as any),
        [name]: parsedValue
      }));
    } else if (activo === "setPrestamos") {
      setNuevoPrestamo((prevState) => ({
        ...(prevState as any),
        [name]: parsedValue
      }));
    }
  };
// ...existing code...

  // ...existing code...
const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  // Helper para procesar respuestas
  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(text || `Server responded with ${response.status}`);
    }
    return response.json();
  };

  // Helper: eliminar campos id autogenerados antes de enviar
  const stripId = (obj: any, idField: string) => {
    const copy: any = { ...obj };
    if (idField in copy) {
      delete copy[idField];
    }
    return copy;
  };

  if (activo === "setClientes") {
    const payload = [stripId(nuevoCliente, "codigo_cliente")];
    fetch('http://localhost:8080/api/biblioteca/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(handleResponse)
      .then((data) => {
        console.log("Cliente agregado:", data);
        // refrescar la lista de clientes
        return fetch('http://localhost:8080/api/biblioteca/clientes');
      })
      .then(res => res.json())
      .then(list => {
        setCliente(list);
        // limpiar formulario
        setNuevoCliente({
          codigo_cliente: 0,
          dpi: "",
          nombres: "",
          primer_apellido: "",
          segundo_apellido: "",
          genero: "",
          fecha_nacimiento: "",
          idioma_materno: "",
          grupo_etnico: "",
          nivel_escolar: "",
          telefono: "",
          email: "",
          departamento_residencia: "",
          municipio_residencia: "",
          estado: false
        });
        setActivo("getClientes");
      })
      .catch(error => {
        console.error("Error al agregar cliente:", error);
        alert("Error al agregar cliente: " + error.message);
      });
  } else if (activo === "setLibros") {
    const payload = [stripId(nuevoLibro, "codigo_libro")];
    fetch('http://localhost:8080/api/biblioteca/libros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(handleResponse)
      .then(() => fetch('http://localhost:8080/api/biblioteca/libros'))
      .then(res => res.json())
      .then(list => {
        setLibro(list);
        setNuevoLibro({
          codigo_libro: 0,
          titulo: "",
          autor: "",
          editorial: "",
          fecha_publicacion: "",
          isbn: "",
          genero: "",
          descripcion: "",
          disponible: true
        });
        setActivo("getLibros");
      })
      .catch(error => {
        console.error("Error al agregar libro:", error);
        alert("Error al agregar libro: " + error.message);
      });
  } else if (activo === "setPrestamos") {
    const payload = [stripId(nuevoPrestamo, "codigo_prestamo")];
    fetch('http://localhost:8080/api/biblioteca/prestamos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(handleResponse)
      .then(() => fetch('http://localhost:8080/api/biblioteca/prestamos'))
      .then(res => res.json())
      .then(list => {
        setPrestamo(list);
        setNuevoPrestamo({
          codigo_prestamo: 0,
          codigo_cliente: 0,
          codigo_libro: 0,
          fecha_prestamo: "",
          fecha_limite: "",
          fecha_devolucion: "",
          observaciones: null,
          Activo: true
        });
        setActivo("getPrestamos");
      })
      .catch(error => {
        console.error("Error al agregar préstamo:", error);
        alert("Error al agregar préstamo: " + error.message);
      });
  }
};
// ...existing code...

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
            
            <input type="number" placeholder="Buscar por Id" className='inputBuscar' onChange={(e) => {
              const searchTerm = e.target.value;
              if (searchTerm === "" || searchTerm <= "0") {
                // Si el término de búsqueda está vacío, obtener todos los clientes
                fetch('http://localhost:8080/api/biblioteca/clientes')
              .then(response => response.json())
              .then(data => setCliente(data))
              .catch(error =>{
                console.error("No se ha podido obtener data", error);
              });

              

              } else {
                // Filtrar los clientes por el término de búsqueda
                fetch(`http://localhost:8080/api/biblioteca/clientes/${searchTerm}`)
              .then(response => response.json())
              .then(data => setCliente([data])) // Envolver el resultado en un array
              .catch(error =>{
                console.error("No se ha podido obtener data", error);
              });
              
             
              }
            }} />

            {cliente.map((c: Clientes) => (
              <div key={c.codigo_cliente} className='datosClientes'>
                <h2>{c.nombres} {c.primer_apellido} {c.segundo_apellido}</h2>
                <p>Código Cliente: {c.codigo_cliente}</p>
                <p>DPI: {c.dpi}</p>
                <p>Teléfono: {c.telefono}</p>
                <p>Email: {c.email}</p>
                <h2>Información Adicional</h2>
                <p>Género: {c.genero}</p>
                <p>Fecha de Nacimiento: {c.fecha_nacimiento}</p>
                <p>Idioma Materno: {c.idioma_materno}</p>
                <p>Grupo Étnico: {c.grupo_etnico}</p>
                <p>Nivel Escolar: {c.nivel_escolar}</p>
                <p>Departamento de Residencia: {c.departamento_residencia}</p>
                <p>Municipio de Residencia: {c.municipio_residencia}</p>
                <p>Estado: {c.estado ? "Préstamo Activo" : "Préstamo Inactivo"}</p>
              </div>
            ))}
        </div>
        )}

        {activo === "setClientes" && (
          <div className={"divClientes"}>
          <h1>Agregar Cliente</h1>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label>DPI:</label>
              <input type="text" name="dpi" value={nuevoCliente.dpi} onChange={handleChange} />
            </div>
            <div>
              <label>Nombres:</label>
              <input type="text" name="nombres" value={nuevoCliente.nombres} onChange={handleChange} />
            </div>
            <div>
              <label>Primer Apellido:</label>
              <input type="text" name="primer_apellido" value={nuevoCliente.primer_apellido} onChange={handleChange} />
            </div>
            <div>
              <label>Segundo Apellido:</label>
              <input type="text" name="segundo_apellido" value={nuevoCliente.segundo_apellido} onChange={handleChange} />
            </div>
            <div>
              <label>Género:</label>
              <input type="text" name="genero" value={nuevoCliente.genero} onChange={handleChange} />
            </div>
            <div>
              <label>Fecha de Nacimiento:</label>
              <input type="date" name="fecha_nacimiento" value={nuevoCliente.fecha_nacimiento} onChange={handleChange} />
            </div>
            <div>
              <label>Idioma Materno:</label>
              <input type="text" name="idioma_materno" value={nuevoCliente.idioma_materno} onChange={handleChange} />
            </div>
            <div>
              <label>Grupo Étnico:</label>
              <input type="text" name="grupo_etnico" value={nuevoCliente.grupo_etnico} onChange={handleChange} />
            </div>
            <div>
              <label>Nivel Escolar:</label>
              <input type="text" name="nivel_escolar" value={nuevoCliente.nivel_escolar} onChange={handleChange} />
            </div>
            <div>
              <label>Teléfono:</label>
              <input type="text" name="telefono" value={nuevoCliente.telefono} onChange={handleChange} />
            </div>
            <div>
              <label>Email:</label>
              <input type="text" name="email" value={nuevoCliente.email} onChange={handleChange} />
            </div>
            <div>
              <label>Departamento de Residencia:</label>
              <input type="text" name="departamento_residencia" value={nuevoCliente.departamento_residencia} onChange={handleChange} />
            </div>
            <div>
              <label>Municipio de Residencia:</label>
              <input type="text" name="municipio_residencia" value={nuevoCliente.municipio_residencia} onChange={handleChange} />
            </div>  
            <div>
              <label>Estado:</label>
              <input type="checkbox" name="estado" checked={nuevoCliente.estado} onChange={(e) => setNuevoCliente((prevState) => ({
                ...prevState,
                estado: e.target.checked
              }))} />
            </div>

            <button type="submit" className='button'>Agregar Cliente</button>
          </form>
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

          <input type="text" placeholder="Buscar por Id" className='inputBuscar' onChange={(e) => {
              const searchTerm = e.target.value;
              if (searchTerm === "" || searchTerm <= "0") {
                // Si el término de búsqueda está vacío, obtener todos los libros
                fetch('http://localhost:8080/api/biblioteca/libros')
              .then(response => response.json())
              .then(data => setLibro(data))
              .catch(error =>{
                console.error("No se ha podido obtener data", error);
              });
              } else {
                // Filtrar los libros por el término de búsqueda
                fetch(`http://localhost:8080/api/biblioteca/libros/${searchTerm}`)
              .then(response => response.json())
              .then(data => setLibro([data])) // Envolver el resultado en un array
              .catch(error =>{
                console.error("No se ha podido obtener data", error);
              });
              }
            }} />
            
          {libro.map((l: Libros) => (
            <div key={l.codigo_libro} className='datosLibros'>
              <h2>{l.titulo}</h2>
              <p>Autor: {l.autor}</p>
              <p>Editorial: {l.editorial}</p>
              <p>Fecha de Publicación: {l.fecha_publicacion}</p>
              <p>ISBN: {l.isbn}</p>
              <p>Género: {l.genero}</p>
              <p>Descripción: {l.descripcion}</p>
              <p>Disponible: {l.disponible ? "Disponible" : "No Disponible"}</p>
            </div>
          ))}
        </div>
        )}

        {activo === "setLibros" && (
          <div className={"divLibros"}>
          <h1>Agregar Libro</h1>
          <form onSubmit={handleFormSubmit}> 
            <div>
              <label>Título:</label>
              <input type="text" name="titulo" value={nuevoLibro.titulo} onChange={handleChange} />
            </div>
            <div>
              <label>Autor:</label>
              <input type="text" name="autor" value={nuevoLibro.autor} onChange={handleChange} />
            </div>
            <div>
              <label>Editorial:</label>
              <input type="text" name="editorial" value={nuevoLibro.editorial} onChange={handleChange} />
            </div>
            <div>
              <label>Fecha de Publicación:</label>
              <input type="text" name="fecha_publicacion" value={nuevoLibro.fecha_publicacion} onChange={handleChange} />
            </div>
            <div>
              <label>ISBN:</label>
              <input type="text" name="isbn" value={nuevoLibro.isbn} onChange={handleChange} />
            </div>
            <div>
              <label>Género:</label>
              <input type="text" name="genero" value={nuevoLibro.genero} onChange={handleChange} />
            </div>
            <div>
              <label>Descripción:</label>
              <input type="text" name="descripcion" value={nuevoLibro.descripcion} onChange={handleChange} />
            </div>
            <div>
              <label>Disponible:</label>
              <input type="checkbox" name="disponible" checked={nuevoLibro.disponible} onChange={(e) => setNuevoLibro((prevState) => ({
                ...prevState,
                disponible: e.target.checked
              }))} />
            </div>
            <button type="submit" className='button'>Agregar Libro</button>
          </form>
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
          <input type="number" placeholder="Buscar por Id" className='inputBuscar' onChange={(e) => {
              const searchTerm = e.target.value;
              if (searchTerm === "" || searchTerm <= "0") {
                // Si el término de búsqueda está vacío, obtener todos los préstamos
                fetch('http://localhost:8080/api/biblioteca/prestamos')
              .then(response => response.json())
              .then(data => setPrestamo(data))
              .catch(error =>{
                console.error("No se ha podido obtener data", error);
              });
              } else {
                // Filtrar los préstamos por el término de búsqueda
                fetch(`http://localhost:8080/api/biblioteca/prestamos/${searchTerm}`)
              .then(response => response.json())
              .then(data => setPrestamo([data])) // Envolver el resultado en un array
              .catch(error =>{
                console.error("No se ha podido obtener data", error);
              });
              }
            }} />

          {prestamo.map((p: Prestamos) => (
            <div key={p.codigo_prestamo} className='datosPrestamos'>
              
              <h2>Préstamo #{p.codigo_prestamo}</h2>
              <p>Cliente: {p.codigo_cliente}</p>
              <p>Libro: {p.codigo_libro}</p>
              <p>Fecha de Préstamo: {p.fecha_prestamo.toString()}</p>
              <p>Fecha Límite: {p.fecha_limite.toString()}</p>
              <p>Fecha de Devolución: {p.fecha_devolucion ? p.fecha_devolucion.toString() : 'No devuelto'}</p>
              <p>Observaciones: {p.observaciones || 'Ninguna'}</p>
              <p>Activo: {p.Activo ? "Préstamo en Curso" : "Préstamo Finalizado"}</p>
            </div>
          ))}
        </div>
        )}

        {activo === "setPrestamos" && (
          <div className={"divPrestamos"}>
          <h1>Agregar Préstamo</h1>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label>Código Cliente:</label>
              <input type="number" name="codigo_cliente" value={nuevoPrestamo.codigo_cliente} onChange={handleChange} />
            </div>
            <div>
              <label>Código Libro:</label>
              <input type="number" name="codigo_libro" value={nuevoPrestamo.codigo_libro} onChange={handleChange} />
            </div>
            <div>
              <label>Fecha de Préstamo:</label>
              <input type="date" name="fecha_prestamo" value={nuevoPrestamo.fecha_prestamo} onChange={handleChange} />
            </div>
            <div>
              <label>Fecha Límite:</label>
              <input type="date" name="fecha_limite" value={nuevoPrestamo.fecha_limite} onChange={handleChange} />
            </div>
            <div>
              <label>Fecha de Devolución:</label>
              <input type="date" name="fecha_devolucion" value={nuevoPrestamo.fecha_devolucion ? nuevoPrestamo.fecha_devolucion : ""} onChange={handleChange} />
            </div>
            <div>
              <label>Observaciones:</label>
              <input type="text" name="observaciones" value={nuevoPrestamo.observaciones || ""} onChange={handleChange} />
            </div>
            <div>
              <label>Activo:</label>
              <input type="checkbox" name="Activo" checked={nuevoPrestamo.Activo} onChange={(e) => setNuevoPrestamo((prevState) => ({
                ...prevState,
                Activo: e.target.checked
              }))} />
            </div>
            <button type="submit" className='button'>Agregar Préstamo</button>
          </form>
        </div>
        )}
      </div>
    </>
  )
}

export default App
