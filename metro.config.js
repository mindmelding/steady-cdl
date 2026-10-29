const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// content.db ships as an asset; wasm is needed by expo-sqlite on web (dev screenshots only).
config.resolver.assetExts.push('db', 'wasm');

// expo-sqlite on web needs SharedArrayBuffer, which needs cross-origin isolation.
config.server = config.server || {};
config.server.enhanceMiddleware = (middleware) => (req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  middleware(req, res, next);
};
module.exports = config;
