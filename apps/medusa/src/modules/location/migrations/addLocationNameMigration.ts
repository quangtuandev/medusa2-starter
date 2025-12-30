import { Migration } from '@mikro-orm/migrations';

export class AddLocationNameMigration extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      ALTER TABLE "location" ADD COLUMN "name" TEXT NOT NULL DEFAULT '';
    `);
  }

  async down(): Promise<void> {
    this.addSql('ALTER TABLE "location" DROP COLUMN "name"');
  }
}

