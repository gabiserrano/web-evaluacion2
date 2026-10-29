import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;
const PRESUPUESTO_INICIAL = 500;
const DURACION_SESION_SEG = 300; 

app.use(cors());
app.use(express.json());


const crearInventario = () => [
  { id: 201, nombre: 'Tanque de Oxígeno XL', precio: 50, stock: 5, categoria: 'Soporte Vital' },
  { id: 202, nombre: 'Panel Solar Plegable', precio: 80, stock: 3, categoria: 'Energía' },
  { id: 203, nombre: 'Ración Espacial (caja)', precio: 20, stock: 10, categoria: 'Alimentos' },
  { id: 204, nombre: 'Kit Médico Avanzado', precio: 65, stock: 4, categoria: 'Soporte Vital' },
  { id: 205, nombre: 'Traje EVA', precio: 120, stock: 2, categoria: 'Equipamiento' },
  { id: 206, nombre: 'Filtro de Agua', precio: 35, stock: 6, categoria: 'Soporte Vital' },
  { id: 207, nombre: 'Rover Explorador', precio: 200, stock: 1, categoria: 'Equipamiento' },
  { id: 208, nombre: 'Batería de Litio', precio: 40, stock: 0, categoria: 'Energía' },
];

let inventario = crearInventario();
let itemsCargados = [];
let confirmada = false;
let inicioSesion = Date.now();


const buscarProducto = (id) => inventario.find((p) => p.id === id);

const calcularTotal = () =>
  itemsCargados.reduce((acc, item) => acc + buscarProducto(item.id).precio * item.cantidad, 0);

const tiempoRestante = () =>
  Math.max(0, DURACION_SESION_SEG - Math.floor((Date.now() - inicioSesion) / 1000));

const estadoCarga = () => {
  const total = calcularTotal();
  return {
    presupuesto: PRESUPUESTO_INICIAL,
    creditos: PRESUPUESTO_INICIAL - total,
    itemsCargados,
    total,
    confirmada,
    tiempoRestante: tiempoRestante(),
    expirada: tiempoRestante() === 0,
  };
};


const verificarSesion = (req, res, next) => {
  if (tiempoRestante() === 0) {
    return res.status(410).json({
      mensaje: 'La ventana de lanzamiento se cerró. Inicia la sesión nuevamente.',
    });
  }
  if (confirmada) {
    return res.status(409).json({ mensaje: 'La carga ya fue confirmada y no puede modificarse.' });
  }
  next();
};


const aplicarCantidad = (producto, nuevaCantidad) => {
  const existente = itemsCargados.find((i) => i.id === producto.id);
  const actual = existente ? existente.cantidad : 0;
  const delta = nuevaCantidad - actual;

  if (delta > producto.stock) return { error: 'Stock en base insuficiente' };
  if (calcularTotal() + delta * producto.precio > PRESUPUESTO_INICIAL) {
    return { error: 'Créditos insuficientes para esta cantidad' };
  }

  producto.stock -= delta;

  if (nuevaCantidad <= 0) {
    itemsCargados = itemsCargados.filter((i) => i.id !== producto.id);
  } else if (existente) {
    existente.cantidad = nuevaCantidad;
  } else {
    itemsCargados.push({ id: producto.id, cantidad: nuevaCantidad });
  }
  return { ok: true };
};

// ---------- Endpoints ----------
// 1. Inventario completo
app.get('/api/inventario', (req, res) => res.json(inventario));

// 2. Carga activa y créditos
app.get('/api/carga', (req, res) => res.json(estadoCarga()));

// 3. Agregar suministro
app.post('/api/carga/agregar', verificarSesion, (req, res) => {
  const equipoId = Number(req.body.equipoId);
  const cantidad = Number(req.body.cantidad);
  const producto = buscarProducto(equipoId);

  if (!producto) return res.status(404).json({ mensaje: 'Suministro no encontrado' });
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return res.status(400).json({ mensaje: 'La cantidad debe ser un entero mayor a 0' });
  }

  const actual = itemsCargados.find((i) => i.id === equipoId)?.cantidad ?? 0;
  const resultado = aplicarCantidad(producto, actual + cantidad);
  if (resultado.error) return res.status(400).json({ mensaje: resultado.error });

  res.status(201).json(estadoCarga());
});


app.put('/api/carga/actualizar-unidades/:id', verificarSesion, (req, res) => {
  const id = Number(req.params.id);
  const cantidad = Number(req.body.cantidad);
  const producto = buscarProducto(id);

  if (!producto || !itemsCargados.some((i) => i.id === id)) {
    return res.status(404).json({ mensaje: 'El suministro no está en la carga' });
  }
  if (!Number.isInteger(cantidad) || cantidad < 0) {
    return res.status(400).json({ mensaje: 'Cantidad inválida' });
  }

  const resultado = aplicarCantidad(producto, cantidad);
  if (resultado.error) return res.status(400).json({ mensaje: resultado.error });

  res.json(estadoCarga());
});


app.delete('/api/carga/eliminar/:id', verificarSesion, (req, res) => {
  const id = Number(req.params.id);
  const item = itemsCargados.find((i) => i.id === id);
  if (!item) return res.status(404).json({ mensaje: 'El suministro no está en la carga' });

  buscarProducto(id).stock += item.cantidad;
  itemsCargados = itemsCargados.filter((i) => i.id !== id);
  res.json(estadoCarga());
});


app.post('/api/carga/confirmar', verificarSesion, (req, res) => {
  if (itemsCargados.length === 0) {
    return res.status(400).json({ mensaje: 'La carga está vacía' });
  }
  confirmada = true;
  res.json(estadoCarga());
});

app.post('/api/sesion/reiniciar', (req, res) => {
  inventario = crearInventario();
  itemsCargados = [];
  confirmada = false;
  inicioSesion = Date.now();
  res.json(estadoCarga());
});

app.listen(PORT, () => console.log(`AstroLogistics API en http://localhost:${PORT}`));
