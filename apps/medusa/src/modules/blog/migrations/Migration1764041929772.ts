import { Migration } from '@mikro-orm/migrations';

export class Migration1764041929772 extends Migration {
    async up(): Promise<void> {
        this.addSql(`
      ALTER TABLE "post" ADD COLUMN "language" TEXT NULL;
    `);
    }

    async down(): Promise<void> {
        this.addSql('ALTER TABLE "post" DROP COLUMN "language"');
    }
}