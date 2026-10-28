const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Configuración
app.use(cors());
app.use(express.json());

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
