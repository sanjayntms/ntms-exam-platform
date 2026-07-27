import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  constructor(private authService: AuthService) {}

  async loginLocal(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await this.authService.loginLocal(email);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async loginEntra(req: Request, res: Response) {
    try {
      const { idToken, accessToken, code, redirectUri } = req.body;
      const result = await this.authService.loginEntra(idToken, accessToken, code, redirectUri);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async me(req: Request, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Unauthenticated' });
      }
      const freshUser = await this.authService.getUserById(req.user.id);
      return res.json({ user: freshUser || req.user });
    } catch (err: any) {
      return res.json({ user: req.user });
    }
  }
}
