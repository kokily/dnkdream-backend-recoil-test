import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Question } from '../../entities/Question';

export default async function readQuestion(ctx: Context) {
  type Param = {
    id: string;
  };

  const { id }: Param = ctx.params;

  try {
    const question = await getRepository(Question).findOne(id);

    if (!question) {
      ctx.status = 404;
      ctx.body = {
        name: 'NotFoundContent',
      };

      return;
    }

    ctx.body = question;
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
