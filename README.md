# Quantix ERP - Sistema de Gestión Empresarial

Quantix es un sistema ERP (Enterprise Resource Planning) Full-Stack diseñado para optimizar y administrar los procesos operativos de las Pymes. Arquitecturado como una Single Page Application (SPA) en el frontend y una API REST robusta en el backend, permite un control integral sobre el inventario, facturación, cartera y recursos humanos.

## 🚀 Características Principales (Módulos)

* **📊 Panel de Control (Dashboard):** Visualización en tiempo real de KPIs (Ventas del mes, Cartera pendiente, Clientes activos) y alertas de bajo stock.
* **💰 Facturación (POS):** Punto de venta dinámico con búsqueda de productos en tiempo real, validación de stock y generación de facturas con múltiples métodos de pago (Efectivo, Transferencia, Crédito).
* **💳 Cartera:** Gestión de cuentas por cobrar, registro de abonos parciales o totales y control del saldo actual de clientes.
* **📦 Inventario:** Administración completa de productos y categorías. Incluye alertas de inventario crítico, asignación de múltiples proveedores por producto y exportación de reportes a Excel (CSV).
* **🏢 Proveedores & Compras:** Directorio de proveedores, seguimiento de órdenes de compra pendientes e historial de trazabilidad.
* **🏷️ Clientes:** Base de datos centralizada de clientes con un consolidado de sus deudas activas (Vista 360).
* **👥 Gestión de Usuarios:** Control de acceso basado en roles (ADMIN, VENDEDOR) con autenticación segura y cifrado de contraseñas.
* **⚙️ Interfaz Moderna:** Diseño responsivo, manejo de temas (Claro/Oscuro), notificaciones asíncronas no intrusivas (Toasts) y modales de confirmación personalizados.

## 🛠️ Stack Tecnológico

**Frontend:**
* HTML5 & CSS3 (Variables nativas, Grid, Flexbox)
* Vanilla JavaScript (ES6+, Arquitectura SPA basada en hash routing)
* Fetch API (Peticiones asíncronas)

**Backend:**
* Node.js & Express.js
* Prisma ORM
* Base de Datos: PostgreSQL
* Zod (Validación estricta de esquemas de datos)
* JSON Web Tokens (JWT) para autenticación y autorización

## 📋 Requisitos Previos

Asegúrate de tener instalado en tu entorno local:
* [Node.js](https://nodejs.org/) (v18 o superior)
* Gestor de paquetes: `npm` o `pnpm`
* PostgreSQL (Si se utiliza como motor de base de datos en producción).

## ⚙️ Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/DavidHGDev/quantix-frontend.git
   cd quantix-frontend
