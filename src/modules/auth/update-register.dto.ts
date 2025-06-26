import { PartialType } from '@nestjs/mapped-types';
import { CreateRegisterDto } from './create-register.dto';

export class UpdateRegisterDto extends PartialType(CreateRegisterDto) {}
export class userPayload{
        id: string;
        name: string;
        surname: string;
        email: string;
        isAdmin: boolean;
        agencyId?: string;
        onBoarding?: boolean;
        status?: string;
        suscriptionId?: string;
}
