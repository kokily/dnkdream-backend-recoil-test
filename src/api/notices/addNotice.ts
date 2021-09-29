import { Context } from 'koa';
import { getRepository } from 'typeorm';
import Joi from 'joi';
import { Notice } from '../../entities/Notice';
import { Tag } from '../../entities/Tag';
import { validateBody } from '../../libs/utils';

export default async function addNotice(ctx: Context) {
  type RequestType = {
    title: string;
    body: string;
    thumbnail?: string;
    tags: string[];
  };

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    thumbnail: Joi.string(),
    tags: Joi.array().items(Joi.string()).required(),
  });

  if (!validateBody(ctx, schema)) return;

  const { title, body, thumbnail, tags }: RequestType = ctx.request.body;

  try {
    if (!tags || tags.length < 1) {
      ctx.status = 400;
      ctx.body = {
        name: 'TagsNotInput',
      };

      return;
    }

    tags.map(async (tag) => {
      const exist = await getRepository(Tag).findOne({ name: tag });

      if (exist) {
        await getRepository(Tag).update(
          { id: exist.id },
          { count: exist.count + 1 }
        );
      } else {
        const tagRepo = await getRepository(Tag);
        const newTag = new Tag();

        newTag.name = tag;

        await tagRepo.save(newTag);
      }
    });

    const noticeRepo = await getRepository(Notice);
    const notice = new Notice();

    notice.title = title;
    notice.body = body;
    notice.thumbnail = thumbnail ? thumbnail : null;
    notice.tags = tags;

    await noticeRepo.save(notice);

    ctx.body = notice;
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
