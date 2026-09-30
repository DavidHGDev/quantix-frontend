import { fetchAPI } from '../utils/api.js';
import { mostrarToast } from '../utils/ui.js';

export const Ventas = {
    render: () => {
        const usuarioStr = localStorage.getItem('usuario');
        const usuario = usuarioStr ? JSON.parse(usuarioStr) : { name: 'Usuario', role: 'Desconocido', email: '' };
        if (!['ADMIN', 'VENDEDOR'].includes(usuario.role)) return `<div style="padding: 40px; color: red;"><h1>Acceso Denegado</h1></div>`;

        const nombreUsuario = usuario.name || usuario.firstName || 'Usuario';
        const apellidoUsuario = usuario.lastName ? ` ${usuario.lastName}` : '';
        const menuAdmin = usuario.role === 'ADMIN' ? `<li><a href="#/usuarios" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">👥 Gestión de Usuarios</a></li>` : '';
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
                            <li><a href="#/ventas" style="text-decoration: none; color: white; background: var(--primary); padding: 12px 15px; display: block; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">💰 Facturación</a></li>
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
                            <p style="font-weight: bold; color: var(--text-color); font-size: 0.95rem;">${nombreUsuario} ${apellidoUsuario}</p>
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

                <main style="flex: 1; display: flex; padding: 20px; gap: 20px; overflow: hidden;">
                    <div style="flex: 2; display: flex; flex-direction: column; background: var(--surface); border-radius: 12px; border: 1px solid var(--border-color); overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                        <div style="padding: 20px; border-bottom: 1px solid var(--border-color); display: flex; gap: 10px;">
                            <input type="text" id="pos-search" placeholder="Buscar por código de barras o nombre..." style="flex: 1; padding: 12px 16px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none; font-size: 1rem;">
                        </div>
                        <div id="pos-products" style="flex: 1; overflow-y: auto; padding: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; align-content: start;">
                        </div>
                    </div>

                    <div style="flex: 1; display: flex; flex-direction: column; background: var(--surface); border-radius: 12px; border: 1px solid var(--border-color); overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02); min-width: 350px;">
                        <div style="padding: 20px; background: var(--bg-color); border-bottom: 1px solid var(--border-color);">
                            <h2 style="color: var(--text-color); font-size: 1.2rem; margin-bottom: 15px;">Resumen de Venta</h2>
                            <select id="pos-cliente" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none; margin-bottom: 10px;">
                                <option value="">Seleccione Cliente...</option>
                            </select>
                            <select id="pos-metodo" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                                <option value="EFECTIVO">Efectivo</option>
                                <option value="TRANSFERENCIA">Transferencia</option>
                                <option value="CREDITO">Crédito (Abonos)</option>
                            </select>
                        </div>
                        
                        <div id="pos-cart" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px;">
                            <p style="text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-top: 20px;">El carrito está vacío</p>
                        </div>

                        <div style="padding: 20px; border-top: 1px solid var(--border-color); background: var(--bg-color);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                <span style="font-weight: bold; color: var(--text-muted);">TOTAL A PAGAR</span>
                                <span id="pos-total" style="font-size: 1.8rem; font-weight: bold; color: var(--primary);">$0</span>
                            </div>
                            <button id="btn-facturar" style="width: 100%; padding: 15px; border: none; background: var(--primary); color: white; border-radius: 8px; font-weight: bold; font-size: 1.1rem; cursor: pointer;">Generar Factura</button>
                        </div>
                    </div>
                </main>
            </div>
        `;
    },

    attachEvents: () => {
        let catalogo = [];
        let carrito = [];

        document.getElementById('btn-logout-sidebar').addEventListener('click', () => { localStorage.clear(); window.location.hash = '#/login'; });
        document.getElementById('btn-theme-toggle').addEventListener('click', (e) => {
            const el = document.documentElement;
            if (el.getAttribute('data-theme') === 'dark') { el.removeAttribute('data-theme'); e.target.textContent = '🌙 Oscuro'; } 
            else { el.setAttribute('data-theme', 'dark'); e.target.textContent = '☀️ Claro'; }
        });

        const cargarDependencias = async () => {
            try {
                const resultClientes = await fetchAPI('/clients?limit=1000');
                const clientes = resultClientes.data || [];
                const selectC = document.getElementById('pos-cliente');
                selectC.innerHTML = `<option value="">Seleccione Cliente...</option>` + clientes.filter(c => c.isActive).map(c => `<option value="${c.id}">${c.documento} - ${c.firstName} ${c.lastName || ''}</option>`).join('');

                const resProd = await fetchAPI('/inventory/products?limit=1000');
                catalogo = resProd.data.filter(p => p.isActive && p.stock > 0);
                renderCatalogo(catalogo);
            } catch (err) { alert("Error cargando el POS"); }
        };

        const renderCatalogo = (productos) => {
            const container = document.getElementById('pos-products');
            container.innerHTML = productos.map(p => `
                <div style="border: 1px solid var(--border-color); padding: 15px; border-radius: 12px; background: var(--bg-color); display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: bold;">${p.codigoBarras}</span>
                        <h4 style="color: var(--text-color); margin: 5px 0;">${p.nameProduct}</h4>
                        <p style="color: var(--primary); font-weight: bold; margin: 0;">$${Number(p.priceVenta).toLocaleString()}</p>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                        <span style="font-size: 0.8rem; color: var(--text-muted);">Stock: ${p.stock}</span>
                        <button class="btn-add-cart" data-id="${p.id}" style="background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; padding: 6px 12px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s;">+ Añadir</button>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.btn-add-cart').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const prod = catalogo.find(p => p.id === Number(e.target.dataset.id));
                    agregarAlCarrito(prod);
                });
            });
        };

        document.getElementById('pos-search').addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            const filtrados = catalogo.filter(p => p.nameProduct.toLowerCase().includes(q) || p.codigoBarras.includes(q));
            renderCatalogo(filtrados);
        });

        const agregarAlCarrito = (prod) => {
            const existente = carrito.find(item => item.productoId === prod.id);
            if (existente) {
                if (existente.cantidad < prod.stock) existente.cantidad++;
                else alert("Stock máximo alcanzado");
            } else {
                carrito.push({ productoId: prod.id, nameProduct: prod.nameProduct, precioUnitario: Number(prod.priceVenta), cantidad: 1, stockMax: prod.stock });
            }
            renderCarrito();
        };

        const renderCarrito = () => {
            const cartContainer = document.getElementById('pos-cart');
            if (carrito.length === 0) {
                cartContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-top: 20px;">El carrito está vacío</p>`;
                document.getElementById('pos-total').textContent = '$0';
                return;
            }

            let total = 0;
            cartContainer.innerHTML = carrito.map((item, index) => {
                const sub = item.cantidad * item.precioUnitario;
                total += sub;
                return `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                    <div style="flex: 1; min-width: 0;">
                        <p style="font-weight: bold; color: var(--text-color); margin: 0; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.nameProduct}</p>
                        <p style="color: var(--text-muted); margin: 0; font-size: 0.8rem;">$${item.precioUnitario.toLocaleString()} c/u</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="number" class="cart-qty" data-index="${index}" value="${item.cantidad}" min="1" max="${item.stockMax}" style="width: 50px; padding: 5px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); text-align: center;">
                        <span style="font-weight: bold; color: var(--text-color); width: 70px; text-align: right;">$${sub.toLocaleString()}</span>
                        <button class="cart-remove" data-index="${index}" style="background: transparent; color: #ef4444; border: none; cursor: pointer; font-weight: bold; font-size: 1rem;">×</button>
                    </div>
                </div>
            `}).join('');

            document.getElementById('pos-total').textContent = `$${total.toLocaleString()}`;

            document.querySelectorAll('.cart-qty').forEach(input => {
                input.addEventListener('change', (e) => {
                    const idx = e.target.dataset.index;
                    let val = Number(e.target.value);
                    if (val < 1) val = 1;
                    if (val > carrito[idx].stockMax) val = carrito[idx].stockMax;
                    carrito[idx].cantidad = val;
                    renderCarrito();
                });
            });

            document.querySelectorAll('.cart-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    carrito.splice(e.target.dataset.index, 1);
                    renderCarrito();
                });
            });
        };

        document.getElementById('btn-facturar').addEventListener('click', async () => {
            const clienteId = document.getElementById('pos-cliente').value;
            const metodoDePago = document.getElementById('pos-metodo').value;

            if (!clienteId) return mostrarToast("Debe seleccionar un cliente");
            if (carrito.length === 0) return mostrarToast("El carrito está vacío");

            const payload = {
                clienteId: Number(clienteId),
                metodoDePago,
                detalles: carrito.map(c => ({ productoId: c.productoId, cantidad: c.cantidad, precioUnitario: c.precioUnitario }))
            };

            try {
                await fetchAPI('/sales/invoices', { method: 'POST', body: JSON.stringify(payload) });
                const mensajeCredito = metodoDePago === 'CREDITO' ? ' Se ha creado una cuenta por cobrar en Cartera.' : '';
                mostrarToast(`Factura registrada con éxito.${mensajeCredito}`, 'success');
                carrito = [];
                document.getElementById('pos-cliente').value = '';
                document.getElementById('pos-search').value = '';
                await cargarDependencias();
                renderCarrito();
            } catch (err) { mostrarToast("Error al cargar datos del POS", "error"); }
        });

        cargarDependencias();
    }
};