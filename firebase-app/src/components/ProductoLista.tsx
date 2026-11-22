import { useEffect, useState } from "react";
import { escucharProductos, eliminarProducto, type Producto } from "../services/productoService";

interface Props {
  onEditar: (producto: Producto) => void;
  onProductoEliminado: (id: string) => void;
}

export const ProductoLista = ({ onEditar, onProductoEliminado }: Props) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [errorProductos, setErrorProductos] = useState("");
  const [errorEliminar, setErrorEliminar] = useState("");

  useEffect(() => {
    const unsubscribe = escucharProductos(setProductos, (error) => {
      console.error("Error al escuchar productos:", error);
      setErrorProductos("No se pudo mantener la lista de productos actualizada.");
    });
    return unsubscribe;
  }, []);

  const handleEliminar = async (id: string) => {
    setErrorEliminar("");
    try {
      await eliminarProducto(id);
      onProductoEliminado(id);
      console.log("Producto eliminado: ", id);
    } catch (error) {
      console.error("Error al eliminar producto: ", error);
      setErrorEliminar("No se pudo eliminar el producto. Inténtalo de nuevo.");
    }
  };

  return (
    <section className="panel inventory-panel" aria-labelledby="inventory-title">
      <div className="inventory-header">
        <div><p className="eyebrow">CATÁLOGO</p><h2 id="inventory-title">Tus productos</h2></div>
        <span className="count-badge">{productos.length} productos</span>
      </div>
      {errorProductos && <p className="form-message error-message" role="alert">{errorProductos}</p>}
      {errorEliminar && <p className="form-message error-message" role="alert">{errorEliminar}</p>}
      <div className="table-scroll">
        <table>
          <caption className="sr-only">Productos registrados con su precio y existencias</caption>

          <thead><tr>
            <th scope="col">Producto</th>
            <th scope="col" className="number-cell">Precio</th>
            <th scope="col">Categoría</th>
            <th scope="col" className="number-cell">Stock</th>
            <th scope="col">Acciones</th>
          </tr></thead>

          <tbody>{productos.map((producto) => (
            <tr key={producto.id}>

              <td><div className="product-name">
                {producto.nombre}

              </div><span className="product-id">
                ID: {producto.id}</span></td>

              <td className="number-cell price-cell">
                ${producto.precio}
              </td>

              <td>{producto.categoria || "Sin categoría"}</td>
              <td className="number-cell">
                <span className={`stock-badge${producto.stock === 0 ? " stock-empty" : ""}`}>
                  {producto.stock}<span className="stock-unit"> ud.</span>
                </span>
              </td>
              <td>
                <button type="button" className="edit-button"
                onClick={() => onEditar(producto)}>
                  Editar
                </button>
                <button type="button" className="edit-button delete-button"
                onClick={() => handleEliminar(producto.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="inventory-footer">La lista se actualiza en tiempo real.</div>
    </section>
  );
};
