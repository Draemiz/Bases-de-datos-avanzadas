import { useState } from "react";
import { obtenerProductosPaginados, type Producto } from "../services/productoService";

type Cursor = Awaited<ReturnType<typeof obtenerProductosPaginados>>["ultimoDocumento"];

interface Props {
  onConsulta: () => void;
}

export const ProductoListaPaginada = ({ onConsulta }: Props) => {
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
      <div className="inventory-header paginated-products-header">
        <h2 id="paginacion-title">Productos paginados</h2>
        <div className="catalog-actions">
          <button type="button" className="edit-button" disabled={cargando} onClick={cargarPrimeraPagina}>
            Cargar productos
          </button>
          <button type="button" className="edit-button" onClick={onConsulta}>
            Consulta
          </button>
        </div>
      </div>

      {error && <p className="catalog-message error-message" role="alert">{error}</p>}
      {cargando && <p className="catalog-message" role="status">Cargando productos…</p>}
      {productos?.length === 0 && <p className="catalog-message">No hay productos en esta página.</p>}

      {!!productos?.length && (
        <ul className="paginated-products-list">
          {productos.map((producto) => (
            <li key={producto.id}>
              <strong>{producto.nombre}</strong>
              <span>${producto.precio} · {producto.stock} ud.</span>
            </li>
          ))}
        </ul>
      )}

      <div className="inventory-footer catalog-actions">
        <button type="button" className="edit-button" disabled={!ultimoDocumento || cargando} onClick={siguientePagina}>
          Siguiente
        </button>
      </div>
    </section>
  );
};
