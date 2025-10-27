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
exports.BlogTag = void 0;
const core_1 = require("@mikro-orm/core");
let BlogTag = class BlogTag {
    id;
    slug;
    name;
    description;
    is_active = true;
    created_at = new Date();
    updated_at = new Date();
    constructor(name, slug) {
        this.id = Date.now().toString();
        this.name = name;
        this.slug = slug;
    }
};
exports.BlogTag = BlogTag;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", String)
], BlogTag.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ unique: true }),
    __metadata("design:type", String)
], BlogTag.prototype, "slug", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], BlogTag.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BlogTag.prototype, "description", void 0);
__decorate([
    (0, core_1.Property)({ default: true }),
    __metadata("design:type", Boolean)
], BlogTag.prototype, "is_active", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.DateTimeType, onCreate: () => new Date() }),
    __metadata("design:type", Date)
], BlogTag.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.DateTimeType, onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], BlogTag.prototype, "updated_at", void 0);
exports.BlogTag = BlogTag = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String, String])
], BlogTag);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvZy10YWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9ibG9nL3NyYy9tb2RlbHMvYmxvZy10YWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMENBQTZFO0FBR3RFLElBQU0sT0FBTyxHQUFiLE1BQU0sT0FBTztJQUVsQixFQUFFLENBQVM7SUFHWCxJQUFJLENBQVM7SUFHYixJQUFJLENBQVM7SUFHYixXQUFXLENBQVU7SUFHckIsU0FBUyxHQUFZLElBQUksQ0FBQztJQUcxQixVQUFVLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUc5QixVQUFVLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUU5QixZQUFZLElBQVksRUFBRSxJQUFZO1FBQ3BDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7Q0FDRixDQUFBO0FBM0JZLDBCQUFPO0FBRWxCO0lBREMsSUFBQSxpQkFBVSxHQUFFOzttQ0FDRjtBQUdYO0lBREMsSUFBQSxlQUFRLEVBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7O3FDQUNkO0FBR2I7SUFEQyxJQUFBLGVBQVEsR0FBRTs7cUNBQ0U7QUFHYjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7OzRDQUN0QjtBQUdyQjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDOzswQ0FDRjtBQUcxQjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFZLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQzs4QkFDakQsSUFBSTsyQ0FBYztBQUc5QjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFZLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQzs4QkFDakQsSUFBSTsyQ0FBYztrQkFwQm5CLE9BQU87SUFEbkIsSUFBQSxhQUFNLEdBQUU7O0dBQ0ksT0FBTyxDQTJCbkIifQ==