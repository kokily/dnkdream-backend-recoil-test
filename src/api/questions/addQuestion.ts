import { Context } from 'koa';
import { getRepository } from 'typeorm';
import Joi from 'joi';
import { Question } from '../../entities/Question';
import { validateBody } from '../../libs/utils';

export default async function addQuestion(ctx: Context) {
  type RequestType = {
    title: string;
    body: string;
    name: string;
    email: string;
    phone?: string;
  };

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string(),
  });

  if (!validateBody(ctx, schema)) return;

  const { title, body, name, email, phone }: RequestType = ctx.request.body;

  try {
    const questionRepo = await getRepository(Question);
    const question = new Question();

    question.title = title;
    question.body = body;
    question.name = name;
    question.email = email;
    question.phone = phone ? phone : null;

    await questionRepo.save(question);

    ctx.body = question;
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
