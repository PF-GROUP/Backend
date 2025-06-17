

import { JwtPayload } from 'src/Interface/jwtpayload';

declare module 'express' {
  export interface Request {
    user?: JwtPayload & { roles?: string[] };
  }
}
