import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

type LD = {
   id: number,
   filmName: string,
   rotationType: "CAV" | "CLV",
   region: string,
   lengthMinutes: number,
   videoFormat: "NTSC" | "PAL",
}


let ld: LD[] = [
   { id: 1,
     filmName: "Peli 1",
     rotationType: "CLV",
     region: "Region 1",
     lengthMinutes: 90,
     videoFormat: "PAL"
   },
   { id: 2,
     filmName: "Peli 2",
     rotationType: "CAV",
     region: "Region 2",
     lengthMinutes: 120,
     videoFormat: "NTSC"
   }
];

app.get("/", (_req, res) => {
 res.json({
   message: "Estas conectado"
 });
});

app.get("/ld", (_req, res) => {
 res.json(ld);
});

app.get("/ld/:id", (req, res) => {
 const idParams = req.params.id;
 const realId = Number(idParams);
 const buscado = ld.find((elem) => elem.id === realId);

 if (buscado) {
   res.json(buscado);
 } else {
   res.status(404).json({
     message: "No se encuentra el LD",
   });
 }
});

app.post("/ld", (req, res) => {

 const lastID = ld.at(-1)?.id;
 const newID = lastID ? lastID + 1 : 0;

 const newfilmName = req.body.filmName;
 const newrotationType = req.body.rotationType;
 const newregion = req.body.region;
 const newlengthMinutes = req.body.lengthMinutes;
 const newvideoFormat = req.body.videoFormat;

 const newdisco: LD = {
   id: newID,
   filmName: newfilmName,
   rotationType: newrotationType,
   region: newregion,
   lengthMinutes: newlengthMinutes,
   videoFormat: newvideoFormat
 };

 if (
   newfilmName &&
   newfilmName &&
   typeof newfilmName === "string" &&
   typeof newrotationType === "string" &&
   typeof newregion === "string" &&
   typeof newlengthMinutes === "number" &&
   typeof newvideoFormat === "string"
 ) {
   ld.push(newdisco);
   res.status(201).json(newdisco);
 } else {
   res.status(400).send("Incorrecto");
 }

});
app.put("/ld/:id", (req, res) => {
 const id = Number(req.params.id);
 ld = ld.map((elem) =>
   id == elem.id ? { ...elem, ...req.body } : elem
 );
 res.status(202).send("El disco ha sido modificado");
});

app.delete("/ld/:id", (req, res) => {
 const id = Number(req.params.id);
 const discoExiste = ld.some((elem) => elem.id === id);

 if (!discoExiste) {
   return res.status(404).json({ message: "No se encuentra el disco" });
 }

 ld = ld.filter((elem) => elem.id !== id);
 res.status(200).json({ message: "El disco ha sido eliminado" });
});

async function testApi() {
 const baseURL = "http://localhost:3000";

 try {
   const respuestaGet = await axios.get(`${baseURL}/ld`);
   console.log("Los discos iniciales:", respuestaGet.data);

   const respuestaPost = await axios.post(`${baseURL}/ld`, {
     filmName: "Pelicula creada",    
     rotationType: "CAV",
     region: "region 3",
     lengthMinutes: 130,
     videoFormat: "NTSC"
   });
   console.log("El nuevo disco ha sido creado:", respuestaPost.data);

   const respuestaGet2 = await axios.get(`${baseURL}/ld`);
   console.log("Los discos después de post:", respuestaGet2.data);

   await axios.put(`${baseURL}/ld/${respuestaPost.data.id}`, {
     rotationType: "CLV",
     lengthMinutes: 80,
     videoFormat: "PAL"
   });
   console.log(`Disco id ${respuestaPost.data.id} modificado.`);

   await axios.delete(`${baseURL}/ld/${respuestaPost.data.id}`);
   console.log(`Disco id ${respuestaPost.data.id} eliminado.`);

   const respuestaGetFinal = await axios.get(`${baseURL}/ld`);
   console.log("Discos finales:", respuestaGetFinal.data);

 } catch (error) {
   console.log("Error en testApi:", error);
 }
}



app.listen(port, "0.0.0.0", () => {
 console.log(`Servidor en http://localhost:${port}`);
 setTimeout(() => {
   testApi();
 }, 1000);
});
