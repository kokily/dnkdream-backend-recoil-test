import Router from 'koa-router';
import authorize from '../../libs/middlewares/authorize';
import login from './login';
import logout from './logout';
import me from './me';

const auth = new Router();

auth.post('/login', login);
auth.post('/logout', logout);
auth.get('/me', authorize, me);

export default auth;
