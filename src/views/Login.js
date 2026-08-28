export const Login = {
    render: () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️ Claro' : '🌙 Oscuro';

        return `
            <main style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; position: relative; background-color: var(--bg-color);">
                
                <!-- Botón de Tema (Esquina superior derecha) -->
                <div style="position: absolute; top: 20px; right: 20px;">
                    <button id="btn-theme-login" style="background: var(--surface); border: 1px solid var(--border-color); color: var(--text-color); padding: 8px 14px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        ${currentTheme}
                    </button>
                </div>

                <form id="form-id" class="form">
                    <h1>Quantix</h1>
                    <div class="grupo-inputs">
                        <label for="email">Correo</label>
                        <input type="email" id="email" placeholder="admin@quantix.com" name="email" required>
                    </div>
                    <div class="grupo-inputs">
                        <label for="password">Contraseña</label>
                        <input type="password" id="password" placeholder="**********" name="password" required>
                    </div>
                    <button type="submit" class="btn-ingresar">Ingresar</button>
                    <span id="span-admin"></span>
                </form>
            </main>
        `;
    },

    attachEvents: () => {
        // 1. Control del Tema
        const btnTheme = document.getElementById('btn-theme-login');
        if (btnTheme) {
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

        // 2. Control del Formulario
        const form = document.querySelector('#form-id');
        const URL = 'http://localhost:3000';

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const usuarioInput = Object.fromEntries(new FormData(form)); 
            
            const payload = {
                email: usuarioInput.email,
                password: usuarioInput.password
            };

            const span = document.querySelector("#span-admin");
            if (span) span.textContent = ""; 

            try {
                const response = await fetch(`${URL}/auth`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    const data = await response.json();
                    if (data.errors) {
                        const mensajesZod = data.errors.map(e => `${e.campo}: ${e.message}`).join(' | ');
                        throw new Error(mensajesZod);
                    }
                    throw new Error(data.message || 'Error desconocido del servidor');
                }

                const data = await response.json();
                
                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                
                console.log('Login Exitoso. Bienvenido:', data.usuario.name || data.usuario.firstName);
                window.location.hash = '#/dashboard'; 

            } catch (error) {
                console.error(error.message);
                if (span) span.textContent = error.message;
            }
        });
    }
};