import "./App.css";
import ProductoForm from "./components/ProductoForm";
import { ProductoLista } from "./components/ProductoLista";
import { ProductoListaPaginada } from "./components/ProductoListaPaginada";
import { ArticuloOtakuListaPaginada } from "./components/ArticuloOtakuListaPaginada";
import { useState } from "react";
import { obtenerProductosDisponibles, type Producto } from "./services/productoService";

function App() {
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  return (
    <main className="app-shell">
      <header className="page-header">
        <div className="brand"><span className="brand-mark" aria-hidden="true">▦</span>Inventario<span className="brand-dot">.</span></div>
        <span className="header-label">GESTIÓN DE PRODUCTOS</span>
      </header>
      <section className="page-intro">
        <h1>Todo en su lugar.</h1>
        <p>Registra tus productos y mantén tu inventario siempre actualizado.</p>
      </section>
      <div className="workspace">
        <ProductoForm
          key={productoEditar?.id ?? "nuevo"}
          productoEditar={productoEditar}
          onFinalizarEdicion={() => setProductoEditar(null)}
        />
        <ProductoLista
          onEditar={setProductoEditar}
          onProductoEliminado={(id) => {
            setProductoEditar((actual) => actual?.id === id ? null : actual);
          }}
        />
      </div>
      <button
        type="button"
        className="edit-button"
        onClick={async () => {
          try {
            const productosDeConsulta = await obtenerProductosDisponibles();
            console.log(productosDeConsulta);
          } catch (error) {
            console.error("Error al consultar productos disponibles:", error);
          }
        }}
      >
        Consulta
      </button>
      <ProductoListaPaginada />
      <ArticuloOtakuListaPaginada />
      <footer className="page-footer">Un inventario organizado empieza con buenos datos.</footer>
    </main>
  );
}

export default App;
