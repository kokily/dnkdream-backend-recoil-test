import { Context } from 'koa';
import { getRepository } from 'typeorm';
import Joi from 'joi';
import { Question } from '../../entities/Question';
import { validateBody } from '../../libs/utils';

export default async function confirmQuestion(ctx: Context) {
  type Param = {
    id: string;
  };

  type RequestType = {
    confirm: boolean;
  };

  const { id }: Param = ctx.params;

  const schema = Joi.object().keys({
    confirm: Joi.boolean().required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { confirm }: RequestType = ctx.request.body;

  try {
    await getRepository(Question).update(
      { id },
      { isConfirm: confirm, updated_at: new Date() }
    );
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
