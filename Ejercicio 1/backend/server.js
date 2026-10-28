const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Configuración
app.use(cors());
app.use(express.json());


 // Generar una temperatura aleatoria entre 1 y 100
function generarTemperatura() {
  return Math.floor(Math.random() * 100) + 1;
}

// Temperatura ideal del reactor
let temperaturaIdeal = generarTemperatura();

console.log("Temperatura ideal generada correctamente");


// Ruta de prueba
app.get("/health", (req, res) => {
  res.json({
    mensaje: "Servidor del reactor funcionando correctamente"
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
