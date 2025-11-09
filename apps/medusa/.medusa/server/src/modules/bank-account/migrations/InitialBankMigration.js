"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialBankMigration = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class InitialBankMigration extends migrations_1.Migration {
    async up() {
        this.addSql(`
      CREATE TABLE "bank_account" (
        "id" VARCHAR(255) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "account_holder" VARCHAR(255) NOT NULL,
        "account_number" VARCHAR(255) NOT NULL,
        "bank_code" VARCHAR(255) NOT NULL,
        "swift_code" VARCHAR(255) NULL,
        "qr_code_url" TEXT NULL,
        "is_active" BOOLEAN DEFAULT true NOT NULL,
        "display_order" INTEGER DEFAULT 0 NOT NULL,
        "created_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "deleted_at" TIMESTAMPTZ(6) NULL,
        CONSTRAINT "bank_account_pkey" PRIMARY KEY ("id")
      );
    `);
        this.addSql(`
      CREATE INDEX "bank_account_is_active_index" ON "bank_account" ("is_active");
    `);
        this.addSql(`
      CREATE INDEX "bank_account_display_order_index" ON "bank_account" ("display_order");
    `);
    }
    async down() {
        this.addSql('DROP INDEX "bank_account_is_active_index"');
        this.addSql('DROP INDEX "bank_account_display_order_index"');
        this.addSql('DROP TABLE "bank_account"');
    }
}
exports.InitialBankMigration = InitialBankMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5pdGlhbEJhbmtNaWdyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9iYW5rLWFjY291bnQvbWlncmF0aW9ucy9Jbml0aWFsQmFua01pZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSxvQkFBcUIsU0FBUSxzQkFBUztJQUNqRCxLQUFLLENBQUMsRUFBRTtRQUNOLElBQUksQ0FBQyxNQUFNLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7S0FnQlgsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7S0FFWCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxDQUFDOztLQUVYLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsMkNBQTJDLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsTUFBTSxDQUFDLCtDQUErQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0lBQzNDLENBQUM7Q0FDRjtBQWxDRCxvREFrQ0MifQ==