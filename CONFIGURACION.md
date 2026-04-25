# GMV Catálogo — Guía de Configuración

## Paso 1: Crear y publicar tu Google Sheet

1. Ir a [sheets.google.com](https://sheets.google.com) → crear hoja nueva
2. Nombrarla: `GMV Catálogo Productos`
3. En la **fila 1** poner exactamente estos encabezados:

| Columna | Nombre exacto | Descripción |
|---------|--------------|-------------|
| A | `Nombre` | Nombre del producto |
| B | `Precio` | Precio (solo número, ej: 1500) |
| C | `Tipo` | Categoría del producto |
| D | `Marca` | Marca del producto |
| E | `Imagen_URL` | URL de imagen (Drive o directa) |
| F | `Descripcion` | Descripción del producto |
| G | `Ofertas` | Texto badge oferta (ej: "OFERTA 20%") |

4. **Publicar la hoja**: `Archivo → Compartir → Publicar en la web`
   - Seleccionar: `Hoja 1` → Formato: `Valores separados por comas (.csv)`
   - Clic en **Publicar** → copiar el enlace generado

5. Del enlace publicado, extraer el **Spreadsheet ID**:
   ```
   https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/pub?...
   ```

---

## Paso 2: Configurar el script

Abrir `assets/js/script.js` y en la **línea 15** reemplazar:

```js
// ANTES
const SHEET_ID = 'TU_SPREADSHEET_ID_AQUI';

// DESPUÉS (ejemplo)
const SHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms';
```

---

## Paso 3: Imágenes de productos

### Opción A — Google Drive (recomendado)
1. Subir imagen a Google Drive
2. Clic derecho → **Compartir** → "Cualquiera con el enlace puede ver"
3. Copiar enlace y pegarlo en la columna `Imagen_URL`
4. El script convierte automáticamente el enlace al formato correcto

### Opción B — URL directa
Pegar cualquier URL pública de imagen directamente en `Imagen_URL`

---

## Paso 4: Despliegue en Vercel

1. Subir la carpeta `gmv-catalogo` a GitHub
2. Ir a [vercel.com](https://vercel.com) → **New Project**
3. Conectar repositorio → Vercel detecta HTML estático automáticamente
4. Clic en **Deploy** → tu sitio estará en `https://gmv-catalogo.vercel.app`

> **Sin configuración adicional requerida** — Vercel sirve archivos estáticos de forma nativa.

---

## Paso 5: Verificar funcionamiento

- [ ] Los productos cargan en la grid
- [ ] Los filtros de categoría funcionan
- [ ] La búsqueda filtra resultados
- [ ] "Añadir" agrega al carrito
- [ ] El botón "Enviar pedido por WhatsApp" abre WhatsApp con el mensaje correcto
- [ ] El número de WhatsApp es: **+1 (829) 936-9811**

---

## Datos de contacto configurados

| Dato | Valor |
|------|-------|
| WhatsApp | +18299369811 |
| Moneda | RD$ (Pesos Dominicanos) |

---

## Solución de problemas

| Problema | Solución |
|----------|----------|
| "Error cargando productos" | El Sheet no está publicado como CSV público |
| Imágenes no cargan | Verificar que los archivos Drive tienen permisos públicos |
| Carrito no persiste | El navegador tiene localStorage desactivado |
| WhatsApp no abre | Revisar que el número no tiene espacios ni guiones extra |
