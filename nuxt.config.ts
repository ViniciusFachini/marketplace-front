// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['./assets/css/reset.css'],

  components: [
    {
      path: './components',
      pathPrefix: false,
    },
  ],

  plugins: [
    '~/plugins/auth.js',
    '~/plugins/api.js'
  ],

  modules: [
    '@sidebase/nuxt-session',
    'nuxt-icons',
    'vue3-carousel-nuxt',
    '@pinia/nuxt'
  ],
  
  session: {
    isEnabled: true,
    session: {
      expiryInSeconds: 3600,
    }
  }
})