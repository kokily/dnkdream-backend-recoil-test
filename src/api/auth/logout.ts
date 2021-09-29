import { Context } from 'koa';
import { setCookie } from '../../libs/tokens';

export default async function logout(ctx: Context) {
  setCookie(ctx);
  ctx.state.admin_id = undefined;
  ctx.status = 204;
}
