
import {
    createStep,
    StepResponse,
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { BLOG_MODULE } from "../modules/blog"
import BlogModuleService from "../modules/blog/service"

export type CreatePostStepInput = {
    title: string
    content: string
    slug: string
    thumbnail: string
    published: boolean
}

export const createPostStep = createStep(
    "create-post-step",
    async (input: CreatePostStepInput, { container }) => {
        const blogModuleService: BlogModuleService = container.resolve(
            BLOG_MODULE
        )

        const post = await blogModuleService.createPosts(input)

        return new StepResponse(post, post.id)
    }
)

type CreatePostWorkflowInput = {
    title: string
    content: string
    slug: string
    thumbnail: string
    published: boolean
}

export const createPostWorkflow = createWorkflow(
    "create-post",
    (input: CreatePostWorkflowInput) => {
        const post = createPostStep(input)

        return new WorkflowResponse(post)
    }
)