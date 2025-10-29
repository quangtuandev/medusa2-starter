"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostAdminCreatePost = void 0;
const zod_1 = require("zod");
exports.PostAdminCreatePost = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    slug: zod_1.z.string(),
    thumbnail: zod_1.z.string(),
    published: zod_1.z.boolean(),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcGkvYWRtaW4vYmxvZy9wb3N0cy92YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUF1QjtBQUVWLFFBQUEsbUJBQW1CLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN4QyxLQUFLLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUNqQixPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUNuQixJQUFJLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUNoQixTQUFTLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUNyQixTQUFTLEVBQUUsT0FBQyxDQUFDLE9BQU8sRUFBRTtDQUN6QixDQUFDLENBQUEifQ==