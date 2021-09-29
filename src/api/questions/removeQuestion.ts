import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Question } from '../../entities/Question';

export default async function removeQuestion(ctx: Context) {
  type Param = {
    id: string;
  };

  const { id }: Param = ctx.params;

  try {
    await getRepository(Question).delete(id);

    ctx.status = 204;
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
