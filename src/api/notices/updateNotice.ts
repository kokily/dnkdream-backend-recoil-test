import Joi from 'joi';
import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Notice } from '../../entities/Notice';
import { cleanAllNulls, validateBody } from '../../libs/utils';

export default async function updateNotice(ctx: Context) {
  type Param = {
    id: string;
  };

  type RequestType = {
    title?: string;
    body?: string;
    thumbnail?: string;
    tags?: string[];
  };

  const { id }: Param = ctx.params;

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    thumbnail: Joi.string(),
    tags: Joi.array().items(Joi.string()).required(),
  });

  if (!validateBody(ctx, schema)) return;

  const notNull: RequestType = cleanAllNulls(ctx.request.body);

  try {
    await getRepository(Notice).update(
      { id },
      { ...notNull, updated_at: new Date() }
    );

    const notice = await getRepository(Notice).findOne(id);

    if (!notice) {
      ctx.status = 500;
      ctx.body = {
        name: 'UnknownError',
      };

      return;
    }

    ctx.body = notice;
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
