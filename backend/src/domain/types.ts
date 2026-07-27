import { Role } from '@prisma/client';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
  entraId?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
