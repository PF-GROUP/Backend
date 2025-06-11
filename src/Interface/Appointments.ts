
export interface AppointmentDTO {
  id: number;
  day: string; 
  time: string; 
  name: string; 
  surname: string; 
  email: string; 
  phone: string; 
}

export interface CreateAppointmentDTO {
  day: string;
  time: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
}