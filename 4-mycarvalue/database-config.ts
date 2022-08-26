import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const isValidDataType = (type: string): 'mssql' | 'sqlite' => {
  if (type === 'mssql' || type === 'sqlite') return type;
  throw new Error();
};

const databaseConfig = {
  name: 'database',
  type: isValidDataType(process.env.DB_TYPE),
  database: process.env.DB_NAME,
  entities: [
    process.env.NODE_ENV === 'test' || process.env.CLI
      ? '**/*.entity.ts'
      : '**/*.entity.js',
  ],
  migrations: [__dirname + '/migrations/*.ts'],
  cli: {
    migrationsDir: 'migrations',
  },
  synchronize: false,
  logging: false,
  migrationsRun: process.env.NODE_ENV === 'test' ? true : false,
};

export default databaseConfig;
