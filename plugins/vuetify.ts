import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, fa } from 'vuetify/iconsets/fa';
import { defineNuxtPlugin } from '#imports';

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
        colors: ['primary', 'secondary', 'background', 'surface'],
        lighten: 2,
        darken: 2,
      },
      themes: {
        customDark: {
          dark: true,
          colors: {
            primary: '#eabd78',
            secondary: '#e0c1a3',
            background: '#251e13',
            surface: '#2D2718',
            success: '#bdcd9d',
            warning: '#ffb4ab',
            error: '#bd4138',
            info: '#9d8e81',
          },
        },
        customLight: {
          dark: false,
          colors: {
            primary: '#8a6d4a',
            secondary: '#b19e77',
            background: '#f7f0df',
            surface: '#f9f5eb',
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
