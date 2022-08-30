import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1661879912856 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "role" ("name") values ("admin");`);
    await queryRunner.query(`INSERT INTO "role" ("name") values ("manager");`);
    await queryRunner.query(`INSERT INTO "role" ("name") values ("employee");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      DELETE from "role" where name == admin OR name == manager OR name == employee
    `,
    );
  }
}
