// Endpoint para enviar correos desde el formulario de contacto
// POST /api/send-contacto — usa Resend, con rate limiting y validación Turnstile
import type { APIRoute } from 'astro';
import { enviarContacto } from '../../utils/email';

export const prerender = false;

// Mapeo de tipo de solicitud a correo destino
const CORREOS_POR_TIPO: Record<string, string> = {
	soporte: 'soporte@enarmduo.com',
	pagos: 'facturacion@enarmduo.com',
	cuenta: 'soporte@enarmduo.com',
};

// Etiquetas legibles para cada tipo
const ETIQUETAS_TIPO: Record<string, string> = {
	soporte: 'Soporte Técnico',
	pagos: 'Pagos y Suscripciones',
	cuenta: 'Cuenta y Datos',
};

// --- Rate limiting en memoria ---
// Almacena timestamps de envíos por IP para limitar abuso
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // Ventana de 15 minutos
const RATE_LIMIT_MAX_REQUESTS = 3; // Máximo 3 envíos por ventana

// Limpia entradas expiradas cada 30 minutos para evitar memory leaks
setInterval(() => {
	const ahora = Date.now();
	for (const [ip, timestamps] of rateLimitMap) {
		const recientes = timestamps.filter(t => ahora - t < RATE_LIMIT_WINDOW_MS);
		if (recientes.length === 0) {
			rateLimitMap.delete(ip);
		} else {
			rateLimitMap.set(ip, recientes);
		}
	}
}, 30 * 60 * 1000);

// Verifica si una IP ha excedido el límite de envíos
function isRateLimited(ip: string): boolean {
	const ahora = Date.now();
	const timestamps = rateLimitMap.get(ip) || [];
	const recientes = timestamps.filter(t => ahora - t < RATE_LIMIT_WINDOW_MS);

	if (recientes.length >= RATE_LIMIT_MAX_REQUESTS) {
		return true;
	}

	recientes.push(ahora);
	rateLimitMap.set(ip, recientes);
	return false;
}

// --- Validación de Turnstile ---
// Verifica el token del captcha con la API de Cloudflare
async function verificarTurnstile(token: string, ip: string): Promise<boolean> {
	const secretKey = process.env.TURNSTILE_SECRET_KEY;
	if (!secretKey) {
		console.warn('TURNSTILE_SECRET_KEY no configurada, omitiendo verificación');
		return true;
	}

	const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			secret: secretKey,
			response: token,
			remoteip: ip,
		}),
	});

	const data = await response.json() as { success: boolean };
	return data.success;
}

// Solo acepta POST, cualquier otro método retorna 405
export const ALL: APIRoute = async ({ request }) => {
	if (request.method !== 'POST') {
		return new Response(
			JSON.stringify({ error: 'Método no permitido' }),
			{ status: 405, headers: { 'Allow': 'POST' } }
		);
	}

	// Obtener IP del cliente (headers de proxy o fallback)
	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
		|| request.headers.get('x-real-ip')
		|| 'unknown';

	// Rate limiting por IP
	if (isRateLimited(ip)) {
		return new Response(
			JSON.stringify({ error: 'Demasiados envíos. Intenta de nuevo en 15 minutos.' }),
			{ status: 429 }
		);
	}

	try {
		const { nombre, email, tipo, mensaje, captchaToken, website } = await request.json();

		// Honeypot: si el campo oculto "website" tiene valor, es un bot
		if (website) {
			// Responder 200 para no alertar al bot, pero no enviar nada
			return new Response(
				JSON.stringify({ message: 'Correo enviado exitosamente' }),
				{ status: 200 }
			);
		}

		// Validar datos requeridos
		if (!nombre || !email || !tipo || !mensaje) {
			return new Response(
				JSON.stringify({ error: 'Datos incompletos' }),
				{ status: 400 }
			);
		}

		// Validar tipo contra whitelist
		if (!CORREOS_POR_TIPO[tipo]) {
			return new Response(
				JSON.stringify({ error: 'Tipo de solicitud inválido' }),
				{ status: 400 }
			);
		}

		// Validar formato de email en servidor
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return new Response(
				JSON.stringify({ error: 'Email inválido' }),
				{ status: 400 }
			);
		}

		// Validar longitud máxima (protección contra payloads enormes)
		if (nombre.length > 200 || email.length > 254 || mensaje.length > 5000) {
			return new Response(
				JSON.stringify({ error: 'Datos exceden el límite permitido' }),
				{ status: 400 }
			);
		}

		// Verificar Turnstile (captcha)
		if (!captchaToken) {
			return new Response(
				JSON.stringify({ error: 'Verificación de seguridad requerida' }),
				{ status: 400 }
			);
		}

		const isCaptchaValid = await verificarTurnstile(captchaToken, ip);
		if (!isCaptchaValid) {
			return new Response(
				JSON.stringify({ error: 'Verificación de seguridad fallida' }),
				{ status: 403 }
			);
		}

		const destino = CORREOS_POR_TIPO[tipo];
		const tipoLabel = ETIQUETAS_TIPO[tipo] || tipo;

		await enviarContacto(destino, tipoLabel, nombre, email, mensaje);

		return new Response(
			JSON.stringify({ message: 'Correo enviado exitosamente' }),
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error al enviar correo:', error);
		return new Response(
			JSON.stringify({ error: 'Error al enviar el correo' }),
			{ status: 500 }
		);
	}
};
