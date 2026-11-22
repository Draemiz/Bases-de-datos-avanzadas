import { addDoc, collection, onSnapshot, updateDoc, doc, deleteDoc, type FirestoreError } from "firebase/firestore";
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
  stock: number
) => {
  const productRef = doc(db, "productos", id);

  await updateDoc(productRef, {
    nombre,
    precio,
    stock,
  });
};

export const eliminarProducto = async (id: string) => {
  const productoRef = doc(db, "productos", id);
  await deleteDoc(productoRef);
};
