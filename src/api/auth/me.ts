import { Context } from 'koa';

export default async function me(ctx: Context) {
  ctx.body = ctx.state.admin_id;
}
