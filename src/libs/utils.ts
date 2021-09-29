import Joi, { SchemaLike } from 'joi';
import { Context } from 'koa';

export function validateBody(ctx: Context, schema: SchemaLike) {
  const validation = Joi.valid(ctx.request.body, schema);

  if (Joi.isError(validation)) {
    ctx.status = 400;
    ctx.body = {
      name: 'WRONG_SCHEMA',
      payload: validation.error,
    };

    return false;
  }

  return true;
}
