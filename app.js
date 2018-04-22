const app = new (require('koa'))();
const router = require('koa-router')();
const NodeCache = require('node-cache');
const tokensCache = new NodeCache();
const truthCache = new NodeCache();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

app.use(require('koa-static')('./static'));
app.use(require('koa-bodyparser')());
app.use(require('koa-respond')());
router.post('/key', createKey)
  .get('/key/verify/:z', verifyAndGetToken)
  .get('/token/:zp', getToken)
  .get('/token/status/:token', getTokenStatus);
app.use(router.routes());

const d = 5 * 60;
const key = 'aDXvWQZeq2tcBuCv';
const expiresIn = 20 * 60;

function encrypt(text){
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  const encrypted = cipher.update(text);
  const finalBuffer = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + finalBuffer.toString('hex');
}
 
function decrypt(text){
  const encryptedArray = text.split(':');
  const iv = new Buffer(encryptedArray[0], 'hex');
  const encrypted = new Buffer(encryptedArray[1], 'hex');
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  const decrypted = decipher.update(encrypted);
  return Buffer.concat([decrypted, decipher.final()]).toString();
}

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

	const token = jwt.sign({u: user, p: params}, key, {expiresIn});
	const zp = encrypt(z);
	tokensCache.set(z, token, d);
	console.log({zp, z});
	ctx.ok({zp});
}

async function verifyAndGetToken(ctx) {
	console.log('verifyAndGetToken');
	const z = ctx.params.z;
	// TODO check how library works, get operation might be blocking
	const token = tokensCache.get(z);
	if(token) {
		ctx.ok({token});
		truthCache.set(z, true, d);
		console.log({z});
	} else {
		ctx.send(403);
	}
}

async function getToken(ctx) {
	const zp = ctx.params.zp;
	const z = decrypt(zp);
	if(truthCache.get(z)) {
		const token = tokensCache.get(z);
		ctx.ok({token});
		truthCache.del(z);
		tokensCache.del(z);
	} else {
		ctx.forbidden();
	}
}

async function getTokenStatus(ctx) {
	const token = ctx.params.token;
	jwt.verify(token, key, function(err, decoded) {
	  if (err) {
	  	ctx.forbidden();
	  } else {
	  	ctx.ok();
	  }
	});
}

app.listen(3000);

console.log('listening on port 3000');