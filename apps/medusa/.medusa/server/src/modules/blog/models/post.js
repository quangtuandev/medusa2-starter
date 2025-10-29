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
exports.Post = void 0;
const core_1 = require("@mikro-orm/core");
let Post = class Post {
    id = Date.now().toString();
    title;
    slug;
    content;
    thumbnail;
    published = false;
    created_at = new Date();
    updated_at = new Date();
    constructor(title, content, slug) {
        this.title = title;
        this.content = content;
        this.slug = slug || this.slugify(title);
    }
    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    }
};
exports.Post = Post;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", String)
], Post.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ length: 255 }),
    (0, core_1.Index)(),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    (0, core_1.Property)({ length: 255 }),
    (0, core_1.Index)(),
    __metadata("design:type", String)
], Post.prototype, "slug", void 0);
__decorate([
    (0, core_1.Property)({ type: 'text' }),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true, length: 500 }),
    __metadata("design:type", String)
], Post.prototype, "thumbnail", void 0);
__decorate([
    (0, core_1.Property)({ default: false }),
    __metadata("design:type", Boolean)
], Post.prototype, "published", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.DateTimeType, onCreate: () => new Date() }),
    __metadata("design:type", Date)
], Post.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.DateTimeType, onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Post.prototype, "updated_at", void 0);
exports.Post = Post = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String])
], Post);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Jsb2cvbW9kZWxzL3Bvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMENBQW9GO0FBRzdFLElBQU0sSUFBSSxHQUFWLE1BQU0sSUFBSTtJQUVmLEVBQUUsR0FBVyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFJbkMsS0FBSyxDQUFTO0lBSWQsSUFBSSxDQUFTO0lBR2IsT0FBTyxDQUFTO0lBR2hCLFNBQVMsQ0FBVTtJQUduQixTQUFTLEdBQVksS0FBSyxDQUFDO0lBRzNCLFVBQVUsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO0lBRzlCLFVBQVUsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO0lBRTlCLFlBQVksS0FBYSxFQUFFLE9BQWUsRUFBRSxJQUFhO1FBQ3ZELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVPLE9BQU8sQ0FBQyxJQUFZO1FBQzFCLE9BQU8sSUFBSTthQUNSLFdBQVcsRUFBRTthQUNiLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO2FBQ3hCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO2FBQ3BCLElBQUksRUFBRSxDQUFDO0lBQ1osQ0FBQztDQUNGLENBQUE7QUF4Q1ksb0JBQUk7QUFFZjtJQURDLElBQUEsaUJBQVUsR0FBRTs7Z0NBQ3NCO0FBSW5DO0lBRkMsSUFBQSxlQUFRLEVBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDekIsSUFBQSxZQUFLLEdBQUU7O21DQUNNO0FBSWQ7SUFGQyxJQUFBLGVBQVEsRUFBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUN6QixJQUFBLFlBQUssR0FBRTs7a0NBQ0s7QUFHYjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDOztxQ0FDWDtBQUdoQjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7O3VDQUN2QjtBQUduQjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDOzt1Q0FDRjtBQUczQjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFZLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQzs4QkFDakQsSUFBSTt3Q0FBYztBQUc5QjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFZLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQzs4QkFDakQsSUFBSTt3Q0FBYztlQXpCbkIsSUFBSTtJQURoQixJQUFBLGFBQU0sR0FBRTs7R0FDSSxJQUFJLENBd0NoQiJ9