import { useEffect, useState } from "react";
import { obtenerProductos, type Producto } from "../services/productoService";

export const ProductoLista = () => {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const datos = await obtenerProductos();
        setProductos(datos);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    cargarProductos();
  }, []);

  return (
    <section className="panel inventory-panel" aria-labelledby="inventory-title">
      <div className="inventory-header">
        <div><p className="eyebrow">CATÁLOGO</p><h2 id="inventory-title">Tus productos</h2></div>
        <span className="count-badge">{productos.length} productos</span>
      </div>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">Productos registrados con su precio y existencias</caption>
            <thead><tr>
              <th scope="col">Producto</th>
              <th scope="col" className="number-cell">Precio</th>
              <th scope="col" className="number-cell">Stock</th>
            </tr></thead>
            <tbody>{productos.map((producto) => (
              <tr key={producto.id}>
                <td><div className="product-name">{producto.nombre}</div><span className="product-id">ID: {producto.id}</span></td>
                <td className="number-cell price-cell">
                  ${producto.precio}
                </td>
                <td className="number-cell">
                  <span className={`stock-badge${producto.stock === 0 ? " stock-empty" : ""}`}>
                    {producto.stock}<span className="stock-unit"> ud.</span>
                  </span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      <div className="inventory-footer">Recarga la página para ver los productos recién guardados.</div>
    </section>
  );
};
