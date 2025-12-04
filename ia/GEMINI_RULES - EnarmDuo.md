# Instrucciones para el Asistente Gemini

Tu Tarea:

Analiza este archivo (GEMINI_RULES.md) por completo. Presta especial atención a las secciones que definen el stack tecnológico, los archivos de configuración, las reglas a largo plazo y el contexto de sesión.
Verifica si el script scripts/gemini-onboarding.js ya existe.
Si no existe: Créalo. El script debe ser escrito en Node.js (sin dependencias externas) y debe realizar lo siguiente:
Leer y analizar los archivos de configuración clave definidos en este documento.
Producir en la salida estándar un objeto JSON con dos propiedades principales:
memory: Un objeto que contenga un array de strings longTerm con las reglas a memorizar.
context: Un objeto con la información relevante para la sesión actual (scripts, dependencias, etc.).
Si ya existe: No lo modifiques. Tu tarea será ejecutarlo.
Establece el flujo de trabajo: Una vez que el script esté creado o verificado, establece que la instrucción gemini init será el disparador para ejecutarlo al inicio de nuestras sesiones.
Ejecuta el onboarding: Procede a ejecutar (o simular la ejecución) del script y utiliza su salida para guardar los hechos en tu memoria y configurar tu contexto para esta sesión.

## Reglas Generales

- Tus respuestas en el chat deben ser sieempre en español.
- Siempre prioriza usar lenguajes, frameworks, librerias y tecnologias estables.
- El codigo debe ser lo más simple posible.
- Debes consultar la documentacion oficial de las tecnologias que usa el proyecto antes de implementar cualquier cambio.
- Aplica los cambios usando las recomendaciones de la documentación en sus versiones estables.
- No agregar nuevas dependencias sin aprobación explícita.
- Evita usar codigo obsoleto, consulta la documentación oficial.

## Descripción del Proyecto

Landing Page y Plataforma de Contenidos para EnarmDuo.
una single web app para promocionar y captación de usuarios para la app de EnarmDuo, asi como tambien para el contenido de la plataforma de EnarmDuo.
la landing page debe ser sencilla, minimalista y centrada en el contenido.

## Arquitectura del Directorio

/
├── public/                # Assets públicos (imágenes optimizadas, iconos)
│   ├── assets/            # Imágenes, SVGs de colaboradores (WebP/AVIF)
│   └── favicon.svg
├── src/
│   ├── components/        # Componentes reutilizables (React/Astro)
│   │   ├── Blog/          # Componentes específicos del Blog
│   │   ├── Form/          # Lógica del formulario de Leads (React Island)
│   │   ├── core/          # Componentes básicos (Header, Footer)
│   │   └── sections/      # Componentes que son una sección completa (Hero, Lobby)
│   ├── content/           # Colecciones de contenido de Astro (para el Blog)
│   │   └── blog/
│   ├── layouts/           # Plantillas de página (Layout principal, Layout del blog)
│   ├── pages/             # Páginas con rutas definidas (index.astro, blog/index.astro)
│   ├── styles/            # Archivos base de Tailwind y CSS global
│   └── utils/             # Funciones de ayuda (e.g., conexión a Supabase, gestión de Leads)
├── astro.config.mjs
├── package.json
└── tailwind.config.cjs

## Stack Tecnológico

Arquitectura: Astro con Islands Architectura como Framework Core para mejor rendimiento, SEO y gestion del contenido (Blog)
Front-end: React para la implementación de las "islas" dinamicas.
BaaS: Supabase BaaS para almacenar los leads y datos del Blog.
Animación: GSAP como Motor de animación 2D para efectos se scroll y animaciones.
Estilos: Tailwind CSS para estilos rápidos y consistentes, enfocados en firts mobile.
Servidor: Netlify como servidor de hosting y Endpoint API para la recepción y procesamiento de los leads.

## Coding Style & Conventions

Aqui se ponen las reglas de estilo y convenciones de código.

- Las variables, constantes, funciones y clases deben nombrarse en español de forma obvia y simple.
- la identación debe ser con tabulaciones simples.
- Usa camelCase para nombres de variables y funciones.
- Usa snake_case para nombres de constantes y clases.
- Usa pascalCase para nombres de clases.

## Testing

Aqui van los frameworks, estrategias y cobertura del testing

## Git Workflow

Aqui van las reglas de git (Como nombrar ramas, Formato de commits, etc.)

- Las confirmaciones (commits) deben seguir la especificación de Commits Convencionales.
- Los commits deben ser claros, concisos y en español, evita usar lenguaje tecnico.

## Frontend

- Priorizar el FirstMobile
- Mantener uniformidad y coherencia en el diseño
- Nunca debes salirte del estilo y tipo de diseño que viene en la descripción del proyecto.
- Usaremos como referencia el sitio web de Google Antigravity: https://antigravity.google/

Descripción del Front-end (La Experiencia Visual) 🖼️
Este apartado describe cómo se sentirá y se verá el producto final, enfocándonos en la experiencia de usuario y las animaciones clave, tal como fue ajustado con el cliente (sin 3D ni partículas, con animación en bucle).

Diseño y Sensación
El diseño será minimalista y moderno, manteniendo una estética premium similar al sitio de referencia, utilizando la paleta de colores del cliente. La prioridad es la claridad de la información y la carga instantánea.

Elementos Clave y Comportamiento
Hero (Foco en el Impacto 2D):

Fondo limpio con elementos gráficos sutiles (imágenes, SVGs) que ejecutarán una animación 2D en bucle constante, logrando una sensación de flotabilidad y vida sin sobrecargar la CPU.

Todos los elementos de UI (logo, título, menú, formulario de registro) se superpondrán con una clara jerarquía, asegurando la legibilidad sobre el fondo animado.

Se integrará el formulario de registro (Input y Botón) de forma destacada, como el principal Call to Action (CTA).

Lobby (Efecto de Scroll Preciso):

Se replicará el efecto Parallax y las transiciones de color/posición de los elementos que tanto gustó al cliente. Esto se gestionará enteramente con GSAP ScrollTrigger, asegurando una transición suave y precisa entre secciones, incluso en dispositivos móviles.

Videos y Colaboradores:

Los videos de YouTube se implementarán con carga diferida (Lazy Loading), mostrando una miniatura estática hasta que el usuario decida reproducirlos, salvando ancho de banda y batería.

La sección de Colaboradores será puramente estática (solo fotos optimizadas), manteniendo el diseño visual del sitio de referencia, pero eliminando la complejidad y el peso del video.

Blog y Estático:

El resto de las secciones (Blog, Footer) serán esencialmente estáticas, garantizando una experiencia de lectura ultrarrápida gracias a la arquitectura de Astro.

## Recursos

### Fuentes

Titulos (h1,h2,h3): https://fonts.google.com/specimen/Inter

Textos (p,span, a, etc): https://fonts.google.com/specimen/Google+Sans+Flex

### Colores

Paleta de Colores
    - Blanco: oklch(0.985 0 0) Fondo
    - Azul: oklch(0.443 0.11 240.79) Acentos, fondo de botones principales, enlaces.
    - Negro: oklch(0.02 0 0) Textos, Titulos.
    - Gris: oklch(0.929 0.013 255.508) fondo de Botones secundarios,

## Backend

Arquitectura del Back-end (El Motor de Datos) ⚙️
Esta sección describe cómo estructuraremos la gestión de datos para el blog y la captación de leads, utilizando la solución BaaS (Backend as a Service) que propusimos.

Base de Datos y Servicios
Utilizaremos Supabase como nuestra solución BaaS. Esto nos proporciona:

Base de Datos Relacional (PostgreSQL): Robustez y familiaridad para manejar los datos del Blog y los Leads.

API Auto-generada (PostgREST): Facilita la comunicación entre Astro y la base de datos sin necesidad de escribir API complejas.

Funciones Serverless (Edge Functions): Para manejar la lógica específica, como la validación inicial del formulario de Leads antes de guardar en la DB.

Estructura de Tablas Clave (Modelo de Datos Básico)

Tabla,Propósito,Campos Esenciales,Integración Front-end
leads_app,Almacenar los emails de los usuarios interesados en la aplicación.,"id, email (único), fecha_registro",Formulario de registro en el Hero.
blog_posts,Contener la información de los artículos del Blog.,"id, titulo, slug (URL), contenido_markdown, fecha_publicacion, autor",Página principal del Blog y Posts individuales.

Gestión de Contenidos (CMS Ligero)
El cliente podrá interactuar con los datos del blog mediante:

Interfaz de Supabase: Utilizando la interfaz de administración de tablas que proporciona Supabase, el cliente podrá ver, editar y publicar directamente los artículos. Esta es la solución más rápida y ligera, evitando desarrollar un CMS desde cero.

Astro Content Collections: Los datos estructurados se consumirán en Astro para generar páginas estáticas, asegurando la máxima velocidad de carga del Blog.

## Despliegue

Estrategia de Despliegue y Mantenimiento (CI/CD) 🌐

Plataforma de Despliegue (Hosting)
Utilizaremos Netlify como plataforma principal de alojamiento.

Serverless Functions: Permite hospedar nuestras Serverless Functions (para el formulario de Leads) junto con el sitio estático, manteniendo la arquitectura centralizada.

Integración Continua y Entrega Continua (CI/CD)
Adoptaremos un flujo de trabajo de Integración Continua / Entrega Continua (CI/CD) simple y robusto.

Repositorio Central: El código fuente se alojará en un repositorio privado de GitHub.

Proceso de Despliegue: Configuraremos Netlify para conectarse directamente a la rama main (o master) de GitHub.

Despliegue Automático: Cada vez que se haga un git push a la rama principal (luego de pasar las revisiones de código), Netlify detectará el cambio, construirá el sitio (Astro Build) y lo desplegará a producción de forma automática en cuestión de minutos.

Mantenimiento y Rollbacks: Netlify mantiene un historial de todas las versiones desplegadas. Esto nos permite hacer rollbacks instantáneos a una versión anterior y estable en caso de que surja algún problema crítico post-despliegue.

Despliegue del Backend (Supabase)
El backend de la Base de Datos (Supabase) será gestionado por la propia plataforma.

Conexión Segura: Astro y las funciones Serverless se conectarán a Supabase usando claves de API seguras (variables de entorno), asegurando que la gestión de contenidos y la recolección de Leads funcionen sin exponer credenciales.

## Dependencias

Aqui van los manejos de paquetes, scripts, etc.

## Seguridad

Aqui van las reglas de seguridad del proyecto

## Licencia

Aqui van las licencias del proyecto
