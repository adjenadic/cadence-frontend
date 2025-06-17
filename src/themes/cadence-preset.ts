import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const CadencePreset = definePreset(Aura, {
	semantic: {
		primary: {
			50: '#eff6ff',
			100: '#dbeafe',
			200: '#bfdbfe',
			300: '#93c5fd',
			400: '#60a5fa',
			500: '#3b82f6',
			600: '#2563eb',
			700: '#1d4ed8',
			800: '#1e40af',
			900: '#1e3a8a',
			950: '#172554',
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
