const {resolve} = require('path');
const authmagicParams = require(resolve('./authmagic.js'));
const baseConfig = {
	port: 3000,
	isProxy: true,
};

if(authmagicParams) {
  module.exports = Object.assign({}, baseConfig, authmagicParams);
} else {
  module.exports = baseConfig;
}
