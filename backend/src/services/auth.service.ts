import jwt from 'jsonwebtoken';
import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';
import { config } from '../config/index.js';
import { Role } from '../domain/types.js';

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
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    );

    return { token, user };
  }

  async loginEntra(idToken?: string, accessToken?: string, code?: string, redirectUri?: string) {
    let email = 'entra_user@ntms.com';
    let name = 'Microsoft Entra User';
    let oid = 'entra-oid-' + Date.now();

    // If authorization code is provided, exchange code with Microsoft token endpoint
    if (code) {
      try {
        const tokenEndpoint = `https://login.microsoftonline.com/${config.azure.tenantId}/oauth2/v2.0/token`;
        const params = new URLSearchParams({
          client_id: config.azure.clientId,
          client_secret: config.azure.clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri || 'http://40.81.226.111:3000/login',
        });

        const tokenRes = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        });

        const tokenData: any = await tokenRes.json();
        if (tokenData.id_token) {
          const decoded: any = jwt.decode(tokenData.id_token);
          email = decoded?.preferred_username || decoded?.email || email;
          name = decoded?.name || name;
          oid = decoded?.oid || decoded?.sub || oid;
        }
      } catch (err) {
        console.error('Entra token exchange error:', err);
      }
    } else if (idToken) {
      const decoded: any = jwt.decode(idToken);
      email = decoded?.preferred_username || decoded?.email || email;
      name = decoded?.name || name;
      oid = decoded?.oid || decoded?.sub || oid;
    }

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
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    );

    return { token, user };
  }
}
