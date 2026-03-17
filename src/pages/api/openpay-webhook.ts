// Webhook que OpenPay llama cuando un pago se completa/falla
// POST /api/openpay-webhook
import type { APIRoute } from 'astro';
import { PLANES, isPlanValido, type PlanId } from '../../utils/openpay';
import { enviarCodigoPago } from '../../utils/email';

export const prerender = false;

// Genera un código de cupón único (8 caracteres alfanuméricos)
function generarCodigo(): string {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sin I, O, 0, 1 para evitar confusión
	let codigo = 'WEB-';
	for (let i = 0; i < 8; i++) {
		codigo += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return codigo;
}

// Extrae el planId del order_id (formato: "mensual_1234567890")
function extraerPlan(orderId: string): PlanId | null {
	const planId = orderId.split('_')[0];
	return isPlanValido(planId) ? planId : null;
}

export const POST: APIRoute = async ({ request }) => {
	try {
		const evento = await request.json();
		console.log('[OpenPay Webhook] Evento recibido:', JSON.stringify(evento));

		// OpenPay envía el objeto de la transacción directamente
		const { type, transaction } = evento;

		// Solo procesar pagos completados
		if (type !== 'charge.succeeded') {
			console.log(`[OpenPay Webhook] Evento ignorado: ${type}`);
			return new Response('OK', { status: 200 });
		}

		const orderId = transaction?.order_id;
		if (!orderId) {
			console.error('[OpenPay Webhook] No se encontró order_id en la transacción');
			return new Response('OK', { status: 200 });
		}

		// Extraer plan del order_id
		const planId = extraerPlan(orderId);
		if (!planId) {
			console.error(`[OpenPay Webhook] Plan no válido en order_id: ${orderId}`);
			return new Response('OK', { status: 200 });
		}

		const plan = PLANES[planId];
		const codigo = generarCodigo();

		// Crear cupón en el backend .NET para activar la suscripción
		const backendUrl = process.env.BACKEND_API_URL || 'https://api.enarmduo.com/api';

		// Primero obtenemos un token de admin para poder crear el cupón
		const loginResponse = await fetch(`${backendUrl}/account/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				correo: process.env.ADMIN_USER || 'admin',
				password: process.env.ADMIN_PASSWORD || 'asdf1234',
			}),
		});

		if (!loginResponse.ok) {
			console.error('[OpenPay Webhook] Error al obtener token de admin');
			return new Response('Error interno', { status: 500 });
		}

		const { token } = await loginResponse.json();

		// Crear cupón con diasBonificados para el plan comprado
		const cuponResponse = await fetch(`${backendUrl}/cupon`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({
				codigo,
				porcentajeDescuento: 0,
				expiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días para canjear
				cantidad: 1, // Un solo uso
				diasBonificados: plan.dias,
			}),
		});

		if (!cuponResponse.ok) {
			const errorText = await cuponResponse.text();
			console.error(`[OpenPay Webhook] Error al crear cupón: ${errorText}`);
			return new Response('Error al crear cupón', { status: 500 });
		}

		console.log(`[OpenPay Webhook] Pago confirmado: ${planId} — Cupón generado: ${codigo}`);

		// Enviar código por email al cliente
		const clienteEmail = transaction?.customer?.email;
		if (clienteEmail) {
			try {
				await enviarCodigoPago(clienteEmail, codigo, plan.nombre, plan.dias);
				console.log(`[OpenPay Webhook] Email enviado a: ${clienteEmail}`);
			} catch (emailError) {
				console.error('[OpenPay Webhook] Error al enviar email:', emailError);
				// No falla el webhook — el cupón ya se creó
			}
		}

		return new Response('OK', { status: 200 });
	} catch (error) {
		console.error('[OpenPay Webhook] Error:', error);
		return new Response('Error interno', { status: 500 });
	}
};
