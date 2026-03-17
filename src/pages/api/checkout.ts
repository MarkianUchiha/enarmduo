// Endpoint para crear un cargo en OpenPay y redirigir al checkout
// POST /api/checkout — recibe { plan, email }
import type { APIRoute } from 'astro';
import { crearCargo, isPlanValido } from '../../utils/openpay';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	try {
		const { plan, email } = await request.json();

		// Validar plan
		if (!plan || !isPlanValido(plan)) {
			return new Response(
				JSON.stringify({ error: 'Plan inválido. Opciones: mensual, trimestral, anual' }),
				{ status: 400 }
			);
		}

		// Validar email
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return new Response(
				JSON.stringify({ error: 'Email inválido' }),
				{ status: 400 }
			);
		}

		// Crear cargo en OpenPay
		const cargo = await crearCargo(plan, email);

		// OpenPay devuelve la URL de pago en payment_method.url
		const paymentUrl = cargo.payment_method?.url;

		if (!paymentUrl) {
			return new Response(
				JSON.stringify({ error: 'No se obtuvo URL de pago de OpenPay' }),
				{ status: 500 }
			);
		}

		return new Response(
			JSON.stringify({
				paymentUrl,
				chargeId: cargo.id,
				status: cargo.status,
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error en checkout:', error);
		const mensaje = error instanceof Error ? error.message : 'Error interno';
		return new Response(
			JSON.stringify({ error: mensaje }),
			{ status: 500 }
		);
	}
};
