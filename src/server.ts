import 'dotenv/config';
import { createConnection, ConnectionOptions } from 'typeorm';
import https from 'https';
import http from 'http';
import fs from 'fs';
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

    const configurations = {
      production: { ssl: true, port: 443, hostname: 'api.dnkdream.com' },
      development: { ssl: false, port: 4000, hostname: 'localhost' },
    };
    const environment = process.env.NODE_ENV || 'production';
    const config = configurations[environment];

    let server;

    if (config.ssl) {
      server = https.createServer(
        {
          key: fs.readFileSync(`${process.env.SSL_KEY}`),
          cert: fs.readFileSync(`${process.env.SSL_CERT}`),
        },
        app.callback()
      );
    } else {
      server = http.createServer(app.callback());
    }

    server.listen(config.port, () => {
      console.log(
        `> D&K Dream API on http${config.ssl ? 's' : ''}://${config.hostname}:${
          config.port
        }`
      );
    });
  } catch (err) {
    console.log(err);
  }
};
_bootStrap();
