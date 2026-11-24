import { useState } from "react";
import { obtenerProductosPaginados, type Producto } from "../services/productoService";

type Cursor = Awaited<ReturnType<typeof obtenerProductosPaginados>>["ultimoDocumento"];

export const ProductoListaPaginada = () => {
  const [productos, setProductos] = useState<Producto[]>();
  const [ultimoDocumento, setUltimoDocumento] = useState<Cursor>();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const cargarPagina = async (cursor?: Cursor) => {
    setCargando(true);
    setError("");

    try {
      const resultado = await obtenerProductosPaginados(cursor);
      setProductos(resultado.productos);
      setUltimoDocumento(resultado.ultimoDocumento);
    } catch (error) {
      console.error("Error al cargar la página:", error);
      setError("No se pudieron cargar los productos. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const cargarPrimeraPagina = () => cargarPagina();

  const siguientePagina = () => {
    if (!ultimoDocumento) return;
    return cargarPagina(ultimoDocumento);
  };

  return (
    <section className="panel inventory-panel" aria-labelledby="paginacion-title">
      <h2 id="paginacion-title">Productos paginados</h2>
      <button type="button" className="edit-button" disabled={cargando} onClick={cargarPrimeraPagina}>
        Cargar productos
      </button>

      {error && <p role="alert">{error}</p>}
      {cargando && <p role="status">Cargando productos…</p>}
      {productos?.length === 0 && <p>No hay productos en esta página.</p>}

      <ul>
        {productos?.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} · ${producto.precio} · {producto.stock} ud.
          </li>
        ))}
      </ul>

      <button type="button" className="edit-button" disabled={!ultimoDocumento || cargando} onClick={siguientePagina}>
        Siguiente
      </button>
    </section>
  );
};
