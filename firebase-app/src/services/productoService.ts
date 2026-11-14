import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
}

export const crearProducto = async (
  nombre: string,
  precio: number,
  stock: number
) => {
  const docRef = await addDoc(collection(db, "productos"), {
    nombre,
    precio,
    stock,
  });

  return docRef.id;
};

export const obtenerProductos = async (): Promise<Producto[]> => {
  const querySnapshot = await getDocs(collection(db, "productos"));

  const productos = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Producto[];

  return productos;
};