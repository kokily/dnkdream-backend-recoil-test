import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Notice } from '../../entities/Notice';

export default async function readNotice(ctx: Context) {
  type Param = {
    id: string;
  };

  const { id }: Param = ctx.params;

  try {
    const notice = await getRepository(Notice).findOne(id);

    if (!notice) {
      ctx.status = 404;
      ctx.body = {
        name: 'NotFoundContent',
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
