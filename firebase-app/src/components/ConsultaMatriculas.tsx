import { useState, type FormEvent } from "react";
import {
  obtenerCursosDeEstudiante,
  obtenerEstudiantesDeCurso,
  obtenerMatriculaPorId,
  obtenerMatriculasActivas,
  type Matricula,
} from "../services/matriculaService";

const consultas = {
  estudiante: {
    titulo: "Cursos de un estudiante",
    etiqueta: "ID del estudiante",
    ejecutar: obtenerCursosDeEstudiante,
  },
  curso: {
    titulo: "Estudiantes de un curso",
    etiqueta: "ID del curso",
    ejecutar: obtenerEstudiantesDeCurso,
  },
  activas: {
    titulo: "Matrículas activas",
    etiqueta: "",
    ejecutar: obtenerMatriculasActivas,
  },
  matricula: {
    titulo: "Matrícula por ID",
    etiqueta: "ID de la matrícula",
    ejecutar: async (id: string) => {
      const matricula = await obtenerMatriculaPorId(id);
      return matricula ? [matricula] : [];
    },
  },
};

export const ConsultaMatriculas = () => {
  const [resultados, setResultados] = useState<Matricula[]>();
  const [consultaActiva, setConsultaActiva] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const buscar = async (evento: FormEvent<HTMLFormElement>, tipo: keyof typeof consultas) => {
    evento.preventDefault();
    if (cargando) return;

    const consulta = consultas[tipo];
    const id = String(new FormData(evento.currentTarget).get("id") ?? "").trim();
    setResultados(undefined);
    setConsultaActiva(consulta.titulo);
    setError("");

    if (consulta.etiqueta && !id) {
      setError("Ingresa el ID para consultar.");
      return;
    }
    if (tipo === "matricula" && id.includes("/")) {
      setError("Ingresa solo el ID de la matrícula, sin barras.");
      return;
    }

    setCargando(true);
    try {
      setResultados(await consulta.ejecutar(id));
    } catch (error) {
      console.error("Error al consultar matrículas:", error);
      setError("No se pudo completar la consulta. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="panel inventory-panel" aria-labelledby="consulta-matriculas-title">
      <div className="inventory-header">
        <h2 id="consulta-matriculas-title">Consulta de matrículas</h2>
      </div>
      {(Object.keys(consultas) as (keyof typeof consultas)[]).map((tipo) => {
        const { titulo, etiqueta } = consultas[tipo];
        return (
          <form
            key={tipo}
            className="inventory-footer"
            aria-labelledby={`consulta-${tipo}-titulo`}
            onSubmit={(evento) => buscar(evento, tipo)}
          >
            <h3 id={`consulta-${tipo}-titulo`}>{titulo}</h3>
            <div className="catalog-actions">
              {etiqueta && (
                <input
                  name="id"
                  aria-label={etiqueta}
                  placeholder={etiqueta}
                  required
                  disabled={cargando}
                />
              )}
              <button type="submit" className="edit-button" disabled={cargando}>
                {tipo === "activas" ? "Consultar matrículas activas" : "Consultar"}
              </button>
            </div>
          </form>
        );
      })}

      {consultaActiva && <h3 className="inventory-footer">Resultados · {consultaActiva}</h3>}
      {cargando && <p className="inventory-footer" role="status">Consultando…</p>}
      {error && <p className="inventory-footer error-message" role="alert">{error}</p>}
      {resultados?.length === 0 && (
        <p className="inventory-footer" role="status">No se encontraron matrículas.</p>
      )}
      {resultados && resultados.length > 0 && (
        <div className="table-scroll">
          <table>
            <caption className="sr-only">Resultados de la consulta de matrículas</caption>
            <thead>
              <tr>
                <th scope="col">ID matrícula</th>
                <th scope="col">ID estudiante</th>
                <th scope="col">Estudiante</th>
                <th scope="col">ID curso</th>
                <th scope="col">Curso</th>
                <th scope="col">Estado</th>
                <th scope="col">Periodo</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((matricula) => (
                <tr key={matricula.id}>
                  <td>{matricula.id}</td>
                  <td>{matricula.estudianteId}</td>
                  <td>{matricula.estudianteNombre}</td>
                  <td>{matricula.cursoId}</td>
                  <td>{matricula.cursoNombre}</td>
                  <td>{matricula.estado}</td>
                  <td>{matricula.periodo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
