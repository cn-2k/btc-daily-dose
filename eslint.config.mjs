import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // your custom flat configs go here, for example:
  {
    // files: ['**/*.ts', '**/*.tsx', '**/*.vue', '**/*.jsx'],
    rules: {
      'no-console': 'off', // allow console.log in TypeScript files
      'vue/multi-word-component-names': 'off',
    },
  },
  // {
  //   ...
  // }
)
