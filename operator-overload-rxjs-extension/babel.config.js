module.exports = function (api) {
  api.cache(true);

  const presets = [];
  const plugins = [
    // [
    //   "@babel/plugin-transform-react-jsx",
    //   {
    //     "pragma": "createElement",
    //     "pragmaFrag": "'fragment'"
    //   }
    // ],
    'module:operator-overload-babel-plugin',
  ];

  return {
    presets,
    plugins
  };
}