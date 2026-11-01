import { fetchAPI } from '../utils/api.js';

export const Perfil = {
    render: () => {
        const usuarioLocal = JSON.parse(localStorage.getItem('usuario')) || {};
        const nombreUsuario = usuarioLocal.name || usuarioLocal.firstName || 'Usuario';
        const apellidoUsuario = usuarioLocal.lastName ? ` ${usuarioLocal.lastName}` : '';
        const menuAdmin = usuarioLocal.role === 'ADMIN' 
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
                            <li><a href="#/proveedores" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🏢 Proveedores</a></li>
                            <li><a href="#/inventario" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">📦 Inventario</a></li>
                            <li><a href="#/compras" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🛒 Compras</a></li>
                            ${menuAdmin}
                        </ul>
                    </div>

                    <div style="border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: 20px;">
                        <div style="margin-bottom: 15px;">
                            <p style="font-weight: bold; color: var(--text-color); font-size: 0.95rem;">${nombreUsuario}${apellidoUsuario}</p>
                            <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 5px;">${usuarioLocal.email || ''}</p>
                            <span style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); padding: 3px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">Rol: ${usuarioLocal.role || 'Sin Rol'}</span>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <button id="btn-theme-toggle" style="width: 100%; background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; text-align: left; transition: 0.2s;">${currentTheme}</button>
                            <a href="#/perfil" style="text-decoration: none; width: 100%; background: var(--primary); color: white; padding: 12px 15px; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2); display: block; box-sizing: border-box;">⚙️️ Mi Perfil</a>
                            <button id="btn-logout-sidebar" style="width: 100%; background: #fee2e2; border: 1px solid #fca5a5; color: #ef4444; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; text-align: left; transition: 0.2s;">🚪 Cerrar Sesión</button>
                        </div>
                    </div>
                </nav>

                <main style="flex: 1; padding: 40px; overflow-y: auto;">
                    <header style="margin-bottom: 30px; border-bottom: 2px solid var(--border-color); padding-bottom: 20px;">
                        <h1 style="color: var(--text-color); font-size: 2rem;">Configuración de Perfil</h1>
                        <p style="color: var(--text-muted); margin-top: 5px;">Administra tu información personal y seguridad.</p>
                    </header>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 1000px;">
                        <div style="background: var(--surface); padding: 30px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px rgba(0,0,0,0.02); align-self: start;">
                            <h2 style="margin-bottom: 20px; font-size: 1.2rem; color: var(--text-color);">Datos Personales</h2>
                            <form id="form-perfil" style="display: flex; flex-direction: column; gap: 15px;">
                                <div style="display: flex; gap: 10px;">
                                    <input type="text" id="prof-firstName" name="firstName" placeholder="Cargando..." required style="flex:1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); outline: none;">
                                    <input type="text" id="prof-lastName" name="lastName" placeholder="Cargando..." style="flex:1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); outline: none;">
                                </div>
                                <input type="email" id="prof-email" name="email" placeholder="Cargando..." required style="padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); outline: none;">
                                
                                <div id="prof-info-estatica" style="background: var(--bg-color); border: 1px solid var(--border-color); padding: 12px; border-radius: 8px; font-size: 0.9rem; color: var(--text-muted);">
                                    Cargando información del servidor...
                                </div>

                                <span id="msg-perfil" style="font-size: 0.9rem; font-weight: bold; text-align: center;"></span>
                                <button type="submit" style="padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">Guardar Cambios</button>
                            </form>
                        </div>

                        <div style="background: var(--surface); padding: 30px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px rgba(0,0,0,0.02); align-self: start;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                <h2 style="font-size: 1.2rem; color: var(--text-color);">Seguridad</h2>
                                <button type="button" id="btn-toggle-seguridad" style="background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); padding: 8px 12px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85rem;">Cambiar Contraseña</button>
                            </div>
                            
                            <div id="contenedor-seguridad" style="display: none; flex-direction: column; gap: 15px;">
                                <form id="form-password" style="display: flex; flex-direction: column; gap: 15px;">
                                    <input type="password" id="currentPassword" placeholder="Contraseña Actual" required style="padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); outline: none;">
                                    <input type="password" name="password" id="newPassword" placeholder="Nueva Contraseña (Mín. 8)" required style="padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); outline: none;">
                                    <input type="password" id="confirmPassword" placeholder="Confirmar Nueva Contraseña" required style="padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color); outline: none;">
                                    
                                    <span id="msg-password" style="font-size: 0.9rem; font-weight: bold; text-align: center;"></span>
                                    <button type="submit" style="padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">Actualizar Contraseña</button>
                                </form>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        `;
    },

    attachEvents: () => {
        const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
        if (!usuarioLocal) return window.location.hash = '#/login';

        const userId = usuarioLocal.id;

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

        const cargarDatosUsuario = async () => {
            try {
                const userData = await fetchAPI(`/users/${userId}`);
                document.getElementById('prof-firstName').value = userData.firstName || userData.name || '';
                document.getElementById('prof-lastName').value = userData.lastName || '';
                document.getElementById('prof-email').value = userData.email || '';
                
                document.getElementById('prof-info-estatica').innerHTML = `
                    <strong>Documento:</strong> ${userData.tipoDocumento} - ${userData.documento} <br>
                    <strong>Rol:</strong> ${userData.role} <br>
                    <em style="margin-top: 5px; display: block;">(Estos campos son inmutables por seguridad)</em>
                `;
            } catch (error) {
                document.getElementById('msg-perfil').textContent = "Error al conectar con el servidor: " + error.message;
                document.getElementById('msg-perfil').style.color = "#ef4444";
            }
        };

        cargarDatosUsuario();

        const btnToggleSeguridad = document.getElementById('btn-toggle-seguridad');
        const contenedorSeguridad = document.getElementById('contenedor-seguridad');

        btnToggleSeguridad.addEventListener('click', () => {
            if (contenedorSeguridad.style.display === 'none') {
                contenedorSeguridad.style.display = 'flex';
                btnToggleSeguridad.textContent = 'Ocultar';
            } else {
                contenedorSeguridad.style.display = 'none';
                btnToggleSeguridad.textContent = 'Cambiar Contraseña';
                document.getElementById('form-password').reset();
            }
        });

        document.getElementById('form-perfil').addEventListener('submit', async (e) => {
            e.preventDefault();
            const msgBox = document.getElementById('msg-perfil');
            msgBox.textContent = "Guardando...";
            msgBox.style.color = "var(--text-muted)";

            const payload = Object.fromEntries(new FormData(e.target));

            try {
                await fetchAPI(`/users/${userId}`, {
                    method: 'PATCH',
                    body: JSON.stringify(payload)
                });
                
                msgBox.textContent = "¡Perfil actualizado con éxito!";
                msgBox.style.color = "#059669";
                
                usuarioLocal.firstName = payload.firstName;
                usuarioLocal.name = payload.firstName;
                usuarioLocal.lastName = payload.lastName;
                usuarioLocal.email = payload.email;
                localStorage.setItem('usuario', JSON.stringify(usuarioLocal));

            } catch (error) {
                msgBox.textContent = error.message;
                msgBox.style.color = "#ef4444";
            }
        });

        document.getElementById('form-password').addEventListener('submit', async (e) => {
            e.preventDefault();
            const msgBox = document.getElementById('msg-password');
            const newPass = document.getElementById('newPassword').value;
            const confirmPass = document.getElementById('confirmPassword').value;

            if (newPass !== confirmPass) {
                msgBox.textContent = "Las nuevas contraseñas no coinciden.";
                msgBox.style.color = "#ef4444";
                return;
            }

            msgBox.textContent = "Actualizando seguridad...";
            msgBox.style.color = "var(--text-muted)";

            try {
                await fetchAPI(`/users/password/${userId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ password: newPass })
                });

                msgBox.textContent = "¡Contraseña cambiada! Redirigiendo...";
                msgBox.style.color = "#059669";
                e.target.reset(); 
                
                setTimeout(() => {
                    localStorage.clear();
                    window.location.hash = '#/login';
                }, 2000);

            } catch (error) {
                msgBox.textContent = error.message;
                msgBox.style.color = "#ef4444";
            }
        });

        document.getElementById('btn-logout-sidebar').addEventListener('click', () => {
            localStorage.clear();
            window.location.hash = '#/login';
        });
    }
};