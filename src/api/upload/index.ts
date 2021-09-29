import { Context, Next } from 'koa';
import Router from 'koa-router';
import { uploadImage } from '../../libs/utils';

const upload = new Router();

upload.post('/', async (ctx: Context, next: Next) => {
  if (ctx.request.files) {
    const file = ctx.request.files.file;

    // @ts-ignore
    const { key, url } = await uploadImage(file);

    ctx.body = { key, url };
  } else {
    return next();
  }
});

export default upload;
