import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import eslintPlugin from 'vite-plugin-eslint'
import viteSvgIcons from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    return defineConfig({
        base: './',
        server: {
            host: '0.0.0.0',
        },
        resolve: {
            alias: [
                { find: '@', replacement: '/src' },
            ],
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
