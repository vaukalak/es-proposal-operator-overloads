module.exports = function (api) {
  api.cache(true);

  const presets = [];
  const plugins = [
    'module:operator-overload-babel-plugin',
  ];

  return {
    presets,
    plugins
  };
}