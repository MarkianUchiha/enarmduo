// Servicio de email usando Resend
// Todos los correos transaccionales del sitio pasan por aquí
import { Resend } from 'resend';

function getResend(): Resend {
	return new Resend(process.env.RESEND_API_KEY);
}

function getFrom(): string {
	return process.env.EMAIL_FROM || 'EnarmDuo <noreply@enarmduo.com>';
}

// Envía el código de cupón al cliente después de un pago exitoso
export async function enviarCodigoPago(email: string, codigo: string, planNombre: string, dias: number) {
	const resend = getResend();

	await resend.emails.send({
		from: getFrom(),
		to: email,
		subject: `Tu código de acceso EnarmDuo — Plan ${planNombre}`,
		html: `
			<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
				<div style="background-color:#024a70;color:white;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
					<h1 style="margin:0;font-size:24px;">¡Pago exitoso!</h1>
					<p style="margin:8px 0 0;opacity:0.9;">Plan ${planNombre} — ${dias} días de acceso</p>
				</div>
				<div style="background-color:#fafbfc;padding:32px;border-radius:0 0 12px 12px;">
					<p style="color:#333;font-size:16px;">Gracias por tu compra. Tu código de acceso es:</p>
					<div style="background-color:#024a70;color:white;text-align:center;padding:20px;border-radius:8px;margin:20px 0;">
						<span style="font-size:32px;font-weight:bold;letter-spacing:4px;">${codigo}</span>
					</div>
					<h3 style="color:#024a70;margin-top:24px;">¿Cómo activarlo?</h3>
					<ol style="color:#555;line-height:1.8;">
						<li>Abre la app <strong>EnarmDuo</strong> en tu celular</li>
						<li>Ve a tu <strong>perfil</strong> o <strong>configuración</strong></li>
						<li>Ingresa el código de arriba</li>
						<li>¡Listo! Tu suscripción se activará al instante</li>
					</ol>
					<p style="color:#999;font-size:12px;margin-top:24px;border-top:1px solid #eee;padding-top:16px;">
						Este código es de un solo uso y expira en 7 días. Si tienes problemas, contáctanos en
						<a href="https://enarmduo.com/contacto" style="color:#024a70;">enarmduo.com/contacto</a>
					</p>
				</div>
			</div>
		`,
	});
}

// Envía el formulario de contacto al equipo
export async function enviarContacto(
	destino: string,
	tipoLabel: string,
	nombre: string,
	email: string,
	mensaje: string,
) {
	const resend = getResend();

	// Sanitizar inputs para evitar inyección en HTML
	const sanitizar = (texto: string) =>
		texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	const nombreSeguro = sanitizar(nombre);
	const emailSeguro = sanitizar(email);
	const mensajeSeguro = sanitizar(mensaje);

	await resend.emails.send({
		from: getFrom(),
		to: destino,
		replyTo: email,
		subject: `[${tipoLabel}] Nuevo mensaje de ${nombreSeguro}`,
		html: `
			<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
				<div style="background-color:#024a70;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
					<h2 style="margin:0;">Nuevo mensaje de contacto</h2>
				</div>
				<div style="background-color:#fafbfc;padding:30px;border-radius:0 0 8px 8px;">
					<p><strong style="color:#024a70;">Tipo:</strong> ${tipoLabel}</p>
					<p><strong style="color:#024a70;">Nombre:</strong> ${nombreSeguro}</p>
					<p><strong style="color:#024a70;">Email:</strong> ${emailSeguro}</p>
					<p><strong style="color:#024a70;">Mensaje:</strong></p>
					<p style="white-space:pre-wrap;background:#f5f5f5;padding:10px;border-radius:4px;">${mensajeSeguro}</p>
				</div>
				<p style="text-align:center;font-size:12px;color:#636e72;margin-top:20px;">
					Enviado desde el formulario de contacto de EnarmDuo
				</p>
			</div>
		`,
	});
}
