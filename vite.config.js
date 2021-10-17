import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import eslintPlugin from 'vite-plugin-eslint'
import viteSvgIcons from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    return defineConfig({
        resolve: {
            alias: [
                { find: '@', replacement: '/src' },
            ],
        },
        server: {
            port: process.env.VITE_APP_PORT,
            proxy: {
                '^/assets': {
                    target: process.env.VITE_APP_URL + 'src/',
                },
            },
        },
        plugins: [
            react(),
            eslintPlugin(),
            viteSvgIcons({
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
                symbolId: '[name]',
            }),
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "./src/style/mixins/mixin";',
                },
            },
        },
    })
}
