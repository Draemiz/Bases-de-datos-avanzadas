import { useState, type FormEvent } from "react";
import { actualizarProducto, crearProducto, type Producto } from "../services/productoService";

interface Props {
  productoEditar: Producto | null;
  onFinalizarEdicion: () => void;
}

export default function ProductoForm({ productoEditar, onFinalizarEdicion }: Props) {
  const [nombre, setNombre] = useState(productoEditar?.nombre ?? "");
  const [precio, setPrecio] = useState(productoEditar ? String(productoEditar.precio) : "");
  const [stock, setStock] = useState(productoEditar ? String(productoEditar.stock) : "");
  const [categoria, setCategoria] = useState(productoEditar?.categoria ?? "");

  const guardarProducto = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (productoEditar) {
        await actualizarProducto(productoEditar.id, nombre, Number(precio), Number(stock), categoria);
        console.log("Producto actualizado: ", productoEditar.id);
        onFinalizarEdicion();
      } else {
        const productoId = await crearProducto(nombre, Number(precio), Number(stock), categoria);
        console.log("Producto creado: ", productoId);
      }
      setNombre("");
      setPrecio("");
      setStock("");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <section className="panel form-panel" aria-labelledby="form-title">
      <h2 id="form-title">{productoEditar ? "Editar producto" : "Nuevo producto"}</h2>
      <p className="section-description">{productoEditar ? "Modifica los datos y guarda los cambios." : "Completa los datos para agregarlo al inventario."}</p>
      <form onSubmit={guardarProducto}>
        <fieldset>
          <label htmlFor="nombre">Nombre del producto</label>
          <input id="nombre" type="text" placeholder="Ej. Teclado inalámbrico"
            value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <div className="input-row">

            <div>
              <label htmlFor="precio">Precio <span>($)</span></label>
              <input id="precio" type="number" step="any" placeholder="Precio"
                value={precio} onChange={(e) => setPrecio(e.target.value)} required />
            </div>

            <div>
              <label htmlFor="stock">Stock <span>(unidades)</span></label>
              <input id="stock" type="number" placeholder="Stock"
                value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>

            <div>
              <label htmlFor="categoria">categoria</label>
              <input
                id="categoria" type="text" placeholder="Ej. Tecnología"
                value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
            </div>
          </div>

          <button className="primary-button" type="submit">
            {productoEditar ? "Guardar cambios" : "Agregar producto"}
            <span aria-hidden="true">＋</span>
          </button>
          {productoEditar && (
            <button type="button" className="edit-button cancel-button" onClick={onFinalizarEdicion}>
              Cancelar edición
            </button>
          )}
        </fieldset>
      </form>
      <p className="form-note">Todos los campos son obligatorios.</p>
    </section>
  );
}
