const withPWA = require('next-pwa')

module.exports = withPWA({
  images: {
    domains: ['storage.googleapis.com', 'i1.sndcdn.com']
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
})