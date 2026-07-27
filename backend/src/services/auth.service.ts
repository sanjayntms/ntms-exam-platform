import jwt from 'jsonwebtoken';
import { UnitOfWork } from '../infrastructure/repositories/unitOfWork.js';
import { config } from '../config/index.js';
import { Role } from '../domain/types.js';

export class AuthService {
  constructor(private uow: UnitOfWork) {}

  async getUserById(id: string) {
    return this.uow.users.findById(id);
  }

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
    let email = '';
    let name = '';
    let oid = '';

    // If authorization code is provided, exchange code with Microsoft token endpoint
    if (code) {
      const tokenEndpoint = `https://login.microsoftonline.com/${config.azure.tenantId}/oauth2/v2.0/token`;
      const params = new URLSearchParams({
        client_id: config.azure.clientId,
        client_secret: config.azure.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri || 'https://exam.ntmscloud.in/login',
      });

      const tokenRes = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      const tokenData: any = await tokenRes.json();
      console.log('Microsoft Entra Token Exchange Response:', tokenData);

      if (tokenData.error || (!tokenData.id_token && !tokenData.access_token)) {
        throw new Error(`Microsoft Entra ID Authentication Failed: ${tokenData.error_description || tokenData.error || 'Token exchange failed'}`);
      }

      // 1. Try decoding ID Token claims
      if (tokenData.id_token) {
        const decoded: any = jwt.decode(tokenData.id_token);
        email = decoded?.preferred_username || decoded?.email || decoded?.upn || '';
        name = decoded?.name || decoded?.given_name || (email.includes('@') ? email.split('@')[0] : '');
        oid = decoded?.oid || decoded?.sub || '';
      }

      // 2. Fetch official profile details directly from Microsoft Graph API using Access Token
      if (tokenData.access_token) {
        try {
          const graphRes = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
          });
          if (graphRes.ok) {
            const graphData: any = await graphRes.json();
            if (graphData.displayName) name = graphData.displayName;
            if (graphData.userPrincipalName || graphData.mail) {
              email = graphData.userPrincipalName || graphData.mail;
            }
            if (graphData.id) oid = graphData.id;
          }
        } catch (graphErr) {
          console.error('Microsoft Graph fetch error:', graphErr);
        }
      }
    } else if (idToken) {
      const decoded: any = jwt.decode(idToken);
      email = decoded?.preferred_username || decoded?.email || decoded?.upn || '';
      name = decoded?.name || decoded?.given_name || (email.includes('@') ? email.split('@')[0] : '');
      oid = decoded?.oid || decoded?.sub || '';
    }

    if (!email || !oid) {
      throw new Error('Could not extract candidate email or Entra ID claims from Microsoft token response.');
    }

    if (!name) {
      name = email.split('@')[0];
    }

    let user = await this.uow.users.findByEntraId(oid);
    if (!user) {
      user = await this.uow.users.findByEmail(email);
      if (user) {
        user = await this.uow.users.update(user.id, {
          entraId: oid,
          name,
          email,
        });
      } else {
        user = await this.uow.users.create({
          email,
          name,
          role: Role.CANDIDATE,
          entraId: oid,
        });
      }
    } else {
      // Always update name & email when authenticating with Entra ID
      user = await this.uow.users.update(user.id, { name, email });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, entraId: user.entraId },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    );

    return { token, user };
  }
}
