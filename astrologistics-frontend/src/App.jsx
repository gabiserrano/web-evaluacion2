import { useEffect, useState } from 'react';
import { Container, Row, Col, UncontrolledAlert, Button } from 'reactstrap';
import { TimerOff, RotateCcw } from 'lucide-react';
import MissionBar from './components/MissionBar.jsx';
import Catalog from './components/Catalog.jsx';
import CargoPanel from './components/CargoPanel.jsx';
import * as api from './api.js';
import './styles.css';

const CARGA_INICIAL = { creditos: 0, total: 0, itemsCargados: [], confirmada: false, tiempoRestante: 0 };

export default function App() {
  const [inventario, setInventario] = useState([]);
  const [carga, setCarga] = useState(CARGA_INICIAL);
  const [tiempo, setTiempo] = useState(0);
  const [error, setError] = useState(null);
  const [ocupado, setOcupado] = useState(false);

  // Solo se muestra un aviso a la vez: uno nuevo reemplaza al anterior
  const mostrarError = (mensaje) => setError({ id: Date.now(), mensaje });

  useEffect(() => {
    if (!error) return undefined;
    const id = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(id);
  }, [error]);

  // Sincroniza inventario y carga con el servidor (fuente de verdad)
  const sincronizar = () =>
    Promise.all([api.getInventario(), api.getCarga()]).then(([inv, car]) => {
      setInventario(inv);
      setCarga(car);
      setTiempo(car.tiempoRestante);
    });

  useEffect(() => {
    sincronizar().catch((e) => mostrarError(e.message));
  }, []);

  const corriendo = !carga.confirmada && tiempo > 0;

  // Cuenta regresiva local entre sincronizaciones
  useEffect(() => {
    if (!corriendo) return undefined;
    const id = setInterval(() => setTiempo((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [corriendo]);

  // Ejecuta una acción REST, refresca el estado y captura el error del backend
  const ejecutar = (accion) => {
    setOcupado(true);
    accion()
      .then(sincronizar)
      .then(() => setError(null))
      .catch((e) => {
        mostrarError(e.message);
        sincronizar().catch(() => {});
      })
      .finally(() => setOcupado(false));
  };

  const reiniciar = () => {
    setError(null);
    ejecutar(api.reiniciarSesion);
  };

  const expirada = inventario.length > 0 && tiempo === 0 && !carga.confirmada;
  const bloqueado = expirada || carga.confirmada;

  return (
    <>
      <MissionBar creditos={carga.creditos} total={carga.total} tiempo={tiempo} confirmada={carga.confirmada} />

      <div className="alert-stack">
        {error && (
          <UncontrolledAlert key={error.id} color="warning" className="shadow-sm mb-0">
            {error.mensaje}
          </UncontrolledAlert>
        )}
      </div>

      <Container className="py-4">
        <Row>
          <Col lg="8" className="mb-4">
            <Catalog
              inventario={inventario}
              bloqueado={bloqueado}
              ocupado={ocupado}
              onAgregar={(id) => ejecutar(() => api.agregarItem(id, 1))}
            />
          </Col>
          <Col lg="4">
            <CargoPanel
              items={carga.itemsCargados}
              inventario={inventario}
              bloqueado={bloqueado}
              ocupado={ocupado}
              confirmada={carga.confirmada}
              onCambiar={(id, cantidad) => ejecutar(() => api.actualizarUnidades(id, cantidad))}
              onEliminar={(id) => ejecutar(() => api.eliminarItem(id))}
              onConfirmar={() => ejecutar(api.confirmarCarga)}
              onReiniciar={reiniciar}
            />
          </Col>
        </Row>
      </Container>

      {expirada && (
        <div className="overlay">
          <div className="overlay-box">
            <TimerOff size={28} className="mb-3" />
            <h5>Ventana de lanzamiento cerrada</h5>
            <p className="text-muted small">El tiempo terminó sin confirmar la carga. Inicia la sesión nuevamente.</p>
            <Button className="btn-ink" onClick={reiniciar}>
              <RotateCcw size={14} className="me-1" /> Iniciar de nuevo
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
