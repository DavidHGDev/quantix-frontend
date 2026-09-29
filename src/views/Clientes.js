import { fetchAPI } from '../utils/api.js';
import { mostrarToast, mostrarConfirmacion } from '../utils/ui.js';

export const Clientes = {
    render: () => {
        const usuarioStr = localStorage.getItem('usuario');
        const usuario = usuarioStr ? JSON.parse(usuarioStr) : { name: 'Usuario', role: 'Desconocido', email: '' };

        const nombreUsuario = usuario.name || usuario.firstName || 'Usuario';
        const apellidoUsuario = usuario.lastName ? ` ${usuario.lastName}` : '';
        const menuAdmin = usuario.role === 'ADMIN' ? `<li><a href="#/usuarios" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">👥 Gestión de Usuarios</a></li>` : '';
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️ Claro' : '🌙 Oscuro';

        const sidebarHTML = `
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
                        <li><a href="#/clientes" style="text-decoration: none; color: white; background: var(--primary); padding: 12px 15px; display: block; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">🏷️ Clientes</a></li>
                        <li><a href="#/proveedores" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🏢 Proveedores</a></li>
                        <li><a href="#/inventario" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">📦 Inventario</a></li>
                        <li><a href="#/compras" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🛒 Compras</a></li>
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
                        <button id="btn-logout-sidebar" style="width: 100%; background: #fee2e2; border: 1px solid #fca5a5; color: #ef4444; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; text-align: left;">🚪 Cerrar Sesión</button>
                    </div>
                </div>
            </nav>
        `;

        let mainContent = '';

        if (!['ADMIN', 'VENDEDOR'].includes(usuario.role)) {
            mainContent = `
                <main style="flex: 1; padding: 40px; overflow-y: auto;">
                    <div style="background: #fee2e2; border: 1px solid #ef4444; color: #b91c1c; padding: 15px 20px; border-radius: 8px; text-align: center; font-weight: bold; font-size: 1.1rem; margin-bottom: 20px;">
                        🚫 Acceso Denegado: Su rol no está permitido para visualizar o gestionar Clientes.
                    </div>
                </main>
            `;
        } else {
            mainContent = `
                <main style="flex: 1; display: flex; flex-direction: column; padding: 40px; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 30px; border-bottom: 2px solid var(--border-color); padding-bottom: 20px;">
                        <div>
                            <h1 style="color: var(--text-color); font-size: 2rem;">Gestión de Clientes (Vista 360)</h1>
                            <p style="color: var(--text-muted); margin-top: 5px;">Administra tu base de datos y revisa los créditos activos de los clientes.</p>
                        </div>
                        <button id="btn-nuevo-cliente" style="background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">+ Nuevo Cliente</button>
                    </div>

                    <div style="background: var(--surface); padding: 16px 20px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 25px; display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
                        <input type="text" id="input-search" placeholder="Buscar por documento, email o nombre..." style="flex: 1; min-width: 300px; padding: 12px 15px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                        <button id="btn-buscar" style="background: var(--text-color); color: var(--surface); border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">🔍 Buscar</button>
                        <button id="btn-limpiar" style="background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">Limpiar</button>
                        <button id="btn-export-csv" style="background: var(--bg-color); color: #059669; border: 1px solid var(--border-color); padding: 12px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-left: auto;">📥 Excel</button>
                    </div>

                    <div style="background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead style="background: var(--bg-color); color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase;">
                                <tr>
                                    <th style="padding: 18px 20px;">Cliente</th>
                                    <th style="padding: 18px 20px;">Documento</th>
                                    <th style="padding: 18px 20px;">Deuda Activa</th>
                                    <th style="padding: 18px 20px;">Estado</th>
                                    <th style="padding: 18px 20px;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-clientes-body">
                                <tr><td colspan="5" style="padding: 20px; text-align: center; color: var(--text-muted);">Cargando clientes...</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding: 0 10px;">
                        <span id="page-info" style="color: var(--text-muted); font-size: 0.9rem;">Mostrando página 1 de 1</span>
                        <div style="display: flex; gap: 10px;">
                            <button id="btn-prev" disabled style="padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--surface); color: var(--text-color); cursor: pointer; font-weight: bold;">Anterior</button>
                            <button id="btn-next" disabled style="padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--surface); color: var(--text-color); cursor: pointer; font-weight: bold;">Siguiente</button>
                        </div>
                    </div>
                </main>

                <!-- MODAL CLIENTE CRUD -->
                <div id="modal-cliente" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); justify-content: center; align-items: center; z-index: 1000;">
                    <div style="background: var(--surface); padding: 35px; border-radius: 16px; width: 90%; max-width: 550px; border: 1px solid var(--border-color); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
                        <h2 id="modal-titulo" style="margin-bottom: 25px; color: var(--text-color); font-size: 1.5rem;">Nuevo Cliente</h2>
                        <form id="form-cliente" style="display: flex; flex-direction: column; gap: 18px;">
                            <input type="hidden" id="client-id" name="id">
                            <div style="display: flex; gap: 15px;">
                                <input type="text" id="firstName" name="firstName" placeholder="Nombres *" required style="flex:1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                                <input type="text" id="lastName" name="lastName" placeholder="Apellidos (Opcional)" style="flex:1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                            </div>
                            <div style="display: flex; gap: 15px;">
                                <select id="tipoDocumento" name="tipoDocumento" required style="width: 110px; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                                    <option value="CC">CC</option><option value="NIT">NIT</option><option value="CE">CE</option><option value="PP">PP</option>
                                </select>
                                <input type="text" id="documento" name="documento" placeholder="Número Documento *" required style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                            </div>
                            <div style="display: flex; gap: 15px;">
                                <input type="email" id="email" name="email" placeholder="Correo (Opcional)" style="flex:1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                                <input type="text" id="phone" name="phone" placeholder="Teléfono (Opcional)" style="flex:1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                            </div>
                            <input type="text" id="address" name="address" placeholder="Dirección (Opcional)" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none; box-sizing: border-box;">
                            
                            <div id="estado-container" style="display: none; align-items: center; gap: 10px; background: var(--bg-color); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                                <input type="checkbox" id="isActive" name="isActive" style="width: 18px; height: 18px;">
                                <label for="isActive" style="font-weight: 600; color: var(--text-color);">Cliente Activo en el Sistema</label>
                            </div>
                            <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px;">
                                <button type="button" id="btn-cerrar-modal" style="padding: 12px 20px; border: none; background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; font-weight: bold;">Cancelar</button>
                                <button type="submit" style="padding: 12px 25px; border: none; background: var(--primary); color: white; border-radius: 8px; cursor: pointer; font-weight: bold;">Guardar Cliente</button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- MODAL DE ABONO DIRECTO -->
                <div id="modal-abono" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); justify-content: center; align-items: center; z-index: 1050;">
                    <div style="background: var(--surface); padding: 35px; border-radius: 16px; width: 90%; max-width: 450px; border: 1px solid var(--border-color); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
                        <h2 style="margin-bottom: 5px; color: var(--text-color); font-size: 1.5rem;">Abono a Cuenta</h2>
                        <p id="abono-cliente-nombre" style="color: var(--text-muted); margin-bottom: 20px; font-size: 0.9rem;"></p>
                        
                        <form id="form-abono" style="display: flex; flex-direction: column; gap: 18px;">
                            <div>
                                <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 8px; display: block;">Seleccione Factura a Pagar</label>
                                <select id="abono-credito-id" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none; box-sizing: border-box;"></select>
                            </div>
                            <div>
                                <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 8px; display: block;">Monto a Abonar</label>
                                <input type="number" id="montoAbono" required min="1" step="0.01" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none; box-sizing: border-box; font-size: 1.1rem; font-weight: bold;">
                            </div>
                            <div>
                                <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 8px; display: block;">Método de Pago</label>
                                <select id="metodoPago" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none; box-sizing: border-box;">
                                    <option value="EFECTIVO">Efectivo</option>
                                    <option value="TRANSFERENCIA">Transferencia</option>
                                </select>
                            </div>
                            <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px;">
                                <button type="button" id="btn-cerrar-abono" style="padding: 12px 20px; border: none; background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; font-weight: bold;">Cancelar</button>
                                <button type="submit" style="padding: 12px 25px; border: none; background: #059669; color: white; border-radius: 8px; cursor: pointer; font-weight: bold;">Aplicar Pago</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        }

        return `<div style="display: flex; height: 100vh; width: 100vw; overflow: hidden; background-color: var(--bg-color);">${sidebarHTML}${mainContent}</div>`;
    },

    attachEvents: () => {
        const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
        if (!usuarioLocal || !['ADMIN', 'VENDEDOR'].includes(usuarioLocal.role)) return;
        const isAdmin = usuarioLocal.role === 'ADMIN';

        let currentPage = 1;
        let querySearch = '';
        let globalClientes = [];

        document.getElementById('btn-logout-sidebar').addEventListener('click', () => { localStorage.clear(); window.location.hash = '#/login'; });
        document.getElementById('btn-theme-toggle').addEventListener('click', (e) => {
            const el = document.documentElement;
            if (el.getAttribute('data-theme') === 'dark') { el.removeAttribute('data-theme'); e.target.textContent = '🌙 Oscuro'; } 
            else { el.setAttribute('data-theme', 'dark'); e.target.textContent = '☀️ Claro'; }
        });

        const tbody = document.getElementById('tabla-clientes-body');
        const pageInfo = document.getElementById('page-info');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const modal = document.getElementById('modal-cliente');
        const form = document.getElementById('form-cliente');
        const modalAbono = document.getElementById('modal-abono');
        const formAbono = document.getElementById('form-abono');

        const cargarClientes = async () => {
            try {
                const params = new URLSearchParams({ page: currentPage, limit: 10 });
                if (querySearch) params.append('search', querySearch);

                const result = await fetchAPI(`/clients?${params.toString()}`);
                const data = result.data || result;
                const pagination = result.pagination || { page: 1, totalPages: 1, hasMore: false };
                globalClientes = data;
                
                if (data.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="5" style="padding: 20px; text-align: center; color: var(--text-muted);">No se encontraron clientes.</td></tr>`;
                    return;
                }

                tbody.innerHTML = data.map(c => {
                    const deudas = c.creditos || []; 
                    const deudaTotal = deudas.reduce((acc, curr) => acc + Number(curr.saldoCredito), 0);

                    return `
                    <tr style="border-bottom: 1px solid var(--border-color); ${!c.isActive ? 'opacity: 0.6;' : ''}">
                        <td style="padding: 18px 20px; font-weight: 600; color: var(--text-color);">
                            ${c.firstName} ${c.lastName || ''} <br>
                            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal;">${c.email || 'Sin correo'}</span>
                        </td>
                        <td style="padding: 18px 20px; color: var(--text-muted);">${c.tipoDocumento} - ${c.documento}</td>
                        <td style="padding: 18px 20px; color: ${deudaTotal > 0 ? '#ef4444' : 'var(--text-muted)'}; font-weight: bold;">
                            $${deudaTotal.toLocaleString('es-CO')}
                        </td>
                        <td style="padding: 18px 20px;">
                            ${c.isActive ? '<span style="color: #059669; font-weight: 700;">🟢 Activo</span>' : '<span style="color: #ef4444; font-weight: 700;">🔴 Inactivo</span>'}
                        </td>
                        <td style="padding: 18px 20px; display: flex; gap: 8px;">
                            <button class="btn-editar" data-client='${JSON.stringify(c)}' style="cursor: pointer; background: #eff6ff; border: 1px solid #bfdbfe; color: #3b82f6; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 0.85rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: 0.2s;">✏️ Editar</button>
                            ${deudaTotal > 0 ? `<button class="btn-pagar" data-client='${JSON.stringify(c)}' style="cursor: pointer; background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 0.85rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">💸 Abonar</button>` : ''}
                        </td>
                    </tr>
                `}).join('');

                document.querySelectorAll('.btn-editar').forEach(btn => btn.addEventListener('click', (e) => abrirModal(JSON.parse(e.target.dataset.client))));
                document.querySelectorAll('.btn-pagar').forEach(btn => btn.addEventListener('click', (e) => abrirModalAbono(JSON.parse(e.target.dataset.client))));

                pageInfo.textContent = `Mostrando página ${pagination.page} de ${pagination.totalPages}`;
                btnPrev.disabled = pagination.page <= 1;
                btnNext.disabled = !pagination.hasMore && pagination.page >= pagination.totalPages;

            } catch (error) { mostrarToast(`Error: ${error.message}`, 'error'); }
        };

        btnPrev.addEventListener('click', () => { currentPage--; cargarClientes(); });
        btnNext.addEventListener('click', () => { currentPage++; cargarClientes(); });

        document.getElementById('btn-buscar').addEventListener('click', () => { querySearch = document.getElementById('input-search').value.trim(); currentPage = 1; cargarClientes(); });
        document.getElementById('btn-limpiar').addEventListener('click', () => { document.getElementById('input-search').value = ''; querySearch = ''; currentPage = 1; cargarClientes(); });

        document.getElementById('btn-export-csv').addEventListener('click', () => {
            if (!globalClientes.length) return mostrarToast('No hay datos para exportar', 'error');
            const encabezados = "Nombre;Apellido;Documento;Email;Telefono;Estado\n";
            const filas = globalClientes.map(c => `"${c.firstName}";"${c.lastName||''}";"${c.tipoDocumento}-${c.documento}";"${c.email||''}";"${c.phone||''}";"${c.isActive?'Activo':'Inactivo'}"`).join('\n');
            const blob = new Blob(["\uFEFF" + encabezados + filas], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.setAttribute('download', `Clientes.csv`);
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
        });

        // MODAL CRUD CLIENTE
        const abrirModal = (cliente = null) => {
            form.reset();
            const estadoContainer = document.getElementById('estado-container');

            if (cliente) {
                document.getElementById('modal-titulo').textContent = 'Editar Cliente';
                document.getElementById('client-id').value = cliente.id;
                document.getElementById('firstName').value = cliente.firstName;
                document.getElementById('lastName').value = cliente.lastName || '';
                document.getElementById('tipoDocumento').value = cliente.tipoDocumento;
                document.getElementById('documento').value = cliente.documento;
                document.getElementById('email').value = cliente.email || '';
                document.getElementById('phone').value = cliente.phone || '';
                document.getElementById('address').value = cliente.address || '';
                
                if (isAdmin) { estadoContainer.style.display = 'flex'; document.getElementById('isActive').checked = cliente.isActive; }
                document.getElementById('documento').readOnly = true; document.getElementById('documento').style.opacity = '0.6'; 
            } else {
                document.getElementById('modal-titulo').textContent = 'Nuevo Cliente';
                document.getElementById('client-id').value = '';
                estadoContainer.style.display = 'none';
                document.getElementById('documento').readOnly = false; document.getElementById('documento').style.opacity = '1';
            }
            modal.style.display = 'flex';
        };

        document.getElementById('btn-nuevo-cliente').addEventListener('click', () => abrirModal());
        document.getElementById('btn-cerrar-modal').addEventListener('click', () => modal.style.display = 'none');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = Object.fromEntries(new FormData(form));
            const id = payload.id; delete payload.id;
            if (id && isAdmin) payload.isActive = form.hasAttribute('isActive') ? document.getElementById('isActive').checked : undefined;

            try {
                if (id) await fetchAPI(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
                else await fetchAPI(`/clients`, { method: 'POST', body: JSON.stringify(payload) });
                modal.style.display = 'none'; 
                mostrarToast(id ? 'Cliente actualizado' : 'Cliente registrado', 'success');
                cargarClientes();
            } catch (error) { mostrarToast(error.message, 'error'); }
        });

        // MODAL ABONOS (VISTA 360)
        let maxSaldoPermitido = 0;
        const selectCredito = document.getElementById('abono-credito-id');
        const inputMonto = document.getElementById('montoAbono');

        const abrirModalAbono = (cliente) => {
            formAbono.reset();
            document.getElementById('abono-cliente-nombre').textContent = `${cliente.firstName} ${cliente.lastName || ''} (${cliente.documento})`;
            
            selectCredito.innerHTML = cliente.creditos.map(c => 
                `<option value="${c.id}" data-saldo="${c.saldoCredito}">FAC-${c.facturaId} - Saldo: $${Number(c.saldoCredito).toLocaleString('es-CO')}</option>`
            ).join('');
            
            const setMontos = () => {
                const opt = selectCredito.options[selectCredito.selectedIndex];
                maxSaldoPermitido = Number(opt.dataset.saldo);
                inputMonto.max = maxSaldoPermitido;
                inputMonto.value = maxSaldoPermitido; 
            };
            
            selectCredito.addEventListener('change', setMontos);
            setMontos();

            modalAbono.style.display = 'flex';
        };

        document.getElementById('btn-cerrar-abono').addEventListener('click', () => modalAbono.style.display = 'none');

        formAbono.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idCredito = selectCredito.value;
            const monto = Number(inputMonto.value);

            if (monto > maxSaldoPermitido) return mostrarToast(`El abono no puede superar $${maxSaldoPermitido.toLocaleString()}`, 'error');

            mostrarConfirmacion(`¿Confirmas el registro de este abono por $${monto.toLocaleString()}?`, async () => {
                const payload = { montoAbono: monto, metodoPago: document.getElementById('metodoPago').value };
                try {
                    await fetchAPI(`/sales/credits/${idCredito}/payments`, { method: 'POST', body: JSON.stringify(payload) });
                    modalAbono.style.display = 'none';
                    mostrarToast('Abono registrado exitosamente', 'success');
                    cargarClientes(); 
                } catch (error) { mostrarToast(error.message, 'error'); }
            });
        });

        cargarClientes();
    }
};