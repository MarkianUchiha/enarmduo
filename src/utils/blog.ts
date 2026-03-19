/**
 * Tipos y funciones para consumir la API del blog desde el backend.
 * El contenido viene en HTML (generado por TipTap en el admin).
 */

const API_URL = import.meta.env.BACKEND_API_URL;

export type BlogPost = {
	idBlogPost: number;
	titulo: string;
	slug: string;
	descripcion: string;
	autor: string;
	categoria: string;
	etiquetas: string | null;
	imagenUrl: string | null;
	tiempoLectura: number;
	destacado: boolean;
	publicado: boolean;
	fechaPublicacion: string;
};

export type BlogPostDetail = BlogPost & {
	contenido: string;
	fechaCreacion: string;
};

// Obtiene todos los posts publicados (para el listado del blog)
export async function fetchBlogPosts(): Promise<BlogPost[]> {
	const res = await fetch(`${API_URL}/BlogPost`);
	if (res.status === 204) return [];
	if (!res.ok) throw new Error(`Error al obtener posts: ${res.status}`);
	return res.json();
}

// Obtiene un post por slug (para la página de detalle)
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
	const res = await fetch(`${API_URL}/BlogPost/slug/${slug}`);
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`Error al obtener post: ${res.status}`);
	return res.json();
}

// Formatea fecha en español
export function formatDate(dateStr: string): string {
	return new Intl.DateTimeFormat('es-MX', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(new Date(dateStr));
}
