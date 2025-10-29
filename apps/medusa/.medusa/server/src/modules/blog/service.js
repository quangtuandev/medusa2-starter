"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_1 = require("./models/post");
class BlogModuleService {
    container;
    constructor(container) {
        // Store container for later use
        this.container = container;
    }
    async getEntityManager() {
        return this.container.em;
    }
    async createPost(data) {
        const em = await this.getEntityManager();
        const post = new post_1.Post(data.title, data.content, data.slug);
        if (data.thumbnail !== undefined) {
            post.thumbnail = data.thumbnail;
        }
        if (data.published !== undefined) {
            post.published = data.published;
        }
        await em.persistAndFlush(post);
        return post;
    }
    async getPosts(filters = {}) {
        const { published = false, limit = 20, offset = 0 } = filters;
        const em = await this.getEntityManager();
        const where = {};
        if (published !== undefined) {
            where.published = published;
        }
        const posts = await em.find(post_1.Post, where, {
            limit: limit || 20,
            offset: offset || 0,
            orderBy: { created_at: 'desc' }
        });
        const count = await em.count(post_1.Post, where);
        return {
            posts,
            count,
            limit,
            offset
        };
    }
    async getPostById(id) {
        const em = await this.getEntityManager();
        return em.findOne(post_1.Post, { id });
    }
    async getPostBySlug(slug) {
        const em = await this.getEntityManager();
        return em.findOne(post_1.Post, { slug });
    }
    async updatePost(id, data) {
        const em = await this.getEntityManager();
        const post = await em.findOne(post_1.Post, { id });
        if (!post)
            return null;
        if (data.title)
            post.title = data.title;
        if (data.content)
            post.content = data.content;
        if (data.slug)
            post.slug = data.slug;
        if (data.thumbnail !== undefined)
            post.thumbnail = data.thumbnail;
        if (data.published !== undefined)
            post.published = data.published;
        await em.persistAndFlush(post);
        return post;
    }
    async deletePost(id) {
        const em = await this.getEntityManager();
        const post = await em.findOne(post_1.Post, { id });
        if (!post)
            return false;
        await em.removeAndFlush(post);
        return true;
    }
    async getPublishedPosts(filters = {}) {
        return this.getPosts({ published: true, ...filters });
    }
}
exports.default = BlogModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Jsb2cvc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUFxQztBQUVyQyxNQUFxQixpQkFBaUI7SUFDNUIsU0FBUyxDQUFNO0lBRXZCLFlBQVksU0FBYztRQUN4QixnQ0FBZ0M7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztJQUVPLEtBQUssQ0FBQyxnQkFBZ0I7UUFDNUIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQU1oQjtRQUNDLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDekMsTUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFJLENBQ25CLElBQUksQ0FBQyxLQUFLLEVBQ1YsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsSUFBSSxDQUNWLENBQUM7UUFFRixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2xDLENBQUM7UUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2xDLENBQUM7UUFFRCxNQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUlYLEVBQUU7UUFNSixNQUFNLEVBQUUsU0FBUyxHQUFHLEtBQUssRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDOUQsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUV6QyxNQUFNLEtBQUssR0FBUSxFQUFFLENBQUM7UUFDdEIsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDNUIsS0FBSyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDOUIsQ0FBQztRQUVELE1BQU0sS0FBSyxHQUFHLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFJLEVBQUUsS0FBSyxFQUFFO1lBQ3ZDLEtBQUssRUFBRSxLQUFLLElBQUksRUFBRTtZQUNsQixNQUFNLEVBQUUsTUFBTSxJQUFJLENBQUM7WUFDbkIsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTtTQUNoQyxDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTFDLE9BQU87WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxNQUFNO1NBQ1AsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQVU7UUFDMUIsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN6QyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFZO1FBQzlCLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDekMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQUksRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBVSxFQUFFLElBTTVCO1FBQ0MsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN6QyxNQUFNLElBQUksR0FBRyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUU1QyxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRXZCLElBQUksSUFBSSxDQUFDLEtBQUs7WUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEMsSUFBSSxJQUFJLENBQUMsT0FBTztZQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM5QyxJQUFJLElBQUksQ0FBQyxJQUFJO1lBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3JDLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2xFLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBRWxFLE1BQU0sRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQVU7UUFDekIsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN6QyxNQUFNLElBQUksR0FBRyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUU1QyxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRXhCLE1BQU0sRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsVUFHcEIsRUFBRTtRQU1KLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELENBQUM7Q0FDRjtBQTdIRCxvQ0E2SEMifQ==