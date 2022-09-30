// https://v3.nuxtjs.org/api/configuration/nuxt.config
import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  css: [
    'vuetify/lib/styles/main.sass',
    'mdi/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => {
            return tag == 'NuxtPage';
          }
        }
      }
    }
  },
  modules: [
    async (options, nuxt) => {
      // @ts-ignore
      nuxt.hooks.hook('vite:extendConfig', config => config.plugins.push(
        vuetify()
      ));
    }
  ],
})
