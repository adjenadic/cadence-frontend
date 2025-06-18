import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const CadencePreset = definePreset(Aura, {
	semantic: {
		primary: {
			50: '#ffffff',
			100: '#f8f8f8',
			200: '#f0f0f0',
			300: '#ededed',
			400: '#e6e6e6',
			500: '#cccccc',
			600: '#999999',
			700: '#666666',
			800: '#333333',
			900: '#1a1a1a',
			950: '#0d0d0d',
		},
	},
	components: {
		button: {
			borderRadius: '8px',
			paddingX: '1rem',
			paddingY: '0.75rem',
			fontWeight: '500',
		},
	},
});
