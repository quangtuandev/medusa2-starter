"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogCategory = void 0;
const core_1 = require("@mikro-orm/core");
let BlogCategory = class BlogCategory {
    id;
    slug;
    name;
    description;
    featured_image;
    is_active = true;
    created_at = new Date();
    updated_at = new Date();
    constructor(name, slug) {
        this.id = Date.now().toString();
        this.name = name;
        this.slug = slug;
    }
};
exports.BlogCategory = BlogCategory;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", String)
], BlogCategory.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ unique: true }),
    __metadata("design:type", String)
], BlogCategory.prototype, "slug", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], BlogCategory.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BlogCategory.prototype, "description", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], BlogCategory.prototype, "featured_image", void 0);
__decorate([
    (0, core_1.Property)({ default: true }),
    __metadata("design:type", Boolean)
], BlogCategory.prototype, "is_active", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.DateTimeType, onCreate: () => new Date() }),
    __metadata("design:type", Date)
], BlogCategory.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.DateTimeType, onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], BlogCategory.prototype, "updated_at", void 0);
exports.BlogCategory = BlogCategory = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String, String])
], BlogCategory);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvZy1jYXRlZ29yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Jsb2cvc3JjL21vZGVscy9ibG9nLWNhdGVnb3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDBDQUE2RTtBQUd0RSxJQUFNLFlBQVksR0FBbEIsTUFBTSxZQUFZO0lBRXZCLEVBQUUsQ0FBUztJQUdYLElBQUksQ0FBUztJQUdiLElBQUksQ0FBUztJQUdiLFdBQVcsQ0FBVTtJQUdyQixjQUFjLENBQVU7SUFHeEIsU0FBUyxHQUFZLElBQUksQ0FBQztJQUcxQixVQUFVLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUc5QixVQUFVLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUU5QixZQUFZLElBQVksRUFBRSxJQUFZO1FBQ3BDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7Q0FDRixDQUFBO0FBOUJZLG9DQUFZO0FBRXZCO0lBREMsSUFBQSxpQkFBVSxHQUFFOzt3Q0FDRjtBQUdYO0lBREMsSUFBQSxlQUFRLEVBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7OzBDQUNkO0FBR2I7SUFEQyxJQUFBLGVBQVEsR0FBRTs7MENBQ0U7QUFHYjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7O2lEQUN0QjtBQUdyQjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOztvREFDTDtBQUd4QjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDOzsrQ0FDRjtBQUcxQjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFZLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQzs4QkFDakQsSUFBSTtnREFBYztBQUc5QjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFZLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQzs4QkFDakQsSUFBSTtnREFBYzt1QkF2Qm5CLFlBQVk7SUFEeEIsSUFBQSxhQUFNLEdBQUU7O0dBQ0ksWUFBWSxDQThCeEIifQ==