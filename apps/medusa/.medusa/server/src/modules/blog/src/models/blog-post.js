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
exports.BlogPost = exports.PostStatus = void 0;
const core_1 = require("@mikro-orm/core");
var PostStatus;
(function (PostStatus) {
    PostStatus["DRAFT"] = "draft";
    PostStatus["PUBLISHED"] = "published";
    PostStatus["ARCHIVED"] = "archived";
})(PostStatus || (exports.PostStatus = PostStatus = {}));
let BlogPost = class BlogPost {
    id;
    title;
    content;
    excerpt;
    featured_image;
    status = PostStatus.DRAFT;
    created_at = new Date();
    updated_at = new Date();
    view_count = 0;
    category_id;
    tags;
    is_active = true;
    constructor(title, content) {
        this.id = Date.now().toString();
        this.title = title;
        this.content = content;
    }
};
exports.BlogPost = BlogPost;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", String)
], BlogPost.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], BlogPost.prototype, "title", void 0);
__decorate([
    (0, core_1.Property)({ type: 'text' }),
    __metadata("design:type", String)
], BlogPost.prototype, "content", void 0);
__decorate([
    (0, core_1.Property)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BlogPost.prototype, "excerpt", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], BlogPost.prototype, "featured_image", void 0);
__decorate([
    (0, core_1.Property)({ type: String, default: PostStatus.DRAFT }),
    __metadata("design:type", String)
], BlogPost.prototype, "status", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.DateTimeType, onCreate: () => new Date() }),
    __metadata("design:type", Date)
], BlogPost.prototype, "created_at", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.DateTimeType, onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], BlogPost.prototype, "updated_at", void 0);
__decorate([
    (0, core_1.Property)({ default: 0 }),
    __metadata("design:type", Number)
], BlogPost.prototype, "view_count", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], BlogPost.prototype, "category_id", void 0);
__decorate([
    (0, core_1.Property)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], BlogPost.prototype, "tags", void 0);
__decorate([
    (0, core_1.Property)({ default: true }),
    __metadata("design:type", Boolean)
], BlogPost.prototype, "is_active", void 0);
exports.BlogPost = BlogPost = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String, String])
], BlogPost);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvZy1wb3N0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvYmxvZy9zcmMvbW9kZWxzL2Jsb2ctcG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNkU7QUFFN0UsSUFBWSxVQUlYO0FBSkQsV0FBWSxVQUFVO0lBQ3BCLDZCQUFlLENBQUE7SUFDZixxQ0FBdUIsQ0FBQTtJQUN2QixtQ0FBcUIsQ0FBQTtBQUN2QixDQUFDLEVBSlcsVUFBVSwwQkFBVixVQUFVLFFBSXJCO0FBR00sSUFBTSxRQUFRLEdBQWQsTUFBTSxRQUFRO0lBRW5CLEVBQUUsQ0FBUztJQUdYLEtBQUssQ0FBUztJQUdkLE9BQU8sQ0FBUztJQUdoQixPQUFPLENBQVU7SUFHakIsY0FBYyxDQUFVO0lBR3hCLE1BQU0sR0FBVyxVQUFVLENBQUMsS0FBSyxDQUFDO0lBR2xDLFVBQVUsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO0lBRzlCLFVBQVUsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO0lBRzlCLFVBQVUsR0FBVyxDQUFDLENBQUM7SUFHdkIsV0FBVyxDQUFVO0lBR3JCLElBQUksQ0FBWTtJQUdoQixTQUFTLEdBQVksSUFBSSxDQUFDO0lBRTFCLFlBQVksS0FBYSxFQUFFLE9BQWU7UUFDeEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztDQUNGLENBQUE7QUExQ1ksNEJBQVE7QUFFbkI7SUFEQyxJQUFBLGlCQUFVLEdBQUU7O29DQUNGO0FBR1g7SUFEQyxJQUFBLGVBQVEsR0FBRTs7dUNBQ0c7QUFHZDtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDOzt5Q0FDWDtBQUdoQjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7O3lDQUMxQjtBQUdqQjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOztnREFDTDtBQUd4QjtJQURDLElBQUEsZUFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDOzt3Q0FDcEI7QUFHbEM7SUFEQyxJQUFBLGVBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxtQkFBWSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFLENBQUM7OEJBQ2pELElBQUk7NENBQWM7QUFHOUI7SUFEQyxJQUFBLGVBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxtQkFBWSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFLENBQUM7OEJBQ2pELElBQUk7NENBQWM7QUFHOUI7SUFEQyxJQUFBLGVBQVEsRUFBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQzs7NENBQ0Y7QUFHdkI7SUFEQyxJQUFBLGVBQVEsRUFBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7NkNBQ1I7QUFHckI7SUFEQyxJQUFBLGVBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOztzQ0FDM0I7QUFHaEI7SUFEQyxJQUFBLGVBQVEsRUFBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQzs7MkNBQ0Y7bUJBbkNmLFFBQVE7SUFEcEIsSUFBQSxhQUFNLEdBQUU7O0dBQ0ksUUFBUSxDQTBDcEIifQ==