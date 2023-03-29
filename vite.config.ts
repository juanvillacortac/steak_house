import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import windicss from 'vite-plugin-windicss'

export default defineConfig({
	plugins: [sveltekit(), windicss()]
});
