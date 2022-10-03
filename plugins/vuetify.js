import { createVuetify } from 'vuetify';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    display: {
      mobileBreakpoint: 'md',
    },
    theme: {
      defaultTheme: 'custom',
      variations: {
        colors: ['primary', 'secondary'],
        lighten: 2,
        darken: 2,
      },
      themes: {
        custom: {
          dark: true,
          colors: {
            background: '#1f1b16',
            surface: '#1f1b16',
            primary: '#ffb865',
            secondary: '#e0c1a3',
            error: '#ffb4ab',
            info: '#9d8e81',
            success: '#bdcd9d',
            warning: '#ffb4ab',
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
