import Router from 'koa-router';
import authorize from '../../libs/middlewares/authorize';
import addNotice from './addNotice';
import listNotices from './listNotices';
import readNotice from './readNotice';
import removeNotice from './removeNotice';
import updateNotice from './updateNotice';

const notices = new Router();

notices.post('/', authorize, addNotice);
notices.get('/', listNotices);
notices.get('/:id', readNotice);
notices.delete('/:id', authorize, removeNotice);
notices.patch('/:id', authorize, updateNotice);

export default notices;
