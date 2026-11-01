import { fetchAPI } from '../utils/api.js';
import { mostrarToast } from '../utils/ui.js';

export const Usuarios = {
    render: () => {
        const usuarioStr = localStorage.getItem('usuario');
        const usuario = usuarioStr ? JSON.parse(usuarioStr) : { name: 'Usuario', role: 'Desconocido', email: '' };

        if (usuario.role !== 'ADMIN') {
            return `<div style="padding: 40px; color: red;"><h1>Acceso Denegado</h1><p>Vista exclusiva para Administradores.</p></div>`;
        }

        const nombreUsuario = usuario.name || usuario.firstName || 'Usuario';
        const apellidoUsuario = usuario.lastName ? ` ${usuario.lastName}` : '';
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
                            <li><a href="#/compras" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🛒 Compras</a></li>
                            <li><a href="#/usuarios" style="text-decoration: none; color: white; background: var(--primary); padding: 12px 15px; display: block; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">👥 Gestión de Usuarios</a></li>
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
                            <h1 style="color: var(--text-color); font-size: 2rem;">Gestión de Usuarios</h1>
                            <p style="color: var(--text-muted); margin-top: 5px;">Administra los accesos y roles del sistema.</p>
                        </div>
                        <button id="btn-nuevo-usuario" style="background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2); transition: 0.2s;">+ Nuevo Usuario</button>
                    </div>

                    <div style="background: var(--surface); padding: 16px 20px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 25px; display: flex; gap: 15px; align-items: center;">
                        <input type="text" id="input-search" placeholder="Buscar por documento, email o nombre..." style="flex: 1; max-width: 500px; padding: 12px 15px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                        <button id="btn-buscar" style="background: var(--text-color); color: var(--surface); border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">🔍 Buscar</button>
                        <button id="btn-limpiar" style="background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">Limpiar</button>
                    </div>

                    <div style="background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead style="background: var(--bg-color); color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase;">
                                <tr>
                                    <th style="padding: 18px 20px;">Nombre Completo</th>
                                    <th style="padding: 18px 20px;">Documento</th>
                                    <th style="padding: 18px 20px;">Email</th>
                                    <th style="padding: 18px 20px;">Rol</th>
                                    <th style="padding: 18px 20px;">Estado</th>
                                    <th style="padding: 18px 20px;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-usuarios-body">
                                <tr><td colspan="6" style="padding: 20px; text-align: center; color: var(--text-muted);">Cargando usuarios...</td></tr>
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

                <!-- MODAL FORMULARIO CRUD -->
                <div id="modal-usuario" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); justify-content: center; align-items: center; z-index: 1000;">
                    <div style="background: var(--surface); padding: 35px; border-radius: 16px; width: 90%; max-width: 500px; border: 1px solid var(--border-color); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
                        <h2 id="modal-titulo" style="margin-bottom: 25px; color: var(--text-color); font-size: 1.5rem;">Nuevo Usuario</h2>
                        
                        <form id="form-usuario" style="display: flex; flex-direction: column; gap: 18px;">
                            <input type="hidden" id="user-id" name="id">
                            
                            <div style="display: flex; gap: 15px;">
                                <input type="text" id="firstName" name="firstName" placeholder="Nombres" required style="flex:1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); box-sizing: border-box; background: var(--bg-color); color: var(--text-color); outline: none;">
                                <input type="text" id="lastName" name="lastName" placeholder="Apellidos" style="flex:1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); box-sizing: border-box; background: var(--bg-color); color: var(--text-color); outline: none;">
                            </div>

                            <div style="display: flex; gap: 15px;">
                                <select id="tipoDocumento" name="tipoDocumento" required style="width: 100px; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); box-sizing: border-box; background: var(--bg-color); color: var(--text-color); outline: none;">
                                    <option value="CC">CC</option><option value="NIT">NIT</option><option value="PP">PP</option>
                                </select>
                                <input type="text" id="documento" name="documento" placeholder="Número Documento" required style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); box-sizing: border-box; background: var(--bg-color); color: var(--text-color); outline: none;">
                            </div>

                            <input type="email" id="email" name="email" placeholder="Correo electrónico" required style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); box-sizing: border-box; background: var(--bg-color); color: var(--text-color); outline: none;">
                            <input type="password" id="password" name="password" placeholder="Contraseña (Mín. 8 caracteres)" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); box-sizing: border-box; background: var(--bg-color); color: var(--text-color); outline: none;">
                            
                            <select id="role" name="role" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); box-sizing: border-box; background: var(--bg-color); color: var(--text-color); outline: none;">
                                <option value="VENDEDOR">VENDEDOR</option>
                                <option value="ADMIN">ADMINISTRADOR</option>
                                <option value="TESTER">TESTER</option>
                            </select>

                            <div id="estado-container" style="display: none; align-items: center; gap: 10px; background: var(--bg-color); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                                <input type="checkbox" id="isActive" name="isActive" style="width: 18px; height: 18px;">
                                <label for="isActive" style="font-weight: 600; color: var(--text-color);">Usuario Activo (Permite acceso al sistema)</label>
                            </div>

                            <span id="modal-error" style="color: #ef4444; font-size: 0.9rem; text-align: center; font-weight: 600;"></span>

                            <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px;">
                                <button type="button" id="btn-cerrar-modal" style="padding: 12px 20px; border: none; background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; font-weight: bold;">Cancelar</button>
                                <button type="submit" style="padding: 12px 25px; border: none; background: var(--primary); color: white; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    attachEvents: () => {
        const usuarioData = JSON.parse(localStorage.getItem('usuario'));
        if (usuarioData?.role !== 'ADMIN') return;

        let currentPage = 1;
        let querySearch = '';

        document.getElementById('btn-logout-sidebar').addEventListener('click', () => { localStorage.clear(); window.location.hash = '#/login'; });
        document.getElementById('btn-theme-toggle').addEventListener('click', (e) => {
            const el = document.documentElement;
            if (el.getAttribute('data-theme') === 'dark') { el.removeAttribute('data-theme'); e.target.textContent = '🌙 Oscuro'; } 
            else { el.setAttribute('data-theme', 'dark'); e.target.textContent = '☀️ Claro'; }
        });

        const tbody = document.getElementById('tabla-usuarios-body');
        const pageInfo = document.getElementById('page-info');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const modal = document.getElementById('modal-usuario');
        const form = document.getElementById('form-usuario');
        const tituloModal = document.getElementById('modal-titulo');
        const modalError = document.getElementById('modal-error');
        const estadoContainer = document.getElementById('estado-container');

        const cargarUsuarios = async () => {
            try {
                const url = `/users?page=${currentPage}&limit=10${querySearch ? `&search=${encodeURIComponent(querySearch)}` : ''}`;
                const result = await fetchAPI(url); 
                
                if (result.data.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" style="padding: 20px; text-align: center; color: var(--text-muted);">No se encontraron usuarios.</td></tr>`;
                } else {
                    tbody.innerHTML = result.data.map(u => `
                        <tr style="border-bottom: 1px solid var(--border-color); ${!u.isActive ? 'opacity: 0.6;' : ''}">
                            <td style="padding: 18px 20px; font-weight: 600; color: var(--text-color);">${u.firstName || u.name || ''} ${u.lastName || ''}</td>
                            <td style="padding: 18px 20px; color: var(--text-muted);">${u.tipoDocumento} - ${u.documento}</td>
                            <td style="padding: 18px 20px; color: var(--text-muted);">${u.email}</td>
                            <td style="padding: 18px 20px;"><span style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-muted); padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: bold;">${u.role}</span></td>
                            <td style="padding: 18px 20px;">
                                ${u.isActive ? '<span style="color: #059669; font-weight: 700;">🟢 Activo</span>' : '<span style="color: #ef4444; font-weight: 700;">🔴 Inactivo</span>'}
                            </td>
                            <td style="padding: 18px 20px; display: flex; gap: 8px;">
                                <button class="btn-editar" data-user='${JSON.stringify(u)}' style="cursor: pointer; background: #eff6ff; border: 1px solid #bfdbfe; color: #3b82f6; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 0.85rem;">✏️ Editar</button>
                                <button class="btn-toggle" data-id='${u.id}' data-estado='${u.isActive}' style="cursor: pointer; background: ${u.isActive ? '#fef2f2' : '#ecfdf5'}; border: 1px solid ${u.isActive ? '#fecaca' : '#a7f3d0'}; color: ${u.isActive ? '#ef4444' : '#059669'}; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 0.85rem;">
                                    ${u.isActive ? '🚫 Inactivar' : '✅ Reactivar'}
                                </button>
                            </td>
                        </tr>
                    `).join('');

                    document.querySelectorAll('.btn-editar').forEach(btn => btn.addEventListener('click', (e) => abrirModal(JSON.parse(e.target.dataset.user))));
                    document.querySelectorAll('.btn-toggle').forEach(btn => {
                        btn.addEventListener('click', async (e) => {
                            const id = e.target.dataset.id;
                            try {
                                await fetchAPI(`/users/admin/${id}`, { method: 'PATCH', body: JSON.stringify({ isActive: e.target.dataset.estado !== 'true' }) });
                                cargarUsuarios(); 
                            } catch (error) { alert(`Error: ${error.message}`); }
                        });
                    });
                }

                pageInfo.textContent = `Mostrando página ${result.pagination.page} de ${result.pagination.totalPages}`;
                btnPrev.disabled = result.pagination.page <= 1;
                btnNext.disabled = !result.pagination.hasMore;

            } catch (error) { tbody.innerHTML = `<tr><td colspan="6" style="color: red; text-align: center; padding: 20px;">Error: ${error.message}</td></tr>`; }
        };

        btnPrev.addEventListener('click', () => { currentPage--; cargarUsuarios(); });
        btnNext.addEventListener('click', () => { currentPage++; cargarUsuarios(); });
        
        document.getElementById('btn-buscar').addEventListener('click', () => {
            querySearch = document.getElementById('input-search').value.trim();
            currentPage = 1;
            cargarUsuarios();
        });
        document.getElementById('btn-limpiar').addEventListener('click', () => {
            document.getElementById('input-search').value = '';
            querySearch = '';
            currentPage = 1;
            cargarUsuarios();
        });

        const abrirModal = (usuario = null) => {
            modalError.textContent = '';
            form.reset();

            if (usuario) {
                tituloModal.textContent = 'Editar Usuario';
                document.getElementById('user-id').value = usuario.id;
                document.getElementById('firstName').value = usuario.firstName || usuario.name || '';
                document.getElementById('lastName').value = usuario.lastName || '';
                document.getElementById('tipoDocumento').value = usuario.tipoDocumento;
                document.getElementById('documento').value = usuario.documento;
                document.getElementById('email').value = usuario.email;
                document.getElementById('role').value = usuario.role;
                
                estadoContainer.style.display = 'flex';
                document.getElementById('isActive').checked = usuario.isActive;
                
                document.getElementById('password').required = false; 
                document.getElementById('documento').readOnly = true; document.getElementById('documento').style.opacity = '0.6'; 
            } else {
                tituloModal.textContent = 'Nuevo Usuario';
                document.getElementById('user-id').value = '';
                estadoContainer.style.display = 'none';
                document.getElementById('password').required = true;
                document.getElementById('documento').readOnly = false; document.getElementById('documento').style.opacity = '1';
            }

            modal.style.display = 'flex';
        };

        document.getElementById('btn-nuevo-usuario').addEventListener('click', () => abrirModal());
        document.getElementById('btn-cerrar-modal').addEventListener('click', () => modal.style.display = 'none');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = Object.fromEntries(new FormData(form));
            const id = payload.id;
            delete payload.id;
            if (!payload.password) delete payload.password; 
            if (id) payload.isActive = form.hasAttribute('isActive') ? document.getElementById('isActive').checked : undefined;

            try {
                if (id) await fetchAPI(`/users/admin/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
                else await fetchAPI(`/users`, { method: 'POST', body: JSON.stringify(payload) });
                modal.style.display = 'none'; 
                cargarUsuarios(); 
            } catch (error) { modalError.textContent = error.message; }
        });

        cargarUsuarios();
    }
};