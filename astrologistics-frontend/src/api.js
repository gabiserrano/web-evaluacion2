// capa de comunicación con el backend (REST + promesas)
// Las URLs son relativas: Vite las redirige al backend con el proxy (/api -> localhost:3001)
const request = (url, options = {}) =>
  fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = new Error(data.mensaje || 'Error inesperado');
      error.status = res.status;
      throw error;
    }
    return data;
  });

export const getInventario = () => request('/api/inventario');
export const getCarga = () => request('/api/carga');
export const agregarItem = (equipoId, cantidad) =>
  request('/api/carga/agregar', { method: 'POST', body: JSON.stringify({ equipoId, cantidad }) });
export const actualizarUnidades = (id, cantidad) =>
  request(`/api/carga/actualizar-unidades/${id}`, { method: 'PUT', body: JSON.stringify({ cantidad }) });
export const eliminarItem = (id) => request(`/api/carga/eliminar/${id}`, { method: 'DELETE' });
export const confirmarCarga = () => request('/api/carga/confirmar', { method: 'POST' });
export const reiniciarSesion = () => request('/api/sesion/reiniciar', { method: 'POST' });