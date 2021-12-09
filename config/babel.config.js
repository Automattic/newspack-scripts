module.exports = api => {
  api.cache(true);
  return {
    presets: [
      "@automattic/calypso-build/babel/default",
      "@automattic/calypso-build/babel/wordpress-element"
    ]
  };
};
