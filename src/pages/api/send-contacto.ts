// Endpoint para enviar correos desde el formulario de contacto
// Migrado de netlify/functions/send-contacto.js a Astro API endpoint
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

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
		const { nombre, email, tipo, mensaje, correoDestino } = await request.json();

		// Validar datos requeridos
		if (!nombre || !email || !tipo || !mensaje) {
			return new Response(
				JSON.stringify({ error: 'Datos incompletos' }),
				{ status: 400 }
			);
		}

		// Validar tipo de solicitud contra whitelist
		if (!CORREOS_POR_TIPO[tipo]) {
			return new Response(
				JSON.stringify({ error: 'Tipo de solicitud inválido' }),
				{ status: 400 }
			);
		}

		// Validar correoDestino contra whitelist (ENARM-028: seguridad)
		const destino = CORREOS_POR_TIPO[tipo];
		const tipoLabel = ETIQUETAS_TIPO[tipo] || tipo;

		// Sanitizar inputs para evitar inyección en HTML
		const sanitizar = (texto: string) =>
			texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

		const nombreSeguro = sanitizar(nombre);
		const emailSeguro = sanitizar(email);
		const mensajeSeguro = sanitizar(mensaje);

		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST || 'smtp.gmail.com',
			port: Number(process.env.EMAIL_PORT) || 587,
			secure: false,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		await transporter.sendMail({
			from: `"EnarmDuo - Contacto" <${process.env.EMAIL_FROM || 'noreply@enarmduo.com'}>`,
			to: destino,
			replyTo: email,
			subject: `[${tipoLabel}] Nuevo mensaje de ${nombreSeguro}`,
			html: `
				<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
					<div style="background-color:#024a70;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
						<h2>Nuevo mensaje de contacto</h2>
					</div>
					<div style="background-color:#fafbfc;padding:30px;border-radius:0 0 8px 8px;">
						<p><strong style="color:#024a70;">Tipo:</strong> ${tipoLabel}</p>
						<p><strong style="color:#024a70;">Nombre:</strong> ${nombreSeguro}</p>
						<p><strong style="color:#024a70;">Email:</strong> ${emailSeguro}</p>
						<p><strong style="color:#024a70;">Mensaje:</strong></p>
						<p style="white-space:pre-wrap;background:#f5f5f5;padding:10px;border-radius:4px;">${mensajeSeguro}</p>
					</div>
					<p style="text-align:center;font-size:12px;color:#636e72;margin-top:20px;">
						Enviado desde el formulario de contacto de EnarmDuo — ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
					</p>
				</div>
			`,
		});

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
