/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				blanco: '#fafbfc',
				azul: '#1e40af',
				negro: '#000000',
				gris: '#ececf1',
			},
			fontFamily: {
				heading: ['Inter', 'sans-serif'],
				sans: ['Google Sans Flex', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
