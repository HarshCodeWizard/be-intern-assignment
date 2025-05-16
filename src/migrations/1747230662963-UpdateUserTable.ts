import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1747230662963 implements MigrationInterface {
    name = 'UpdateUserTable1747230662963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "follow" ("followedId" integer NOT NULL, "followerId" integer NOT NULL, PRIMARY KEY ("followedId", "followerId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f4a9d59861c87ba252ead40d84" ON "follow" ("followedId") `);
        await queryRunner.query(`CREATE INDEX "IDX_550dce89df9570f251b6af2665" ON "follow" ("followerId") `);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(255) NOT NULL, "lastName" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "password" varchar(255) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "firstName", "lastName", "email", "createdAt", "updatedAt") SELECT "id", "firstName", "lastName", "email", "createdAt", "updatedAt" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(255) NOT NULL, "lastName" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "password" varchar(255) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "firstName", "lastName", "email", "createdAt", "updatedAt", "password") SELECT "id", "firstName", "lastName", "email", "createdAt", "updatedAt", "password" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`DROP INDEX "IDX_f4a9d59861c87ba252ead40d84"`);
        await queryRunner.query(`DROP INDEX "IDX_550dce89df9570f251b6af2665"`);
        await queryRunner.query(`CREATE TABLE "temporary_follow" ("followedId" integer NOT NULL, "followerId" integer NOT NULL, CONSTRAINT "FK_f4a9d59861c87ba252ead40d84d" FOREIGN KEY ("followedId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_550dce89df9570f251b6af2665a" FOREIGN KEY ("followerId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("followedId", "followerId"))`);
        await queryRunner.query(`INSERT INTO "temporary_follow"("followedId", "followerId") SELECT "followedId", "followerId" FROM "follow"`);
        await queryRunner.query(`DROP TABLE "follow"`);
        await queryRunner.query(`ALTER TABLE "temporary_follow" RENAME TO "follow"`);
        await queryRunner.query(`CREATE INDEX "IDX_f4a9d59861c87ba252ead40d84" ON "follow" ("followedId") `);
        await queryRunner.query(`CREATE INDEX "IDX_550dce89df9570f251b6af2665" ON "follow" ("followerId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_550dce89df9570f251b6af2665"`);
        await queryRunner.query(`DROP INDEX "IDX_f4a9d59861c87ba252ead40d84"`);
        await queryRunner.query(`ALTER TABLE "follow" RENAME TO "temporary_follow"`);
        await queryRunner.query(`CREATE TABLE "follow" ("followedId" integer NOT NULL, "followerId" integer NOT NULL, PRIMARY KEY ("followedId", "followerId"))`);
        await queryRunner.query(`INSERT INTO "follow"("followedId", "followerId") SELECT "followedId", "followerId" FROM "temporary_follow"`);
        await queryRunner.query(`DROP TABLE "temporary_follow"`);
        await queryRunner.query(`CREATE INDEX "IDX_550dce89df9570f251b6af2665" ON "follow" ("followerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f4a9d59861c87ba252ead40d84" ON "follow" ("followedId") `);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(255) NOT NULL, "lastName" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "password" varchar(255) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "firstName", "lastName", "email", "createdAt", "updatedAt", "password") SELECT "id", "firstName", "lastName", "email", "createdAt", "updatedAt", "password" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(255) NOT NULL, "lastName" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "firstName", "lastName", "email", "createdAt", "updatedAt") SELECT "id", "firstName", "lastName", "email", "createdAt", "updatedAt" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`DROP INDEX "IDX_550dce89df9570f251b6af2665"`);
        await queryRunner.query(`DROP INDEX "IDX_f4a9d59861c87ba252ead40d84"`);
        await queryRunner.query(`DROP TABLE "follow"`);
    }

}
