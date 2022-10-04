// https://v3.nuxtjs.org/api/configuration/nuxt.config
import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  app: {
    head: {
      title: 'CalculaChien',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Divers calculateurs pour chien',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
      htmlAttrs: {
        lang: 'fr',
      },
    },
  },
  css: [
    'vuetify/lib/styles/main.sass',
    '@fortawesome/fontawesome-free/scss/fontawesome.scss',
    '@fortawesome/fontawesome-free/scss/regular.scss',
    '@fortawesome/fontawesome-free/scss/solid.scss',
    'assets/scss/style.scss',
  ],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  modules: [
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) =>
        // @ts-ignore
        config.plugins.push(vuetify()),
      );
    },
  ],
});
