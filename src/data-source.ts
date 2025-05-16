import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  name: 'default', // Connection name must be "default"
  type: 'sqlite', // Database type
  database: 'database.sqlite', // Path to SQLite database file
  synchronize: true, // Should be false since you're using migrations
  logging: true, // Enable logging for debugging
  entities: ['src/entities/*.ts'], // Path to entities
  migrations: ['src/migrations/*.ts'], // Path to migrations
  subscribers: [],
});