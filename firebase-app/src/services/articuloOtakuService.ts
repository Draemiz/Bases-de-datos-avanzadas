import { collection, getDocs, limit, orderBy, query, startAfter, type DocumentData, type QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase.ts";

export interface ArticuloOtaku {
  id: string;
  nombre: string;
  categoria: string;
  tematica: string;
  precio: number;
  stock: number;
}

export type CursorArticulo = QueryDocumentSnapshot<DocumentData>;

export const obtenerPaginaArticulos = async (cursor?: CursorArticulo) => {
  const consulta = query(
    collection(db, "articulosOtaku"),
    orderBy("nombre", "asc"),
    ...(cursor ? [startAfter(cursor)] : []),
    limit(10),
  );

  const snapshot = await getDocs(consulta);

  const articulos = snapshot.docs.map((documento) => ({
    ...documento.data(),
    id: documento.id,
  })) as ArticuloOtaku[];

  return { articulos, ultimoDocumento: snapshot.docs.at(-1), paginaCompleta: snapshot.size === 10 };
};
