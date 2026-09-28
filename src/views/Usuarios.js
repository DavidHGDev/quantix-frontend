import { fetchAPI } from '../utils/api.js';

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
                
                <!-- SIDEBAR -->
                <nav class="sidebar" style="width: 260px; background-color: var(--surface); border-right: 1px solid var(--border-color); padding: 20px; display: flex; flex-direction: column; justify-content: space-between; flex-shrink: 0;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 40px;">
                            <div style="background: var(--primary); color: white; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: bold; font-size: 1.2rem;">Q</div>
                            <h2 style="color: var(--text-color); letter-spacing: -0.5px;">Quantix</h2>
                        </div>
                        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px;">
                            <li><a href="#/dashboard" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">📊 Panel de Control</a></li>
                            <li><a href="#/clientes" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🏷️ Clientes</a></li>
                            <!-- Botón Activo -->
                            <li><a href="#/usuarios" style="text-decoration: none; color: white; background: var(--primary); padding: 12px 15px; display: block; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">👥 Gestión de Usuarios</a></li>
                        </ul>
                    </div>

                    <!-- FOOTER DEL SIDEBAR -->
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

                <!-- CONTENIDO PRINCIPAL -->
                <main style="flex: 1; display: flex; flex-direction: column; padding: 40px; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 30px; border-bottom: 2px solid var(--border-color); padding-bottom: 20px;">
                        <div>
                            <h1 style="color: var(--text-color); font-size: 2rem;">Gestión de Usuarios</h1>
                            <p style="color: var(--text-muted); margin-top: 5px;">Administra los accesos y roles del sistema.</p>
                        </div>
                        <button id="btn-nuevo-usuario" style="background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2); transition: 0.2s;">+ Nuevo Usuario</button>
                    </div>

                    <!-- TABLA -->
                    <div style="background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead style="background: var(--bg-color); color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">
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
                </main>

                <!-- MODAL FORMULARIO -->
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
                                <label for="isActive" style="font-weight: 600; color: var(--text-color);">El usuario tiene acceso al sistema (Activo)</label>
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

        const tbody = document.getElementById('tabla-usuarios-body');
        const modal = document.getElementById('modal-usuario');
        const form = document.getElementById('form-usuario');
        const tituloModal = document.getElementById('modal-titulo');
        const modalError = document.getElementById('modal-error');
        const estadoContainer = document.getElementById('estado-container');

        const cargarUsuarios = async () => {
            try {
                const usuarios = await fetchAPI('/users'); 
                
                tbody.innerHTML = usuarios.map(u => `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 18px 20px; font-weight: 600; color: var(--text-color);">${u.firstName || u.name || ''} ${u.lastName || ''}</td>
                        <td style="padding: 18px 20px; color: var(--text-muted);">${u.tipoDocumento} - ${u.documento}</td>
                        <td style="padding: 18px 20px; color: var(--text-muted);">${u.email}</td>
                        <td style="padding: 18px 20px;"><span style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-muted); padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: bold;">${u.role}</span></td>
                        <td style="padding: 18px 20px;">
                            ${u.isActive 
                                ? '<span style="color: #059669; font-weight: 700;">🟢 Activo</span>' 
                                : '<span style="color: #ef4444; font-weight: 700;">🔴 Inactivo</span>'}
                        </td>
                        <td style="padding: 18px 20px; display: flex; gap: 15px;">
                            <button class="btn-editar" data-user='${JSON.stringify(u)}' style="cursor: pointer; background: transparent; border: none; color: #3b82f6; font-weight: 600; font-size: 0.9rem;">Editar</button>
                            <button class="btn-toggle" data-id='${u.id}' data-estado='${u.isActive}' style="cursor: pointer; background: transparent; border: none; color: ${u.isActive ? '#f59e0b' : '#059669'}; font-weight: 600; font-size: 0.9rem;">
                                ${u.isActive ? 'Inactivar' : 'Reactivar'}
                            </button>
                        </td>
                    </tr>
                `).join('');

                asignarEventosTabla();
            } catch (error) {
                tbody.innerHTML = `<tr><td colspan="6" style="color: red; text-align: center; padding: 20px;">Error: ${error.message}</td></tr>`;
            }
        };

        const asignarEventosTabla = () => {
            document.querySelectorAll('.btn-editar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const u = JSON.parse(e.target.dataset.user);
                    abrirModal(u); 
                });
            });

            document.querySelectorAll('.btn-toggle').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    const estadoActual = e.target.dataset.estado === 'true'; 
                    try {
                        await fetchAPI(`/users/admin/${id}`, { 
                            method: 'PATCH',
                            body: JSON.stringify({ isActive: !estadoActual })
                        });
                        cargarUsuarios(); 
                    } catch (error) {
                        alert(`Error al cambiar estado: ${error.message}`);
                    }
                });
            });
        };

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
                document.getElementById('documento').readOnly = true; 
                document.getElementById('documento').style.opacity = '0.6'; 
            } else {
                tituloModal.textContent = 'Nuevo Usuario';
                document.getElementById('user-id').value = '';
                estadoContainer.style.display = 'none';
                document.getElementById('password').required = true;
                document.getElementById('documento').readOnly = false;
                document.getElementById('documento').style.opacity = '1';
            }

            modal.style.display = 'flex';
        };

        document.getElementById('btn-nuevo-usuario').addEventListener('click', () => abrirModal());
        
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
            if (!payload.password) delete payload.password; 
            if (id) payload.isActive = formData.has('isActive');

            try {
                if (id) {
                    await fetchAPI(`/users/admin/${id}`, {
                        method: 'PATCH',
                        body: JSON.stringify(payload)
                    });
                } else {
                    await fetchAPI(`/users`, {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    });
                }
                modal.style.display = 'none'; 
                cargarUsuarios(); 
            } catch (error) {
                modalError.textContent = error.message;
            }
        });

        cargarUsuarios();
    }
};