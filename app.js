const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
const crypto = require('crypto');

app.use(require('koa-static')('./static'));
app.use(require('koa-bodyparser')());
router.post('/key', createKey)
  .get('/key/verify/:z', verifyAndGetToken)
  .get('/token/:zp', getToken)
  .get('/token/status/:token', getTokenStatus);
app.use(router.routes());

const d = 5 * 60;

async function createKey(ctx) {
	const {user, params} = ctx.request.body;
	const timestamp = Math.floor(new Date().getTime()/1000);
	const i = Math.floor(timestamp/d);
	const mi = d*i;
	const mi1 = d*(i+1);
	const ni = d*i - d/2;
	const ni1 = d*(i+1) - d/2;
	let z = null;

	if(timestamp >= mi && ni1 > timestamp) {
		z = crypto.createHash('sha256').update(user + mi + mi1).digest('base64');
	} else if(timestamp >= ni1 && timestamp <= mi1) {
		z = crypto.createHash('sha256').update(user + ni + ni1).digest('base64');
	} else {
		console.log({mi, mi1, ni, ni1, timestamp});
		throw Error('undefined timestamp');
	}

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