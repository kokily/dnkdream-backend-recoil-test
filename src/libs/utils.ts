import Joi, { SchemaLike } from 'joi';
import { Context } from 'koa';
import aws from 'aws-sdk';
import fs from 'fs';
import moment from 'moment';

// Validate Schema
export function validateBody(ctx: Context, schema: SchemaLike) {
  const validation = Joi.valid(ctx.request.body, schema);

  if (Joi.isError(validation)) {
    ctx.status = 400;
    ctx.body = {
      name: 'WRONG_SCHEMA',
      payload: validation.error,
    };

    return false;
  }

  return true;
}

// Upload Image
export type FileType = {
  name: string;
  path: string;
  type: string;
};

export type S3ReturnType = {
  key: string;
  url: string;
};

export const uploadImage = async (file: FileType): Promise<S3ReturnType> => {
  aws.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });

  const s3 = new aws.S3({
    apiVersion: '2006-03-01',
  });

  return new Promise((resolve, reject) => {
    const Body = fs.createReadStream(file.path);

    Body.on('error', function (err) {
      reject(err);
    });

    s3.upload(
      {
        Bucket: 'image.dnkdream.com',
        Body,
        Key: `${moment().format('YYMMDD_HHmmss')}_${file.name.trim()}`,
        ContentType: file.type,
      },
      (err: Error, data: aws.S3.ManagedUpload.SendData) => {
        if (err) {
          reject(err);
        } else if (data) {
          resolve({
            key: data.Key,
            url: data.Location,
          });
        }
      }
    );
  });
};

// Clean args not null
export function cleanAllNulls(args: object): object {
  const notNull = {};

  Object.keys(args).forEach((key) => {
    if (args[key] !== null) {
      notNull[key] = args[key];
    }
  });

  return notNull;
}
