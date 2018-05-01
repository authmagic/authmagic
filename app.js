const path = require('path');
const app = new (require('koa'))();
const router = require('koa-router')();
const koaStatic = require('koa-static');
const config = require('./consts/config');
const {port, core: {name: coreName}} = config;
if(!coreName) {
	console.log('core is undefined');
	process.exit(-1);
}
const core = require(path.resolve(`./node_modules/${coreName}/core`));
app.use(koaStatic('./static'));
app.use(require('koa-bodyparser')());
app.use(require('koa-respond')());
app.use(core(router, config));
app.listen(port);
console.log(`AuthMagic is running on port ${port}`);