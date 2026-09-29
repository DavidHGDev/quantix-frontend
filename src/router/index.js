// src/router/index.js

import { Login } from '../views/Login.js';
import { Dashboard } from '../views/Dashboard.js';
import { Usuarios } from '../views/Usuarios.js';
import { Perfil } from '../views/Perfil.js';
import { Clientes } from '../views/Clientes.js';
import { Proveedores } from '../views/Proveedores.js';
import { Inventario } from '../views/Inventario.js';
import { Compras } from '../views/Compras.js';

// Diccionario de rutas disponibles
const routes = {
    '': Login,
    '#/': Login,
    '#/login': Login,
    '#/dashboard': Dashboard,
    '#/usuarios': Usuarios,
    '#/perfil': Perfil,
    '#/clientes': Clientes,
    '#/proveedores': Proveedores,
    '#/inventario': Inventario,
    '#/compras': Compras
};

export const router = () => {
    const app = document.getElementById('app');
    let path = window.location.hash;

    // ==========================================
    // ROUTE GUARD (Protección de rutas)
    // ==========================================
    const token = localStorage.getItem('token'); // Verificamos si hay sesión activa

    // Si intenta ir al dashboard (o cualquier ruta privada) sin token...
    if (path === '#/dashboard' && !token) {
        console.warn('Acceso denegado: No hay token. Redirigiendo al Login.');
        window.location.hash = '#/login'; // Redirección forzada
        return; // Detenemos la ejecución
    }

    // Si ya está logueado y trata de ir al login, lo mandamos al dashboard
    if ((path === '#/login' || path === '' || path === '#/') && token) {
        window.location.hash = '#/dashboard';
        return;
    }
    // ==========================================

    // Obtenemos el módulo correspondiente a la ruta
    const view = routes[path] || routes['#/login'];

    // 1. Fase de Dibujado (Render)
    app.innerHTML = view.render();

    // 2. Fase de Interactividad (Eventos)
    if (typeof view.attachEvents === 'function') {
        view.attachEvents();
    }
};