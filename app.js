const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();

//app.use(require('koa-body'));
app.use(require('koa-static')('./static'));
router.post('/key', createKey)
  .get('/key/verify/:z', verifyAndGetToken)
  .get('/token/:zp', getToken)
  .get('/token/status/:token', getTokenStatus);
app.use(router.routes());

async function createKey(ctx) {
	const z = "rgfiudsp90-8yruewdiospkpfkdsl";
	ctx.body = JSON.stringify({z});
}

async function verifyAndGetToken(ctx) {
	const z = ctx.params.z;
	console.log(z);
	const token = "89yruihfodjphuebjdwfsiougyewdsaihoudpfiybuedsahocjkbd ";
	ctx.body = JSON.stringify({token});
}

async function getToken(ctx) {
	const zp = ctx.params.zp;
	console.log(zp);
	const token = "89yruihfodjphuebjdwfsiougyewdsaihoudpfiybuedsahocjkbd ";
	ctx.body = JSON.stringify({token});
}

async function getTokenStatus(ctx) {
	const token = ctx.params.token;
	console.log(token);
	ctx.status = 403;
}

app.listen(3000);

console.log('listening on port 3000');