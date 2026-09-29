import { fetchAPI } from '../utils/api.js';
import { mostrarToast } from '../utils/ui.js';

export const Dashboard = {
    render: () => {
        const usuarioStr = localStorage.getItem('usuario');
        const usuario = usuarioStr ? JSON.parse(usuarioStr) : { name: 'Usuario', role: 'Desconocido', email: '' };

        const nombreUsuario = usuario.name || usuario.firstName || 'Usuario';
        const apellidoUsuario = usuario.lastName ? ` ${usuario.lastName}` : '';

        const menuAdmin = usuario.role === 'ADMIN' 
            ? `<li><a href="#/usuarios" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">👥 Gestión de Usuarios</a></li>` 
            : '';

        const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️ Claro' : '🌙 Oscuro';

        const sidebarHTML = `
            <nav class="sidebar" style="width: 260px; background-color: var(--surface); border-right: 1px solid var(--border-color); padding: 20px; display: flex; flex-direction: column; justify-content: space-between; flex-shrink: 0;">
                <div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 40px;">
                        <div style="background: var(--primary); color: white; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: bold; font-size: 1.2rem;">Q</div>
                        <h2 style="color: var(--text-color); letter-spacing: -0.5px;">Quantix</h2>
                    </div>
                    <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px;">
                        <li><a href="#/dashboard" style="text-decoration: none; color: white; background: var(--primary); padding: 12px 15px; display: block; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">📊 Panel de Control</a></li>
                        <li><a href="#/ventas" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">💰 Facturación</a></li>
                        <li><a href="#/historial-facturas" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🧾 Historial Ventas</a></li>
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
        `;

        const mainContent = `
            <main style="flex: 1; display: flex; flex-direction: column; padding: 40px; overflow-y: auto; background-color: var(--bg-color); width: 100%;">
                
                <header style="margin-bottom: 30px; border-bottom: 2px solid var(--border-color); padding-bottom: 20px; width: 100%;">
                    <h1 style="color: var(--text-color); font-size: 2rem; margin: 0;">Panel de Control</h1>
                    <p style="color: var(--text-muted); margin-top: 5px;">Resumen general de operaciones del mes actual.</p>
                </header>

                <!-- TARJETAS DE MÉTRICAS (KPIs) -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px; width: 100%;">
                    
                    <div style="background: var(--surface); padding: 25px; border-radius: 12px; border: 1px solid var(--border-color); border-top: 5px solid #059669; box-shadow: 0 4px 6px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                            <p style="color: var(--text-muted); font-size: 0.95rem; font-weight: bold; margin: 0; text-transform: uppercase;">Ventas del Mes</p>
                            <span style="background: #ecfdf5; color: #059669; padding: 8px; border-radius: 8px; font-size: 1.2rem;">💰</span>
                        </div>
                        <h2 id="kpi-ventas" style="color: var(--text-color); font-size: 2.2rem; margin: 0;">$0</h2>
                    </div>

                    <div style="background: var(--surface); padding: 25px; border-radius: 12px; border: 1px solid var(--border-color); border-top: 5px solid #ef4444; box-shadow: 0 4px 6px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                            <p style="color: var(--text-muted); font-size: 0.95rem; font-weight: bold; margin: 0; text-transform: uppercase;">Cartera Pendiente</p>
                            <span style="background: #fef2f2; color: #ef4444; padding: 8px; border-radius: 8px; font-size: 1.2rem;">💳</span>
                        </div>
                        <h2 id="kpi-cartera" style="color: var(--text-color); font-size: 2.2rem; margin: 0;">$0</h2>
                    </div>

                    <div style="background: var(--surface); padding: 25px; border-radius: 12px; border: 1px solid var(--border-color); border-top: 5px solid #3b82f6; box-shadow: 0 4px 6px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                            <p style="color: var(--text-muted); font-size: 0.95rem; font-weight: bold; margin: 0; text-transform: uppercase;">Clientes Activos</p>
                            <span style="background: #eff6ff; color: #3b82f6; padding: 8px; border-radius: 8px; font-size: 1.2rem;">👥</span>
                        </div>
                        <h2 id="kpi-clientes" style="color: var(--text-color); font-size: 2.2rem; margin: 0;">0</h2>
                    </div>

                </div>

                <!-- PANELES DE ACTIVIDAD -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 25px; width: 100%;">
                    
                    <!-- ÚLTIMAS VENTAS -->
                    <div style="background: var(--surface); border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px rgba(0,0,0,0.02); overflow: hidden; display: flex; flex-direction: column;">
                        <div style="padding: 20px; border-bottom: 1px solid var(--border-color); background: var(--bg-color);">
                            <h3 style="color: var(--text-color); margin: 0; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">🧾 Últimas Ventas</h3>
                        </div>
                        <div style="padding: 0; overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                                <thead style="background: var(--surface); color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">
                                    <tr><th style="padding: 15px 20px;">Factura</th><th style="padding: 15px 20px;">Cliente</th><th style="padding: 15px 20px; text-align: right;">Total</th></tr>
                                </thead>
                                <tbody id="tabla-ultimas-ventas">
                                    <tr><td colspan="3" style="padding: 30px; text-align: center; color: var(--text-muted);">Cargando información...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- ALERTAS DE STOCK -->
                    <div style="background: var(--surface); border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px rgba(0,0,0,0.02); overflow: hidden; display: flex; flex-direction: column;">
                        <div style="padding: 20px; border-bottom: 1px solid #fca5a5; background: #fef2f2;">
                            <h3 style="color: #b91c1c; margin: 0; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">⚠️ Productos en Bajo Stock</h3>
                        </div>
                        <div style="padding: 0; overflow-y: auto; max-height: 400px;">
                            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                                <thead style="background: var(--surface); color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">
                                    <tr><th style="padding: 15px 20px;">Producto</th><th style="padding: 15px 20px;">Código</th><th style="padding: 15px 20px; text-align: right;">Stock Actual</th></tr>
                                </thead>
                                <tbody id="tabla-alertas-stock">
                                    <tr><td colspan="3" style="padding: 30px; text-align: center; color: var(--text-muted);">Cargando información...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
        `;

        return `<div style="display: flex; height: 100vh; width: 100vw; overflow: hidden; background-color: var(--bg-color);">${sidebarHTML}${mainContent}</div>`;
    },

    attachEvents: () => {
        document.getElementById('btn-logout-sidebar').addEventListener('click', () => {
            localStorage.clear();
            window.location.hash = '#/login';
        });

        const btnTheme = document.getElementById('btn-theme-toggle');
        btnTheme.addEventListener('click', () => {
            const htmlElement = document.documentElement;
            if (htmlElement.getAttribute('data-theme') === 'dark') {
                htmlElement.removeAttribute('data-theme');
                btnTheme.textContent = '🌙 Oscuro';
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                btnTheme.textContent = '☀️ Claro';
            }
        });

        const cargarDashboard = async () => {
            try {
                const metricas = await fetchAPI('/dashboard');
                
                // Formateadores de moneda seguros
                const formaterDineros = (valor) => {
                    const num = Number(valor);
                    return isNaN(num) ? '$0' : `$${num.toLocaleString('es-CO')}`;
                };

                // Render KPIs
                document.getElementById('kpi-ventas').textContent = formaterDineros(metricas.ventasDelMes);
                document.getElementById('kpi-cartera').textContent = formaterDineros(metricas.carteraPendiente);
                document.getElementById('kpi-clientes').textContent = metricas.clientesActivos || '0';

                // Render Últimas Ventas
                const tbVentas = document.getElementById('tabla-ultimas-ventas');
                if (!metricas.ultimasVentas || metricas.ultimasVentas.length === 0) {
                    tbVentas.innerHTML = `<tr><td colspan="3" style="padding: 30px; text-align: center; color: var(--text-muted);">Sin ventas recientes en el sistema.</td></tr>`;
                } else {
                    tbVentas.innerHTML = metricas.ultimasVentas.map(v => `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 15px 20px; font-weight: bold; color: var(--text-color);">#FAC-${v.id.toString().padStart(4, '0')}</td>
                            <td style="padding: 15px 20px; color: var(--text-color);">${v.cliente?.firstName || 'Desconocido'} ${v.cliente?.lastName || ''}</td>
                            <td style="padding: 15px 20px; color: #059669; font-weight: bold; text-align: right;">${formaterDineros(v.totalPagar)}</td>
                        </tr>
                    `).join('');
                }

                // Render Alertas de Stock
                const tbStock = document.getElementById('tabla-alertas-stock');
                if (!metricas.alertasStock || metricas.alertasStock.length === 0) {
                    tbStock.innerHTML = `<tr><td colspan="3" style="padding: 30px; text-align: center; color: #059669; font-weight: bold;">✅ Inventario sano. No hay productos en nivel crítico.</td></tr>`;
                } else {
                    tbStock.innerHTML = metricas.alertasStock.map(p => `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 15px 20px; font-weight: 600; color: var(--text-color);">${p.nameProduct}</td>
                            <td style="padding: 15px 20px; color: var(--text-muted); font-size: 0.85rem;">${p.codigoBarras}</td>
                            <td style="padding: 15px 20px; text-align: right;">
                                <span style="background: #fee2e2; border: 1px solid #fca5a5; color: #b91c1c; padding: 4px 12px; border-radius: 999px; font-weight: bold; font-size: 0.85rem;">
                                    ${p.stock} uds
                                </span>
                            </td>
                        </tr>
                    `).join('');
                }

            } catch (error) {
                // Notificación elegante en lugar de destruir el HTML con la palabra "Error"
                mostrarToast(`Fallo al cargar el Panel de Control: Revise que el servidor esté activo.`, 'error');
                document.getElementById('kpi-ventas').textContent = '$--';
                document.getElementById('kpi-cartera').textContent = '$--';
                document.getElementById('kpi-clientes').textContent = '--';
                document.getElementById('tabla-ultimas-ventas').innerHTML = `<tr><td colspan="3" style="padding: 20px; text-align: center; color: #ef4444;">Error de conexión</td></tr>`;
                document.getElementById('tabla-alertas-stock').innerHTML = `<tr><td colspan="3" style="padding: 20px; text-align: center; color: #ef4444;">Error de conexión</td></tr>`;
            }
        };

        cargarDashboard();
    }
};