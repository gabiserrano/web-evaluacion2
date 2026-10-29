import { Row, Col, Card, CardBody, Badge, Button } from 'reactstrap';
import { Plus, Shapes } from 'lucide-react';

export default function Catalog({ inventario, bloqueado, ocupado, onAgregar }) {
  return (
    <>
      <h2 className="section-title">Catálogo de la base</h2>
      <Row>
        {inventario.map((p) => {
          const agotado = p.stock === 0;
          return (
            <Col md="4" xs="12" key={p.id}>
              <Card className={`supply-card mb-3 ${agotado ? 'out' : ''}`}>
                <CardBody>
                  <div className="cat"><Shapes size={13} /> {p.categoria}</div>
                  <h3>{p.nombre}</h3>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Badge color="success">{p.precio} Cr</Badge>
                    <span className="stock">Stock: {p.stock}</span>
                  </div>
                  {agotado ? (
                    <Button color="secondary" disabled block size="sm">Agotado en Base</Button>
                  ) : (
                    <Button className="btn-ink" block size="sm" disabled={bloqueado || ocupado} onClick={() => onAgregar(p.id)}>
                      <Plus size={14} className="me-1" /> Añadir a la Nave
                    </Button>
                  )}
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
}
