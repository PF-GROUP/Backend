import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './Appointment/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentController {
    private readonly appointmentService;
    constructor(appointmentService: AppointmentService);
    create(createAppointmentDto: CreateAppointmentDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): string;
    remove(id: string): string;
}
