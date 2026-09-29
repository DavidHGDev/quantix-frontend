import { fetchAPI } from '../utils/api.js';
import { mostrarToast, mostrarConfirmacion } from '../utils/ui.js';

export const Cartera = {
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
                        <li><a href="#/cartera" style="text-decoration: none; color: white; background: var(--primary); padding: 12px 15px; display: block; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">💳 Cartera</a></li>
                        <li><a href="#/clientes" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🏷️ Clientes</a></li>
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
                        🚫 Acceso Denegado: Su rol no está permitido para visualizar Cartera.
                    </div>
                </main>
            `;
        } else {
            mainContent = `
                <main style="flex: 1; display: flex; flex-direction: column; padding: 40px; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 25px; border-bottom: 2px solid var(--border-color); padding-bottom: 20px;">
                        <div>
                            <h1 style="color: var(--text-color); font-size: 2rem;">Cuentas por Cobrar</h1>
                            <p style="color: var(--text-muted); margin-top: 5px;">Gestión de créditos activos y registro de abonos.</p>
                        </div>
                    </div>

                    <div style="background: var(--surface); padding: 16px 20px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 20px; display: flex; gap: 15px;">
                        <input type="text" id="input-search" placeholder="Buscar por ID cliente..." style="flex: 1; max-width: 400px; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                        <button id="btn-buscar" style="background: var(--text-color); color: var(--surface); border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer;">Buscar</button>
                        <button id="btn-reset" style="background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); padding: 10px 14px; border-radius: 8px; cursor: pointer;">Limpiar</button>
                    </div>

                    <div style="background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead style="background: var(--bg-color); color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">
                                <tr>
                                    <th style="padding: 18px 20px;">Factura</th>
                                    <th style="padding: 18px 20px;">Cliente</th>
                                    <th style="padding: 18px 20px;">Fecha Emisión</th>
                                    <th style="padding: 18px 20px;">Deuda Inicial</th>
                                    <th style="padding: 18px 20px;">Saldo Actual</th>
                                    <th style="padding: 18px 20px;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-creditos-body">
                                <tr><td colspan="6" style="padding: 20px; text-align: center; color: var(--text-muted);">Cargando...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </main>

                <!-- MODAL DE ABONO -->
                <div id="modal-abono" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); justify-content: center; align-items: center; z-index: 1000;">
                    <div style="background: var(--surface); padding: 35px; border-radius: 16px; width: 90%; max-width: 450px; border: 1px solid var(--border-color); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
                        <h2 style="margin-bottom: 5px; color: var(--text-color); font-size: 1.5rem;">Registrar Abono</h2>
                        <p id="abono-cliente-nombre" style="color: var(--text-muted); margin-bottom: 20px; font-size: 0.9rem;"></p>
                        
                        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                            <p style="margin: 0; font-size: 0.85rem; color: #1e3a8a; font-weight: bold;">SALDO PENDIENTE</p>
                            <p id="abono-saldo-display" style="margin: 5px 0 0 0; font-size: 1.8rem; color: #1d4ed8; font-weight: bold;">$0</p>
                        </div>

                        <form id="form-abono" style="display: flex; flex-direction: column; gap: 18px;">
                            <input type="hidden" id="abono-credito-id">
                            <input type="hidden" id="abono-saldo-max">
                            
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
                            
                            <input type="text" id="notaAbono" placeholder="Nota o referencia (Opcional)" style="padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">

                            <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px;">
                                <button type="button" id="btn-cerrar-modal" style="padding: 12px 20px; border: none; background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; font-weight: bold;">Cancelar</button>
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

        let querySearch = '';

        document.getElementById('btn-logout-sidebar').addEventListener('click', () => { localStorage.clear(); window.location.hash = '#/login'; });
        document.getElementById('btn-theme-toggle').addEventListener('click', (e) => {
            const el = document.documentElement;
            if (el.getAttribute('data-theme') === 'dark') { el.removeAttribute('data-theme'); e.target.textContent = '🌙 Oscuro'; } 
            else { el.setAttribute('data-theme', 'dark'); e.target.textContent = '☀️ Claro'; }
        });

        const tbody = document.getElementById('tabla-creditos-body');
        const modal = document.getElementById('modal-abono');
        const form = document.getElementById('form-abono');

        const cargarCreditos = async () => {
            try {
                const url = `/sales/credits${querySearch ? `?clienteId=${encodeURIComponent(querySearch)}` : ''}`;
                const creditos = await fetchAPI(url); 
                
                if (creditos.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" style="padding: 20px; text-align: center; color: var(--text-muted);">No hay cuentas por cobrar activas.</td></tr>`;
                    return;
                }

                tbody.innerHTML = creditos.map(c => {
                    const fecha = new Date(c.factura.fecha).toLocaleDateString('es-CO');
                    return `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 18px 20px; font-weight: bold; color: var(--text-color);">#FAC-${c.facturaId}</td>
                        <td style="padding: 18px 20px; color: var(--text-color);">${c.cliente.firstName} ${c.cliente.lastName || ''}</td>
                        <td style="padding: 18px 20px; color: var(--text-muted);">${fecha}</td>
                        <td style="padding: 18px 20px; color: var(--text-muted);">$${Number(c.montoOriginal).toLocaleString('es-CO')}</td>
                        <td style="padding: 18px 20px; color: #ef4444; font-weight: bold; font-size: 1.05rem;">$${Number(c.saldoCredito).toLocaleString('es-CO')}</td>
                        <td style="padding: 18px 20px;">
                            <button class="btn-abonar" data-cred='${JSON.stringify(c)}' style="cursor: pointer; background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; padding: 8px 16px; border-radius: 6px; font-weight: bold; font-size: 0.85rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: 0.2s;">💸 Abonar</button>
                        </td>
                    </tr>
                `}).join('');

                document.querySelectorAll('.btn-abonar').forEach(btn => {
                    btn.addEventListener('click', (e) => abrirModalAbono(JSON.parse(e.target.dataset.cred)));
                });
            } catch (error) { mostrarToast(`Error: ${error.message}`, 'error'); }
        };

        document.getElementById('btn-buscar').addEventListener('click', () => { querySearch = document.getElementById('input-search').value.trim(); cargarCreditos(); });
        document.getElementById('btn-reset').addEventListener('click', () => { document.getElementById('input-search').value = ''; querySearch = ''; cargarCreditos(); });

        const abrirModalAbono = (credito) => {
            form.reset();
            document.getElementById('abono-credito-id').value = credito.id;
            document.getElementById('abono-saldo-max').value = credito.saldoCredito;
            document.getElementById('abono-cliente-nombre').textContent = `Cliente: ${credito.cliente.firstName} ${credito.cliente.lastName || ''}`;
            document.getElementById('abono-saldo-display').textContent = `$${Number(credito.saldoCredito).toLocaleString('es-CO')}`;
            
            document.getElementById('montoAbono').max = credito.saldoCredito;
            document.getElementById('montoAbono').value = credito.saldoCredito; 
            
            modal.style.display = 'flex';
        };

        document.getElementById('btn-cerrar-modal').addEventListener('click', () => modal.style.display = 'none');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idCredito = document.getElementById('abono-credito-id').value;
            const saldoPermitido = Number(document.getElementById('abono-saldo-max').value);
            const monto = Number(document.getElementById('montoAbono').value);

            if (monto > saldoPermitido) return mostrarToast(`El abono no puede superar $${saldoPermitido.toLocaleString()}`, 'error');

            mostrarConfirmacion(`¿Confirmas el registro de este abono por $${monto.toLocaleString()}?`, async () => {
                const payload = { montoAbono: monto, metodoPago: document.getElementById('metodoPago').value, nota: document.getElementById('notaAbono').value || undefined };
                try {
                    await fetchAPI(`/sales/credits/${idCredito}/payments`, { method: 'POST', body: JSON.stringify(payload) });
                    modal.style.display = 'none';
                    mostrarToast('Abono registrado exitosamente', 'success');
                    cargarCreditos(); 
                } catch (error) { mostrarToast(error.message, 'error'); }
            });
        });

        cargarCreditos();
    }
};