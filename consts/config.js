const {resolve} = require('path');
const authmagicParams = require(resolve('./authmagic.js'));
const baseConfig = {
	duration: 10*60,
	key: 'xDXvWQZeq2tcBuCv',
	expiresIn: 18*60,
	port: 3000,
};

if(authmagicParams) {
  module.exports = Object.assign({}, baseConfig, authmagicParams);
} else {
  module.exports = baseConfig;
}