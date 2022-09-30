import { createVuetify } from 'vuetify'


export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark'
    }
  })

  // nuxtApp.vueApp.config.compilerOptions.isCustomElement = (tag) => {
  //   return tag === 'NuxtPage';
  // }
  nuxtApp.vueApp.use(vuetify)
})