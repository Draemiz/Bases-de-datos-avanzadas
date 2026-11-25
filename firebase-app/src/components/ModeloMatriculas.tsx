import { useState } from "react";
import { crearDatosMatriculas } from "../services/matriculaService";

export const ModeloMatriculas = () => {
  const [estado, setEstado] = useState<"inicial" | "guardando" | "guardado" | "error">("inicial");

  const guardarDatos = async () => {
    setEstado("guardando");

    try {
      await crearDatosMatriculas();
      setEstado("guardado");
    } catch (error) {
      console.error("Error al crear los datos de matrículas:", error);
      setEstado("error");
    }
  };

  return (
    <section className="panel inventory-panel" aria-labelledby="matriculas-title">
      <div className="inventory-header paginated-products-header">
        <h2 id="matriculas-title">Modelo de matrículas</h2>
        <div className="catalog-actions">
          <button type="button" className="edit-button" onClick={guardarDatos} disabled={estado === "guardando"}>
            {estado === "guardando" ? "Guardando…" : "Crear datos"}
          </button>
        </div>
      </div>

      {estado === "guardado" && (
        <p className="inventory-footer success-message" role="status">
          Estudiante, curso y matrícula guardados en Firestore.
        </p>
      )}
      {estado === "error" && (
        <p className="inventory-footer error-message" role="alert">
          No se pudieron guardar los datos. Inténtalo de nuevo.
        </p>
      )}
    </section>
  );
};
