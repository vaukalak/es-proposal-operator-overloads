module.exports = function (api) {
  api.cache(true);

  const presets = [];
  const plugins = [
    './plugin.js',
    // "@babel/plugin-transform-modules-commonjs",
  ];

  return {
    presets,
    plugins
  };
}