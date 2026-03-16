# EnarmDuo - Plataforma Educativa para ENARM

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

### Cintillo
- Banner promocional destacado
- Diseño minimalista
- Animación de entrada suave

### Video
- Sección de contenido multimedia
- Reproductor de video responsivo
- Optimizado para todos los dispositivos

### Parallax
- Efecto parallax con GSAP ScrollTrigger
- Contenido dinámico con imágenes
- Transiciones suaves al hacer scroll
- Diseño adaptativo móvil/desktop

### Team
- Carrusel horizontal de fundadores
- Fotos con bordes redondeados
- Información de cada miembro: nombre, título y posición
- Indicadores de navegación interactivos
- Animaciones de hover en las tarjetas
- Scroll nativo con touch en móviles

### Footer
- Información de contacto
- Enlaces útiles
- Derechos reservados

### Página Legal
- Procesamiento de Markdown a HTML
- Secciones: Términos y Condiciones, Políticas de Privacidad, Aviso de Privacidad
- Diseño con botones tab en móvil (verticales) y desktop (horizontales)
- Scroll automático al cambiar de sección con offset para header

### Página de Contacto
- Formulario interactivo con validación
- Campos: nombre, correo electrónico, tipo de solicitud, mensaje
- Selector de tipo de solicitud con 3 opciones:
  - Soporte Técnico → soporte@enarmduo.com
  - Pagos y Suscripciones → facturacion@enarmduo.com
  - Cuenta y Datos → soporte@enarmduo.com
- Mensaje con límite de 600 palabras con contador en tiempo real
- Envío de correos mediante Netlify Functions
- Diseño responsivo con tarjetas informativas de departamentos
- Mensajes de validación y confirmación de envío

## ✅ Actualizaciones Recientes

- **Favicon actualizado**: Se cambió el favicon del sitio a `icono_enarm.svg` para mejor identificación en navegadores
- **Logo en Header**: Se actualizó el logo del Header a `Logo_final_enarmduo (1).png` con tamaño aumentado un 30%
- **Mejoras visuales en Header**: Se aumentó el tamaño de los textos de navegación de 11px a 13px y el botón "Registrarse" ahora es más grande con padding aumentado

## 🔄 Próximos Pasos

- [ ] Integrar sistema de login en la página de contacto
- [ ] Configurar credenciales de email en Netlify (variables de entorno)
- [ ] Implementar formulario de leads con Supabase
- [ ] Agregar sección Blog con content collections
- [ ] Integrar animaciones GSAP en scroll
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

- **Soporte Técnico**: soporte@enarmduo.com
- **Pagos y Facturación**: facturacion@enarmduo.com
- **General**: info@enarmduo.com
- **Web**: https://enarmduo.com

## ⚙️ Configuración de Variables de Entorno

Para que funcione el envío de correos, debes configurar las siguientes variables de entorno en Netlify:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-aplicación
EMAIL_FROM=noreply@enarmduo.com
```

**Notas importantes**:
- Usa una contraseña de aplicación de Google, no tu contraseña normal
- La cuenta de correo debe tener acceso para enviar correos
- Los correos destino están configurados automáticamente según el tipo de solicitud
