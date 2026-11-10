import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

export function crearProducto(nombre: string, precio: number, stock: number) {
  return addDoc(collection(db, "productos"), { nombre, precio, stock });
}