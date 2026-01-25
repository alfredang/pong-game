import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    base: '/pong-game/',
    plugins: [
        tailwindcss(),
    ],
});
