const { getDefaultConfig } = require("@expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot, {
  isTsconfigPathsEnabled: true,
});

config.watchFolders = [
  ...config.watchFolders,
  path.resolve(workspaceRoot, "node_modules"),
];

module.exports = withNativeWind(config);
