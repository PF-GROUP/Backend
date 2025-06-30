import { Role } from "src/Enum/roles.enum";



export interface JwtPayload {
  id: string;
  email: string;
  agencyId?: string;
  roles?: Role[];
  iat?: number;
  exp?: number;
  profilePictureUrl?: string;
}
