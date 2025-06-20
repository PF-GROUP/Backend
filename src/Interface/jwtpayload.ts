


export interface JwtPayload {
  id: number;
  email: string;
  isAdmin: boolean;
  agencyId?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}
