# EnarmDuo - Plataforma Educativa para ENAM

Landing page y plataforma de contenidos para **EnarmDuo**, una solución integral para la preparación del ENAM con diseño minimalista, moderno y optimizado para rendimiento.

## 🎯 Descripción del Proyecto

**EnarmDuo** es una single web app desarrollada con **Astro** que combina:
- **Landing page** minimalista para promoción y captación de usuarios
- **Plataforma de contenidos** para acceso a materiales educativos
- **Experiencia responsiva** optimizada para móvil y desktop
- **Animaciones 2D sutiles** usando GSAP para efectos de scroll

## 🏗️ Stack Tecnológico

- **Framework**: Astro (Islands Architecture)
- **Frontend Dinámico**: React (Islands)
- **Estilos**: Tailwind CSS + CSS Global personalizado
- **Animaciones**: GSAP
- **BaaS**: Supabase (PostgreSQL, PostgREST, Edge Functions)
- **Hosting**: Netlify (con Serverless Functions)
- **Fuentes**: Inter (títulos), Google Sans Flex (textos)

## 📁 Estructura de Directorios

```
src/
├── components/
│   ├── core/              # Header, Footer
│   ├── sections/          # Hero, Features, etc
│   ├── Blog/              # Componentes de blog
│   └── Form/              # Formularios (Islands)
├── content/
│   └── blog/              # Colecciones de contenido
├── layouts/
│   └── Layout.astro       # Layout principal
├── pages/                 # Rutas (index, blog/index, etc)
├── styles/
│   └── global.css         # Estilos globales, variables CSS
└── utils/
    ├── constants.ts       # Constantes del proyecto
    └── config.ts          # Configuración centralizada
```

## 🎨 Paleta de Colores

- **Blanco** (`#fafbfc`) - Fondo principal
- **Azul** (`#1e40af`) - Acentos, botones, enlaces
- **Negro** (`#000000`) - Textos, títulos
- **Gris** (`#ececf1`) - Botones secundarios, bordes

## 🚀 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando | Acción |
|---------|--------|
| `pnpm install` | Instala dependencias |
| `pnpm dev` | Inicia servidor local en `localhost:4321` |
| `pnpm build` | Construye sitio para producción en `./dist/` |
| `pnpm preview` | Vista previa del build |
| `pnpm astro ...` | Ejecuta comandos de Astro CLI |

## 📱 Características Principales

### Header
- Logo responsivo
- Navegación con 11px de tipografía delgada
- Efecto hover con contorno gris
- Botón "Registrarse" destacado
- Menú hamburguesa para móvil

### Hero
- Full viewport (100% pantalla)
- Título y subtítulo con tipografías escalables
- Botón CTA con efectos hover
- Responsive perfecto móvil/desktop

### Footer
- Información de contacto
- Enlaces útiles
- Derechos reservados

## 🔄 Próximos Pasos

- [ ] Implementar formulario de leads con Supabase
- [ ] Agregar sección Blog con content collections
- [ ] Integrar animaciones GSAP en scroll
- [ ] Configurar Netlify Edge Functions
- [ ] Optimizar imágenes y assets
- [ ] Agregar SEO avanzado

## 👥 Contribuyendo

Para cambios importantes, por favor:
1. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
2. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
3. Push a la rama (`git push origin feature/AmazingFeature`)
4. Abre un Pull Request

## 📄 Licencia

Derechos reservados © 2025 EnarmDuo

## 📞 Contacto

- Email: info@enarmduo.com
- Web: https://enarmduo.com
