import { useState, type FormEvent } from 'react';

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

export default function ContactoForm() {
	const [formData, setFormData] = useState<FormData>({
		nombre: '',
		email: '',
		tipo: 'soporte',
		mensaje: ''
	});

	const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
	const [enviando, setEnviando] = useState(false);
	const [enviado, setEnviado] = useState(false);

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
	};

	// Manejar envío del formulario
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!validarFormulario()) {
			return;
		}

		setEnviando(true);

		try {
			// Obtener el correo destino según el tipo seleccionado
			const correoDestino = correosPorTipo[formData.tipo];

			// Enviar formulario a Netlify Functions
			const response = await fetch('/.netlify/functions/send-contacto', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...formData,
					correoDestino
				})
			});

			if (!response.ok) {
				throw new Error('Error al enviar el mensaje');
			}

			setEnviado(true);
			setFormData({
				nombre: '',
				email: '',
				tipo: 'soporte',
				mensaje: ''
			});
		} catch (error) {
			console.error('Error al enviar el formulario:', error);
			alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
		} finally {
			setEnviando(false);
		}
	};

	// Mostrar mensaje de éxito
	if (enviado) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center" style="background-color: var(--color-azul);">
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
				<h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-negro)' }}>
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
			{/* Campo: Nombre */}
			<div>
				<label htmlFor="nombre" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-negro)' }}>
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
						color: 'var(--color-negro)',
						borderColor: errors.nombre ? '#ef4444' : 'var(--color-gris)'
					} as React.CSSProperties}
					placeholder="Tu nombre completo"
				/>
				{errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
			</div>

			{/* Campo: Email */}
			<div>
				<label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-negro)' }}>
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
						color: 'var(--color-negro)',
						borderColor: errors.email ? '#ef4444' : 'var(--color-gris)'
					}}
					placeholder="tu@ejemplo.com"
				/>
				{errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
			</div>

			{/* Campo: Tipo de Solicitud */}
			<div>
				<label htmlFor="tipo" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-negro)' }}>
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
						color: 'var(--color-negro)',
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
				<label htmlFor="mensaje" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-negro)' }}>
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
						color: 'var(--color-negro)',
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