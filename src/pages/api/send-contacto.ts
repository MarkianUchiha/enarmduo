// Endpoint para enviar correos desde el formulario de contacto
// POST /api/send-contacto — usa Resend en vez de nodemailer
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

export const POST: APIRoute = async ({ request }) => {
	try {
		const { nombre, email, tipo, mensaje } = await request.json();

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
