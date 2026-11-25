import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch
} from "firebase/firestore";
import { db } from "../firebase.ts";

export interface Matricula {
  id: string;
  estudianteId: string;
  estudianteNombre: string;
  cursoId: string;
  cursoNombre: string;
  estado: string;
  periodo: string;
}

const matriculas = collection(db, "matriculas");

const consultarMatriculas = async (
  campo: "estudianteId" | "cursoId" | "estado",
  valor: string,
): Promise<Matricula[]> => {
  const resultado = await getDocs(query(matriculas, where(campo, "==", valor)));

  return resultado.docs.map((documento) => ({
    ...documento.data(),
    id: documento.id,
  }) as Matricula);
};

export const obtenerCursosDeEstudiante = (estudianteId: string) =>
  consultarMatriculas("estudianteId", estudianteId.trim());

export const obtenerEstudiantesDeCurso = (cursoId: string) =>
  consultarMatriculas("cursoId", cursoId.trim());

export const obtenerMatriculasActivas = () =>
  consultarMatriculas("estado", "ACTIVA");

export const obtenerMatriculaPorId = async (matriculaId: string): Promise<Matricula | null> => {
  const id = matriculaId.trim();
  if (!id || id.includes("/")) {
    throw new Error("Ingresa un ID de matrícula válido.");
  }

  const documento = await getDoc(doc(matriculas, id));
  return documento.exists() ? { ...documento.data(), id: documento.id } as Matricula : null;
};

export const crearDatosMatriculas = async () => {
  const estudianteId = "EST002";
  const cursoId = "CUR001";

  const estudiante = {
    nombre: "Ivan Mendoza",
    email: "ivang@gmail.com",
    celular: "1231231232",
    estado: "ACTIVO",
  };

  const curso = {
    nombre: "Desarrollo Web",
    codigo: "DW-001",
    estado: "ACTIVO",
  };

  const lote = writeBatch(db);

  lote.set(doc(db, "estudiantes", estudianteId), estudiante);
  lote.set(doc(db, "cursos", cursoId), curso, { merge: true });
  lote.set(doc(db, "matriculas", "MAT002"), {
    estudianteId,
    estudianteNombre: estudiante.nombre,
    cursoId,
    cursoNombre: curso.nombre,
    estado: "ACTIVA",
    periodo: "2026-2",
  });

  await lote.commit();
};
