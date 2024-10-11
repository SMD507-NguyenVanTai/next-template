import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    API_TIMEOUT: process.env.API_TIMEOUT,
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/manage-account',
  //       permanent: true,
  //     },
  //   ];
  // },
  // images: {
  //   domains: ['picsum.photos'],
  // },
};

export default withNextIntl(nextConfig);
