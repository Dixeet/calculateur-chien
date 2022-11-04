export default {
  '*.{ts,vue}': ['npx eslint', () => 'npx vue-tsc --skipLibCheck --noEmit'],
  '*.{js,mjs,cjs}': 'npx eslint',
};
