// Cliente REST para OpenPay — usa fetch nativo de Node 22
// No usamos el SDK npm porque es viejo (CommonJS, callbacks, dependencias deprecadas)

// Configuración de planes con precios web
export const PLANES = {
	mensual: {
		nombre: 'Mensual',
		precio: 259,
		dias: 30,
		descripcion: 'Plan Mensual EnarmDuo — 30 días de acceso',
	},
	trimestral: {
		nombre: 'Trimestral',
		precio: 699,
		dias: 90,
		descripcion: 'Plan Trimestral EnarmDuo — 90 días de acceso',
	},
	anual: {
		nombre: 'Anual',
		precio: 2399,
		dias: 365,
		descripcion: 'Plan Anual EnarmDuo — 365 días de acceso',
	},
} as const;

export type PlanId = keyof typeof PLANES;

// Verifica si un string es un plan válido
export function isPlanValido(plan: string): plan is PlanId {
	return plan in PLANES;
}

// Construye la URL base según sandbox o producción
function getBaseUrl(): string {
	const isSandbox = process.env.OPENPAY_SANDBOX === 'true';
	return isSandbox
		? 'https://sandbox-api.openpay.mx/v1'
		: 'https://api.openpay.mx/v1';
}

// Header de autenticación Basic (private_key como usuario, sin password)
function getAuthHeader(): string {
	const key = process.env.OPENPAY_PRIVATE_KEY;
	return 'Basic ' + Buffer.from(`${key}:`).toString('base64');
}

// Interfaz de respuesta de cargo OpenPay
export interface OpenpayCharge {
	id: string;
	status: string;
	amount: number;
	description: string;
	payment_method?: {
		type: string;
		url?: string;
		reference?: string;
		barcode_url?: string;
	};
	redirect_url?: string;
	error_message?: string;
}

// Crea un cargo con redirección a la página de pago de OpenPay
export async function crearCargo(planId: PlanId, email: string): Promise<OpenpayCharge> {
	const plan = PLANES[planId];
	const merchantId = process.env.OPENPAY_MERCHANT_ID;
	const baseUrl = getBaseUrl();

	// URL de redirección después del pago — siempre la URL real del sitio
	const siteUrl = process.env.SITE_URL || 'https://enarmduo.com';

	const body = {
		method: 'card',
		amount: plan.precio,
		currency: 'MXN',
		description: plan.descripcion,
		confirm: 'false', // Formulario hosted de OpenPay (el usuario paga en su página)
		send_email: 'false',
		redirect_url: `${siteUrl}/checkout/resultado`,
		customer: {
			name: 'Cliente',
			last_name: 'Web',
			phone_number: '0000000000',
			email: email,
		},
		// Metadatos para identificar el plan en el webhook
		order_id: `${planId}_${Date.now()}`,
	};

	const response = await fetch(`${baseUrl}/${merchantId}/charges`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': getAuthHeader(),
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.description || 'Error al crear cargo en OpenPay');
	}

	return response.json();
}

// Consulta el estado de un cargo por su ID
export async function consultarCargo(chargeId: string): Promise<OpenpayCharge> {
	const merchantId = process.env.OPENPAY_MERCHANT_ID;
	const baseUrl = getBaseUrl();

	const response = await fetch(`${baseUrl}/${merchantId}/charges/${chargeId}`, {
		method: 'GET',
		headers: {
			'Authorization': getAuthHeader(),
		},
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.description || 'Error al consultar cargo');
	}

	return response.json();
}
