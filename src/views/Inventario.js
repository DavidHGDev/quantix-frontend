import { fetchAPI } from '../utils/api.js';
import { mostrarToast } from '../utils/ui.js';

export const Inventario = {
    render: () => {
        const usuarioStr = localStorage.getItem('usuario');
        const usuario = usuarioStr ? JSON.parse(usuarioStr) : { name: 'Usuario', role: 'Desconocido', email: '' };

        if (!['ADMIN', 'VENDEDOR'].includes(usuario.role)) {
            return `<div style="padding: 40px; color: red;"><h1>Acceso Denegado</h1></div>`;
        }

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
                            <li><a href="#/ventas" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">💰 Facturación</a></li>
                            <li><a href="#/historial-facturas" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🧾 Historial Ventas</a></li>
                            <li><a href="#/cartera" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">💳 Cartera</a></li>
                            <li><a href="#/clientes" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🏷️ Clientes</a></li>
                            <li><a href="#/proveedores" style="text-decoration: none; color: var(--text-color); padding: 12px 15px; display: block; border-radius: 8px; font-weight: 500; transition: 0.2s;">🏢 Proveedores</a></li>
                            <li><a href="#/inventario" style="text-decoration: none; color: white; background: var(--primary); padding: 12px 15px; display: block; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">📦 Inventario</a></li>
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
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 25px; border-bottom: 2px solid var(--border-color); padding-bottom: 20px;">
                        <div>
                            <h1 style="color: var(--text-color); font-size: 2rem;">Inventario</h1>
                            <p style="color: var(--text-muted); margin-top: 5px;">Catálogo de productos, stock y precios.</p>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button id="btn-nueva-categoria" style="background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s;">+ Categoría</button>
                            <button id="btn-nuevo-producto" style="background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2); transition: 0.2s;">+ Nuevo Producto</button>
                        </div>
                    </div>

                    <div style="background: var(--surface); padding: 16px 20px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                        <div style="display: flex; gap: 10px; flex: 1; max-width: 500px;">
                            <input type="text" id="input-search" placeholder="Buscar por código o nombre..." style="flex: 1; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                            <button id="btn-search" style="background: var(--text-color); color: var(--surface); border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer;">Buscar</button>
                            <button id="btn-reset" style="background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); padding: 10px 14px; border-radius: 8px; cursor: pointer;">Limpiar</button>
                        </div>
                        <div>
                            <button id="btn-export-csv" style="background: var(--bg-color); color: #059669; border: 1px solid var(--border-color); padding: 10px 16px; border-radius: 8px; font-weight: bold; cursor: pointer;">📥 Exportar Excel</button>
                        </div>
                    </div>

                    <div style="background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead style="background: var(--bg-color); color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">
                                <tr>
                                    <th style="padding: 18px 20px;">Código</th>
                                    <th style="padding: 18px 20px;">Producto</th>
                                    <th style="padding: 18px 20px;">Categoría</th>
                                    <th style="padding: 18px 20px;">Precio</th>
                                    <th style="padding: 18px 20px;">Stock</th>
                                    <th style="padding: 18px 20px;">Estado</th>
                                    <th style="padding: 18px 20px;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-productos-body">
                                <tr><td colspan="7" style="padding: 20px; text-align: center; color: var(--text-muted);">Cargando...</td></tr>
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

                <!-- MODAL PRODUCTO -->
                <div id="modal-producto" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); justify-content: center; align-items: center; z-index: 1000;">
                    <div style="background: var(--surface); padding: 35px; border-radius: 16px; width: 90%; max-width: 600px; border: 1px solid var(--border-color); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); max-height: 90vh; overflow-y: auto;">
                        <h2 id="modal-titulo-prod" style="margin-bottom: 25px; color: var(--text-color); font-size: 1.5rem;">Nuevo Producto</h2>
                        
                        <form id="form-producto" style="display: flex; flex-direction: column; gap: 18px;">
                            <input type="hidden" id="prod-id" name="id">
                            
                            <div style="display: flex; gap: 15px;">
                                <input type="text" id="codigoBarras" name="codigoBarras" placeholder="Código de Barras *" required style="flex:1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                                <input type="text" id="nameProduct" name="nameProduct" placeholder="Nombre del Producto *" required style="flex:2; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                            </div>

                            <div style="display: flex; gap: 15px;">
                                <select id="categoriaId" name="categoriaId" required style="flex:1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                                    <option value="">Seleccione Categoría...</option>
                                </select>
                                <input type="number" id="priceVenta" name="priceVenta" placeholder="Precio de Venta *" step="0.01" required style="flex:1; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                            </div>

                            <div style="background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 15px;">
                                <p style="font-weight: 600; font-size: 0.9rem; color: var(--text-muted); margin-bottom: 10px;">Proveedores Asociados (Opcional)</p>
                                <div id="proveedores-checkboxes" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-height: 120px; overflow-y: auto;">
                                    <!-- Checkboxes inyectados por JS -->
                                </div>
                            </div>

                            <div id="estado-container-prod" style="display: none; align-items: center; gap: 10px; background: var(--bg-color); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                                <input type="checkbox" id="isActiveProd" name="isActive" style="width: 18px; height: 18px;">
                                <label for="isActiveProd" style="font-weight: 600; color: var(--text-color);">Producto Activo en el Sistema</label>
                            </div>

                            <span id="modal-error-prod" style="color: #ef4444; font-size: 0.9rem; text-align: center; font-weight: 600;"></span>

                            <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px;">
                                <button type="button" id="btn-cerrar-modal-prod" style="padding: 12px 20px; border: none; background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; font-weight: bold;">Cancelar</button>
                                <button type="submit" style="padding: 12px 25px; border: none; background: var(--primary); color: white; border-radius: 8px; cursor: pointer; font-weight: bold;">Guardar Producto</button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- MODAL CATEGORÍA -->
                <div id="modal-categoria" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); justify-content: center; align-items: center; z-index: 1050;">
                    <div style="background: var(--surface); padding: 35px; border-radius: 16px; width: 90%; max-width: 400px; border: 1px solid var(--border-color); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
                        <h2 style="margin-bottom: 25px; color: var(--text-color); font-size: 1.5rem;">Nueva Categoría</h2>
                        <form id="form-categoria" style="display: flex; flex-direction: column; gap: 18px;">
                            <input type="text" id="nameCategorie" name="nameCategorie" placeholder="Nombre de la Categoría *" required style="padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                            <input type="text" id="description" name="description" placeholder="Descripción (Opcional)" style="padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-color); outline: none;">
                            
                            <span id="modal-error-cat" style="color: #ef4444; font-size: 0.9rem; text-align: center; font-weight: 600;"></span>
                            <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px;">
                                <button type="button" id="btn-cerrar-modal-cat" style="padding: 12px 20px; border: none; background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; font-weight: bold;">Cancelar</button>
                                <button type="submit" style="padding: 12px 25px; border: none; background: var(--primary); color: white; border-radius: 8px; cursor: pointer; font-weight: bold;">Guardar</button>
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
        
        const isAdmin = usuarioLocal.role === 'ADMIN';
        let currentPage = 1;
        let globalProducts = []; 
        let querySearch = '';

        document.getElementById('btn-logout-sidebar').addEventListener('click', () => {
            localStorage.clear(); window.location.hash = '#/login';
        });
        document.getElementById('btn-theme-toggle').addEventListener('click', (e) => {
            const el = document.documentElement;
            if (el.getAttribute('data-theme') === 'dark') {
                el.removeAttribute('data-theme'); e.target.textContent = '🌙 Oscuro';
            } else {
                el.setAttribute('data-theme', 'dark'); e.target.textContent = '☀️ Claro';
            }
        });

        const tbody = document.getElementById('tabla-productos-body');
        const pageInfo = document.getElementById('page-info');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');

        const cargarSelects = async () => {
            try {
                // 1. Cargar Categorías
                const resCat = await fetchAPI('/inventory/categories');
                // Fallback de seguridad: si es array lo usamos, sino buscamos .data, sino []
                const categorias = Array.isArray(resCat) ? resCat : (resCat?.data || []);
                const catSelect = document.getElementById('categoriaId');
                
                if (catSelect) {
                    catSelect.innerHTML = `<option value="">Seleccione Categoría...</option>` + 
                        categorias.map(c => `<option value="${c.id}">${c.nameCategorie}</option>`).join('');
                }

                // 2. Cargar Proveedores
                const resProv = await fetchAPI('/inventory/suppliers');
                const proveedores = Array.isArray(resProv) ? resProv : (resProv?.data || []);
                const provContainer = document.getElementById('proveedores-checkboxes');
                
                if (provContainer) {
                    if (proveedores.length === 0) {
                        provContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; margin: 0; padding: 5px 0;">No hay proveedores registrados aún.</p>`;
                    } else {
                        provContainer.innerHTML = proveedores.map(p => `
                            <label style="display: flex; align-items: center; gap: 8px; color: var(--text-color); font-size: 0.85rem;">
                                <input type="checkbox" name="supplierIds" value="${p.id}" class="sup-checkbox">
                                ${p.razonSocial}
                            </label>
                        `).join('');
                    }
                }
            } catch (error) { 
                console.error(error);
                mostrarToast("Error al cargar categorías o proveedores", "error"); 
            }
        };

        const cargarProductos = async () => {
            try {
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: 10,
                    all: isAdmin ? 'true' : 'false'
                });
                if (querySearch) params.append('search', querySearch);

                const result = await fetchAPI(`/inventory/products?${params.toString()}`);
                globalProducts = result.data; 

                if (result.data.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="7" style="padding: 20px; text-align: center; color: var(--text-muted);">No se encontraron productos.</td></tr>`;
                } else {
                    tbody.innerHTML = result.data.map(p => `
                        <tr style="border-bottom: 1px solid var(--border-color); ${!p.isActive ? 'opacity: 0.5;' : ''}">
                            <td style="padding: 18px 20px; font-weight: 600; color: var(--text-color);">${p.codigoBarras}</td>
                            <td style="padding: 18px 20px; font-weight: bold; color: var(--text-color);">${p.nameProduct}</td>
                            <td style="padding: 18px 20px; color: var(--text-muted);">${p.categoria.nameCategorie}</td>
                            <td style="padding: 18px 20px; color: #059669; font-weight: bold;">$${Number(p.priceVenta).toLocaleString()}</td>
                            <td style="padding: 18px 20px;">
                                <span style="background: ${p.stock <= 5 ? '#fee2e2' : 'var(--bg-color)'}; color: ${p.stock <= 5 ? '#ef4444' : 'var(--text-color)'}; padding: 4px 10px; border-radius: 999px; font-weight: bold; font-size: 0.85rem;">
                                    ${p.stock}
                                </span>
                            </td>
                            <td style="padding: 18px 20px;">
                                ${p.isActive 
                                    ? '<span style="color: #059669; font-weight: 700; font-size: 0.9rem;">🟢 Activo</span>' 
                                    : '<span style="color: #ef4444; font-weight: 700; font-size: 0.9rem;">🔴 Inactivo</span>'}
                            </td>
                            <td style="padding: 18px 20px;">
                                <button class="btn-editar-prod" data-prod='${JSON.stringify(p)}' style="cursor: pointer; background: #eff6ff; border: 1px solid #bfdbfe; color: #3b82f6; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 0.85rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: 0.2s;">✏️ Editar</button>
                            </td>
                        </tr>
                    `).join('');

                    document.querySelectorAll('.btn-editar-prod').forEach(btn => {
                        btn.addEventListener('click', (e) => abrirModalProducto(JSON.parse(e.target.dataset.prod)));
                    });
                }

                pageInfo.textContent = `Mostrando página ${result.pagination.page} de ${result.pagination.totalPages}`;
                btnPrev.disabled = result.pagination.page <= 1;
                btnNext.disabled = !result.pagination.hasMore;

            } catch (error) {
                tbody.innerHTML = `<tr><td colspan="7" style="color: #ef4444; text-align: center; padding: 20px;">Error: ${error.message}</td></tr>`;
            }
        };

        btnPrev.addEventListener('click', () => { currentPage--; cargarProductos(); });
        btnNext.addEventListener('click', () => { currentPage++; cargarProductos(); });
        
        document.getElementById('btn-search').addEventListener('click', () => {
            querySearch = document.getElementById('input-search').value.trim();
            currentPage = 1;
            cargarProductos();
        });
        document.getElementById('btn-reset').addEventListener('click', () => {
            document.getElementById('input-search').value = '';
            querySearch = '';
            currentPage = 1;
            cargarProductos();
        });

        document.getElementById('btn-export-csv').addEventListener('click', () => {
            if (!globalProducts.length) return mostrarToast('No hay datos para exportar en esta página');
            
            const encabezados = "Codigo;Producto;Categoria;Precio;Stock;Estado\n";
            const filas = globalProducts.map(p => 
                `"${p.codigoBarras}";"${p.nameProduct}";"${p.categoria.nameCategorie}";${p.priceVenta};${p.stock};${p.isActive ? 'Activo' : 'Inactivo'}`
            ).join('\n');
            
            const blob = new Blob(["\uFEFF" + encabezados + filas], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `Inventario_Pagina_${currentPage}.csv`);
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
        });

        const modalProd = document.getElementById('modal-producto');
        const formProd = document.getElementById('form-producto');
        const modalCat = document.getElementById('modal-categoria');
        const formCat = document.getElementById('form-categoria');
        const estadoContainerProd = document.getElementById('estado-container-prod');

        const abrirModalProducto = (p = null) => {
            document.getElementById('modal-error-prod').textContent = '';
            formProd.reset();

            if (p) {
                document.getElementById('modal-titulo-prod').textContent = 'Editar Producto';
                document.getElementById('prod-id').value = p.id;
                document.getElementById('codigoBarras').value = p.codigoBarras;
                document.getElementById('nameProduct').value = p.nameProduct;
                document.getElementById('categoriaId').value = p.categoriaId;
                document.getElementById('priceVenta').value = p.priceVenta;
                
                if (isAdmin) {
                    estadoContainerProd.style.display = 'flex';
                    document.getElementById('isActiveProd').checked = p.isActive;
                } else {
                    estadoContainerProd.style.display = 'none';
                }

                const supplierIds = p.suppliers.map(s => s.id);
                document.querySelectorAll('.sup-checkbox').forEach(cb => {
                    cb.checked = supplierIds.includes(Number(cb.value));
                });
            } else {
                document.getElementById('modal-titulo-prod').textContent = 'Nuevo Producto';
                document.getElementById('prod-id').value = '';
                estadoContainerProd.style.display = 'none';
            }
            modalProd.style.display = 'flex';
        };

        document.getElementById('btn-nuevo-producto').addEventListener('click', () => abrirModalProducto());
        document.getElementById('btn-nueva-categoria').addEventListener('click', () => modalCat.style.display = 'flex');
        
        document.getElementById('btn-cerrar-modal-prod').addEventListener('click', () => modalProd.style.display = 'none');
        document.getElementById('btn-cerrar-modal-cat').addEventListener('click', () => modalCat.style.display = 'none');

        formCat.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = Object.fromEntries(new FormData(formCat));
            try {
                await fetchAPI(`/inventory/categories`, { method: 'POST', body: JSON.stringify(payload) });
                modalCat.style.display = 'none';
                formCat.reset();
                cargarSelects(); 
            } catch (error) { document.getElementById('modal-error-cat').textContent = error.message; }
        });

        formProd.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formProd);
            const payload = Object.fromEntries(formData);
            const id = payload.id;
            
            delete payload.id;
            
            payload.categoriaId = Number(payload.categoriaId);
            payload.priceVenta = Number(payload.priceVenta);
            
            if (id && isAdmin) {
                payload.isActive = formData.has('isActive');
            }

            payload.supplierIds = Array.from(document.querySelectorAll('.sup-checkbox:checked')).map(cb => Number(cb.value));

            try {
                if (id) {
                    await fetchAPI(`/inventory/products/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
                } else {
                    await fetchAPI(`/inventory/products`, { method: 'POST', body: JSON.stringify(payload) });
                }
                modalProd.style.display = 'none';
                cargarProductos();
            } catch (error) { document.getElementById('modal-error-prod').textContent = error.message; }
        });

        cargarSelects();
        cargarProductos();
    }
};