/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Если вы планируете деплой на Vercel или подобные платформы,
  // следующие опции могут быть полезны
  images: {
    domains: [], // Добавьте домены, с которых будут загружаться изображения
  },
  // Если вы будете использовать i18n, можно настроить здесь
  // i18n: {
  //   locales: ['ru'],
  //   defaultLocale: 'ru',
  // },
}

module.exports = nextConfig