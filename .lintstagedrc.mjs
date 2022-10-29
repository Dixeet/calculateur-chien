export default {
  '*.{ts,vue}': [() => 'npx vue-tsc --skipLibCheck --noEmit', 'npx eslint'],
  '*.{js,mjs,cjs}': 'npx eslint',
};
