import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: '#04050C',
				secondary: '#F0B35B',
				tertiary: '#0D121E'
			},
			fontFamily: {
				poppins: ['Poppins']
			},
			container: {
				center: true
			}
		}
	},

	plugins: []
} satisfies Config;
