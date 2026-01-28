const nodemailer = require('nodemailer');

// Mapeo de tipo de solicitud a correo electrónico
const correosPorTipo = {
	soporte: 'soporte@enarmduo.com',
	pagos: 'facturacion@enarmduo.com',
	cuenta: 'soporte@enarmduo.com'
};

// Mapeo de tipo de solicitud a etiqueta legible
const etiquetasTipo = {
	soporte: 'Soporte Técnico',
	pagos: 'Pagos y Suscripciones',
	cuenta: 'Cuenta y Datos'
};

export async function handler(event, context) {
	// Solo permitir método POST
	if (event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			body: JSON.stringify({ error: 'Método no permitido' })
		};
	}

	try {
		const { nombre, email, tipo, mensaje, correoDestino } = JSON.parse(event.body);

		// Validar datos requeridos
		if (!nombre || !email || !tipo || !mensaje) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: 'Datos incompletos' })
			};
		}

		// Obtener correo destino
		const destino = correoDestino || correosPorTipo[tipo];
		const tipoLabel = etiquetasTipo[tipo] || tipo;

		// Configurar el transportador de correo
		// Nota: Para producción, usa variables de entorno para las credenciales
		// Ejemplo: process.env.EMAIL_USER, process.env.EMAIL_PASSWORD
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST || 'smtp.gmail.com',
			port: process.env.EMAIL_PORT || 587,
			secure: false, // true para 465, false para otros puertos
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD
			}
		});

		// Construir el correo electrónico
		const mailOptions = {
			from: `"EnarmDuo - Contacto" <${process.env.EMAIL_FROM || 'noreply@enarmduo.com'}>`,
			to: destino,
			replyTo: email,
			subject: `[${tipoLabel}] Nuevo mensaje de ${nombre}`,
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<style>
						body {
							font-family: Arial, sans-serif;
							line-height: 1.6;
							color: #333;
							margin: 0;
							padding: 0;
						}
						.container {
							max-width: 600px;
							margin: 0 auto;
							padding: 20px;
						}
						.header {
							background-color: #024a70;
							color: white;
							padding: 20px;
							text-align: center;
							border-radius: 8px 8px 0 0;
						}
						.content {
							background-color: #fafbfc;
							padding: 30px;
							border-radius: 0 0 8px 8px;
							box-shadow: 0 2px 4px rgba(0,0,0,0.1);
						}
						.field {
							margin-bottom: 20px;
						}
						.label {
							font-weight: bold;
							color: #024a70;
							margin-bottom: 5px;
						}
						.value {
							padding: 10px;
							background-color: #f5f5f5;
							border-radius: 4px;
							word-wrap: break-word;
						}
						.message {
							white-space: pre-wrap;
						}
						.footer {
							text-align: center;
							margin-top: 20px;
							padding-top: 20px;
							border-top: 1px solid #ddd;
							font-size: 12px;
							color: #636e72;
						}
					</style>
				</head>
				<body>
					<div class="container">
						<div class="header">
							<h2>Nuevo mensaje de contacto</h2>
						</div>
						<div class="content">
							<div class="field">
								<div class="label">Tipo de solicitud:</div>
								<div class="value">${tipoLabel}</div>
							</div>
							<div class="field">
								<div class="label">Nombre:</div>
								<div class="value">${nombre}</div>
							</div>
							<div class="field">
								<div class="label">Correo electrónico:</div>
								<div class="value">${email}</div>
							</div>
							<div class="field">
								<div class="label">Mensaje:</div>
								<div class="value message">${mensaje}</div>
							</div>
						</div>
						<div class="footer">
							<p>Este mensaje fue enviado desde el formulario de contacto de EnarmDuo</p>
							<p>Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</p>
						</div>
					</div>
				</body>
				</html>
			`,
			text: `
Nuevo mensaje de contacto

Tipo de solicitud: ${tipoLabel}
Nombre: ${nombre}
Correo electrónico: ${email}

Mensaje:
${mensaje}

---
Este mensaje fue enviado desde el formulario de contacto de EnarmDuo
Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
			`
		};

		// Enviar el correo
		await transporter.sendMail(mailOptions);

		return {
			statusCode: 200,
			body: JSON.stringify({ 
				message: 'Correo enviado exitosamente',
				destino: destino
			})
		};

	} catch (error) {
		console.error('Error al enviar el correo:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({ 
				error: 'Error al enviar el correo',
				details: error.message 
			})
		};
	}
}