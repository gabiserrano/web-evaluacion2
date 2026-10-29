import { ListGroup, ListGroupItem, ButtonGroup, Button } from 'reactstrap';
import { Minus, Plus, LogOut, CheckCircle2, RotateCcw } from 'lucide-react';

export default function CargoPanel({ items, inventario, bloqueado, ocupado, confirmada, onCambiar, onEliminar, onConfirmar, onReiniciar }) {
  const detalle = items.map((i) => ({ ...inventario.find((p) => p.id === i.id), ...i }));

  return (
    <>
      <h2 className="section-title">Tu bodega de carga</h2>
      <div className="cargo">
        {ocupado && <div className="cargo-sub px-3 pt-2">Calculando peso...</div>}
        {detalle.length === 0 ? (
          <div className="empty">La bodega está vacía.</div>
        ) : (
          <ListGroup flush>
            {detalle.map((d) => (
              <ListGroupItem key={d.id} >
                <div className="d-flex justify-content-between align-items-baseline mb-2">
                  <span className="cargo-name">{d.nombre}</span>
                  <span className="cargo-sub">{d.precio * d.cantidad} Cr</span>
                </div>
                <div className="d-flex justify-content-between align-items-center gap-2">
                  <ButtonGroup size="sm">
                    <Button outline color="dark" disabled={bloqueado || ocupado} onClick={() => onCambiar(d.id, d.cantidad - 1)} aria-label="Restar">
                      <Minus size={13} />
                    </Button>
                    <Button outline color="dark" disabled className="qty">{d.cantidad}</Button>
                    <Button outline color="dark" disabled={bloqueado || ocupado} onClick={() => onCambiar(d.id, d.cantidad + 1)} aria-label="Sumar">
                      <Plus size={13} />
                    </Button>
                  </ButtonGroup>
                  <Button color="danger" outline size="sm" disabled={bloqueado || ocupado} onClick={() => onEliminar(d.id)}>
                    <LogOut size={13} className="me-1" /> Desembarcar
                  </Button>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </div>
      {confirmada ? (
        <div className="done mt-3">
          <div className="done-title"><CheckCircle2 size={16} /> Carga confirmada</div>
          <p className="cargo-sub mb-3">
            La nave está lista para el lanzamiento. Para armar otra carga se restablecen inventario, créditos y tiempo.
          </p>
          <Button className="btn-ink" block onClick={onReiniciar} disabled={ocupado}>
            <RotateCcw size={15} className="me-1" /> Iniciar nueva misión
          </Button>
        </div>
      ) : (
        <Button className="btn-ink mt-3" block disabled={bloqueado || ocupado || detalle.length === 0} onClick={onConfirmar}>
          <CheckCircle2 size={15} className="me-1" /> Confirmar equipamiento
        </Button>
      )}
    </>
  );
}
