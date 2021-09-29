import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Question } from '../../entities/Question';

export default async function listQuestions(ctx: Context) {
  type QueryType = {
    page?: string;
    title?: string;
    confirm?: boolean;
    name?: string;
    email?: string;
  };

  const { page, title, confirm, name, email }: QueryType = ctx.query;
  const currentPage = parseInt(page || '1', 10);

  if (currentPage < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const query = await getManager()
      .createQueryBuilder(Question, 'questions')
      .take(10)
      .skip((currentPage - 1) * 10)
      .orderBy('questions.created_at', 'DESC')
      .addOrderBy('questions.id', 'DESC');

    if (title) {
      query.andWhere('questions.title like :title', {
        title: `%${title}%`,
      });
    }

    if (confirm) {
      query.andWhere('questions.isConfirm = :confirm', {
        confirm,
      });
    }

    if (name) {
      query.andWhere('questions.name like :name', {
        name: `%${name}%`,
      });
    }

    if (email) {
      query.andWhere('questions.email like :email', {
        email: `%${email}%`,
      });
    }

    const questions = await query.getMany();
    const questionCount = await query.getCount();

    ctx.body = {
      questions,
      lastPage: Math.ceil(questionCount / 10),
    };
  } catch (err) {
    if (err instanceof Error) {
      ctx.throw(500, err);
    }
  }
}
