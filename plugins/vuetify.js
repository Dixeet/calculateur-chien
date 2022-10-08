import { createVuetify } from 'vuetify';
import { aliases, fa } from 'vuetify/iconsets/fa';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    display: {
      mobileBreakpoint: 'md',
    },
    icons: {
      defaultSet: 'fa',
      aliases,
      sets: {
        fa,
      },
    },
    theme: {
      defaultTheme: 'customDark',
      variations: {
        colors: ['primary', 'secondary'],
        lighten: 2,
        darken: 2,
      },
      themes: {
        customDark: {
          dark: true,
          colors: {
            primary: '#ffb865',
            secondary: '#e0c1a3',
            background: '#1f1b16',
            surface: '#1f1b16',
            success: '#bdcd9d',
            warning: '#ffb4ab',
            error: '#ffb4ab',
            info: '#9d8e81',
          },
        },
        customLight: {
          dark: false,
          colors: {
            primary: '#7b5800',
            secondary: '#6c5c3f',
            background: '#fffbff',
            surface: '#fffbff',
            success: '#4c6545',
            warning: '#ba1a1a',
            error: '#ba1a1a',
            info: '#7f7667',
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
