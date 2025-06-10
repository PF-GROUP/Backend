
import { UserRole } from "./enum";


export interface UserDTO {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  password?: string;
  rol: UserRole;
}

export interface CreateUserDTO {
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  rol: UserRole;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}