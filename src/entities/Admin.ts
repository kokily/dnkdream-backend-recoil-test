import {
  BaseEntity,
  Column,
  Entity,
  getRepository,
  PrimaryGeneratedColumn,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import { Token } from './Token';
import { generateToken } from '../libs/tokens';

@Entity()
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  password!: string;

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async setPassword(password: string): Promise<void> {
    this.password = await this.hashPassword(password);
  }

  async validPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  async createToken() {
    const token = new Token();

    token.fk_admin_id = this.id;

    await getRepository(Token).save(token);

    const accessToken = await generateToken(
      { admin_id: this.id },
      { subject: 'access_token', expiresIn: '1h' }
    );

    const refreshToken = await generateToken(
      { admin_id: this.id, token_id: token.id },
      { subject: 'refresh_token', expiresIn: '1h' }
    );

    return { accessToken, refreshToken };
  }

  async refreshAdminToken(
    tokenId: string,
    refreshTokenExp: number,
    prevRefreshToken: string
  ) {
    const now = new Date().getTime();
    const diff = refreshTokenExp * 1000 - now;

    let refreshToken = prevRefreshToken;

    if (diff < 1000 * 60 * 60 * 24 * 15) {
      refreshToken = await generateToken(
        { admin_id: this.id, token_id: tokenId },
        {
          subject: 'refresh_token',
          expiresIn: '30d',
        }
      );
    }

    const accessToken = await generateToken(
      {
        admin_id: this.id,
      },
      { subject: 'access_token', expiresIn: '1h' }
    );

    return { accessToken, refreshToken };
  }
}
