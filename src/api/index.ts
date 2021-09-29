import Router from 'koa-router';
import auth from './auth';
import notices from './notices';
import questions from './questions';
import upload from './upload';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/notices', notices.routes());
api.use('/questions', questions.routes());
api.use('/upload', upload.routes());

export default api;
