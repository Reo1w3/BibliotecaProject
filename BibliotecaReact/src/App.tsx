import React, { useEffect, useState } from 'react'
import './App.css'
 
interface Clientes{
  codigo_cliente: number
  dpi: string
  nombres: string
  primer_apellido: string
  segundo_apellido: string
  genero: string
  fecha_nacimiento: string
  idioma_materno: string
  grupo_etnico: string
  nivel_escolar: string
  telefono: string
  email: string
  departamento_residencia: string
  municipio_residencia: string
  estado: boolean
}

interface Libros{
  codigo_libro: number
  titulo: string
  autor: string
  editorial: string
  fecha_publicacion: string
  isbn: string
  genero: string
  descripcion: string
  disponible: boolean
}

interface Prestamos {
  codigoPrestamo: number;
  codigoCliente: number;
  codigoLibro: number;
  fechaPrestamo: string;
  fechaLimite: string;
  fechaDevolucion: string | null;
  observaciones: string | null;
  activo: boolean;
}

const API = '/api/biblioteca';

function App() {

    const [ventanaActiva, setVentanaActiva] = useState<string>("") // controla vistas
    const [cliente, setCliente] = useState<Clientes[]>([])
    const [libro, setLibro] = useState<Libros[]>([])
    const [prestamo, setPrestamo] = useState<Prestamos[]>([])

    const [clienteActivo, setClienteActivo] = useState<boolean>(false);
    const [libroDisponibleFlag, setLibroDisponibleFlag] = useState<boolean>(true);
    const [formError, setFormError] = useState<string | null>(null);

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
      codigoPrestamo: 0,
      codigoCliente: 0,
      codigoLibro: 0,
      fechaPrestamo: "",
      fechaLimite: "",
      fechaDevolucion: "",
      observaciones: null,
      activo: true
    });

    // Carga inicial y función de refresco
    const fetchAll = async () => {
      try {
        const [clientesRes, librosRes, prestamosRes] = await Promise.all([
          fetch(`${API}/clientes`),
          fetch(`${API}/libros`),
          fetch(`${API}/prestamos`)
        ]);
        const [clientesData, librosData, prestamosData] = await Promise.all([
          clientesRes.json(),
          librosRes.json(),
          prestamosRes.json()
        ]);
        setCliente(clientesData || []);
        setLibro(librosData || []);
        setPrestamo(prestamosData || []);
      } catch (error) {
        console.error("No se ha podido obtener data", error);
      }
    };

    useEffect(() => {
      fetchAll();
    }, []);

  // Observa cliente seleccionado para nuevo prestamo
  useEffect(() => {
    const clientId = nuevoPrestamo.codigoCliente;
    if (!clientId || clientId <= 0) {
      setClienteActivo(false);
      setFormError(null);
      return;
    }
    const c = cliente.find(cl => cl.codigo_cliente === clientId);
    if (c) {
      setClienteActivo(!!c.estado);
      if (c.estado) {
        const fullName = `${c.nombres || ''} ${c.primer_apellido || ''}`.trim();
        setFormError(fullName
          ? `El cliente ${fullName} (ID ${c.codigo_cliente}) ya tiene un préstamo activo. Finaliza ese préstamo antes de crear uno nuevo.`
          : `El cliente seleccionado (ID ${c.codigo_cliente}) ya tiene un préstamo activo. Finaliza ese préstamo antes de crear uno nuevo.`);
      } else {
        setFormError(null);
      }
    } else {
      setClienteActivo(false);
      setFormError(null);
    }
  }, [nuevoPrestamo.codigoCliente, cliente]);

  // Observa libro seleccionado para nuevo prestamo
  useEffect(() => {
    const bookId = nuevoPrestamo.codigoLibro;
    if (!bookId || bookId <= 0) {
      setLibroDisponibleFlag(true);
      return;
    }
    const b = libro.find(lb => lb.codigo_libro === bookId);
    if (b) {
      setLibroDisponibleFlag(!!b.disponible);
      if (!b.disponible) {
        setFormError(`El libro "${b.titulo || 'sin título'}" (ID ${b.codigo_libro}) no está disponible actualmente. Elige otro libro o espera a que se devuelva.`);
      } else {
        setFormError(prev => {
          if (prev && prev.toLowerCase().includes('cliente')) return prev;
          return null;
        });
      }
    } else {
      setLibroDisponibleFlag(true);
    }
  }, [nuevoPrestamo.codigoLibro, libro]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    const parsedValue: any = type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? '' : Number(value)) : value);

    if (ventanaActiva === "setClientes" || ventanaActiva === "editClientes") {
      setNuevoCliente((prevState) => ({
        ...(prevState as any),
        [name]: parsedValue
      }));
    } else if (ventanaActiva === "setLibros" || ventanaActiva === "editLibros") {
      setNuevoLibro((prevState) => ({
        ...(prevState as any),
        [name]: parsedValue
      }));
    } else if (ventanaActiva === "setPrestamos" || ventanaActiva === "editPrestamos") {
      setNuevoPrestamo((prevState) => ({
        ...(prevState as any),
        [name]: parsedValue
      }));
    }
  };

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(text || `Server responded with ${response.status}`);
    }
    
    const text = await response.text().catch(() => '');
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  };

  const stripId = (obj: any, idField: string) => {
    const copy: any = { ...obj };
    if (idField in copy) {
      delete copy[idField];
    }
    return copy;
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (ventanaActiva === "setClientes") {
      const payload = [stripId(nuevoCliente, "codigo_cliente")];
      fetch(`${API}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(handleResponse)
        .then(() => fetchAll())
        .then(() => {
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
          setVentanaActiva("getClientes");
        })
        .catch(error => {
          console.error("Error al agregar cliente:", error);
          alert("Error al agregar cliente: " + (error as Error).message);
        });
    } else if (ventanaActiva === "setLibros") {
      const payload = [stripId(nuevoLibro, "codigo_libro")];
      fetch(`${API}/libros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(handleResponse)
        .then(() => fetchAll())
        .then(() => {
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
          setVentanaActiva("getLibros");
        })
        .catch(error => {
          console.error("Error al agregar libro:", error);
          alert("Error al agregar libro: " + (error as Error).message);
        });
    } else if (ventanaActiva === "setPrestamos") {
      const payloadObj = { ...nuevoPrestamo };
      if ('codigoPrestamo' in payloadObj) delete (payloadObj as any).codigoPrestamo;

      if (nuevoPrestamo.codigoCliente <= 0) {
        alert("Seleccione/ingrese un Código de Cliente válido.");
        return;
      }
      if (nuevoPrestamo.codigoLibro <= 0) {
        alert("Seleccione/ingrese un Código de Libro válido.");
        return;
      }
      if (clienteActivo) {
        alert(formError || "El cliente seleccionado ya tiene un préstamo activo.");
        return;
      }
      if (!libroDisponibleFlag) {
        alert(formError || "El libro seleccionado no está disponible.");
        return;
      }

      fetch(`${API}/prestamos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([payloadObj]) // backend espera List<Prestamo> en POST
      })
        .then(handleResponse)
        .then(() => fetchAll())
        .then(() => {
          setNuevoPrestamo({
            codigoPrestamo: 0,
            codigoCliente: 0,
            codigoLibro: 0,
            fechaPrestamo: "",
            fechaLimite: "",
            fechaDevolucion: "",
            observaciones: null,
            activo: true
          });
          setVentanaActiva("getPrestamos");
          setFormError(null);
        })
        .catch((error) => {
          console.error("Error al agregar préstamo:", error);
          alert("Error al agregar préstamo: " + (error as Error).message);
        });
    }
  };

  // --- FUNCIONES DE EDICIÓN ---

  // Clientes (iniciar y enviar)
  const startEditCliente = (c: Clientes) => {
    setNuevoCliente({ ...c });
    setVentanaActiva("editClientes");
  };

  const submitEditCliente = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // PUT por id   
      const res = await fetch(`${API}/clientes/${nuevoCliente.codigo_cliente}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCliente)
      });
      await handleResponse(res);
      await fetchAll();
      setVentanaActiva("getClientes");
      setFormError(null);
    } catch (error: any) {
      console.error("Error al editar cliente:", error);
      alert("Error al editar cliente: " + (error?.message || error));
    }
  };

  // Libros: iniciar edición y enviar
  const startEditLibro = (l: Libros) => {
    setNuevoLibro({ ...l });
    setVentanaActiva("editLibros");
  };

  const submitEditLibro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/libros/${nuevoLibro.codigo_libro}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoLibro)
      });
      await handleResponse(res);
      await fetchAll();
      setVentanaActiva("getLibros");
      setFormError(null);
    } catch (error: any) {
      console.error("Error al editar libro:", error);
      alert("Error al editar libro: " + (error?.message || error));
    }
  };

  // Préstamos: iniciar edición (solo activos)
  const startEditPrestamo = (p: Prestamos) => {
    if (!p.activo) {
      alert("Solo se pueden editar préstamos activos.");
      return;
    }
    setNuevoPrestamo({ ...p });
    setVentanaActiva("editPrestamos");
  };

  // Enviar edición de préstamo; si finalizar=true, marcamos activo=false y ponemos fechaDevolucion si falta
  const submitEditPrestamo = async (e: React.FormEvent<HTMLFormElement> | any, finalizar = false) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    try {
      const payloadObj: any = { ...nuevoPrestamo };
      if (finalizar) {
        payloadObj.activo = false;
        if (!payloadObj.fechaDevolucion) {
          const hoy = new Date();
          payloadObj.fechaDevolucion = hoy.toISOString().slice(0,10); // yyyy-mm-dd
        }
      }

      const res = await fetch(`${API}/prestamos/${nuevoPrestamo.codigoPrestamo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadObj)
      });
      await handleResponse(res);

      // refrescar listas (clientes y libros se actualizarán según backend)
      await fetchAll();

      setVentanaActiva("getPrestamos");
      setFormError(null);
      setNuevoPrestamo({
        codigoPrestamo: 0,
        codigoCliente: 0,
        codigoLibro: 0,
        fechaPrestamo: "",
        fechaLimite: "",
        fechaDevolucion: "",
        observaciones: null,
        activo: true
      });
    } catch (error: any) {
      console.error("Error al editar préstamo:", error);
      alert("Error al editar préstamo: " + (error?.message || error));
    }
  };

  // Vista principal render
  return (
    <>
      <div className="parent">
        <div className="div1"> 
          <h1 className='titulo'>Biblioteca</h1>
          <div className="menu">
            <button className="buttonmenu" onClick={() => setVentanaActiva("Clientes")}>Clientes</button> <br />
            <button className="buttonmenu" onClick={() => setVentanaActiva("Libros")}>Libros</button> <br />
            <button className="buttonmenu" onClick={() => setVentanaActiva("Prestamos")}>Préstamos</button> <br />
          </div>
        </div>

        {ventanaActiva === "" && (
          <div className="divDatos">
            <h1>Bienvenido a la Biblioteca</h1>
            <p>Seleccione una opción del menú para comenzar.</p>
          </div>
        )}

        {ventanaActiva === "Clientes" && (
          <div className={"divClientes"}>
            <h1>Clientes</h1>
            <button className='button' onClick={() => setVentanaActiva("setClientes")}>Agregar</button>
            <button className='button' onClick={() => setVentanaActiva("getClientes")}>Ver</button>
          </div>
        )}

        {ventanaActiva === "getClientes" &&  (
          <div className={"divClientes"}>
            <h1>Mostrar Clientes</h1>
            <input type="number" placeholder="Buscar por Id" className='inputBuscar' onChange={(e) => {
              const searchTerm = e.target.value;
              if (searchTerm === "" || searchTerm <= "0") {
                fetch(`${API}/clientes`)
                  .then(response => response.json())
                  .then(data => setCliente(data))
                  .catch(error => console.error("No se ha podido obtener data", error));
              } else {
                fetch(`${API}/clientes/${searchTerm}`)
                  .then(response => response.json())
                  .then(data => setCliente([data]))
                  .catch(error => console.error("No se ha podido obtener data", error));
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
                <button className='button' onClick={() => startEditCliente(c)}>Editar</button>
              </div>
            ))}
          </div>
        )}

        {ventanaActiva === "setClientes" && (
          <div className={"divClientes"}>
            <h1>Agregar Cliente</h1>
            <form onSubmit={handleFormSubmit}>
              {/* campos para crear cliente */}
              <div>
                <label className='subtitulo'>DPI:</label><br />
                <input className='insertar' type="text" name="dpi" value={nuevoCliente.dpi} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Nombres:</label><br />
                <input className='insertar' type="text" name="nombres" value={nuevoCliente.nombres} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Primer Apellido:</label><br />
                <input className='insertar' type="text" name="primer_apellido" value={nuevoCliente.primer_apellido} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Segundo Apellido:</label><br />
                <input className='insertar' type="text" name="segundo_apellido" value={nuevoCliente.segundo_apellido} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Género:</label><br />
                <input className='insertar' type="text" name="genero" value={nuevoCliente.genero} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Fecha de Nacimiento:</label><br />
                <input className='insertar' type="date" name="fecha_nacimiento" value={nuevoCliente.fecha_nacimiento} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Idioma Materno:</label><br />
                <input className='insertar' type="text" name="idioma_materno" value={nuevoCliente.idioma_materno} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Grupo Étnico:</label><br />
                <input className='insertar' type="text" name="grupo_etnico" value={nuevoCliente.grupo_etnico} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Nivel Escolar:</label><br />
                <input className='insertar' type="text" name="nivel_escolar" value={nuevoCliente.nivel_escolar} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Teléfono:</label><br />
                <input className='insertar' type="text" name="telefono" value={nuevoCliente.telefono} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Email:</label><br />
                <input className='insertar' type="text" name="email" value={nuevoCliente.email} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Departamento de Residencia:</label><br />
                <input className='insertar' type="text" name="departamento_residencia" value={nuevoCliente.departamento_residencia} onChange={handleChange} />
              </div> 
              <div>
                <label className='subtitulo'>Municipio de Residencia:</label><br />
                <input className='insertar' type="text" name="municipio_residencia" value={nuevoCliente.municipio_residencia} onChange={handleChange} />
              </div>
              <button type="submit" className='button'>Guardar Cambios</button>
            </form>
          </div>
        )}

        {ventanaActiva === "editClientes" && (
          <div className={"divClientes"}>
            <h1>Editar Cliente (solo campos editables)</h1>
            <form onSubmit={submitEditCliente}>
              <div>
                <label className='subtitulo'>Código Cliente:</label><br />
                <input className='insertar' type="number" name="codigo_cliente" value={nuevoCliente.codigo_cliente} readOnly />
              </div>

              <div>
                <label className='subtitulo'>DPI:</label><br />
                <input className='insertar' type="text" name="dpi" value={nuevoCliente.dpi} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Nombres:</label><br />
                <input className='insertar' type="text" name="nombres" value={nuevoCliente.nombres} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Primer Apellido:</label><br />
                <input className='insertar' type="text" name="primer_apellido" value={nuevoCliente.primer_apellido} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Segundo Apellido:</label><br />
                <input className='insertar' type="text" name="segundo_apellido" value={nuevoCliente.segundo_apellido} onChange={handleChange} />
              </div>

              <div>
                <label className='subtitulo'>Género:</label><br />
                <input className='insertar' type="text" name="genero" value={nuevoCliente.genero} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Fecha de Nacimiento:</label><br />
                <input className='insertar' type="date" name="fecha_nacimiento" value={nuevoCliente.fecha_nacimiento} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Idioma Materno:</label><br />
                <input className='insertar' type="text" name="idioma_materno" value={nuevoCliente.idioma_materno} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Grupo Étnico:</label><br />
                <input className='insertar' type="text" name="grupo_etnico" value={nuevoCliente.grupo_etnico} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Nivel Escolar:</label><br />
                <input className='insertar' type="text" name="nivel_escolar" value={nuevoCliente.nivel_escolar} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Teléfono:</label><br />
                <input className='insertar' type="text" name="telefono" value={nuevoCliente.telefono} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Email:</label><br />
                <input className='insertar' type="text" name="email" value={nuevoCliente.email} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Departamento de Residencia:</label><br />
                <input className='insertar' type="text" name="departamento_residencia" value={nuevoCliente.departamento_residencia} onChange={handleChange} />
              </div> 
              <div>
                <label className='subtitulo'>Municipio de Residencia:</label><br />
                <input className='insertar' type="text" name="municipio_residencia" value={nuevoCliente.municipio_residencia} onChange={handleChange} />
              </div>

              <button type="submit" className='button'>Guardar Cambios</button>
              <button type="button" className='button' onClick={() => setVentanaActiva("getClientes")}>Cancelar</button>
            </form>
          </div>
        )}

        {ventanaActiva === "Libros" && (
          <div className={"divLibros"}>
            <h1>Libros</h1>
            <button className='button' onClick={() => setVentanaActiva("setLibros")}>Agregar</button>
            <button className='button' onClick={() => setVentanaActiva("getLibros")}>Ver</button>
          </div>
        )}

        {ventanaActiva === "getLibros" && (
          <div className={"divLibros"}>
            <h1>Mostrar Libros</h1>

            <input type="text" placeholder="Buscar por Id" className='inputBuscar' onChange={(e) => {
                const searchTerm = e.target.value;  
                if (searchTerm === "" || searchTerm <= "0") {
                  fetch(`${API}/libros`)
                .then(response => response.json())
                .then(data => setLibro(data))
                .catch(error =>{
                  console.error("No se ha podido obtener data", error);
                });
                } else {
                  fetch(`${API}/libros/${searchTerm}`)
                    .then(response => response.json())
                    .then(data => setLibro(data))
                    .catch(error => {
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
                <button className='button' onClick={() => startEditLibro(l)}>Editar</button>
              </div>
            ))}

          </div>
        )}

        {ventanaActiva === "setLibros" && (
          <div className={"divLibros"}>
            <h1>Agregar Libro</h1>
            <form onSubmit={handleFormSubmit}> 
              <div>
                <label className='subtitulo'>Título:</label><br />
                <input className='insertar' type="text" name="titulo" value={nuevoLibro.titulo} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Autor:</label><br /> 
                <input className='insertar' type="text" name="autor" value={nuevoLibro.autor} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Editorial:</label><br />
                <input className='insertar' type="text" name="editorial" value={nuevoLibro.editorial} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Fecha de Publicación:</label><br />
                <input className='insertar' type="text" name="fecha_publicacion" value={nuevoLibro.fecha_publicacion} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>ISBN:</label><br />
                <input className='insertar' type="text" name="isbn" value={nuevoLibro.isbn} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Género:</label><br />
                <input className='insertar' type="text" name="genero" value={nuevoLibro.genero} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Descripción:</label><br />
                <input className='insertar' type="text" name="descripcion" value={nuevoLibro.descripcion} onChange={handleChange} required />
              </div>
              
              <button type="submit" className='button'>Agregar Libro</button>
            </form>
          </div>
        )}

        {ventanaActiva === "editLibros" && (
          <div className={"divLibros"}>
            <h1>Editar Libro</h1>
            <form onSubmit={submitEditLibro}>
              <div>
                <label className='subtitulo'>Código Libro:</label><br />
                <input className='insertar' type="number" name="codigo_libro" value={nuevoLibro.codigo_libro} readOnly />
              </div>
              <div>
                <label className='subtitulo'>Título:</label><br />
                <input className='insertar' type="text" name="titulo" value={nuevoLibro.titulo} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Autor:</label><br />
                <input className='insertar' type="text" name="autor" value={nuevoLibro.autor} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Editorial:</label><br />
                <input className='insertar' type="text" name="editorial" value={nuevoLibro.editorial} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Fecha de Publicación:</label><br />
                <input className='insertar' type="text" name="fecha_publicacion" value={nuevoLibro.fecha_publicacion} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>ISBN:</label><br />
                <input className='insertar' type="text" name="isbn" value={nuevoLibro.isbn} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Género:</label><br />
                <input className='insertar' type="text" name="genero" value={nuevoLibro.genero} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Descripción:</label><br />
                <input className='insertar' type="text" name="descripcion" value={nuevoLibro.descripcion} onChange={handleChange} />
              </div>
              <div>
                <label className='subtitulo'>Disponible:</label><br />
                <input className='insertar' type="checkbox" name="disponible" checked={nuevoLibro.disponible} onChange={handleChange as any} />
              </div>

              <button type="submit" className='button'>Guardar Cambios</button>
              <button type="button" className='button' onClick={() => setVentanaActiva("getLibros")}>Cancelar</button>
            </form>
          </div>
        )}

        {ventanaActiva === "Prestamos" && (
          <div className={"divPrestamos"}>
            <h1>Préstamos</h1>
            <button className='button' onClick={() => setVentanaActiva("setPrestamos")}>Agregar</button>
            <button className='button' onClick={() => setVentanaActiva("getPrestamos")}>Ver</button>
          </div>
        )}

        {ventanaActiva === "getPrestamos" && (
          <div className={"divPrestamos"}>
            <h1>Mostrar Préstamos</h1>
            <input type="number" placeholder="Buscar por Id" className='inputBuscar' onChange={(e) => {
                const searchTerm = e.target.value;
                if (searchTerm === "" || searchTerm <= "0") {
                  fetch(`${API}/prestamos`)
                .then(response => response.json())
                .then(data => setPrestamo(data))
                .catch(error =>{
                  console.error("No se ha podido obtener data", error);
                });
                } else {
                  fetch(`${API}/prestamos/${searchTerm}`)
                .then(response => response.json())
                .then(data => setPrestamo([data]))
                .catch(error =>{
                  console.error("No se ha podido obtener data", error);
                });
                }
              }} />

            {prestamo.map((p: Prestamos) => (
              <div key={p.codigoPrestamo} className='datosPrestamos'>
                <h2>Préstamo #{p.codigoPrestamo}</h2>
                <p>Cliente: {p.codigoCliente}</p>
                <p>Libro: {p.codigoLibro}</p>
                <p>Fecha de Préstamo: {p.fechaPrestamo?.toString()}</p>
                <p>Fecha Límite: {p.fechaLimite?.toString()}</p>
                <p>Fecha de Devolución: {p.fechaDevolucion ? p.fechaDevolucion.toString() : 'No devuelto'}</p>
                <p>Observaciones: {p.observaciones || 'Ninguna'}</p>
                <p>Activo: {p.activo ? "Préstamo en Curso" : "Préstamo Finalizado"}</p>
                <button className='button' onClick={() => startEditPrestamo(p)} disabled={!p.activo}>Editar</button>
              </div>
            ))}
          </div>
        )}

        {ventanaActiva === "setPrestamos" && (
          <div className={"divPrestamos"}>
            <h1>Agregar Préstamo</h1>
            <form onSubmit={handleFormSubmit}>
              <div>
                <label className='subtitulo'>Código Cliente:</label><br />
                <input className='insertar' type="number" name="codigoCliente" value={nuevoPrestamo.codigoCliente} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Código Libro:</label><br />
                <input className='insertar' type="number" name="codigoLibro" value={nuevoPrestamo.codigoLibro} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Fecha de Préstamo:</label><br />
                <input className='insertar' type="date" name="fechaPrestamo" value={nuevoPrestamo.fechaPrestamo} onChange={handleChange} required />
              </div>
              <div>
                <label className='subtitulo'>Fecha Límite:</label><br />
                <input className='insertar' type="date" name="fechaLimite" value={nuevoPrestamo.fechaLimite} onChange={handleChange} required />
              </div>

              {formError && <p style={{ color: 'red' }}>{formError}</p>}
              {!libroDisponibleFlag && <p style={{ color: 'red' }}>El libro seleccionado no está disponible.</p>}

              <button type="submit" className='button' disabled={clienteActivo || !libroDisponibleFlag}>
                Agregar Préstamo
              </button>
            </form>
          </div>
        )}

        {ventanaActiva === "editPrestamos" && (
          <div className={"divPrestamos"}>
            <h1>Editar Préstamo (solo si estaba activo)</h1>
            <form onSubmit={(e) => submitEditPrestamo(e, false)}>
              <div>
                <label className='subtitulo'>Código Préstamo:</label><br />
                <input className='insertar' type="number" name="codigoPrestamo" value={nuevoPrestamo.codigoPrestamo} readOnly />
              </div>
              <div>
                <label className='subtitulo'>Código Cliente:</label><br />
                <input className='insertar' type="number" name="codigoCliente" value={nuevoPrestamo.codigoCliente} readOnly />
              </div>
              <div>
                <label className='subtitulo'>Código Libro:</label><br />
                <input className='insertar' type="number" name="codigoLibro" value={nuevoPrestamo.codigoLibro} readOnly />
              </div>

              <div>
                <label className='subtitulo'>Fecha de Devolución:</label><br />
                <input className='insertar' type="date" name="fechaDevolucion" value={nuevoPrestamo.fechaDevolucion || ''} onChange={handleChange} />
              </div>

              <div>
                <label className='subtitulo'>Observaciones:</label><br />
                <textarea className='insertar' name="observaciones" value={nuevoPrestamo.observaciones || ''} onChange={handleChange} />
              </div>

              <p>Nota: solo se permite editar fecha de entrega y observaciones. Para finalizar el préstamo pulse "Finalizar préstamo".</p>

              <button type="submit" className='button'>Guardar Cambios</button>
              <button type="button" className='button' onClick={() => submitEditPrestamo(null, true)}>Finalizar préstamo</button>
              <button type="button" className='button' onClick={() => setVentanaActiva("getPrestamos")}>Cancelar</button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

export default App