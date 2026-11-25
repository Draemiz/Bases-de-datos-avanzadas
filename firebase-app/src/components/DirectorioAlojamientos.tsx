import "./DirectorioAlojamientos.css";
import { useState, type FormEvent } from "react";
import { consultarAlojamientos, tiposAlojamiento, type Alojamiento, type CursorAlojamiento, type FiltroAlojamiento } from "../services/alojamientoService";

export const DirectorioAlojamientos = () => {
  const [modo, setModo] = useState<FiltroAlojamiento["modo"]>("disponibles");
  const [filtroActivo, setFiltroActivo] = useState<FiltroAlojamiento>();
  const [alojamientos, setAlojamientos] = useState<Alojamiento[]>();
  const [cursores, setCursores] = useState<(CursorAlojamiento | undefined)[]>([]);
  const [siguiente, setSiguiente] = useState<CursorAlojamiento>();
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargar = async (filtro: FiltroAlojamiento, destino: number, cursor?: CursorAlojamiento) => {
    if (cargando) return;
    setCargando(true);
    setMensaje("");
    setError("");
    try {
      const resultado = await consultarAlojamientos(filtro, cursor);
      if (destino > pagina && resultado.alojamientos.length === 0) {
        setSiguiente(undefined);
        setMensaje("Ya estás en la última página.");
        return;
      }
      setFiltroActivo(filtro);
      setAlojamientos(resultado.alojamientos);
      setPagina(destino);
      setSiguiente(resultado.alojamientos.length === 10 ? resultado.ultimoDocumento : undefined);
      setCursores((actuales) => destino === 1 ? [undefined] : Object.assign([...actuales], { [destino - 1]: cursor }));
    } catch (error) {
      console.error("Error al consultar alojamientos:", error);
      setError("No se pudo completar la consulta. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const buscar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    switch (modo) {
      case "ciudad":
        return cargar({ modo, ciudad: String(datos.get("ciudad")) }, 1);
      case "tipo":
        return cargar({ modo, tipo: datos.get("tipo") as Alojamiento["tipo"] }, 1);
      case "disponibles":
        return cargar({ modo }, 1);
      case "precio": {
        const desde = Number(datos.get("desde"));
        const hasta = Number(datos.get("hasta"));
        if (desde > hasta) {
          setError("El precio mínimo debe ser menor o igual al máximo.");
          return;
        }
        return cargar({ modo, desde, hasta }, 1);
      }
    }
  };

  const filtros = [
    ["disponibles", "✓", "Disponibles"],
    ["ciudad", "⌖", "Ciudad"],
    ["tipo", "⌂", "Tipo"],
    ["precio", "$", "Precio por noche"],
  ] as const;

  return (
    <section id="hoteles" className="estancias" aria-labelledby="hoteles-titulo">
      <header className="estancias-hero">
        <h1 id="hoteles-titulo">Directorio de hoteles y alojamientos</h1>
        <p>Encuentra tu próxima estancia por destino, tipo o presupuesto.</p>
      </header>

      <form className="estancias-filtros" onSubmit={buscar}>
        <fieldset disabled={cargando}>
          <legend>Buscar por</legend>
          <div className="estancias-opciones">
            {filtros.map(([valor, icono, texto]) => (
              <label key={valor}>
                <input type="radio" name="modo" value={valor} checked={modo === valor}
                  onChange={() => setModo(valor)} />
                <span><span aria-hidden="true">{icono}</span>{texto}</span>
              </label>
            ))}
          </div>

          <div className="estancias-campos">
            {modo === "ciudad" && <label>Ciudad <select name="ciudad">
              {["Quito", "Cuenca", "Baños", "Manta"].map((ciudad) => <option key={ciudad}>{ciudad}</option>)}
            </select></label>}
            {modo === "tipo" && <label>Tipo de alojamiento <select name="tipo">
              {tiposAlojamiento.map((tipo) => <option key={tipo}>{tipo}</option>)}
            </select></label>}
            {modo === "precio" && <>
              <label>Mínimo (USD) <input name="desde" type="number" min="0" step="0.01" defaultValue="30" required /></label>
              <label>Máximo (USD) <input name="hasta" type="number" min="0" step="0.01" defaultValue="80" required /></label>
            </>}
            <button type="submit"><span aria-hidden="true">⌕</span> Buscar alojamientos</button>
          </div>
        </fieldset>
      </form>

      <section className="estancias-resultados" aria-labelledby="estancias-resultados">
        <header>
          <h2 id="estancias-resultados">Resultados</h2>
          {alojamientos && <span aria-live="polite">Página {pagina} · {alojamientos.length} {alojamientos.length === 1 ? "alojamiento" : "alojamientos"}</span>}
        </header>
        {cargando && <p role="status">Consultando alojamientos…</p>}
        {error && <p role="alert">{error}</p>}
        {mensaje && <p role="status">{mensaje}</p>}
        {!alojamientos && !cargando && !error && <p>Elige un filtro y pulsa Buscar alojamientos.</p>}
        {alojamientos?.length === 0 && <p>No hay alojamientos para este filtro.</p>}

        {!!alojamientos?.length && (
          <ul className="estancias-tarjetas">
            {alojamientos.map((alojamiento) => (
              <li className="estancia" key={alojamiento.id}>
                <div className="estancia-meta">
                  <span>{alojamiento.tipo}{alojamiento.categoria && " · " + alojamiento.categoria}</span>
                  <span className={alojamiento.disponible ? "estancia-disponible" : "estancia-agotada"}>
                    {alojamiento.disponible ? "Disponible" : "Sin disponibilidad"}
                  </span>
                </div>
                <h3>{alojamiento.nombre}</h3>
                <p>{alojamiento.ciudad} · {alojamiento.detalles.sector}</p>
                <p>{alojamiento.detalles.servicio}{alojamiento.detalles.capacidadMaxima &&
                  " · " + alojamiento.detalles.capacidadMaxima + " huéspedes máx."}</p>
                <div className="estancia-precio">
                  <strong>US$ {alojamiento.precioNoche}</strong> <span>/ noche</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <nav className="estancias-paginacion" aria-label="Páginas de alojamientos">
          <button type="button" disabled={!filtroActivo || pagina === 1 || cargando}
            onClick={() => filtroActivo && cargar(filtroActivo, pagina - 1, cursores[pagina - 2])}>
            <span aria-hidden="true">←</span> Anterior
          </button>
          <button type="button" disabled={!filtroActivo || !siguiente || cargando}
            onClick={() => filtroActivo && cargar(filtroActivo, pagina + 1, siguiente)}>
            Siguiente <span aria-hidden="true">→</span>
          </button>
        </nav>
      </section>
    </section>
  );
};
