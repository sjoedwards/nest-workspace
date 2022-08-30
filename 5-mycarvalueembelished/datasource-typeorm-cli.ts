import databaseConfig from './database-config';
import { DataSource } from 'typeorm';

export default new DataSource(databaseConfig);
