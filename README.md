# 🛒 GMV Catálogo — Catálogo Dinámico con WhatsApp

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://gmvct.vercel.app/)
[![Status](https://img.shields.io/badge/Status-Activo-success)]()
[![Backend](https://img.shields.io/badge/Backend-Google_Apps_Script-blue?logo=google-sheets&logoColor=white)]()

Un catálogo de productos moderno y responsivo diseñado para **GMV**. Permite gestionar inventarios a través de Google Sheets y recibir pedidos directamente en WhatsApp, eliminando la necesidad de una base de datos compleja o un servidor dedicado.

---

## ✨ Características Principales

- **📦 Inventario Dinámico**: Sincronización en tiempo real con Google Sheets.
- **🛒 Carrito de Compras**: Sistema de carrito persistente en el navegador (`localStorage`).
- **📲 Checkout vía WhatsApp**: Envío automático de la lista de productos seleccionados al vendedor.
- **🛠️ Panel de Administración**: Interfaz privada (`admin.html`) para importar/exportar productos masivamente mediante CSV.
- **🔍 Filtros Avanzados**: Búsqueda por nombre y filtrado por categorías generadas dinámicamente.
- **📱 Mobile First & PWA**: Optimizado para dispositivos móviles y listo para instalarse como aplicación (PWA).
- **🚀 Ultra Rápido**: Construido con HTML/JS vanilla para tiempos de carga mínimos.

---

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Estilos**: Sistema de diseño personalizado con variables CSS (Modern UI).
- **Base de Datos**: Google Sheets (usando Apps Script como API JSON).
- **Librerías**:
  - [PapaParse](https://www.papaparse.com/) para el manejo de archivos CSV.
  - [FontAwesome 6](https://fontawesome.com/) para iconografía.
  - Google Fonts (Outfit & Playfair Display).

---

## 📂 Estructura del Proyecto

```text
├── index.html          # Página principal del catálogo
├── admin.html          # Panel de administración (Import/Export)
├── assets/
│   ├── css/
│   │   └── layout.css  # Sistema de diseño y estilos
│   ├── js/
│   │   └── script.js   # Lógica principal del catálogo
│   └── img/            # Recursos visuales estáticos
├── sw.js               # Service Worker para soporte PWA
└── site.webmanifest    # Configuración de la aplicación web
```

---

## 🚀 Configuración e Instalación

Para configurar tu propio catálogo con Google Sheets, sigue las instrucciones detalladas en nuestra:

👉 **[Guía de Configuración (CONFIGURACION.md)](./CONFIGURACION.md)**

---

## 👨‍💼 Panel de Administración

El panel de administración permite:
1. **Importar**: Cargar cientos de productos desde un archivo Excel/CSV directamente a Google Sheets.
2. **Exportar**: Descargar tu base de datos actual en formato CSV para respaldos o edición local.
3. **Gestión Directa**: Los cambios hechos en el archivo de Google Sheets se reflejan al instante en la web.

---

## 📞 Contacto y Soporte

Si necesitas soporte o personalización para este catálogo:
- **WhatsApp**: [+1 (829) 936-9811](https://wa.me/18299369811)
- **Desarrollado por**: GMV Team

---
© 2025 GMV. Todos los derechos reservados.

