import Router from 'koa-router';
import authorize from '../../libs/middlewares/authorize';
import addQuestion from './addQuestion';
import confirmQuestion from './confirmQuestion';
import listQuestions from './listQuestions';
import readQuestion from './readQuestion';
import removeQuestion from './removeQuestion';

const questions = new Router();

questions.post('/', addQuestion);
questions.get('/', authorize, listQuestions);
questions.get('/:id', authorize, readQuestion);
questions.delete('/:id', authorize, removeQuestion);
questions.patch('/:id', authorize, confirmQuestion);

export default questions;
