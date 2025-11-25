"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1764041929772 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration1764041929772 extends migrations_1.Migration {
    async up() {
        this.addSql(`
      ALTER TABLE "post" ADD COLUMN "language" TEXT NULL;
    `);
    }
    async down() {
        this.addSql('ALTER TABLE "post" DROP COLUMN "language"');
    }
}
exports.Migration1764041929772 = Migration1764041929772;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMTc2NDA0MTkyOTc3Mi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Jsb2cvbWlncmF0aW9ucy9NaWdyYXRpb24xNzY0MDQxOTI5NzcyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFrRDtBQUVsRCxNQUFhLHNCQUF1QixTQUFRLHNCQUFTO0lBQ2pELEtBQUssQ0FBQyxFQUFFO1FBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQzs7S0FFZixDQUFDLENBQUM7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUk7UUFDTixJQUFJLENBQUMsTUFBTSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztDQUNKO0FBVkQsd0RBVUMifQ==