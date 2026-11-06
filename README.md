# INFINITYcolor

Sitio web estático (HTML + CSS + JS, sin dependencias ni build) para INFINITYcolor: letreros, publicidad exterior y marketing en la calle. Paleta: azul marino y blanco.

## Estructura

```
index.html   → contenido y secciones
styles.css   → estilos y colores (variables en :root)
script.js    → servicios, cotizador y WhatsApp
```

## Cotizador

Los clientes pueden agregar servicios con el botón **Cotizar** y completar el formulario (qué necesitan, medidas, cantidad, ciudad, fecha y detalles). Al enviar, se abre WhatsApp con el mensaje armado hacia el **+591 75864344**.

Para cambiar el número, edita `WHATSAPP_NUMBER` al inicio de `script.js` (formato internacional, sin `+`).

## Personalizar

- **Servicios:** edita el arreglo `PRODUCTS` en `script.js` (nombre, categoría, etiqueta y descripción corta).
- **Colores de marca:** variables `--navy`, `--navy-700`, `--sky`, etc. en `styles.css`.
- **Fotos de trabajos reales:** en `script.js`, dentro de `renderGrid()`, puedes reemplazar el bloque `card__img` por una etiqueta `<img src="img/tu-foto.jpg" alt="...">`.
- **Textos:** directamente en `index.html`.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `infinitycolor`).
2. Sube estos archivos a la raíz del repositorio.
3. Ve a **Settings → Pages**.
4. En **Source** elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
5. Guarda. En un minuto tu sitio estará en `https://TU-USUARIO.github.io/infinitycolor/`.

Con la terminal:

```bash
git init
git add .
git commit -m "Sitio INFINITYcolor"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/infinitycolor.git
git push -u origin main
```
