import { defineConfig } from 'vite'
import vueRouter from 'unplugin-vue-router/vite'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [
    vueRouter({
      routesFolder: 'src/pages',
      extensions: ['.vue'],
    }),
    autoImport({
      imports: [
        'vue',
        'pinia',
        VueRouterAutoImports,
        {
          '@entities/map/model/mapStore': ['useMapStore'],
          '@entities/user/model/userStore': ['useUserStore'],
          '@features/lang-switcher/model/langStore': ['useLangStore'],
          '@shared/lib/uiStore': ['useUiStore'],
        }
      ],
      dts: 'src/auto-imports.d.ts',
    }),
    components({
      dirs: ['src/shared/ui', 'src/features', 'src/widgets', 'src/entities', 'src/shared/loaders'],
      extensions: ['vue'],
      deep: true,
      dts: 'src/components.d.ts',
    }),
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
})