import { useState, useEffect, useRef, type FormEvent } from 'react';

// Tipo de solicitud con su correo correspondiente
type TipoSolicitud = 'soporte' | 'pagos' | 'cuenta';

interface FormData {
	nombre: string;
	email: string;
	tipo: TipoSolicitud;
	mensaje: string;
}

// Configuración de tipos de solicitud
const tiposSolicitud: { value: TipoSolicitud; label: string }[] = [
	{ value: 'soporte', label: 'Soporte Técnico' },
	{ value: 'pagos', label: 'Pagos y Suscripciones' },
	{ value: 'cuenta', label: 'Cuenta y Datos' }
];

// Mapeo de tipo de solicitud a correo electrónico
const correosPorTipo: Record<TipoSolicitud, string> = {
	soporte: 'soporte@enarmduo.com',
	pagos: 'facturacion@enarmduo.com',
	cuenta: 'soporte@enarmduo.com'
};

// Declaración del widget de Turnstile que se inyecta via script externo
declare global {
	interface Window {
		turnstile?: {
			render: (container: string | HTMLElement, options: {
				sitekey: string;
				callback: (token: string) => void;
				'error-callback'?: () => void;
				'expired-callback'?: () => void;
				theme?: 'light' | 'dark' | 'auto';
				size?: 'normal' | 'compact';
			}) => string;
			reset: (widgetId: string) => void;
			remove: (widgetId: string) => void;
		};
	}
}

// Site key de Turnstile — se pasa como prop desde Astro
interface ContactoFormProps {
	turnstileSiteKey: string;
}

export default function ContactoForm({ turnstileSiteKey }: ContactoFormProps) {
	const [formData, setFormData] = useState<FormData>({
		nombre: '',
		email: '',
		tipo: 'soporte',
		mensaje: ''
	});

	const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
	const [enviando, setEnviando] = useState(false);
	const [enviado, setEnviado] = useState(false);
	const [errorGeneral, setErrorGeneral] = useState('');

	// Estado del captcha
	const [captchaToken, setCaptchaToken] = useState<string | null>(null);
	const turnstileRef = useRef<HTMLDivElement>(null);
	const widgetIdRef = useRef<string | null>(null);

	// Cargar e inicializar Turnstile cuando el componente monta
	useEffect(() => {
		const inicializarTurnstile = () => {
			if (!window.turnstile || !turnstileRef.current) return;

			// Evitar renderizar dos veces
			if (widgetIdRef.current) return;

			widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
				sitekey: turnstileSiteKey,
				callback: (token: string) => setCaptchaToken(token),
				'error-callback': () => setCaptchaToken(null),
				'expired-callback': () => setCaptchaToken(null),
				theme: 'light',
			});
		};

		// Si el script ya cargó, inicializar directo
		if (window.turnstile) {
			inicializarTurnstile();
			return;
		}

		// Si no, esperar a que cargue (evento del script en la página Astro)
		const onTurnstileReady = () => inicializarTurnstile();
		window.addEventListener('turnstile-ready', onTurnstileReady);

		return () => {
			window.removeEventListener('turnstile-ready', onTurnstileReady);
			// Limpiar widget al desmontar
			if (widgetIdRef.current && window.turnstile) {
				window.turnstile.remove(widgetIdRef.current);
				widgetIdRef.current = null;
			}
		};
	}, [turnstileSiteKey]);

	// Contar palabras del mensaje
	const contarPalabras = (texto: string): number => {
		if (!texto.trim()) return 0;
		return texto.trim().split(/\s+/).length;
	};

	// Validar formulario
	const validarFormulario = (): boolean => {
		const nuevosErrores: Partial<Record<keyof FormData, string>> = {};

		if (!formData.nombre.trim()) {
			nuevosErrores.nombre = 'El nombre es requerido';
		}

		if (!formData.email.trim()) {
			nuevosErrores.email = 'El correo electrónico es requerido';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			nuevosErrores.email = 'Correo electrónico inválido';
		}

		const palabras = contarPalabras(formData.mensaje);
		if (!formData.mensaje.trim()) {
			nuevosErrores.mensaje = 'El mensaje es requerido';
		} else if (palabras > 600) {
			nuevosErrores.mensaje = 'El mensaje excede el límite de 600 palabras';
		}

		setErrors(nuevosErrores);
		return Object.keys(nuevosErrores).length === 0;
	};

	// Manejar cambio en campos
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		// Limpiar error del campo actual
		if (errors[name as keyof FormData]) {
			setErrors(prev => ({ ...prev, [name]: undefined }));
		}
		setErrorGeneral('');
	};

	// Manejar envío del formulario
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorGeneral('');

		if (!validarFormulario()) return;

		if (!captchaToken) {
			setErrorGeneral('Completa la verificación de seguridad antes de enviar.');
			return;
		}

		setEnviando(true);

		try {
			const correoDestino = correosPorTipo[formData.tipo];

			const response = await fetch('/api/send-contacto', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					correoDestino,
					captchaToken,
					// Honeypot: campo oculto, si tiene valor el servidor lo ignora
					website: (document.getElementById('website') as HTMLInputElement)?.value || '',
				})
			});

			if (response.status === 429) {
				setErrorGeneral('Demasiados envíos. Intenta de nuevo en 15 minutos.');
				return;
			}

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Error al enviar el mensaje');
			}

			setEnviado(true);
			setFormData({ nombre: '', email: '', tipo: 'soporte', mensaje: '' });
			setCaptchaToken(null);
		} catch (error) {
			const mensaje = error instanceof Error ? error.message : 'Error al enviar el mensaje';
			setErrorGeneral(mensaje);
		} finally {
			setEnviando(false);
			// Resetear captcha para el siguiente envío
			if (widgetIdRef.current && window.turnstile) {
				window.turnstile.reset(widgetIdRef.current);
			}
		}
	};

	// Mostrar mensaje de éxito
	if (enviado) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-azul)' }}>
					<svg
						className="w-8 h-8"
						style={{ color: 'var(--color-blanco)' }}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-azul)' }}>
					¡Mensaje Enviado!
				</h3>
				<p className="text-base" style={{ color: 'var(--color-Zinc)' }}>
					Hemos recibido tu mensaje. Te responderemos lo más pronto posible.
				</p>
				<button
					onClick={() => setEnviado(false)}
					className="mt-6 px-6 py-2 rounded-md font-medium transition-all"
					style={{ backgroundColor: 'var(--color-azul)', color: 'var(--color-blanco)' }}
				>
					Enviar otro mensaje
				</button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Honeypot: campo invisible para atrapar bots */}
			<div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
				<label htmlFor="website">No llenar este campo</label>
				<input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
			</div>

			{/* Campo: Nombre */}
			<div>
				<label htmlFor="nombre" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-azul)' }}>
					Nombre completo
				</label>
				<input
					type="text"
					id="nombre"
					name="nombre"
					value={formData.nombre}
					onChange={handleChange}
					className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
						errors.nombre ? 'border-red-500' : 'border-gray-300'
					}`}
					style={{
						backgroundColor: 'var(--color-blanco)',
						color: 'var(--color-azul)',
						borderColor: errors.nombre ? '#ef4444' : 'var(--color-gris)'
					} as React.CSSProperties}
					placeholder="Tu nombre completo"
				/>
				{errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
			</div>

			{/* Campo: Email */}
			<div>
				<label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-azul)' }}>
					Correo electrónico
				</label>
				<input
					type="email"
					id="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
						errors.email ? 'border-red-500' : 'border-gray-300'
					}`}
					style={{
						backgroundColor: 'var(--color-blanco)',
						color: 'var(--color-azul)',
						borderColor: errors.email ? '#ef4444' : 'var(--color-gris)'
					}}
					placeholder="tu@ejemplo.com"
				/>
				{errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
			</div>

			{/* Campo: Tipo de Solicitud */}
			<div>
				<label htmlFor="tipo" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-azul)' }}>
					Tipo de solicitud
				</label>
				<select
					id="tipo"
					name="tipo"
					value={formData.tipo}
					onChange={handleChange}
					className="w-full px-4 py-3 rounded-lg border-2 transition-all"
					style={{
						backgroundColor: 'var(--color-blanco)',
						color: 'var(--color-azul)',
						borderColor: 'var(--color-gris)'
					}}
				>
					{tiposSolicitud.map(tipo => (
						<option key={tipo.value} value={tipo.value}>
							{tipo.label}
						</option>
					))}
				</select>
			</div>

			{/* Campo: Mensaje */}
			<div>
				<label htmlFor="mensaje" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-azul)' }}>
					Mensaje
				</label>
				<textarea
					id="mensaje"
					name="mensaje"
					value={formData.mensaje}
					onChange={handleChange}
					rows={6}
					className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
						errors.mensaje ? 'border-red-500' : 'border-gray-300'
					}`}
					style={{
						backgroundColor: 'var(--color-blanco)',
						color: 'var(--color-azul)',
						borderColor: errors.mensaje ? '#ef4444' : 'var(--color-gris)'
					}}
					placeholder="Escribe tu mensaje aquí..."
				/>
				<div className="flex justify-between items-center mt-2">
					{errors.mensaje && <p className="text-sm text-red-500">{errors.mensaje}</p>}
					<div className="text-sm" style={{ color: 'var(--color-Zinc)' }}>
						{contarPalabras(formData.mensaje)}/600 palabras
					</div>
				</div>
			</div>

			{/* Widget de Turnstile (captcha invisible/managed) */}
			<div ref={turnstileRef} className="flex justify-center" />

			{/* Mensaje de error general */}
			{errorGeneral && (
				<div className="p-3 rounded-lg bg-red-50 border border-red-200">
					<p className="text-sm text-red-600 text-center">{errorGeneral}</p>
				</div>
			)}

			{/* Botón de envío */}
			<button
				type="submit"
				disabled={enviando}
				className="w-full px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.02]"
				style={{
					backgroundColor: 'var(--color-azul)',
					color: 'var(--color-blanco)'
				}}
			>
				{enviando ? 'Enviando...' : 'Enviar Mensaje'}
			</button>
		</form>
	);
}
