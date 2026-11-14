import "./App.css";
import ProductoForm from "./components/ProductoForm";
import { ProductoLista } from "./components/ProductoLista";

function App() {
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
        <ProductoForm />
        <ProductoLista />
      </div>
      <footer className="page-footer">Un inventario organizado empieza con buenos datos.</footer>
    </main>
  );
}

export default App;
