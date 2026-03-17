// Botón de checkout que pide email y redirige a OpenPay
// Se usa como React Island en la página de precios
import { useState, type FormEvent } from 'react';

interface Props {
	planId: string;
	planNombre: string;
	precio: number;
	isPopular: boolean;
}

export default function CheckoutButton({ planId, planNombre, precio, isPopular }: Props) {
	const [showModal, setShowModal] = useState(false);
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [cargando, setCargando] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError('');

		// Validar email
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError('Ingresa un correo electrónico válido');
			return;
		}

		setCargando(true);

		try {
			const response = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ plan: planId, email }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || 'Error al procesar el pago');
				return;
			}

			// Redirigir a la página de pago de OpenPay
			if (data.paymentUrl) {
				window.location.href = data.paymentUrl;
			}
		} catch (err) {
			setError('Error de conexión. Intenta nuevamente.');
		} finally {
			setCargando(false);
		}
	};

	return (
		<>
			{/* Botón principal */}
			<button
				onClick={() => setShowModal(true)}
				className={`block w-full text-center py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer border-0 ${
					isPopular ? 'plan-btn-popular' : 'plan-btn-regular'
				}`}
				style={isPopular
					? { backgroundColor: 'var(--color-azul)', color: 'white' }
					: { backgroundColor: 'transparent', border: '2px solid var(--color-azul)', color: 'var(--color-azul)' }
				}
			>
				Elegir plan
			</button>

			{/* Modal para pedir email */}
			{showModal && (
				<div
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 9999,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
					}}
					onClick={() => !cargando && setShowModal(false)}
				>
					<div
						style={{
							backgroundColor: 'white',
							borderRadius: '16px',
							padding: '32px',
							maxWidth: '420px',
							width: '90%',
							boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<h3 style={{ color: 'var(--color-azul)', fontFamily: 'Inter, sans-serif', fontSize: '1.25rem', marginBottom: '4px' }}>
							Plan {planNombre}
						</h3>
						<p style={{ color: 'var(--color-Zinc)', fontSize: '0.875rem', marginBottom: '20px' }}>
							${precio.toLocaleString('es-MX')} MXN — Ingresa tu correo para continuar al pago
						</p>

						<form onSubmit={handleSubmit}>
							<input
								type="email"
								value={email}
								onChange={(e) => { setEmail(e.target.value); setError(''); }}
								placeholder="tu@correo.com"
								disabled={cargando}
								style={{
									width: '100%',
									padding: '12px 16px',
									borderRadius: '8px',
									border: error ? '2px solid #ef4444' : '2px solid #e5e7eb',
									fontSize: '1rem',
									marginBottom: '8px',
									boxSizing: 'border-box',
									outline: 'none',
								}}
								autoFocus
							/>
							{error && (
								<p style={{ color: '#ef4444', fontSize: '0.75rem', marginBottom: '8px' }}>{error}</p>
							)}

							<p style={{ color: '#9ca3af', fontSize: '0.7rem', marginBottom: '16px' }}>
								Te enviaremos tu código de acceso a este correo después del pago.
							</p>

							<button
								type="submit"
								disabled={cargando}
								style={{
									width: '100%',
									padding: '12px',
									borderRadius: '8px',
									border: 'none',
									backgroundColor: 'var(--color-azul)',
									color: 'white',
									fontWeight: 600,
									fontSize: '1rem',
									cursor: cargando ? 'not-allowed' : 'pointer',
									opacity: cargando ? 0.6 : 1,
								}}
							>
								{cargando ? 'Procesando...' : 'Continuar al pago'}
							</button>

							<button
								type="button"
								onClick={() => setShowModal(false)}
								disabled={cargando}
								style={{
									width: '100%',
									padding: '10px',
									marginTop: '8px',
									background: 'none',
									border: 'none',
									color: 'var(--color-Zinc)',
									cursor: 'pointer',
									fontSize: '0.875rem',
								}}
							>
								Cancelar
							</button>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
