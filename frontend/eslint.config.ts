import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
    // 1. Игнорируемые файлы
    globalIgnores([
        '**/dist/**',
        '**/dist-ssr/**',
        '**/coverage/**',
        'auto-imports.d.ts',
        'components.d.ts',
        'typed-router.d.ts'
    ]),

    // 2. Базовые конфиги
    pluginVue.configs['flat/essential'],
    vueTsConfigs.recommended,

    // 3. Твои ПРАВИЛА (самый важный блок)
    {
        files: ['**/*.{ts,mts,tsx,vue}'],
        rules: {
            'vue/multi-word-component-names': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'no-unused-vars': 'off', // На всякий случай для чистого JS
        },
    },

    skipFormatting,
)