import { Context } from 'koa';
import { getManager } from 'typeorm';
import Joi from 'joi';
import { Admin } from '../../entities/Admin';
import { setCookie } from '../../libs/tokens';
import { validateBody } from '../../libs/utils';

export default async function login(ctx: Context) {
  type RequestType = {
    password: string;
  };

  const schema = Joi.object().keys({
    password: Joi.string().min(4).required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { password }: RequestType = ctx.request.body;

  try {
    const admin = await getManager()
      .createQueryBuilder(Admin, 'admin')
      .getOne();

    if (!admin) {
      ctx.status = 404;
      ctx.body = {
        name: 'ADMIN_NOT_CREATED',
      };

      return;
    }

    const valid = await admin.validPassword(password);

    if (!valid) {
      ctx.status = 401;
      ctx.body = {
        name: 'WRONG_PASSWORD',
      };

      return;
    }

    const tokens = await admin.createToken();

    setCookie(ctx, tokens);

    ctx.body = admin.id;
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
