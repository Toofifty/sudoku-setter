import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            { find: 'components', replacement: '/src/components' },
            { find: 'hooks', replacement: '/src/hooks' },
            { find: 'modules', replacement: '/src/modules' },
            { find: 'reducers', replacement: '/src/reducers' },
            { find: 'styles', replacement: '/src/styles' },
            { find: 'utils', replacement: '/src/utils' },
        ],
    },
});
