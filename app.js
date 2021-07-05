const path = require('path');
const app = new (require('koa'))();
const router = require('koa-router')();
const koaStatic = require('koa-static');
const cors = require('@koa/cors');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const config = require('./consts/config');

const {
  port,
  isProxy,
  core: {
    name: coreName,
    isRateLimiterEnabled,
    rateLimiterBlockDurationSeconds: blockDuration,
    rateLimiterPoints: points,
    rateLimiterDuration: duration,
  },
  isUseCors,
  corsOptions,
} = config;

if (!coreName) {
  console.log('core is undefined');
  process.exit(-1);
}

app.proxy = isProxy;

const core = require(path.resolve(`./node_modules/${coreName}/core`));

if (isUseCors) {
  app.use(cors(corsOptions));
}

if (isRateLimiterEnabled) {
  const rateLimiter = new RateLimiterMemory({	points,	blockDuration, duration	});

  app.use(async (ctx, next) => {
    try {
      await rateLimiter.consume(ctx.ip);
      await next();
    } catch (rejRes) {
      ctx.status = 429;
      ctx.body = `Too Many Requests for ${ctx.ip}.`;
    }
  });
}

app.use(koaStatic('./static'));
app.use(koaStatic(`./static/${config.theme.name}`));
app.use(require('koa-bodyparser')());
app.use(require('koa-respond')());
app.use(core(router, config));
app.listen(port);
console.log(`authmagic is running on port ${port}`);
