import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Notice } from '../../entities/Notice';

export default async function listNotices(ctx: Context) {
  type QueryType = {
    page?: string;
    title?: string;
    tag?: string;
  };

  const { page, title, tag }: QueryType = ctx.query;
  const currentPage = parseInt(page || '1', 10);

  if (currentPage < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const query = await getManager()
      .createQueryBuilder(Notice, 'notices')
      .take(20)
      .skip((currentPage - 1) * 20)
      .orderBy('notices.created_at', 'DESC')
      .addOrderBy('notices.id', 'DESC');

    if (title) {
      query.andWhere('notices.title like :title', {
        title: `%${title}%`,
      });
    }

    if (tag) {
      query.andWhere(":tag = ANY (string_to_array(notices.tags, ','))", {
        tag,
      });
    }

    const notices = await query.getMany();

    ctx.body = notices;
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
