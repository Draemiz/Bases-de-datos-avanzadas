import process from "node:process";
import { collection, doc, getCountFromServer, terminate, writeBatch } from "firebase/firestore";
import { db } from "../src/firebase.ts";

const grupos = [
  {
    tematica: "Anime",
    categoria: "Chuchería",
    nombres: [
      "Llavero de kunai ninja",
      "Pin de gato ramen",
      "Pulsera de estrellas mágicas",
      "Stickers de mechas",
      "Broche de pétalos sakura",
      "Colgante de espíritu del bosque",
      "Set de separadores de manga",
      "Mini libreta de academia mágica",
      "Dije de luna creciente",
      "Estuche de explorador espacial",
    ],
  },

  {
    tematica: "Anime",
    categoria: "Decoración",
    nombres: [
      "Lámpara de luna de anime",
      "Póster de ciudad cyberpunk",
      "Guirnalda de cerezos",
      "Figura chibi de alquimista",
      "Cojín de gato con ramen",
      "Diorama de tienda de manga",
      "Tapiz de batalla mecha",
      "Reloj de órbita estelar",
      "Portarretrato de festival japonés",
      "Farol de espíritu del bosque",
    ],
  },

  {
    tematica: "Dibujos animados",
    categoria: "Chuchería",
    nombres: [
      "Pin de fantasma sonriente",
      "Llavero de mapache detective",
      "Stickers de patos viajeros",
      "Borrador de robot retro",
      "Libreta de monstruos amigables",
      "Imán de cohete de caricatura",
      "Parche de rana aventurera",
      "Clip de nube con ojos",
      "Monedero de zorro piloto",
      "Set de sellos de dinosaurios",
    ],
  },

  {
    tematica: "Dibujos animados",
    categoria: "Decoración",
    nombres: [
      "Lámpara de dinosaurio pastel",
      "Póster de caricaturas retro",
      "Guirnalda de fantasmas felices",
      "Cojín de rana exploradora",
      "Figura de robot bailarín",
      "Maceta de mapache detective",
      "Marco de cómic retro",
      "Reloj de nube arcoíris",
      "Mini letrero de aventuras",
      "Organizador de escritorio de monstruos",
    ],
  },
];

async function generarArticulosOtaku() {
  const articulos = collection(db, "articulosOtaku");
  const lote = writeBatch(db);
  let numero = 0;

  for (const { tematica, categoria, nombres } of grupos) {
    for (const nombre of nombres) {
      numero += 1;
      const id = "taller8-otaku-" + String(numero).padStart(2, "0");

      lote.set(doc(articulos, id), {
        nombre,
        categoria,
        tematica,
        precio: categoria === "Decoración" ? 12 + numero % 9 * 2 : 3 + numero % 8,
        stock: numero % 7,
      });
    }
  }

  await lote.commit();
  const total = await getCountFromServer(articulos);
  console.log(`Artículos de prueba guardados: ${numero}. Total en Firestore: ${total.data().count}.`);
}

try {
  await generarArticulosOtaku();
} catch (error) {
  console.error("Error al preparar el catálogo:", error);
  process.exitCode = 1;
} finally {
  await terminate(db);
}
