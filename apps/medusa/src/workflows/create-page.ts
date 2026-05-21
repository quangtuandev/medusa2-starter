
import {
    createStep,
    StepResponse,
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { PAGE_MODULE } from "../modules/page"
import PageModuleService from "../modules/page/service"

export type CreatePageStepInput = {
    title: string
    slug: string
    content: string
    language?: string
    meta_title?: string
    meta_description?: string
    published: boolean
}

export const createPageStep = createStep(
    "create-page-step",
    async (input: CreatePageStepInput, { container }) => {
        const pageModuleService: PageModuleService = container.resolve(
            PAGE_MODULE
        )

        const page = await pageModuleService.createPages(input)

        return new StepResponse(page, page.id)
    }
)

type CreatePageWorkflowInput = {
    title: string
    slug: string
    content: string
    language?: string
    meta_title?: string
    meta_description?: string
    published: boolean
}

export const createPageWorkflow = createWorkflow(
    "create-page",
    (input: CreatePageWorkflowInput) => {
        const page = createPageStep(input)

        return new WorkflowResponse(page)
    }
)
