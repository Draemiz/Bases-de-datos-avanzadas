import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import { DirectorioAlojamientos } from "./components/DirectorioAlojamientos";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="app-shell">
      <nav className="section-nav catalog-actions" aria-label="Navegación">
        <a className="edit-button" href="./">Volver a la aplicación principal</a>
      </nav>
      <DirectorioAlojamientos />
    </main>
  </StrictMode>,
);
