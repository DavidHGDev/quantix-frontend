export const Dashboard = {
    render: () => {
        const usuarioStr = localStorage.getItem('usuario');
        const usuario = usuarioStr ? JSON.parse(usuarioStr) : { firstName: 'Usuario', role: 'Desconocido', email: '' };

        const menuAdmin = usuario.role === 'ADMIN' 
            ? `<li><a href="#/usuarios" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">👥 Gestión de Usuarios</a></li>` 
            : '';

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
                            <!-- Botón Activo con contraste corregido -->
                            <li><a href="#/dashboard" style="text-decoration: none; color: white; background: var(--primary); padding: 12px 15px; display: block; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">📊 Panel de Control</a></li>
                            <li><a href="#/clientes" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🏷️ Clientes</a></li>
                            ${menuAdmin}
                        </ul>
                    </div>

                    <!-- FOOTER DEL SIDEBAR -->
                    <div style="border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: 20px;">
                        <div style="margin-bottom: 15px;">
                            <p style="font-weight: bold; color: var(--text-color); font-size: 0.95rem;">${usuario.firstName || usuario.name || 'Usuario'} ${usuario.lastName || ''}</p>
                            <p style="color: var(--text-color); opacity: 0.7; font-size: 0.8rem; margin-bottom: 5px;">${usuario.email}</p>
                            <span style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); padding: 3px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">Rol: ${usuario.role}</span>
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
                    <header style="margin-bottom: 40px; border-bottom: 2px solid var(--border-color); padding-bottom: 20px;">
                        <h1 style="color: var(--text-color); font-size: 2rem;">Panel de Control</h1>
                        <p style="color: var(--text-color); opacity: 0.7; margin-top: 5px;">Resumen general de tu cuenta y operaciones.</p>
                    </header>

                    <div style="background: var(--surface); padding: 30px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 4px 6px rgba(0,0,0,0.02); max-width: 800px;">
                        <h2 style="color: var(--text-color); margin-bottom: 15px; font-size: 1.2rem;">Estado del Sistema</h2>
                        <p style="color: var(--text-color); opacity: 0.8; line-height: 1.6;">Tu conexión con el servidor <strong>Quantix Core</strong> está activa. Tienes permisos de <strong style="color: var(--primary);">${usuario.role}</strong> habilitados en esta sesión.</p>
                    </div>
                </main>
            </div>
        `;
    },

    attachEvents: () => {
        // Cerrar Sesión
        document.getElementById('btn-logout-sidebar').addEventListener('click', () => {
            localStorage.clear();
            window.location.hash = '#/login';
        });

        // Alternar Tema
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
    }
};