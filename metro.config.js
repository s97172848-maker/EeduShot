const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('@expo/metro-config/file-store');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Do not disable CSS support when using Tailwind.
  isCSSEnabled: true,
});

config.cacheStores = [
  new FileStore({
    root: '/path/to/custom/cache',
  }),
];

module.exports = config; 