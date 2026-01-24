Perfecto, voy a darte el paso a paso para guardar el plan de pagos y desplegar en Netlify.

## Paso a Paso para Guardar el Plan y Desplegar

### **1. Guardar el Plan de Pagos (Para Continuar Después)**

Crea un archivo en tu proyecto llamado `PLAN_PAGOS.md` en la raíz:

```markdown
# PLAN DE IMPLEMENTACIÓN - SISTEMA DE PAGOS OPEN PAY

## Contexto Actual
- Proyecto: EnarmDuo (Astro + React + Tailwind CSS)
- Backend: API existente proporcionada por el equipo
- Objetivo: Página de pagos separada con 3 paquetes

## Paquetes Definidos
- **Mensual**: $299/mes - Acceso completo por 30 días
- **Trimestral**: $750/trimestre - Acceso completo por 90 días, ahorro 16%
- **Anual**: $2,599/año - Acceso completo por 365 días, ahorro 28%

## Fases de Implementación

### Fase 1: Configuración y Preparación
1. Configurar Open Pay (sandbox → producción)
2. Integración con API backend existente:
   - POST /api/usuarios/crear
   - POST /api/pagos/procesar  
   - POST /api/codigos/validar
   - POST /api/facturacion/generar

### Fase 2: Página de Pagos con Tarjetas
3. Crear `/pagos` con 3 tarjetas de precios
4. Componentes: PricingCards.astro, PricingCard.astro

### Fase 3: Formulario de Pago
5. Crear `/pagos/formulario?plan=X`
6. Componentes: PaymentForm.astro, UserRegistration.astro, InvoiceForm.astro

### Fase 4: Integración y Flujo
7. Flujo: Selección → Formulario → Pago → Código
8. Página de éxito con código generado

### Fase 5: Preparación para Index
9. PricingSection.astro para integración futura

## Tecnologías
- Frontend: Astro + React
- Backend: API existente
- Pagos: Open Pay.js + Open Pay API
- Estados: React hooks o Astro islands

## Endpoints API
[Documentar aquí los endpoints exactos cuando se tenga]

## Notas
- El plan está listo para implementación
- Requiere toggle a Act Mode para comenzar
- Priorizar seguridad y experiencia de usuario
```

### **2. Desplegar en Netlify desde GitHub**

#### **Paso 1: Verificar Build Local**
```bash
cd EnarmDuo
pnpm install
pnpm build
```
Verifica que no haya errores y se genere la carpeta `dist/`

#### **Paso 2: Commit Final (si hay cambios pendientes)**
```bash
git add .
git status  # Revisar cambios
git commit -m "feat: Preparar para despliegue en producción

- Componente Team corregido y optimizado
- Página legal con Markdown funcionando
- Todos los estilos y componentes listos
- Build exitoso para producción"
```

#### **Paso 3: Push a GitHub**
```bash
git push origin main
```

#### **Paso 4: Configurar Netlify**
**Opción A: Conectando a GitHub (Recomendado)**
1. Ir a [netlify.com](https://netlify.com)
2. Iniciar sesión o crear cuenta
3. Click en "New site from Git"
4. Seleccionar "GitHub"
5. Autorizar Netlify (si es la primera vez)
6. Seleccionar repositorio `MarkianUchiha/enarmduo`
7. Configurar build settings:
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
   - **Node version**: `18` (o la que uses)
8. Click en "Deploy site"

**Opción B: Drag and Drop (Rápido)**
1. Correr `pnpm build` localmente
2. Arrastrar la carpeta `dist/` a [app.netlify.com/drop](https://app.netlify.com/drop)

#### **Paso 5: Configurar Dominio (Opcional)**
1. En Netlify, ir a "Site settings" → "Domain management"
2. Agregar dominio personalizado si tienes uno
3. Configurar DNS según instrucciones de Netlify

#### **Paso 6: Verificar Despliegue**
1. Netlify te dará una URL como: `nombre-random.netlify.app`
2. Visitar la URL y verificar:
   - Todas las páginas funcionan
   - Estilos cargan correctamente
   - Componentes Team y Legal funcionan
   - Responsive design en móvil

#### **Paso 7: Configurar Redirecciones (Si es necesario)**
Crear archivo `netlify.toml` en raíz:
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 404
```

### **3. Para Continuar con Pagos (Próximo Chat)**

Cuando estés listo para continuar con el sistema de pagos:
1. **Iniciar nuevo chat** conmigo
2. **Mencionar**: "Continuar con plan de pagos guardado en PLAN_PAGOS.md"
3. **Proporcionar**: 
   - Los endpoints exactos de la API backend
   - Credenciales de Open Pay (cuando las tengas)
   - Cualquier cambio en los paquetes o precios

### **4. Checklist Rápido de Despliegue**
- [ ] Build local exitoso
- [ ] Commit y push a GitHub
- [ ] Conectar repo a Netlify
- [ ] Configurar build command y publish directory
- [ ] Verificar despliegue en URL de Netlify
- [ ] Testear todas las páginas y componentes
- [ ] Configurar dominio personalizado (si aplica)
- [ ] Guardar PLAN_PAGOS.md para futuro

Con esto tendrás el proyecto desplegado y el plan de pagos documentado para continuar cuando quieras.