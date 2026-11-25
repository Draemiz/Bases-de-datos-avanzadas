import process from "node:process";
import { collection, doc, getCountFromServer, terminate, writeBatch } from "firebase/firestore";
import { db } from "../src/firebase.ts";
import { tiposAlojamiento } from "../src/services/alojamientoService.ts";

const destinos = [
  { ciudad: "Quito", sector: "Centro histórico", nombres: ["Luz del Panecillo", "Casa del Zaguán", "Patio de los Faroles"] },
  { ciudad: "Cuenca", sector: "El Barranco", nombres: ["Orilla del Tomebamba", "Portal de Piedra", "Casa de los Sauces"] },
  { ciudad: "Baños", sector: "Río Pastaza", nombres: ["Bruma del Pastaza", "Sendero de la Cascada", "Refugio del Colibrí"] },
  { ciudad: "Manta", sector: "Barbasquillo", nombres: ["Viento del Pacífico", "Mirador de Coral", "Patio de Sal"] },
];

const servicios = {
  Hotel: "Desayuno incluido",
  Hostal: "Cocina compartida",
  Apartamento: "Cocina equipada",
  Cabaña: "Terraza privada",
};

try {
  const alojamientos = collection(db, "alojamientos");
  const lote = writeBatch(db);

  destinos.forEach(({ ciudad, sector, nombres }, destino) => {
    tiposAlojamiento.forEach((tipo, indiceTipo) => {
      nombres.forEach((nombre, variante) => {
        const id = `taller9-${destino + 1}-${indiceTipo + 1}-${variante + 1}`;
        const precioNoche = 28 + destino * 9 + indiceTipo * 11 + variante * 7;
        const categoria = precioNoche < 45 ? "Económica" : precioNoche < 70 ? "Confort" : "Premium";
        const capacidadMaxima = tipo === "Apartamento" || tipo === "Cabaña" ? 3 + variante : 1 + variante;

        lote.set(doc(alojamientos, id), {
          nombre: `${tipo} ${nombre}`,
          ciudad,
          tipo,
          categoria,
          precioNoche,
          disponible: (destino + indiceTipo + variante) % 4 !== 0,
          detalles: {
            sector,
            capacidadMaxima,
            servicio: servicios[tipo],
          },
        }, { merge: true });
      });
    });
  });

  await lote.commit();
  const total = await getCountFromServer(alojamientos);
  console.log(`Alojamientos en Firestore: ${total.data().count}`);
} catch (error) {
  console.error("Error al cargar alojamientos:", error);
  process.exitCode = 1;
} finally {
  await terminate(db);
}
