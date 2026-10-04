// src/router/index.js

import { Login } from '../views/Login.js';
import { Dashboard } from '../views/Dashboard.js';
import { Usuarios } from '../views/Usuarios.js';
import { Perfil } from '../views/Perfil.js';
import { Clientes } from '../views/Clientes.js';
import { Proveedores } from '../views/Proveedores.js';
import { Inventario } from '../views/Inventario.js';
import { Compras } from '../views/Compras.js';
import { Ventas } from '../views/Ventas.js';
import { Cartera } from '../views/Cartera.js';
import { HistorialFacturas } from '../views/HistorialFacturas.js';

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
    '#/compras': Compras,
    '#/ventas': Ventas,
    '#/cartera': Cartera,
    '#/historial-facturas': HistorialFacturas,
};

export const router = () => {
    const app = document.getElementById('app');
    let path = window.location.hash || '#/';

    // 1. Verificamos la sesión persistente (Este no se borra al dar Ctrl + R)
    const usuarioString = localStorage.getItem('usuario'); 
    
    const isPublicRoute = (path === '' || path === '#/' || path === '#/login');

    // 2. Si intenta ir a CUALQUIER ruta privada sin sesión, lo expulsamos al login
    if (!isPublicRoute && !usuarioString) {
        window.location.hash = '#/login';
        return;
    }

    // 3. Si ya está logueado y trata de ver el login, lo forzamos al dashboard
    if (isPublicRoute && usuarioString) {
        window.location.hash = '#/dashboard';
        return;
    }

    const view = routes[path] || routes['#/login'];

    app.innerHTML = view.render();

    if (typeof view.attachEvents === 'function') {
        view.attachEvents();
    }
};