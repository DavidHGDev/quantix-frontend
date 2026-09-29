import { fetchAPI } from '../utils/api.js';

export const Proveedores = {
    render: () => {
        const usuarioStr = localStorage.getItem('usuario');
        const usuario = usuarioStr ? JSON.parse(usuarioStr) : { name: 'Usuario', role: 'Desconocido', email: '' };

        if (!['ADMIN', 'VENDEDOR'].includes(usuario.role)) {
            return `<div style="padding: 40px; color: red;"><h1>Acceso Denegado</h1></div>`;
        }

        const nombreUsuario = usuario.name || usuario.firstName || 'Usuario';
        const apellidoUsuario = usuario.lastName ? ` ${usuario.lastName}` : '';
        const menuAdmin = usuario.role === 'ADMIN' 
            ? `<li><a href="#/usuarios" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">👥 Gestión de Usuarios</a></li>` 
            : '';
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
                            <li><a href="#/proveedores" style="text-decoration: none; color: white; background: var(--primary); padding: 12px 15px; display: block; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">🏢 Proveedores</a></li>
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

                <main style="flex: 1; display: flex; flex-direction: column; padding: 40px; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 30px; border-bottom: 2px solid var(--border-color); padding-bottom: 20px;">
                        <div>
                            <h1 style="color: var(--text-color); font-size: 2rem;">Proveedores</h1>
                            <p style="color: var(--text-muted); margin-top: 5px;">Directorio de empresas y distribuidores para reabastecimiento.</p>
                        </div>
                        <button id="btn-nuevo-proveedor" style="background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2); transition: 0.2s;">+ Nuevo Proveedor</button>
                    </div>

                    <div style="background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead style="background: var(--bg-color); color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">
                                <tr>
                                    <th style="padding: 18px 20px;">Razón Social</th>
                                    <th style="padding: 18px 20px;">Documento</th>
                                    <th style="padding: 18px 20px;">Teléfono</th>
                                    <th style="padding: 18px 20px;">Email</th>
                                    <th style="padding: 18px 20px;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-proveedores-body">
                                <tr><td colspan="5" style="padding: 20px; text-align: center; color: var(--text-muted);">Cargando proveedores...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </main>

                <!-- MODAL FORMULARIO -->
                <div id="modal-proveedor" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); justify-content: center; align-items: center; z-index: 1000;">
                    <div style="background: var(--surface); padding: 35px; border-radius: 16px; width: 90%; max-width: 550px; border: 1px solid var(--border-color); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
                        <h2 id="modal-titulo" style="margin-bottom: 25px; color: var(--text-color); font-size: 1.5rem;">Nuevo Proveedor</h2>
                        
                        <form id="form-proveedor" style="display: flex; flex-direction: column; gap: 18px;">
                            <input type="hidden" id="prov-id" name="id">
                            
                            <input type="text" id="razonSocial" name="razonSocial" placeholder="Razón Social o Nombre de Empresa *" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none; box-sizing: border-box;">

                            <div style="display: flex; gap: 15px;">
                                <select id="tipoDocumento" name="tipoDocumento" required style="width: 110px; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                                    <option value="NIT">NIT</option>
                                    <option value="CC">CC</option>
                                    <option value="PP">PP</option>
                                </select>
                                <input type="text" id="documento" name="documento" placeholder="Número de Documento *" required style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                            </div>

                            <div style="display: flex; gap: 15px;">
                                <input type="email" id="email" name="email" placeholder="Correo electrónico *" required style="flex:1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                                <input type="text" id="phone" name="phone" placeholder="Teléfono *" required style="flex:1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                            </div>

                            <span id="modal-error" style="color: #ef4444; font-size: 0.9rem; text-align: center; font-weight: 600;"></span>

                            <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px;">
                                <button type="button" id="btn-cerrar-modal" style="padding: 12px 20px; border: none; background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; font-weight: bold;">Cancelar</button>
                                <button type="submit" style="padding: 12px 25px; border: none; background: var(--primary); color: white; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">Guardar Proveedor</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    attachEvents: () => {
        const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
        if (!usuarioLocal) return window.location.hash = '#/login';

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

        const tbody = document.getElementById('tabla-proveedores-body');
        const modal = document.getElementById('modal-proveedor');
        const form = document.getElementById('form-proveedor');
        const modalError = document.getElementById('modal-error');
        const tituloModal = document.getElementById('modal-titulo');

        const cargarProveedores = async () => {
            try {
                const proveedores = await fetchAPI('/inventory/suppliers');
                
                if (proveedores.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="5" style="padding: 20px; text-align: center; color: var(--text-muted);">No hay proveedores registrados.</td></tr>`;
                    return;
                }

                tbody.innerHTML = proveedores.map(p => `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 18px 20px; font-weight: 600; color: var(--text-color);">${p.razonSocial}</td>
                        <td style="padding: 18px 20px; color: var(--text-muted);">${p.tipoDocumento} - ${p.documento}</td>
                        <td style="padding: 18px 20px; color: var(--text-muted);">📱 ${p.phone}</td>
                        <td style="padding: 18px 20px; color: var(--text-muted);">✉️ ${p.email}</td>
                        <td style="padding: 18px 20px;">
                            <button class="btn-editar" data-prov='${JSON.stringify(p)}' style="cursor: pointer; background: #eff6ff; border: 1px solid #bfdbfe; color: #3b82f6; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 0.85rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: 0.2s;">✏️ Editar</button>
                        </td>
                    </tr>
                `).join('');

                asignarEventosTabla();
            } catch (error) {
                tbody.innerHTML = `<tr><td colspan="5" style="color: #ef4444; text-align: center; padding: 20px; font-weight: bold;">Error: ${error.message}</td></tr>`;
            }
        };

        const asignarEventosTabla = () => {
            document.querySelectorAll('.btn-editar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const p = JSON.parse(e.target.dataset.prov);
                    abrirModal(p); 
                });
            });
        };

        const abrirModal = (proveedor = null) => {
            modalError.textContent = '';
            form.reset();

            if (proveedor) {
                tituloModal.textContent = 'Editar Proveedor';
                document.getElementById('prov-id').value = proveedor.id;
                document.getElementById('razonSocial').value = proveedor.razonSocial;
                document.getElementById('tipoDocumento').value = proveedor.tipoDocumento;
                document.getElementById('documento').value = proveedor.documento;
                document.getElementById('email').value = proveedor.email;
                document.getElementById('phone').value = proveedor.phone;
                
                document.getElementById('documento').readOnly = true; 
                document.getElementById('documento').style.opacity = '0.6'; 
            } else {
                tituloModal.textContent = 'Nuevo Proveedor';
                document.getElementById('prov-id').value = '';
                document.getElementById('documento').readOnly = false;
                document.getElementById('documento').style.opacity = '1';
            }
            modal.style.display = 'flex';
        };

        document.getElementById('btn-nuevo-proveedor').addEventListener('click', () => abrirModal());
        
        document.getElementById('btn-cerrar-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            modalError.textContent = '';
            
            const formData = new FormData(form);
            const payload = Object.fromEntries(formData);
            const id = payload.id;
            delete payload.id;

            try {
                if (id) {
                    await fetchAPI(`/inventory/suppliers/${id}`, {
                        method: 'PATCH',
                        body: JSON.stringify(payload)
                    });
                } else {
                    await fetchAPI(`/inventory/suppliers`, {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    });
                }
                modal.style.display = 'none'; 
                cargarProveedores(); 
            } catch (error) {
                modalError.textContent = error.message;
            }
        });

        cargarProveedores();
    }
};