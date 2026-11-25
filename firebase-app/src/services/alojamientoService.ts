import { collection, getDocsFromServer, limit, orderBy, query, startAfter, where, type QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase.ts";

export const tiposAlojamiento = ["Hotel", "Hostal", "Apartamento", "Cabaña"] as const;

export interface Alojamiento {
  id: string;
  nombre: string;
  ciudad: string;
  tipo: typeof tiposAlojamiento[number];
  precioNoche: number;
  disponible: boolean;
  categoria?: string;
  detalles: { sector: string; servicio: string; capacidadMaxima?: number };
}

export type FiltroAlojamiento =
  | { modo: "ciudad"; ciudad: string }
  | { modo: "tipo"; tipo: Alojamiento["tipo"] }
  | { modo: "disponibles" }
  | { modo: "precio"; desde: number; hasta: number };

export type CursorAlojamiento = QueryDocumentSnapshot;

export const consultarAlojamientos = async (filtro: FiltroAlojamiento, cursor?: CursorAlojamiento) => {
  const restricciones = (() => {
    switch (filtro.modo) {
      case "ciudad":
        return [where("ciudad", "==", filtro.ciudad)];
      case "tipo":
        return [where("tipo", "==", filtro.tipo)];
      case "disponibles":
        return [where("disponible", "==", true)];
      case "precio":
        return [
          where("precioNoche", ">=", filtro.desde),
          where("precioNoche", "<=", filtro.hasta),
          orderBy("precioNoche", "asc"),
        ];
    }
  })();

  const resultado = await getDocsFromServer(query(
    collection(db, "alojamientos"),
    ...restricciones,
    ...(cursor ? [startAfter(cursor)] : []),
    limit(10),
  ));

  return {
    alojamientos: resultado.docs.map((documento) => ({
      ...documento.data(),
      id: documento.id,
    }) as Alojamiento),
    ultimoDocumento: resultado.docs.at(-1),
  };
};
