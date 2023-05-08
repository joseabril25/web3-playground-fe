module.exports = {
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false,
      path: false,
      http: false,
      https: false,
      stream: false,
      "crypto": false,
      "os": false
     };
    return config;
  },
  env: {
    NEXT_ETHERSCANAPI_KEY: process.env.NEXT_ETHERSCANAPI_KEY,
  },
}
