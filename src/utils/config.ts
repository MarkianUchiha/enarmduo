/**
 * Archivo de configuración central para la aplicación
 */

export const config = {
	siteName: 'EnarmDuo',
	siteDescription: 'Plataforma educativa integral para prepararte en el ENAM',
	siteUrl: process.env.PUBLIC_SITE_URL || 'http://localhost:3000',
	language: 'es',
	
	// API
	apiUrl: process.env.PUBLIC_API_URL || 'http://localhost:3001/api',
	supabaseUrl: process.env.PUBLIC_SUPABASE_URL || '',
	supabaseKey: process.env.PUBLIC_SUPABASE_ANON_KEY || '',
	
	// Redes sociales
	social: {
		twitter: 'https://twitter.com/enarmduo',
		instagram: 'https://instagram.com/enarmduo',
		linkedin: 'https://linkedin.com/company/enarmduo',
		github: 'https://github.com/enarmduo',
	},
	
	// Contacto
	contact: {
		email: 'info@enarmduo.com',
		phone: '+1 234 567 890',
		address: 'Calle Principal 123, Ciudad',
	},
} as const;
