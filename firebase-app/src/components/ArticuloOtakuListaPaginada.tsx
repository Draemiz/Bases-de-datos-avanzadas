import { useEffect, useState } from "react";
import { obtenerPaginaArticulos, type ArticuloOtaku, type CursorArticulo } from "../services/articuloOtakuService";

export const ArticuloOtakuListaPaginada = () => {
  const [articulos, setArticulos] = useState<ArticuloOtaku[]>();
  const [error, setError] = useState("");
  const [cursor, setCursor] = useState<CursorArticulo>();
  const [pagina, setPagina] = useState(1);
  const [navegando, setNavegando] = useState(false);
  const [cursoresIniciales, setCursoresIniciales] = useState<Record<number, CursorArticulo | undefined>>({});

  useEffect(() => {
    let activo = true;

    obtenerPaginaArticulos()
      .then((resultado) => {
        if (!activo) return;
        setArticulos(resultado.articulos);
        setCursor(resultado.paginaCompleta ? resultado.ultimoDocumento : undefined);
      })
      .catch((error: unknown) => {
        if (!activo) return;
        console.error("Error al consultar el Bazar del Eclipse:", error);
        setError("No se pudo cargar el catálogo del Bazar del Eclipse.");
      });

    return () => {
      activo = false;
    };
  }, []);

  const cambiarPagina = async (destino: number, cursorInicial?: CursorArticulo) => {
    setNavegando(true);
    setError("");

    try {
      const resultado = await obtenerPaginaArticulos(cursorInicial);
      if (resultado.articulos.length === 0) {
        if (destino > pagina) setCursor(undefined);
        else setError("La página anterior ya no tiene artículos.");
        return;
      }

      setArticulos(resultado.articulos);
      setCursor(resultado.paginaCompleta ? resultado.ultimoDocumento : undefined);
      setCursoresIniciales((actuales) => ({
        ...actuales,
        [destino]: cursorInicial,
      }));
      setPagina(destino);
    } catch (error) {
      console.error("Error al cambiar de página:", error);
      setError("No se pudo cargar esa página. Inténtalo de nuevo.");
    } finally {
      setNavegando(false);
    }
  };

  return (
    <section className="panel inventory-panel" aria-labelledby="otaku-title">
      <div className="inventory-header">
        <h2 id="otaku-title">El Bazar del Eclipse</h2>
        <span className="count-badge" aria-live="polite">Página {pagina}</span>
      </div>

      {error && <p className="empty-state error-message" role="alert">{error}</p>}
      {!articulos && !error && <p className="empty-state" role="status">Cargando artículos…</p>}
      {articulos?.length === 0 && <p className="empty-state">No hay artículos.</p>}

      {articulos && articulos.length > 0 && (
        <div className="table-scroll">
          <table>
            <caption className="sr-only">Artículos del Bazar del Eclipse ordenados por nombre</caption>
            <thead>
              <tr>
                <th scope="col">Artículo</th>
                <th scope="col">Categoría</th>
                <th scope="col">Temática</th>
                <th scope="col" className="number-cell">Precio</th>
                <th scope="col" className="number-cell">Stock</th>
              </tr>
            </thead>
            <tbody>
              {articulos.map((articulo) => (
                <tr key={articulo.id}>
                  <td>{articulo.nombre}</td>
                  <td>{articulo.categoria}</td>
                  <td>{articulo.tematica}</td>
                  <td className="number-cell">${articulo.precio}</td>
                  <td className="number-cell">{articulo.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <nav className="inventory-footer otaku-pagination" aria-label="Paginación del catálogo">
        <button
          type="button"
          className="edit-button"
          onClick={() => cambiarPagina(pagina - 1, cursoresIniciales[pagina - 1])}
          disabled={pagina === 1 || navegando}
        >
          Anterior
        </button>
        <button
          type="button"
          className="edit-button"
          onClick={() => cambiarPagina(pagina + 1, cursor)}
          disabled={!cursor || navegando}
        >
          Siguiente
        </button>
        {navegando && <span role="status">Cargando página…</span>}
      </nav>
    </section>
  );
};
