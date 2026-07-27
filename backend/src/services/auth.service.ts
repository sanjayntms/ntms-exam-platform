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
          redirect_uri: redirectUri || 'https://40.81.226.111:3000/login',
        });

        const tokenRes = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        });

        const tokenData: any = await tokenRes.json();

        // 1. Try decoding ID Token claims
        if (tokenData.id_token) {
          const decoded: any = jwt.decode(tokenData.id_token);
          email = decoded?.preferred_username || decoded?.email || decoded?.upn || email;
          name = decoded?.name || decoded?.given_name || (email.includes('@') ? email.split('@')[0] : name);
          oid = decoded?.oid || decoded?.sub || oid;
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
      } catch (err) {
        console.error('Entra token exchange error:', err);
      }
    } else if (idToken) {
      const decoded: any = jwt.decode(idToken);
      email = decoded?.preferred_username || decoded?.email || decoded?.upn || email;
      name = decoded?.name || decoded?.given_name || (email.includes('@') ? email.split('@')[0] : name);
      oid = decoded?.oid || decoded?.sub || oid;
    }

    let user = await this.uow.users.findByEntraId(oid);
    if (!user) {
      user = await this.uow.users.findByEmail(email);
      if (user) {
        user = await this.uow.users.update(user.id, { entraId: oid, name, email });
      } else {
        user = await this.uow.users.create({
          email,
          name,
          role: Role.CANDIDATE,
          entraId: oid,
        });
      }
    } else {
      // Update name and email if changed in Entra ID
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
