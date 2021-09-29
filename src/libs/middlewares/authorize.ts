import { Middleware } from 'koa';

const authorize: Middleware = (ctx, next) => {
  if (!ctx.state.admin_id) {
    ctx.status = 401;
    ctx.body = {
      name: 'NOT_AUTHORIZED',
    };

    return;
  }

  return next();
};

export default authorize;
