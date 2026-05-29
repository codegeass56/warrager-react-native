const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const reactNativePlugin = require("eslint-plugin-react-native");
const reactHooksPlugin = require("eslint-plugin-react-hooks");

module.exports = defineConfig([
  expoConfig, // Flatten the array if it's exported as one
  {
    plugins: {
      "react-native": reactNativePlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      // Highlight unused StyleSheet styles
      "react-native/no-unused-styles": "warn",

      // Ensure missing useEffect dependencies are flagged
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    ignores: ["dist/*", ".expo/*", "node_modules/*"],
  },
]);
