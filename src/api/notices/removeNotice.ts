import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Notice } from '../../entities/Notice';

export default async function removeNotice(ctx: Context) {
  type Param = {
    id: string;
  };

  const { id }: Param = ctx.params;

  try {
    await getRepository(Notice).delete(id);

    ctx.status = 204;
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
