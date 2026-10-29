import { Navbar, Container, Badge } from 'reactstrap';
import { Rocket, Coins, Package, Timer } from 'lucide-react';

const formatTiempo = (seg) =>
  `${String(Math.floor(seg / 60)).padStart(2, '0')}:${String(seg % 60).padStart(2, '0')}`;

export default function MissionBar({ creditos, total, tiempo, confirmada }) {
  return (
    <Navbar className="topbar py-2">
      <Container className="d-flex flex-wrap gap-3 justify-content-between align-items-center">
        <span className="brand">
          <Rocket size={18} /> AstroLogistics
        </span>
        <div className="d-flex flex-wrap gap-4">
          <span className="metric">
            <Coins size={16} /> Créditos disponibles: <strong>{creditos} Cr</strong>
          </span>
          <span className="metric">
            <Package size={16} /> Costo total de Carga:
            <Badge color="dark" pill>{total} Cr</Badge>
          </span>
          <span className={`metric timer ${tiempo <= 60 && !confirmada ? 'low' : ''}`}>
            <Timer size={16} />
            {confirmada ? 'Carga confirmada' : <strong>{formatTiempo(tiempo)}</strong>}
          </span>
        </div>
      </Container>
    </Navbar>
  );
}
