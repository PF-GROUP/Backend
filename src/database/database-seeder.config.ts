export const databaseSeederConfig = {
  enabled: process.env.NODE_ENV !== 'production',

  clearDatabase: process.env.NODE_ENV !== 'production',

  debug: process.env.NODE_ENV !== 'production',

  seeders: ['TypeOfPropertySeeder', 'AgencySeeder', 'PropertySeeder'],
};
