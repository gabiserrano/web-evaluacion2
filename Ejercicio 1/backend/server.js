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
console.log("Temperatura correcta:", temperaturaIdeal);

console.log("Temperatura ideal generada correctamente");


// Ruta de prueba
app.get("/health", (req, res) => {
  res.json({
    mensaje: "Servidor del reactor funcionando correctamente"
  });
});

// Iniciar el servidor

 // Ruta para ajustar la temperatura del reactor
app.post("/adjust", (req, res) => {
  const temperatura = req.body?.temperatura;

  // Validar la temperatura ingresada
  if (
    !Number.isInteger(temperatura) ||
    temperatura < 1 ||
    temperatura > 100
  ) {
    return res.status(400).json({
      mensaje: "Ingresa una temperatura válida entre 1 y 100"
    });
  }

  // Temperatura demasiado baja
  if (temperatura < temperaturaIdeal) {
    return res.json({
      estado: "más alta",
      mensaje: "La temperatura ideal es más alta",
      estabilizado: false
    });
  }

  // Temperatura demasiado alta
  if (temperatura > temperaturaIdeal) {
    return res.json({
      estado: "más baja",
      mensaje: "La temperatura ideal es más baja",
      estabilizado: false
    });
  }

  // Temperatura correcta
  return res.json({
    estado: "estabilizado",
    mensaje: "¡Felicidades! Reactor estabilizado correctamente",
    estabilizado: true
  });
});

 // Ruta para reiniciar el reactor
app.post("/reboot", (req, res) => {
  const temperaturaAnterior = temperaturaIdeal;

  // Generar una nueva temperatura
  do {
    temperaturaIdeal = generarTemperatura();
  } while (temperaturaIdeal === temperaturaAnterior);

  res.json({
    mensaje: "Reactor reiniciado correctamente",
    estabilizado: false
  });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
