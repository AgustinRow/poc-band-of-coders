module.exports = {
  "extends": [
    "../../node_modules/@project/config-eslint/.eslintrc.json"
  ],
  "ignorePatterns": ["dist", "coverage", "/*.js", "/*.cjs"],
  "parserOptions": {
    "project": /\/apps\/api\/?$/.test(process.cwd()) ? "./tsconfig.json" : "./apps/api/tsconfig.json"
  }
}
