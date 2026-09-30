import { fetchAPI } from '../utils/api.js';
import { mostrarToast } from '../utils/ui.js';

export const HistorialFacturas = {
    render: () => {
        const usuarioStr = localStorage.getItem('usuario');
        const usuario = usuarioStr ? JSON.parse(usuarioStr) : { name: 'Usuario', role: 'Desconocido', email: '' };
        if (!['ADMIN', 'VENDEDOR'].includes(usuario.role)) return `<div style="padding: 40px; color: red;"><h1>Acceso Denegado</h1></div>`;

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
                            <li><a href="#/historial-facturas" style="text-decoration: none; color: white; background: var(--primary); padding: 12px 15px; display: block; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">🧾 Historial Ventas</a></li>
                            <li><a href="#/cartera" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">💳 Cartera</a></li>
                            <li><a href="#/clientes" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🏷️ Clientes</a></li>
                            <li><a href="#/proveedores" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🏢 Proveedores</a></li>
                            <li><a href="#/inventario" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">📦 Inventario</a></li>
                            <li><a href="#/compras" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🛒 Compras</a></li>
                            ${menuAdmin}
                        </ul>
                    </div>
                    <div style="border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: 20px;">
                        <div style="margin-bottom: 15px;">
                            <p style="font-weight: bold; color: var(--text-color); font-size: 0.95rem;">${nombreUsuario} ${apellidoUsuario}</p>
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
                    <div style="margin-bottom: 25px; border-bottom: 2px solid var(--border-color); padding-bottom: 20px;">
                        <h1 style="color: var(--text-color); font-size: 2rem;">Historial de Ventas</h1>
                        <p style="color: var(--text-muted); margin-top: 5px;">Consulta las facturas generadas y sus detalles.</p>
                    </div>

                    <div style="background: var(--surface); padding: 16px 20px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 20px; display: flex; gap: 15px;">
                        <button id="btn-export-csv" style="background: var(--bg-color); color: #059669; border: 1px solid var(--border-color); padding: 10px 16px; border-radius: 8px; font-weight: bold; cursor: pointer;">📥 Exportar Excel</button>
                    </div>

                    <div style="background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead style="background: var(--bg-color); color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase;">
                                <tr>
                                    <th style="padding: 18px 20px;">N° Factura</th>
                                    <th style="padding: 18px 20px;">Fecha</th>
                                    <th style="padding: 18px 20px;">Cliente</th>
                                    <th style="padding: 18px 20px;">Método</th>
                                    <th style="padding: 18px 20px;">Total</th>
                                    <th style="padding: 18px 20px;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-facturas-body">
                                <tr><td colspan="6" style="padding: 20px; text-align: center; color: var(--text-muted);">Cargando...</td></tr>
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

                <!-- MODAL DETALLE FACTURA -->
                <div id="modal-detalle" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); justify-content: center; align-items: center; z-index: 1000;">
                    <div style="background: var(--surface); padding: 35px; border-radius: 16px; width: 90%; max-width: 700px; border: 1px solid var(--border-color); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); max-height: 90vh; overflow-y: auto;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
                            <h2 id="modal-titulo-fac" style="color: var(--text-color); font-size: 1.5rem;">Detalle de Factura</h2>
                            <button id="btn-cerrar-modal" style="background: transparent; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer;">×</button>
                        </div>
                        
                        <div style="background: var(--bg-color); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <p style="margin:0; font-size: 0.9rem; color: var(--text-muted);">Cliente: <strong id="det-cliente" style="color: var(--text-color);"></strong></p>
                            <p style="margin:0; font-size: 0.9rem; color: var(--text-muted);">Vendedor: <strong id="det-vendedor" style="color: var(--text-color);"></strong></p>
                            <p style="margin:0; font-size: 0.9rem; color: var(--text-muted);">Fecha: <strong id="det-fecha" style="color: var(--text-color);"></strong></p>
                            <p style="margin:0; font-size: 0.9rem; color: var(--text-muted);">Método: <strong id="det-metodo" style="color: var(--text-color);"></strong></p>
                        </div>

                        <h3 style="font-size: 1.1rem; color: var(--text-color); margin-bottom: 15px;">Productos</h3>
                        <div style="border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden;">
                            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                                <thead style="background: var(--bg-color); color: var(--text-muted); font-size: 0.85rem;">
                                    <tr>
                                        <th style="padding: 12px 15px;">Producto</th>
                                        <th style="padding: 12px 15px;">Cant.</th>
                                        <th style="padding: 12px 15px;">Precio U.</th>
                                        <th style="padding: 12px 15px; text-align: right;">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody id="tabla-detalles-body"></tbody>
                            </table>
                        </div>
                        <div style="text-align: right; margin-top: 15px; font-size: 1.5rem; font-weight: bold; color: var(--primary);">
                            Total: <span id="det-total"></span>
                        </div>
                    </div>
                </div>

            </div>
        `;
    },

    attachEvents: () => {
        let currentPage = 1;
        let globalInvoices = [];

        document.getElementById('btn-logout-sidebar').addEventListener('click', () => { localStorage.clear(); window.location.hash = '#/login'; });
        document.getElementById('btn-theme-toggle').addEventListener('click', (e) => {
            const el = document.documentElement;
            if (el.getAttribute('data-theme') === 'dark') { el.removeAttribute('data-theme'); e.target.textContent = '🌙 Oscuro'; } 
            else { el.setAttribute('data-theme', 'dark'); e.target.textContent = '☀️ Claro'; }
        });

        const tbody = document.getElementById('tabla-facturas-body');
        const pageInfo = document.getElementById('page-info');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const modal = document.getElementById('modal-detalle');

        const cargarFacturas = async () => {
            try {
                const result = await fetchAPI(`/sales/invoices?page=${currentPage}&limit=10`);
                globalInvoices = result.data; 

                if (result.data.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" style="padding: 20px; text-align: center; color: var(--text-muted);">No hay facturas registradas.</td></tr>`;
                } else {
                    tbody.innerHTML = result.data.map(f => {
                        const colorMetodo = f.metodoDePago === 'CREDITO' ? '#f59e0b' : '#059669';
                        return `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 18px 20px; font-weight: bold; color: var(--text-color);">#FAC-${f.id.toString().padStart(4, '0')}</td>
                            <td style="padding: 18px 20px; color: var(--text-muted);">${new Date(f.fecha).toLocaleDateString('es-CO')}</td>
                            <td style="padding: 18px 20px; color: var(--text-color);">${f.cliente.firstName} ${f.cliente.lastName || ''}</td>
                            <td style="padding: 18px 20px;"><span style="background: var(--bg-color); border: 1px solid ${colorMetodo}; color: ${colorMetodo}; padding: 4px 10px; border-radius: 999px; font-weight: bold; font-size: 0.75rem;">${f.metodoDePago}</span></td>
                            <td style="padding: 18px 20px; color: var(--primary); font-weight: bold;">$${Number(f.totalPagar).toLocaleString('es-CO')}</td>
                            <td style="padding: 18px 20px;">
                                <button class="btn-ver" data-id="${f.id}" style="cursor: pointer; background: #eff6ff; border: 1px solid #bfdbfe; color: #3b82f6; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 0.85rem;">👁️ Ver Detalle</button>
                            </td>
                        </tr>
                    `}).join('');

                    document.querySelectorAll('.btn-ver').forEach(btn => {
                        btn.addEventListener('click', async (e) => {
                            try {
                                const fac = await fetchAPI(`/sales/invoices/${e.target.dataset.id}`);
                                abrirModal(fac);
                            } catch (error) { mostrarToast("Error al cargar detalles") }
                        });
                    });
                }

                pageInfo.textContent = `Mostrando página ${result.pagination.page} de ${result.pagination.totalPages}`;
                btnPrev.disabled = result.pagination.page <= 1;
                btnNext.disabled = !result.pagination.hasMore;

            } catch (error) { tbody.innerHTML = `<tr><td colspan="6" style="color: red; text-align: center; padding: 20px;">Error: ${error.message}</td></tr>`; }
        };

        btnPrev.addEventListener('click', () => { currentPage--; cargarFacturas(); });
        btnNext.addEventListener('click', () => { currentPage++; cargarFacturas(); });

        const abrirModal = (fac) => {
            document.getElementById('modal-titulo-fac').textContent = `#FAC-${fac.id.toString().padStart(4, '0')}`;
            document.getElementById('det-cliente').textContent = `${fac.cliente.firstName} ${fac.cliente.lastName || ''} (${fac.cliente.documento})`;
            document.getElementById('det-vendedor').textContent = fac.usuario.firstName;
            document.getElementById('det-fecha').textContent = new Date(fac.fecha).toLocaleString('es-CO');
            document.getElementById('det-metodo').textContent = fac.metodoDePago;
            
            document.getElementById('tabla-detalles-body').innerHTML = fac.detalles.map(d => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px 15px; color: var(--text-color);">${d.producto.nameProduct}</td>
                    <td style="padding: 12px 15px; color: var(--text-color);">${d.cantidad}</td>
                    <td style="padding: 12px 15px; color: var(--text-muted);">$${Number(d.precioUnitario).toLocaleString('es-CO')}</td>
                    <td style="padding: 12px 15px; text-align: right; font-weight: bold; color: var(--text-color);">$${Number(d.subtotal).toLocaleString('es-CO')}</td>
                </tr>
            `).join('');
            
            document.getElementById('det-total').textContent = `$${Number(fac.totalPagar).toLocaleString('es-CO')}`;
            modal.style.display = 'flex';
        };

        document.getElementById('btn-cerrar-modal').addEventListener('click', () => modal.style.display = 'none');

        document.getElementById('btn-export-csv').addEventListener('click', () => {
            if (!globalInvoices.length) return mostrarToast("No hay datos");
            const encabezados = "Factura;Fecha;Cliente;Metodo;Total\n";
            const filas = globalInvoices.map(f => `"${f.id}";"${new Date(f.fecha).toLocaleDateString('es-CO')}";"${f.cliente.firstName} ${f.cliente.lastName||''}";"${f.metodoDePago}";${f.totalPagar}`).join('\n');
            const blob = new Blob(["\uFEFF" + encabezados + filas], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.setAttribute('download', `Facturas_Pag${currentPage}.csv`);
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
        });

        cargarFacturas();
    }
};