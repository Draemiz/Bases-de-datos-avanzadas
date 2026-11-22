import {
  addDoc,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  type FirestoreError,
} from "firebase/firestore";
import { db } from "../firebase";

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria:string,
}

export const crearProducto = async (
  nombre: string,
  precio: number,
  stock: number,
  categoria: string
) => {
  const docRef = await addDoc(collection(db, "productos"), {
    nombre,
    precio,
    stock,
    categoria
  });

  return docRef.id;
};

export const escucharProductos = (
  onProductos: (productos: Producto[]) => void,
  onError: (error: FirestoreError) => void
) => onSnapshot(collection(db, "productos"), (snapshot) => {
  const productos = snapshot.docs.map((documento) => ({
    ...documento.data(),
    id: documento.id,
  })) as Producto[];

  onProductos(productos);
}, onError);

export const actualizarProducto = async (
  id: string,
  nombre: string,
  precio: number,
  stock: number,
  categoria:string,
) => {
  const productRef = doc(db, "productos", id);

  await updateDoc(productRef, {
    nombre,
    precio,
    stock,
    categoria
  });
};

export const eliminarProducto = async (id: string) => {
  const productoRef = doc(db, "productos", id);
  await deleteDoc(productoRef);
};

export const obtenerProductosDisponibles = async (): Promise<Producto[]> => {
  const consulta = query(
    collection(db, "productos"),
    where("stock", ">", 0),
    where("precio", ">=", 100),
    where("precio", "<=", 500),
    orderBy("precio", "asc"),
  );

  const querySnapshot = await getDocs(consulta);

  const productos = querySnapshot.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  })) as Producto[];

  return productos;
};
