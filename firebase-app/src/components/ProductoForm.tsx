import { useState, type FormEvent } from "react";
import { crearProducto } from "../services/productoService";

export default function ProductoForm() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const guardarProducto = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const productoId = await crearProducto(nombre, Number(precio), Number(stock));
      console.log("Producto creado: ", productoId);
      setNombre("");
      setPrecio("");
      setStock("");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <section className="panel form-panel" aria-labelledby="form-title">
      <h2 id="form-title">Nuevo producto</h2>
      <p className="section-description">Completa los datos para agregarlo al inventario.</p>
      <form onSubmit={guardarProducto}>
        <fieldset>
          <label htmlFor="nombre">Nombre del producto</label>
          <input id="nombre" type="text" placeholder="Ej. Teclado inalámbrico"
            value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <div className="input-row">
            <div>
              <label htmlFor="precio">Precio <span>($)</span></label>
              <input id="precio" type="number" placeholder="Precio"
                value={precio} onChange={(e) => setPrecio(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="stock">Stock <span>(unidades)</span></label>
              <input id="stock" type="number" placeholder="Stock"
                value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>
          </div>
          <button className="primary-button" type="submit">
            Agregar producto
            <span aria-hidden="true">＋</span>
          </button>
        </fieldset>
      </form>
      <p className="form-note">Todos los campos son obligatorios.</p>
    </section>
  );
}
