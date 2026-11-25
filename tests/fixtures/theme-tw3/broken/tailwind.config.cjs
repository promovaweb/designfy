/** A valid CommonJS config that cannot load its plugin. */
module.exports = { plugins: [require("designfy-test-missing-plugin")] };
