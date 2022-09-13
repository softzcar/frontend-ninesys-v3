export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',

  // Should hold all env variables that are public as these will be exposed on the frontend.
  publicRuntimeConfig: {
    LOCAL_IP: `https://apitmp.nineteengreen.com`,
    LOCAL_IP_WOO: `https://api2.nineteengreen.com`,
    API: `https://api2.nineteengreen.com`,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ninesys',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // CSS file in the project
    '@/assets/css/main.css',
    // quilli
    'quill/dist/quill.core.css',
    // for snow theme
    'quill/dist/quill.snow.css',
    // for bubble theme
    'quill/dist/quill.bubble.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // Alerts
    '~/plugins/alerts.js',
    '~/plugins/wizard.js',
    '~/plugins/typehead.js',
    '~/plugins/loading-twa.js',
    '~/mixins/mixins.js',
    { src: '~plugins/nuxt-quill-plugin', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',

    // https://go.nuxtjs.dev/axios
    // '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  bootstrapVue: {
    icons: true,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  // axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'es',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // vendor: ['axios'],
  },

  // Mode: This option lets you define the development or production mode of Nuxt (important when you use Nuxt programmatically)
  dev: process.env.NODE_ENV !== 'development',
}
