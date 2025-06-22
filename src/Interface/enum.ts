import { Role } from 'src/Enum/roles.enum';

export type PropertyType =
  | 'appartment'
  | 'house'
  | 'land'
  | 'commercial'
  | 'garage'
  | 'office'
  | 'farmhouse';

export type PropertyStatus = 'Disponible' | 'Vendido';

export type TransactionType = 'Alquiler' | 'Venta';

export type UserRole = Role.User | Role.Admin;
