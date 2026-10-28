
import { useState } from "react";
import "./App.css";

function App() {
  const [temperatura, setTemperatura] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarEnvio = (e) => {
    e.preventDefault();

    const numero = Number(temperatura);

    if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
      setMensaje("Ingresa una temperatura válida entre 1 y 100");
      return;
    }

    setMensaje(`Temperatura ${numero}°C preparada para enviar`);
  };

  return (
    <div className="contenedor">
      <div className="reactor">
        <h1>Estabiliza el Reactor</h1>

        <p>
          Ingresa una temperatura entre 1 y 100
          para estabilizar el reactor.
        </p>

        <form onSubmit={manejarEnvio}>
          <label htmlFor="temperatura">
            Temperatura del reactor
          </label>

          <input
            id="temperatura"
            type="number"
            min="1"
            max="100"
            required
            placeholder="Ejemplo: 50"
            value={temperatura}
            onChange={(e) => setTemperatura(e.target.value)}
          />

          <button type="submit">
            Ajustar temperatura
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
}

export default App;
