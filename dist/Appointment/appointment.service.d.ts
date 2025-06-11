import { CreateAppointmentDto } from './Appointment/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentService {
    create(createAppointmentDto: CreateAppointmentDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAppointmentDto: UpdateAppointmentDto): string;
    remove(id: number): string;
}
