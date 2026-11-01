// src/utils/api.js
const BASE_URL = 'http://localhost:3000';

export async function fetchAPI(endpoint, options = {}) {
    // 1. Extraer el token de forma automática
    const token = localStorage.getItem('token');

    // 2. Configurar cabeceras por defecto
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // 3. Inyectar el token si existe (Estándar Bearer)
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 4. Ejecutar la petición
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            // Si es un error de Zod (Array de errores)
            if (data.errors) {
                const mensajesZod = data.errors.map(e => `${e.campo}: ${e.message}`).join(' | ');
                throw new Error(mensajesZod);
            }
            // Si el token expiró o es inválido (401 Unauthorized)
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                window.location.hash = '#/login';
                throw new Error('Sesión expirada. Vuelve a iniciar sesión.');
            }
            throw new Error(data.message || 'Error en la petición');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error.message);
        throw error; // Relanzamos el error para que la vista lo atrape y lo muestre
    }
}