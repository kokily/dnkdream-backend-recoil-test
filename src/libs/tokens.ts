import jwt, { SignOptions } from 'jsonwebtoken';
import { Context } from 'koa';

export type TokenType = {
  iat: number;
  exp: number;
  sub: string;
  iss: string;
};

export type AccessTokenType = {
  admin_id: string;
} & TokenType;

export type RefreshTokenType = {
  admin_id: string;
  token_id: string;
} & TokenType;

export const generateToken = async (
  payload: any,
  options?: SignOptions
): Promise<string> => {
  const secretKey = process.env.TOKEN_SECRET!;
  const jwtOptions: SignOptions = {
    issuer: 'dnkdream.com',
    expiresIn: '15d',
    ...options,
  };

  if (!jwtOptions.expiresIn) {
    delete jwtOptions.expiresIn;
  }

  return new Promise((resolve, reject) => {
    if (!secretKey) return;

    jwt.sign(payload, secretKey, jwtOptions, (err, token) => {
      if (err || token === undefined) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

export const decodeToken = async <T = any>(token: string): Promise<T> => {
  const secretKey = process.env.TOKEN_SECRET!;

  return new Promise((resolve, reject) => {
    if (!secretKey) return;

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) reject(err);

      resolve(decoded as any);
    });
  });
};

export const setCookie = (
  ctx: Context,
  tokens?: { accessToken: string; refreshToken: string }
) => {
  if (tokens) {
    ctx.cookies.set('access_token', tokens.accessToken, {
      httpOnly: tokens.accessToken ? true : undefined,
      domain:
        process.env.NODE_ENV === 'production' ? '.dnkdream.com' : undefined,
      secure: process.env.NODE_ENV === 'production' && true,
      sameSite: 'lax',
      maxAge: tokens.accessToken ? 1000 * 60 * 60 : undefined,
    });

    ctx.cookies.set('refresh_token', tokens.refreshToken, {
      httpOnly: tokens.refreshToken ? true : undefined,
      domain:
        process.env.NODE_ENV === 'production' ? '.dnkdream.com' : undefined,
      secure: process.env.NODE_ENV === 'production' && true,
      sameSite: 'lax',
      maxAge: tokens.refreshToken ? 1000 * 60 * 60 * 24 * 30 : undefined,
    });
  } else {
    ctx.cookies.set('access_token');
    ctx.cookies.set('refresh_token');
  }
};
