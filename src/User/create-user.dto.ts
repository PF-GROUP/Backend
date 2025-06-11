import { UserRole } from "src/Interface/enum";

export class CreateUserDto {

      id: number;
      name: string;
      surname: string;
      email: string;
      phone: string;
      password?: string;
      rol: UserRole;
}
