import jwt from 'jsonwebtoken';
import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';
import { config } from '../config/index.js';
import { Role } from '@prisma/client';

export class AuthService {
  constructor(private uow: UnitOfWork) {}

  async loginLocal(email: string) {
    const user = await this.uow.users.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, entraId: user.entraId },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return { token, user };
  }

  async loginEntra(idToken: string, accessToken: string) {
    // Decode claims from Entra ID JWT
    const decoded: any = jwt.decode(idToken);
    const email = decoded?.preferred_username || decoded?.email || 'entra_user@ntms.com';
    const name = decoded?.name || 'Microsoft Entra User';
    const oid = decoded?.oid || decoded?.sub || 'entra-oid-' + Date.now();

    let user = await this.uow.users.findByEntraId(oid);
    if (!user) {
      user = await this.uow.users.findByEmail(email);
      if (user) {
        user = await this.uow.users.update(user.id, { entraId: oid });
      } else {
        user = await this.uow.users.create({
          email,
          name,
          role: Role.CANDIDATE,
          entraId: oid,
        });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, entraId: user.entraId },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return { token, user };
  }
}
