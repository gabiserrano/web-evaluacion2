
import { useState } from "react";
import "./App.css";

function App() {
  const [temperatura, setTemperatura] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [estabilizado, setEstabilizado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [reiniciando, setReiniciando] = useState(false);
  const [historial, setHistorial] = useState([]);

  // Enviar temperatura al backend
  const manejarEnvio = async (e) => {
    e.preventDefault();

    const numero = Number(temperatura);

    if (
      temperatura.trim() === "" ||
      !Number.isInteger(numero) ||
      numero < 1 ||
      numero > 100
    ) {
      setMensaje("Ingresa una temperatura válida entre 1 y 100");
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(
        "http://localhost:3000/adjust",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            temperatura: numero
          })
        }
      );

      if (!respuesta.ok) {
        throw new Error("Error al ajustar la temperatura");
      }

      const datos = await respuesta.json();

      // Mostrar mensaje del servidor
      setMensaje(datos.mensaje);

      // Guardar intento en el historial
      const nuevoIntento = {
        temperatura: numero,
        estado: datos.estado,
        estabilizado: datos.estabilizado === true
      };

      setHistorial((anterior) => [
        ...anterior,
        nuevoIntento
      ]);

      // Verificar si el jugador ganó
      if (datos.estabilizado === true) {
        setEstabilizado(true);
      }

      setTemperatura("");

    } catch (error) {
      console.error(error);
      setMensaje("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  // Reiniciar el reactor
  const reiniciarReactor = async () => {
    setReiniciando(true);

    try {
      const respuesta = await fetch(
        "http://localhost:3000/reboot",
        {
          method: "POST"
        }
      );

      if (!respuesta.ok) {
        throw new Error("Error al reiniciar el reactor");
      }

      const datos = await respuesta.json();

      // Limpiar estados para comenzar otra partida
      setTemperatura("");
      setHistorial([]);
      setEstabilizado(false);
      setMensaje(datos.mensaje);

    } catch (error) {
      console.error(error);
      setMensaje("No se pudo reiniciar el reactor");
    } finally {
      setReiniciando(false);
    }
  };

  // Contador de intentos fallidos
  const intentosFallidos = historial.filter(
    (intento) => !intento.estabilizado
  ).length;

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
            disabled={estabilizado || cargando || reiniciando}
          />

          <button
            type="submit"
            disabled={estabilizado || cargando || reiniciando}
          >
            {cargando ? "Ajustando..." : "Ajustar temperatura"}
          </button>
        </form>

        {mensaje && (
          <p className="mensaje">{mensaje}</p>
        )}

        {estabilizado && (
          <h2 className="victoria">
            ¡Reactor estabilizado!
          </h2>
        )}

        {/* Botón para reiniciar el reactor */}
        <button
          type="button"
          className="boton-reiniciar"
          onClick={reiniciarReactor}
          disabled={reiniciando || cargando}
        >
          {reiniciando ? "Reiniciando..." : "Reiniciar reactor"}
        </button>

        {/* Historial de intentos */}
        <div className="historial">
          <h2>Historial de intentos</h2>

          <p>Total de intentos: {historial.length}</p>
          <p>Intentos fallidos: {intentosFallidos}</p>

          {historial.length === 0 ? (
            <p>Todavía no has ingresado temperaturas.</p>
          ) : (
            <ul>
              {historial.map((intento, index) => (
                <li
                  key={index}
                  className={intento.estabilizado ? "acierto" : ""}
                >
                  <span>
                    Intento {index + 1}: {intento.temperatura}°C
                  </span>

                  <span>
                    {intento.estabilizado
                      ? "Estabilizado"
                      : intento.estado}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
