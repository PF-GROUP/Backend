import {  registerAs } from "@nestjs/config";
import {config as dotenvconfig} from "dotenv"

dotenvconfig({path: ".env.development"});


const config = {
  type: 'postgres',
  database: `${process.env.DB_NAME}`,
  host: `${process.env.DB_HOST}`,
  port: `${process.env.DB_PORT}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrations: ["dist/migrations/*{.ts,.js}"],
  autoLoadEntities: true,
  synchronize: true, 
  logging: true, 
//dropSchema: true,
  
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default registerAs("typeorm", ( ) => config);