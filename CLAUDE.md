# EnarmDuo - Landing Page y Plataforma de Contenidos

> Landing page minimalista para captación de usuarios y plataforma de contenidos médicos
> Stack: Astro + React Islands + Supabase + GSAP + Tailwind CSS
> Última actualización: Diciembre 2025

---

## Comandos Bash Comunes

### Desarrollo

- `pnpm install`: Instalar dependencias del proyecto
- `pnpm dev`: Iniciar servidor de desarrollo (puerto 4321)
- `pnpm build`: Construir sitio estático para producción
- `pnpm preview`: Previsualizar build de producción localmente
- `netlify dev`: Ejecutar con funciones serverless de Netlify localmente

### Testing

- `pnpm test`: Ejecutar suite de pruebas (cuando se implemente)
- `pnpm test:e2e`: Pruebas end-to-end (cuando se implemente)

### Supabase

- `pnpm dlx supabase start`: Iniciar Supabase local
- `pnpm dlx supabase db reset`: Resetear base de datos local
- `pnpm dlx supabase db push`: Aplicar cambios de schema a Supabase

### Deploy

- `pnpm build && netlify deploy`: Deploy manual a preview
- `netlify deploy --prod`: Deploy a producción (normalmente automático desde main)

---

## Estructura del Proyecto

### Arquitectura de Carpetas

```
/
├── public/                # Assets estáticos (optimizar imágenes a WebP/AVIF)
│   ├── assets/           # Imágenes, logos, SVGs
│   └── favicon.svg
├── src/
│   ├── components/       # Componentes React y Astro
│   │   ├── Blog/        # Específicos del blog
│   │   ├── Form/        # Formulario de leads (React Island)
│   │   ├── core/        # Header, Footer
│   │   └── sections/    # Hero, Lobby, etc.
│   ├── content/
│   │   └── blog/        # Posts del blog (Markdown)
│   ├── layouts/         # Layouts de Astro
│   ├── pages/           # Rutas (index.astro, blog/[slug].astro)
│   ├── styles/          # CSS global y Tailwind
│   └── utils/           # Helpers (supabase, validaciones)
├── netlify/
│   └── functions/       # Serverless functions para formularios
├── astro.config.mjs     # Configuración de Astro
├── package.json
└── tailwind.config.cjs  # Configuración de Tailwind
```

### Archivos Clave

- **src/utils/supabase.ts**: Cliente de Supabase, USAR este para todas las llamadas a DB
- **src/components/Form/LeadForm.tsx**: Formulario principal de captación (React Island)
- **src/styles/global.css**: Estilos base y configuración de Tailwind
- **netlify/functions/submitLead.ts**: Función serverless para procesar leads
- **.env**: Variables de entorno (NO commitear, usar .env.example)

---

## Stack Tecnológico

### Core

- **Astro v4+**: Framework principal con Islands Architecture para SSG/SSR híbrido
- **React v18**: Solo para "islas" interactivas (formularios, animaciones dinámicas)
- **TypeScript**: IMPORTANTE: Preferir TypeScript sobre JavaScript para type safety

### Estilos y Animación

- **Tailwind CSS v3**: Utility-first CSS, configurado para mobile-first
- **GSAP v3**: Motor de animación 2D para efectos de scroll y transiciones
  - Usar ScrollTrigger para efectos parallax
  - Evitar animaciones que sobrecarguen CPU en móviles

### Backend y Datos

- **Supabase**: BaaS para PostgreSQL, auth y storage
  - Tablas: `leads_app`, `blog_posts`
  - API auto-generada con PostgREST
- **Netlify Functions**: Serverless functions para validación de formularios

### Deploy y Hosting

- **Netlify**: Hosting y CI/CD automático desde GitHub
- **GitHub**: Repositorio privado, rama `main` para producción

---

## Convenciones de Código

### IMPORTANTE - Idioma y Estilo

- **TODO el código debe nombrarse en español**: variables, funciones, clases, comentarios
- **Respuestas del agente en español** siempre

### Nomenclatura

- **Variables y funciones**: camelCase → `const nombreUsuario = "Juan"`
- **Constantes**: UPPER_SNAKE_CASE → `const API_URL = "..."`
- **Clases y Componentes**: PascalCase → `class FormularioLead`, `<BotonPrincipal />`
- **Archivos de componentes**: PascalCase.tsx/astro → `LeadForm.tsx`, `Hero.astro`
- **Archivos de utilidades**: camelCase.ts → `validarEmail.ts`, `supabase.ts`

### Formato

- **Indentación**: Usar tabulaciones (tabs), NO espacios
- **Línea máxima**: 100 caracteres
- **Imports**: Ordenar por: 1) externos, 2) internos, 3) relativos
- **Punto y coma**: Usar siempre al final de statements

### TypeScript

```typescript
// ✅ BUENO: Tipos explícitos
interface DatosLead {
	email: string;
	fechaRegistro: Date;
}

const guardarLead = async (datos: DatosLead): Promise<void> => {
	// implementación
};

// ❌ MALO: Evitar 'any'
const guardarLead = async (datos: any) => {
	// ...
};
```

### React/Astro

```tsx
// ✅ BUENO: Componente funcional con tipos
interface PropiedadesBoton {
	texto: string;
	onClick: () => void;
}

export const Boton: React.FC<PropiedadesBoton> = ({ texto, onClick }) => {
	return <button onClick={onClick}>{texto}</button>;
};

// ❌ MALO: Sin tipos, class components
export class Boton extends React.Component {
	// No usar class components
}
```

---

## Workflow de Git

### Branches

- **Formato**: `tipo/descripcion-corta`
  - `feature/formulario-leads`
  - `fix/error-supabase`
  - `docs/actualizar-readme`

### Commits (Conventional Commits)

**IMPORTANTE**: Commits en español, claros y concisos

Formato: `tipo: descripción corta`

Tipos válidos:

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, estilos (no afecta funcionalidad)
- `refactor:` Refactorización sin cambio de funcionalidad
- `perf:` Mejoras de rendimiento
- `test:` Agregar o modificar tests
- `chore:` Cambios en build, configs, dependencias

Ejemplos:

```bash
✅ BUENOS:
git commit -m "feat: agregar formulario de captura de leads"
git commit -m "fix: corregir validación de email en formulario"
git commit -m "docs: actualizar documentación de Supabase"

❌ MALOS:
git commit -m "cambios varios"
git commit -m "fix stuff"
git commit -m "WIP"
```

### Workflow

1. Crear branch desde `main`
2. Hacer cambios y commits
3. Push a GitHub
4. Crear Pull Request
5. Review (si trabaja en equipo)
6. Merge a `main` → Deploy automático a producción

---

## Diseño y Frontend

### IMPORTANTE - Principios de Diseño

- **Mobile-first SIEMPRE**: Diseñar para móvil primero, luego desktop
- **Minimalista**: Menos es más, evitar sobrecargar la interfaz
- **Consistencia**: Mantener uniformidad en espaciados, tamaños, colores
- **Referencia**: Google Antigravity (https://antigravity.google/) como inspiración de estilo

### Paleta de Colores

```css
/* USAR ESTOS COLORES EXACTOS */
--color-fondo: oklch(0.985 0 0);           /* Blanco - Fondos */
--color-acento: oklch(0.443 0.11 240.79);  /* Azul - Botones, enlaces */
--color-texto: oklch(0.02 0 0);            /* Negro - Textos, títulos */
--color-gris: oklch(0.929 0.013 255.508);  /* Gris - Botones secundarios */
```

### Tipografía

```css
/* Títulos (h1, h2, h3) */
font-family: 'Inter', sans-serif;
/* Importar desde: https://fonts.google.com/specimen/Inter */

/* Textos (p, span, a, etc) */
font-family: 'Google Sans Flex', sans-serif;
/* Importar desde: https://fonts.google.com/specimen/Google+Sans+Flex */
```

### Componentes Principales

#### Hero Section

- Fondo limpio con elementos SVG animados
- Animación 2D en bucle constante (GSAP)
- Formulario de registro destacado como CTA principal
- IMPORTANTE: Legibilidad sobre el fondo animado

#### Lobby (Scroll Effects)

- Efecto Parallax con GSAP ScrollTrigger
- Transiciones suaves de color y posición
- Optimizado para móviles (no sobrecargar CPU)

#### Videos

- Lazy loading obligatorio para videos de YouTube
- Mostrar thumbnail estática hasta que usuario reproduzca
- Usar `loading="lazy"` en iframes

#### Colaboradores

- Solo imágenes estáticas optimizadas (WebP o AVIF)
- NO videos, solo fotos
- Grid responsivo

#### Blog

- Páginas estáticas generadas con Astro
- Carga ultrarrápida
- Markdown para contenido

### Optimización de Imágenes

```astro
<!-- ✅ BUENO: Usar Picture de Astro para responsive images -->
<Picture
	src={imagen}
	widths={[400, 800, 1200]}
	formats={['avif', 'webp']}
	alt="descripción"
/>

<!-- ❌ MALO: img sin optimización -->
<img src="/imagen.jpg" alt="descripción" />
```

---

## Animaciones con GSAP

### Reglas para Animaciones

- NO animar demasiados elementos simultáneamente (performance)
- Usar `will-change` con precaución
- Preferir `transform` y `opacity` (GPU-accelerated)
- Evitar animar `width`, `height`, `top`, `left` (CPU-intensive)

### Ejemplo de ScrollTrigger

```typescript
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ✅ BUENO: Animación optimizada
gsap.to('.elemento', {
	scrollTrigger: {
		trigger: '.seccion',
		start: 'top center',
		end: 'bottom center',
		scrub: 1,
		markers: false, // true solo en desarrollo
	},
	y: -100,
	opacity: 1,
	ease: 'power2.out',
});
```

---

## Supabase (Backend)

### Tablas de Base de Datos

#### Tabla: `leads_app`

```sql
CREATE TABLE leads_app (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	email VARCHAR(255) UNIQUE NOT NULL,
	fecha_registro TIMESTAMP DEFAULT NOW(),
	origen VARCHAR(50) DEFAULT 'landing'
);
```

#### Tabla: `blog_posts`

```sql
CREATE TABLE blog_posts (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	titulo VARCHAR(255) NOT NULL,
	slug VARCHAR(255) UNIQUE NOT NULL,
	contenido_markdown TEXT NOT NULL,
	fecha_publicacion TIMESTAMP DEFAULT NOW(),
	autor VARCHAR(100),
	publicado BOOLEAN DEFAULT false
);
```

### Cliente de Supabase

```typescript
// src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

const urlSupabase = import.meta.env.PUBLIC_SUPABASE_URL;
const claveSupabase = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// IMPORTANTE: SIEMPRE usar este cliente, no crear nuevos
export const supabase = createClient(urlSupabase, claveSupabase);

// Ejemplo de uso:
export const guardarLead = async (email: string) => {
	const { data, error } = await supabase
		.from('leads_app')
		.insert({ email });
	
	if (error) throw error;
	return data;
};
```

---

## Formulario de Leads (React Island)

### Validación

```typescript
// IMPORTANTE: Validar SIEMPRE en cliente Y servidor

// Cliente (React)
const validarEmail = (email: string): boolean => {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
};

// Servidor (Netlify Function)
// netlify/functions/submitLead.ts
export const handler = async (event) => {
	const { email } = JSON.parse(event.body);
	
	// Validar formato
	if (!validarEmail(email)) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Email inválido' }),
		};
	}
	
	// Guardar en Supabase
	// ...
};
```

---

## Variables de Entorno

### Archivo .env (NO COMMITEAR)

```bash
# Supabase
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_KEY=eyJxxx...  # Solo para funciones serverless

# Netlify (si es necesario)
NETLIFY_SITE_ID=xxx

# Entorno
PUBLIC_ENV=development
```

### Archivo .env.example (COMMITEAR)

```bash
# Supabase
PUBLIC_SUPABASE_URL=tu_url_aqui
PUBLIC_SUPABASE_ANON_KEY=tu_clave_aqui
SUPABASE_SERVICE_KEY=tu_clave_de_servicio_aqui

# Netlify
NETLIFY_SITE_ID=tu_site_id

# Entorno
PUBLIC_ENV=development
```

---

## Testing (Pendiente de Implementar)

### Estrategia (cuando se implemente)

- Unit tests: Funciones de utilidad (validaciones, helpers)
- Component tests: Componentes React con Testing Library
- E2E tests: Flujos críticos (registro de leads, navegación)

### Herramientas sugeridas

- Vitest: Testing framework
- React Testing Library: Para componentes
- Playwright: Para E2E

---

## Deployment

### Netlify (Producción)

- **URL**: https://enarmduo.netlify.app (o dominio personalizado)
- **Deploy automático**: Push a `main` → build → deploy
- **Build command**: `pnpm build`
- **Publish directory**: `dist`

### Variables de Entorno en Netlify

1. Dashboard de Netlify → Site settings → Environment variables
2. Agregar todas las variables de .env.example
3. NO commitear secrets en .env

### Rollback

Si algo falla después de un deploy:

1. Ir a Netlify Dashboard → Deploys
2. Seleccionar versión anterior estable
3. Click en "Publish deploy"

---

## Debugging y Troubleshooting

### Comandos Útiles

- `pnpm dev -- --host`: Exponer servidor a red local (testing en móvil)
- `pnpm dlx astro check`: Verificar errores de TypeScript en archivos Astro
- `pnpm dlx netlify dev`: Simular entorno de Netlify localmente

### Problemas Comunes

#### 1. Error: "Cannot find module '@supabase/supabase-js'"

- **Síntoma**: Imports de Supabase fallan
- **Solución**: `pnpm add @supabase/supabase-js`

#### 2. Error: "env is not defined"

- **Síntoma**: Variables de entorno no se cargan
- **Solución**:
  - Verificar que exista `.env` en raíz
  - En Astro, usar `import.meta.env.VARIABLE`
  - Reiniciar servidor de desarrollo

#### 3. Animaciones lentas en móvil

- **Síntoma**: Lag en scroll, animaciones trabadas
- **Solución**:
  - Reducir número de elementos animados
  - Usar `will-change` solo cuando sea necesario
  - Preferir `transform` sobre position properties

#### 4. Imágenes no optimizadas

- **Síntoma**: Carga lenta, bajo rendimiento
- **Solución**:
  - Usar componente `<Picture>` de Astro
  - Convertir a WebP/AVIF
  - Implementar lazy loading

---

## Seguridad

### IMPORTANTE - Reglas de Seguridad

#### Secrets y API Keys

- NUNCA commitear `.env` al repositorio
- Usar variables de entorno para todas las credenciales
- En Netlify, configurar variables en dashboard (no en código)

#### Validación de Inputs

```typescript
// ✅ SIEMPRE validar en cliente Y servidor
// Cliente
if (!validarEmail(email)) {
	mostrarError('Email inválido');
	return;
}

// Servidor (Netlify Function)
if (!validarEmail(email)) {
	return { statusCode: 400, body: 'Error' };
}
```

#### Supabase Row Level Security (RLS)

```sql
-- IMPORTANTE: Habilitar RLS en todas las tablas públicas
ALTER TABLE leads_app ENABLE ROW LEVEL SECURITY;

-- Política: Solo permitir INSERT, no SELECT/UPDATE/DELETE público
CREATE POLICY "Permitir solo inserción de leads"
ON leads_app FOR INSERT
WITH CHECK (true);
```

#### CORS

- Configurar CORS en Netlify Functions para permitir solo tu dominio
- No usar `*` en Access-Control-Allow-Origin en producción

---

## Notas Importantes para Claude

### CRÍTICO - Leer Primero

1. **SIEMPRE usar español** para código, variables, funciones, comentarios
2. **NUNCA agregar dependencias** sin aprobación explícita
3. **CONSULTAR documentación oficial** antes de implementar cambios
4. **Mobile-first OBLIGATORIO** - diseñar para móvil primero
5. **NO usar código obsoleto** - verificar versiones estables
6. **Simplicidad ante todo** - el código más simple es el mejor

### Comportamientos Específicos del Proyecto

- **Astro Islands**: Solo componentes interactivos deben ser React, resto en Astro
- **Supabase**: Usar siempre el cliente de `src/utils/supabase.ts`, no crear nuevos
- **GSAP**: Registrar plugins antes de usar (`gsap.registerPlugin(ScrollTrigger)`)
- **Formularios**: Validar en cliente Y servidor, nunca solo uno
- **Imágenes**: SIEMPRE optimizar, preferir WebP/AVIF sobre JPG/PNG

### Preferencias del Equipo

- TypeScript sobre JavaScript
- Componentes funcionales sobre class components
- Async/await sobre .then()/.catch()
- Optional chaining (?.) sobre checks manuales
- Named exports sobre default exports (excepto páginas Astro)

### Quirks y Limitaciones

- **Astro Content Collections**: Schema debe estar en `src/content/config.ts`
- **React Islands**: Deben tener `client:load` o `client:visible` directive
- **GSAP ScrollTrigger**: Requiere `gsap.registerPlugin()` antes de usar
- **Supabase**: Las claves públicas (`ANON_KEY`) son seguras, pero usar RLS siempre
- **Netlify Functions**: Timeout de 10 segundos en plan gratuito

---

## Checklist de Calidad

Antes de hacer commit, verificar:

- [ ] Código nombrado en español (variables, funciones, comentarios)
- [ ] TypeScript sin errores (`pnpm dlx astro check`)
- [ ] Imágenes optimizadas (WebP/AVIF)
- [ ] Mobile-first implementado
- [ ] Animaciones no sobrecargadas (tested en móvil)
- [ ] Variables de entorno no expuestas
- [ ] Validación en cliente Y servidor (formularios)
- [ ] Commit sigue Conventional Commits
- [ ] Documentación actualizada si es necesario

---

## Recursos Externos

### Documentación Oficial

- [Astro Docs](https://docs.astro.build/)
- [React Docs](https://react.dev/)
- [GSAP Docs](https://greensock.com/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Netlify Docs](https://docs.netlify.com/)

### Referencia de Diseño

- [Google Antigravity](https://antigravity.google/) - Referencia de estilo y animaciones

### Tipografías

- [Inter](https://fonts.google.com/specimen/Inter) - Títulos
- [Google Sans Flex](https://fonts.google.com/specimen/Google+Sans+Flex) - Textos
