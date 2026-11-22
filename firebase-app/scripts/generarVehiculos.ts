import process from "node:process";
import { doc, terminate, writeBatch } from "firebase/firestore";
import { db } from "../src/firebase.ts";

interface Vehiculo {
  marca: string;
  modelo: string;
  precio: number;
  stock: number;
  anio: number;
  tipo: "Sedan" | "SUV" | "Pickup" | "Hatchback";
}

// Precios ficticios.
const vehiculos: Vehiculo[] = [
  {
    marca: "Audi",
    modelo: "A4",
    precio: 26500,
    stock: 2,
    anio: 2023,
    tipo: "Sedan",
  },

  {
    marca: "BMW",
    modelo: "330i",
    precio: 32500,
    stock: 1,
    anio: 2024,
    tipo: "Sedan",
  },

  {
    marca: "Mercedes-Benz",
    modelo: "C 300",
    precio: 38900,
    stock: 2,
    anio: 2025,
    tipo: "Sedan",
  },

  {
    marca: "Lexus",
    modelo: "ES 350",
    precio: 20000,
    stock: 1,
    anio: 2020,
    tipo: "Sedan",
  },

  {
    marca: "Genesis",
    modelo: "G70",
    precio: 32900,
    stock: 0,
    anio: 2024,
    tipo: "Sedan",
  },

  {
    marca: "Volvo",
    modelo: "S60",
    precio: 19500,
    stock: 1,
    anio: 2020,
    tipo: "Sedan",
  },

  {
    marca: "Porsche",
    modelo: "Macan",
    precio: 58400,
    stock: 1,
    anio: 2026,
    tipo: "SUV",
  },

  {
    marca: "Land Rover",
    modelo: "Range Rover Evoque",
    precio: 40000,
    stock: 2,
    anio: 2023,
    tipo: "SUV",
  },

  {
    marca: "BMW",
    modelo: "X3",
    precio: 36400,
    stock: 3,
    anio: 2024,
    tipo: "SUV",
  },

  {
    marca: "Audi",
    modelo: "Q5",
    precio: 34700,
    stock: 0,
    anio: 2023,
    tipo: "SUV",
  },

  {
    marca: "Volvo",
    modelo: "XC60",
    precio: 29900,
    stock: 1,
    anio: 2022,
    tipo: "SUV",
  },

  {
    marca: "Lexus",
    modelo: "RX 350",
    precio: 47900,
    stock: 2,
    anio: 2025,
    tipo: "SUV",
  },

  {
    marca: "Lincoln",
    modelo: "Corsair",
    precio: 37200,
    stock: 1,
    anio: 2025,
    tipo: "SUV",
  },

  {
    marca: "GMC",
    modelo: "Sierra 1500 Denali",
    precio: 54900,
    stock: 1,
    anio: 2024,
    tipo: "Pickup",
  },

  {
    marca: "Ford",
    modelo: "F-150 Platinum",
    precio: 56900,
    stock: 2,
    anio: 2025,
    tipo: "Pickup",
  },

  {
    marca: "Ram",
    modelo: "1500 Limited",
    precio: 51900,
    stock: 0,
    anio: 2023,
    tipo: "Pickup",
  },

  {
    marca: "Jeep",
    modelo: "Gladiator High Altitude",
    precio: 39900,
    stock: 1,
    anio: 2022,
    tipo: "Pickup",
  },

  {
    marca: "MINI",
    modelo: "Cooper S",
    precio: 18500,
    stock: 2,
    anio: 2021,
    tipo: "Hatchback",
  },

  {
    marca: "Audi",
    modelo: "A3 Sportback",
    precio: 24900,
    stock: 1,
    anio: 2023,
    tipo: "Hatchback",
  },

  {
    marca: "Mercedes-Benz",
    modelo: "A 250 Hatchback",
    precio: 19700,
    stock: 1,
    anio: 2021,
    tipo: "Hatchback",
  },
];

async function generarVehiculos() {
  const lote = writeBatch(db);

  vehiculos.forEach((vehiculo, indice) => {
    // Los IDs fijos evitan duplicados si se vuelve a ejecutar el script.
    const id = "taller7-lujo-" + String(indice + 1).padStart(2, "0");
    lote.set(doc(db, "vehiculos", id), vehiculo);
  });

  try {
    await lote.commit();
    console.log(`Se guardaron ${vehiculos.length} vehículos en Firestore.`);
  } finally {
    await terminate(db);
  }
}

generarVehiculos().catch((error: unknown) => {
  console.error("Error al guardar los vehículos:", error);
  process.exitCode = 1;
});
