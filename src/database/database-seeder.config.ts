import {config as dotenvconfig} from "dotenv"
dotenvconfig({path: ".env.development"})

export const databaseSeederConfig = {
  enabled: process.env.SEEDER_ENABLED === 'true',

  clearDatabase: process.env.SEEDER_CLEAR === 'true',

  debug: process.env.SEEDER_DEBUG === 'true',

  seeders: ['TypeOfPropertySeeder', 'AgencySeeder', 'PropertySeeder'],
};
