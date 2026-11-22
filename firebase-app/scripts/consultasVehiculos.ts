import process from "node:process";
import { collection, getDocsFromServer, orderBy, query, terminate, where } from "firebase/firestore";
import { db } from "../src/firebase.ts";

const vehiculos = collection(db, "vehiculos");

const consultas = [
  {
    titulo: "Consulta 1 · Vehículos disponibles por precio",
    consulta: query(
      vehiculos,
      where("stock", ">", 0),
      orderBy("precio", "asc"),
    ),
  },
  {
    titulo: "Consulta 2 · SUV disponibles por precio",
    consulta: query(
      vehiculos,
      where("tipo", "==", "SUV"),
      where("stock", ">", 0),
      orderBy("precio", "asc"),
    ),
  },
  {
    titulo: "Consulta 3 · Vehículos disponibles entre 20.000 y 40.000",
    consulta: query(
      vehiculos,
      where("precio", ">=", 20000),
      where("precio", "<=", 40000),
      where("stock", ">", 0),
      orderBy("precio", "asc"),
    ),
  },
  {
    titulo: "Consulta 4 · Sedanes disponibles desde 2023",
    consulta: query(
      vehiculos,
      where("tipo", "==", "Sedan"),
      where("anio", ">=", 2023),
      where("stock", ">", 0),
      orderBy("anio", "desc"),
    ),
  },
];

try {
  for (const { titulo, consulta } of consultas) {
    console.log("\n" + titulo);

    try {
      const resultado = await getDocsFromServer(consulta);
      console.log(`Vehículos encontrados: ${resultado.size}`);
      if (!resultado.empty) {
        console.table(resultado.docs.map((documento) => documento.data()));
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    }
  }
} finally {
  await terminate(db);
}
