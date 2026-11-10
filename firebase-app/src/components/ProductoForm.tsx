import { useState, type FormEvent } from "react";
import { crearProducto } from "../services/productoService";

export default function ProductoForm() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const guardarProducto = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const docRef = await crearProducto(nombre, Number(precio), Number(stock));
      console.log("Producto creado: ", docRef.id);

      setNombre("");
      setPrecio("");
      setStock("");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <form onSubmit={guardarProducto}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
      />

      <button type="submit">Guardar</button>
    </form>
  );
}
