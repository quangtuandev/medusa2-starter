"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLocationNameMigration = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class AddLocationNameMigration extends migrations_1.Migration {
    async up() {
        this.addSql(`
      ALTER TABLE "location" ADD COLUMN "name" TEXT NOT NULL DEFAULT '';
    `);
    }
    async down() {
        this.addSql('ALTER TABLE "location" DROP COLUMN "name"');
    }
}
exports.AddLocationNameMigration = AddLocationNameMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkTG9jYXRpb25OYW1lTWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbG9jYXRpb24vbWlncmF0aW9ucy9hZGRMb2NhdGlvbk5hbWVNaWdyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0RBQWtEO0FBRWxELE1BQWEsd0JBQXlCLFNBQVEsc0JBQVM7SUFDckQsS0FBSyxDQUFDLEVBQUU7UUFDTixJQUFJLENBQUMsTUFBTSxDQUFDOztLQUVYLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsMkNBQTJDLENBQUMsQ0FBQztJQUMzRCxDQUFDO0NBQ0Y7QUFWRCw0REFVQyJ9