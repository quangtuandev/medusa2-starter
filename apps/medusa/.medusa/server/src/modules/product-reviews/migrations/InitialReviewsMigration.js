"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialReviewsMigration = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class InitialReviewsMigration extends migrations_1.Migration {
    async up() {
        this.addSql(`
      CREATE TABLE "review" (
        "id" VARCHAR(255) NOT NULL,
        "product_id" VARCHAR(255) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "content" TEXT NOT NULL,
        "stars" INTEGER NOT NULL,
        "status" VARCHAR(255) DEFAULT 'pending' NOT NULL,
        "created_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMPTZ(6) DEFAULT now() NOT NULL,
        "deleted_at" TIMESTAMPTZ(6) NULL,
        CONSTRAINT "review_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "review_stars_check" CHECK ("stars" >= 1 AND "stars" <= 5)
      );
    `);
        this.addSql(`
      CREATE INDEX "review_product_id_index" ON "review" ("product_id");
    `);
        this.addSql(`
      CREATE INDEX "review_status_index" ON "review" ("status");
    `);
    }
    async down() {
        this.addSql('DROP INDEX "review_product_id_index"');
        this.addSql('DROP INDEX "review_status_index"');
        this.addSql('DROP TABLE "review"');
    }
}
exports.InitialReviewsMigration = InitialReviewsMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5pdGlhbFJldmlld3NNaWdyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LXJldmlld3MvbWlncmF0aW9ucy9Jbml0aWFsUmV2aWV3c01pZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUNwRCxLQUFLLENBQUMsRUFBRTtRQUNOLElBQUksQ0FBQyxNQUFNLENBQUM7Ozs7Ozs7Ozs7Ozs7O0tBY1gsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7S0FFWCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxDQUFDOztLQUVYLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7Q0FDRjtBQWhDRCwwREFnQ0MifQ==