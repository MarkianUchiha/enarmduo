# 📚 Estructura de Estilos y Componentes - EnarmDuo

## ✅ Archivos Creados

### 1. **Estilos Globales** (`src/styles/global.css`)
- Reset CSS global con Tailwind directives
- Variables CSS personalizadas (colores, tipografía, espaciado, bordes, sombras, z-index)
- Escalas tipográficas (h1-h6)
- Estilos base para elementos HTML
- Componentes reutilizables (.btn, .container, etc.)
- Utilidades de transición

### 2. **Configuración de Tailwind** (`tailwind.config.mjs`)
- Content patching para Astro
- Extensiones de tema vinculadas a variables CSS
- Colores personalizados (primary, secondary, accent)
- Familias de fuentes extendidas
- Espaciado personalizado
- Radio de borde personalizado
- Sombras personalizadas

### 3. **Layout Base** (`src/layouts/Layout.astro`)
- Importa estilos globales
- Estructura HTML semántica
- Meta etiquetas esenciales
- Props para título y descripción

### 4. **Componentes Core**
- **Header.astro** - Navegación principal
- **Footer.astro** - Pie de página con enlaces

### 5. **Secciones**
- **Hero.astro** - Sección hero con CTA

### 6. **Utilidades**
- **constants.ts** - Constantes de colores y breakpoints
- **config.ts** - Configuración centralizada (API, Supabase, etc.)

## 🎨 Cómo Usar los Estilos

### Variables CSS
```css
/* Acceso a variables desde CSS */
color: var(--color-primary);
padding: var(--spacing-md);
border-radius: var(--radius-lg);
```

### Clases Tailwind
```html
<!-- Usar clases de Tailwind normalmente -->
<div class="bg-primary text-white p-lg rounded-lg shadow-md">
	Contenido
</div>

<!-- Botones predefinidos -->
<button class="btn btn-primary">Primario</button>
<button class="btn btn-secondary">Secundario</button>
<button class="btn btn-outline">Contorno</button>
```

### Tipografía
```html
<h1 class="heading-1">Título Principal</h1>
<h2 class="heading-2">Título Secundario</h2>
<p class="text-base">Párrafo normal</p>
<p class="text-small">Texto pequeño</p>
```

## 📁 Estructura de Directorios
```
src/
├── components/
│   ├── core/          (Header, Footer, etc.)
│   ├── sections/      (Hero, Features, etc.)
│   ├── Blog/
│   └── Form/
├── content/
│   └── blog/
├── layouts/
│   └── Layout.astro
├── pages/
├── styles/
│   └── global.css
└── utils/
    ├── constants.ts
    └── config.ts
```

## 🚀 Próximos Pasos

1. **Actualizar colores** en `src/styles/global.css` según la paleta del cliente
2. **Crear componentes** en `src/components/` según necesidad
3. **Importar layout** en páginas: `import Layout from '../layouts/Layout.astro'`
4. **Usar componentes**: `<Header />` y `<Footer />`

## 🔧 Comandos Útiles

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Previsualizar build
pnpm preview
```

## 📝 Convenciones

- Variables y funciones: `camelCase`
- Constantes y clases: `snake_case` o `PascalCase`
- Clases CSS: `kebab-case`
- Archivos de componentes: `PascalCase.astro`
