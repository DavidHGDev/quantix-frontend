import { fetchAPI } from '../utils/api.js';

export const Compras = {
    render: () => {
        const usuarioStr = localStorage.getItem('usuario');
        const usuario = usuarioStr ? JSON.parse(usuarioStr) : { name: 'Usuario', role: 'Desconocido', email: '' };

        if (!['ADMIN', 'VENDEDOR'].includes(usuario.role)) {
            return `<div style="padding: 40px; color: red;"><h1>Acceso Denegado</h1></div>`;
        }

        const nombreUsuario = usuario.name || usuario.firstName || 'Usuario';
        const apellidoUsuario = usuario.lastName ? ` ${usuario.lastName}` : '';
        const menuAdmin = usuario.role === 'ADMIN' ? `<li><a href="#/usuarios" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">👥 Gestión de Usuarios</a></li>` : '';
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️ Claro' : '🌙 Oscuro';

        return `
            <div style="display: flex; height: 100vh; width: 100vw; overflow: hidden; background-color: var(--bg-color);">
                
                <nav class="sidebar" style="width: 260px; background-color: var(--surface); border-right: 1px solid var(--border-color); padding: 20px; display: flex; flex-direction: column; justify-content: space-between; flex-shrink: 0;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 40px;">
                            <div style="background: var(--primary); color: white; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: bold; font-size: 1.2rem;">Q</div>
                            <h2 style="color: var(--text-color); letter-spacing: -0.5px;">Quantix</h2>
                        </div>
                        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px;">
                            <li><a href="#/dashboard" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">📊 Panel de Control</a></li>
                            <li><a href="#/ventas" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">💰 Facturación</a></li>
                            <li><a href="#/historial-facturas" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🧾 Historial Ventas</a></li>
                            <li><a href="#/cartera" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">💳 Cartera</a></li>
                            <li><a href="#/clientes" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🏷️ Clientes</a></li>
                            <li><a href="#/proveedores" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🏢 Proveedores</a></li>
                            <li><a href="#/inventario" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">📦 Inventario</a></li>
                            <li><a href="#/compras" style="text-decoration: none; color: white; background: var(--primary); padding: 12px 15px; display: block; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">🛒 Compras</a></li>
                            ${menuAdmin}
                        </ul>
                    </div>

                    <div style="border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: 20px;">
                        <div style="margin-bottom: 15px;">
                            <p style="font-weight: bold; color: var(--text-color); font-size: 0.95rem;">${nombreUsuario}${apellidoUsuario}</p>
                            <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 5px;">${usuario.email || ''}</p>
                            <span style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); padding: 3px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">Rol: ${usuario.role || 'Sin Rol'}</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <button id="btn-theme-toggle" style="width: 100%; background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; text-align: left; transition: 0.2s;">${currentTheme}</button>
                            <a href="#/perfil" style="text-decoration: none; width: 100%; background: transparent; border: 1px solid var(--border-color); color: var(--text-color); padding: 10px; border-radius: 8px; font-weight: 600; text-align: left; display: block; box-sizing: border-box;">⚙️ Mi Perfil</a>
                            <button id="btn-logout-sidebar" style="width: 100%; background: #fee2e2; border: 1px solid #fca5a5; color: #ef4444; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; text-align: left;">🚪 Cerrar Sesión</button>
                        </div>
                    </div>
                </nav>

                <main style="flex: 1; display: flex; flex-direction: column; padding: 40px; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 25px; border-bottom: 2px solid var(--border-color); padding-bottom: 20px;">
                        <div>
                            <h1 style="color: var(--text-color); font-size: 2rem;">Órdenes de Compra</h1>
                            <p style="color: var(--text-muted); margin-top: 5px;">Gestiona pedidos a proveedores y el ingreso de inventario.</p>
                        </div>
                        <button id="btn-nueva-orden" style="background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2); transition: 0.2s;">+ Nueva Orden</button>
                    </div>

                    <div style="background: var(--surface); padding: 16px 20px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                        <div style="display: flex; gap: 10px;">
                            <button id="btn-export-csv" style="background: var(--bg-color); color: #059669; border: 1px solid var(--border-color); padding: 10px 16px; border-radius: 8px; font-weight: bold; cursor: pointer;">📥 Exportar Excel</button>
                        </div>
                    </div>

                    <div style="background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead style="background: var(--bg-color); color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">
                                <tr>
                                    <th style="padding: 18px 20px;">ID Orden</th>
                                    <th style="padding: 18px 20px;">Fecha</th>
                                    <th style="padding: 18px 20px;">Proveedor</th>
                                    <th style="padding: 18px 20px;">Total (Aprox)</th>
                                    <th style="padding: 18px 20px;">Estado</th>
                                    <th style="padding: 18px 20px;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-ordenes-body">
                                <tr><td colspan="6" style="padding: 20px; text-align: center; color: var(--text-muted);">Cargando órdenes...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </main>

                <div id="modal-orden" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); justify-content: center; align-items: center; z-index: 1000;">
                    <div style="background: var(--surface); padding: 35px; border-radius: 16px; width: 95%; max-width: 800px; border: 1px solid var(--border-color); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column;">
                        <h2 id="modal-titulo-orden" style="margin-bottom: 25px; color: var(--text-color); font-size: 1.5rem;">Nueva Orden de Compra</h2>
                        
                        <form id="form-orden" style="display: flex; flex-direction: column; gap: 20px;">
                            <input type="hidden" id="orden-id">
                            
                            <div style="display: flex; gap: 15px; align-items: center;">
                                <div style="flex: 1;">
                                    <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 8px; display: block;">Proveedor</label>
                                    <select id="proveedorId" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                                        <option value="">Seleccione Proveedor...</option>
                                    </select>
                                </div>
                                <div style="width: 200px; text-align: right; background: var(--bg-color); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); flex-shrink: 0;">
                                    <p style="font-size: 0.8rem; color: var(--text-muted); font-weight: bold; margin: 0;">TOTAL ORDEN</p>
                                    <p id="total-orden-display" style="font-size: 1.5rem; font-weight: bold; color: var(--primary); margin: 5px 0 0 0;">$0</p>
                                </div>
                            </div>

                            <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; background: var(--bg-color);">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                    <h3 style="font-size: 1.1rem; color: var(--text-color); margin: 0;">Productos</h3>
                                    <button type="button" id="btn-add-producto" style="background: var(--surface); color: var(--text-color); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">+ Agregar Fila</button>
                                </div>
                                
                                <div style="display: flex; gap: 10px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color);">
                                    <div style="flex: 3; min-width: 0; font-weight: bold; font-size: 0.85rem; color: var(--text-muted);">Producto</div>
                                    <div style="flex: 1; min-width: 0; font-weight: bold; font-size: 0.85rem; color: var(--text-muted);">Cantidad</div>
                                    <div style="flex: 1; min-width: 0; font-weight: bold; font-size: 0.85rem; color: var(--text-muted);">Precio Compra</div>
                                    <div style="flex: 1; min-width: 0; font-weight: bold; font-size: 0.85rem; color: var(--text-muted); text-align: right;">Subtotal</div>
                                    <div style="width: 35px; flex-shrink: 0;"></div>
                                </div>

                                <div id="productos-container" style="display: flex; flex-direction: column; gap: 10px;"></div>
                            </div>

                            <span id="modal-error-orden" style="color: #ef4444; font-size: 0.9rem; text-align: center; font-weight: 600;"></span>

                            <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px;">
                                <button type="button" id="btn-cerrar-modal" style="padding: 12px 20px; border: none; background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; font-weight: bold;">Cancelar</button>
                                <button type="submit" id="btn-guardar-orden" style="padding: 12px 25px; border: none; background: var(--primary); color: white; border-radius: 8px; cursor: pointer; font-weight: bold;">Guardar Orden</button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        `;
    },

    attachEvents: () => {
        let globalOrders = [];
        let productosCatalogo = [];

        document.getElementById('btn-logout-sidebar').addEventListener('click', () => {
            localStorage.clear(); window.location.hash = '#/login';
        });
        document.getElementById('btn-theme-toggle').addEventListener('click', (e) => {
            const el = document.documentElement;
            if (el.getAttribute('data-theme') === 'dark') {
                el.removeAttribute('data-theme'); e.target.textContent = '🌙 Oscuro';
            } else {
                el.setAttribute('data-theme', 'dark'); e.target.textContent = '☀️ Claro';
            }
        });

        const tbody = document.getElementById('tabla-ordenes-body');
        const modal = document.getElementById('modal-orden');
        const form = document.getElementById('form-orden');
        const containerProductos = document.getElementById('productos-container');

        const cargarDependencias = async () => {
            try {
                const proveedores = await fetchAPI('/inventory/suppliers');
                const provSelect = document.getElementById('proveedorId');
                provSelect.innerHTML = `<option value="">Seleccione Proveedor...</option>` + 
                    proveedores.map(p => `<option value="${p.id}">${p.documento} - ${p.razonSocial}</option>`).join('');

                const resProd = await fetchAPI('/inventory/products?limit=1000');
                productosCatalogo = resProd.data || [];
            } catch (error) { console.error("Error dependencias", error); }
        };

        const cargarOrdenes = async () => {
            try {
                const ordenes = await fetchAPI('/purchases/orders');
                globalOrders = ordenes;

                if (ordenes.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" style="padding: 20px; text-align: center; color: var(--text-muted);">No hay órdenes registradas.</td></tr>`;
                    return;
                }

                tbody.innerHTML = ordenes.map(o => {
                    const fecha = new Date(o.fecha).toLocaleDateString('es-CO');
                    let colorEstado = '#f59e0b'; 
                    if (o.estado === 'RECIBIDA') colorEstado = '#059669'; 
                    if (o.estado === 'CANCELADA') colorEstado = '#ef4444'; 

                    const totalOrden = o.detalles ? o.detalles.reduce((acc, curr) => acc + (curr.cantidad * parseFloat(curr.priceCompra)), 0) : 0;

                    return `
                    <tr style="border-bottom: 1px solid var(--border-color); ${o.estado !== 'PENDIENTE' ? 'opacity: 0.8;' : ''}">
                        <td style="padding: 18px 20px; font-weight: bold; color: var(--text-color);">#ORD-${o.id.toString().padStart(4, '0')}</td>
                        <td style="padding: 18px 20px; color: var(--text-muted);">${fecha}</td>
                        <td style="padding: 18px 20px; color: var(--text-color);">${o.proveedor.razonSocial}</td>
                        <td style="padding: 18px 20px; color: var(--text-color); font-weight: bold; font-size: 1.05rem;">$${totalOrden.toLocaleString('es-CO')}</td>
                        <td style="padding: 18px 20px;">
                            <span style="background: var(--bg-color); border: 1px solid ${colorEstado}; color: ${colorEstado}; padding: 4px 10px; border-radius: 999px; font-weight: bold; font-size: 0.75rem;">
                                ${o.estado}
                            </span>
                        </td>
                        <td style="padding: 18px 20px; display: flex; gap: 8px;">
                            ${o.estado === 'PENDIENTE' ? `
                                <button class="btn-editar-ord" data-id='${o.id}' style="cursor: pointer; background: #eff6ff; border: 1px solid #bfdbfe; color: #3b82f6; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 0.85rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: 0.2s;">✏️ Editar</button>
                                <button class="btn-estado-ord" data-id='${o.id}' data-estado='RECIBIDA' style="cursor: pointer; background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 0.85rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: 0.2s;">✅ Recibir</button>
                                <button class="btn-estado-ord" data-id='${o.id}' data-estado='CANCELADA' style="cursor: pointer; background: #fef2f2; border: 1px solid #fecaca; color: #ef4444; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 0.85rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: 0.2s;">❌ Cancelar</button>
                            ` : `
                                <button class="btn-ver-ord" data-id='${o.id}' style="cursor: pointer; background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-muted); padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 0.85rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: 0.2s;">👁️ Ver Info</button>
                            `}
                        </td>
                    </tr>
                `}).join('');

                asignarEventosTabla();
            } catch (error) {
                tbody.innerHTML = `<tr><td colspan="6" style="color: #ef4444; text-align: center; padding: 20px;">Error: ${error.message}</td></tr>`;
            }
        };

        const asignarEventosTabla = () => {
            document.querySelectorAll('.btn-editar-ord, .btn-ver-ord').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    try {
                        const ordenCompleta = await fetchAPI(`/purchases/orders/${id}`);
                        abrirModal(ordenCompleta, ordenCompleta.estado !== 'PENDIENTE');
                    } catch (err) { alert('Error cargando detalles'); }
                });
            });

            document.querySelectorAll('.btn-estado-ord').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    const estado = e.target.dataset.estado;
                    if (!confirm(`¿Estás seguro de marcar esta orden como ${estado}? ${estado === 'RECIBIDA' ? 'Esto sumará inventario al stock permanentemente.' : ''}`)) return;
                    
                    try {
                        await fetchAPI(`/purchases/orders/${id}/status`, {
                            method: 'PATCH',
                            body: JSON.stringify({ estado })
                        });
                        cargarOrdenes();
                    } catch (err) { alert(err.message); }
                });
            });
        };

        const calcularTotalOrden = () => {
            let total = 0;
            document.querySelectorAll('.producto-row').forEach(row => {
                const qty = parseFloat(row.querySelector('.prod-qty').value) || 0;
                const price = parseFloat(row.querySelector('.prod-price').value) || 0;
                total += (qty * price);
                row.querySelector('.prod-subtotal').textContent = '$' + (qty * price).toLocaleString('es-CO');
            });
            document.getElementById('total-orden-display').textContent = '$' + total.toLocaleString('es-CO');
        };

        const agregarFilaProducto = (detalle = null, soloLectura = false) => {
            const row = document.createElement('div');
            row.className = 'producto-row';
            row.style = 'display: flex; gap: 10px; margin-bottom: 10px; align-items: center; width: 100%;';

            const selectHtml = `<select class="prod-id-select" required ${soloLectura ? 'disabled' : ''} style="flex: 3; min-width: 0; box-sizing: border-box; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none; text-overflow: ellipsis;">
                <option value="">Seleccione Producto...</option>
                ${productosCatalogo.map(p => `<option value="${p.id}" ${detalle && detalle.productoId === p.id ? 'selected' : ''}>${p.codigoBarras} -${p.nameProduct}</option>`).join('')}
            </select>`;

            row.innerHTML = `
                ${selectHtml}
                <input type="number" class="prod-qty" placeholder="Cant." value="${detalle ? detalle.cantidad : ''}" required min="1" ${soloLectura ? 'readonly' : ''} style="flex: 1; min-width: 0; box-sizing: border-box; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                <input type="number" class="prod-price" placeholder="Precio U." value="${detalle ? detalle.priceCompra : ''}" step="0.01" required min="0.01" ${soloLectura ? 'readonly' : ''} style="flex: 1; min-width: 0; box-sizing: border-box; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                <div class="prod-subtotal" style="flex: 1; min-width: 0; box-sizing: border-box; font-weight: bold; color: var(--text-color); text-align: right; padding: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">$0</div>
                <button type="button" class="btn-remove-row" style="width: 35px; flex-shrink: 0; background: #fee2e2; color: #ef4444; border: none; padding: 10px 0; border-radius: 8px; cursor: pointer; font-weight: bold; ${soloLectura ? 'display:none;' : ''}">X</button>
            `;
            
            containerProductos.appendChild(row);

            row.querySelector('.prod-qty').addEventListener('input', calcularTotalOrden);
            row.querySelector('.prod-price').addEventListener('input', calcularTotalOrden);
            row.querySelector('.btn-remove-row').addEventListener('click', () => {
                row.remove();
                calcularTotalOrden();
            });

            if (detalle) calcularTotalOrden();
        };

        document.getElementById('btn-add-producto').addEventListener('click', () => agregarFilaProducto());

        const abrirModal = (orden = null, soloLectura = false) => {
            document.getElementById('modal-error-orden').textContent = '';
            form.reset();
            containerProductos.innerHTML = '';
            document.getElementById('total-orden-display').textContent = '$0';

            const provSelect = document.getElementById('proveedorId');
            const btnGuardar = document.getElementById('btn-guardar-orden');
            const btnAdd = document.getElementById('btn-add-producto');

            if (orden) {
                document.getElementById('modal-titulo-orden').textContent = soloLectura ? `Orden #ORD-${orden.id.toString().padStart(4, '0')} (${orden.estado})` : 'Editar Orden PENDIENTE';
                document.getElementById('orden-id').value = orden.id;
                provSelect.value = orden.proveedorId;
                
                orden.detalles.forEach(d => agregarFilaProducto(d, soloLectura));
                
                provSelect.disabled = soloLectura;
                btnGuardar.style.display = soloLectura ? 'none' : 'block';
                btnAdd.style.display = soloLectura ? 'none' : 'block';
            } else {
                document.getElementById('modal-titulo-orden').textContent = 'Nueva Orden de Compra';
                document.getElementById('orden-id').value = '';
                provSelect.disabled = false;
                btnGuardar.style.display = 'block';
                btnAdd.style.display = 'block';
                agregarFilaProducto(); 
            }

            modal.style.display = 'flex';
        };

        document.getElementById('btn-nueva-orden').addEventListener('click', () => abrirModal());
        document.getElementById('btn-cerrar-modal').addEventListener('click', () => modal.style.display = 'none');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('orden-id').value;
            const proveedorId = Number(document.getElementById('proveedorId').value);
            
            const detalles = [];
            let isValid = true;

            document.querySelectorAll('.producto-row').forEach(row => {
                const prodId = Number(row.querySelector('.prod-id-select').value);
                const qty = Number(row.querySelector('.prod-qty').value);
                const price = Number(row.querySelector('.prod-price').value);

                if (!prodId || qty <= 0 || price <= 0) isValid = false;
                detalles.push({ productoId: prodId, cantidad: qty, priceCompra: price });
            });

            if (detalles.length === 0) return document.getElementById('modal-error-orden').textContent = 'Agregue al menos un producto.';
            if (!isValid) return document.getElementById('modal-error-orden').textContent = 'Faltan datos o valores inválidos en los productos.';

            const payload = { proveedorId, detalles };

            try {
                if (id) {
                    await fetchAPI(`/purchases/orders/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
                } else {
                    await fetchAPI(`/purchases/orders`, { method: 'POST', body: JSON.stringify(payload) });
                }
                modal.style.display = 'none';
                cargarOrdenes();
            } catch (error) { document.getElementById('modal-error-orden').textContent = error.message; }
        });

        document.getElementById('btn-export-csv').addEventListener('click', () => {
            if (!globalOrders.length) return alert('No hay datos para exportar');
            
            const encabezados = "ID;Fecha;Proveedor;Estado\n";
            const filas = globalOrders.map(o => 
                `"${o.id}";"${new Date(o.fecha).toLocaleDateString('es-CO')}";"${o.proveedor.razonSocial}";"${o.estado}"`
            ).join('\n');
            
            const blob = new Blob(["\uFEFF" + encabezados + filas], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `Ordenes_Compra.csv`);
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
        });

        cargarDependencias().then(() => cargarOrdenes());
    }
};