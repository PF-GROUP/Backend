


export interface JwtPayload {
  id: string;
  email: string;
  isAdmin: boolean;
  agencyId?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}
