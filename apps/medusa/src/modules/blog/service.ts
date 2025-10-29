import { MedusaService } from "@medusajs/framework/utils"
import { Post } from "./models/post"

class BlogModuleService extends MedusaService({
  Post,
}) {
  // TODO implement custom methods
}

export default BlogModuleService