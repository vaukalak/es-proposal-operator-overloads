module.exports = function (api) {
  api.cache(true);

  const presets = [];
  const plugins = [
    './plugin.js',
  ];

  return {
    presets,
    plugins
  };
}