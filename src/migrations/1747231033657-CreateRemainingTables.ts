import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRemainingTables1747231033657 implements MigrationInterface {
  name = 'CreateRemainingTables1747231033657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create posts table with foreign key to users
    await queryRunner.query(
      `CREATE TABLE "posts" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "content" varchar(280) NOT NULL,
        "hashtags" text NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "userId" integer NOT NULL,
        CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`
    );
    // Add indexes for posts
    await queryRunner.query(`CREATE INDEX "IDX_POST_USERID" ON "posts" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_POST_HASHTAGS" ON "posts" ("hashtags")`);
    await queryRunner.query(`CREATE INDEX "IDX_POST_CREATEDAT" ON "posts" ("createdAt")`);

    // Create like table with foreign keys to users and posts
    await queryRunner.query(
      `CREATE TABLE "like" (
        "userId" integer NOT NULL,
        "postId" integer NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "FK_e8fb739f08d47955a39850fac23" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_3acf7c55c319c4000e8056c1279" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        PRIMARY KEY ("userId", "postId")
      )`
    );
    // Add indexes for like
    await queryRunner.query(`CREATE INDEX "IDX_e8fb739f08d47955a39850fac2" ON "like" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_3acf7c55c319c4000e8056c127" ON "like" ("postId")`);

    // Create activities table with foreign key to users
    await queryRunner.query(
      `CREATE TABLE "activities" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "type" varchar NOT NULL,
        "targetId" integer,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "userId" integer NOT NULL,
        CONSTRAINT "FK_5a2cfe6f705df945b20c1b22c71" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`
    );
    // Add indexes for activities
    await queryRunner.query(`CREATE INDEX "IDX_ACTIVITY_USERID_TYPE" ON "activities" ("userId", "type")`);
    await queryRunner.query(`CREATE INDEX "IDX_ACTIVITY_CREATEDAT" ON "activities" ("createdAt")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop activities table and its indexes
    await queryRunner.query(`DROP INDEX "IDX_ACTIVITY_CREATEDAT"`);
    await queryRunner.query(`DROP INDEX "IDX_ACTIVITY_USERID_TYPE"`);
    await queryRunner.query(`DROP TABLE "activities"`);

    // Drop like table and its indexes
    await queryRunner.query(`DROP INDEX "IDX_3acf7c55c319c4000e8056c127"`);
    await queryRunner.query(`DROP INDEX "IDX_e8fb739f08d47955a39850fac2"`);
    await queryRunner.query(`DROP TABLE "like"`);

    // Drop posts table and its indexes
    await queryRunner.query(`DROP INDEX "IDX_POST_CREATEDAT"`);
    await queryRunner.query(`DROP INDEX "IDX_POST_HASHTAGS"`);
    await queryRunner.query(`DROP INDEX "IDX_POST_USERID"`);
    await queryRunner.query(`DROP TABLE "posts"`);
  }
}