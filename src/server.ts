import 'dotenv/config';
import { createConnection, ConnectionOptions } from 'typeorm';
import http from 'http';
import app from './app';
import entities from './entities';

const Options: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  synchronize: false,
  logging: false,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities,
};

const _bootStrap = async () => {
  try {
    await createConnection(Options);

    let server = http.createServer(app.callback());

    server.listen(4000, () => {
      console.log('> Dev server 4000 port');
    });
  } catch (err) {
    console.log(err);
  }
};
_bootStrap();
