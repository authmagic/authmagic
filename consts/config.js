module.exports = {
	duration: process.env.DURATION || 5*60,
	key: process.env.KEY || 'aDXvWQZeq2tcBuCv',
	expiresIn: process.env.EXPIRES_IN || 20*60,
	pluginName: process.env.PLUGIN_NAME || 'authmagic-email',
	checkUrl: process.env.CHECK_URL || '/check.html?z=${z}',
};