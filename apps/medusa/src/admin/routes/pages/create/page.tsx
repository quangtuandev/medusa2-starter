/// <reference types="react" />
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ArrowLeft } from "@medusajs/icons"
import {
    Heading,
    Container,
    Button,
    Input,
    Skeleton,
    Switch,
    Label,
    toast,
    Select,
    Textarea,
} from "@medusajs/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import BlockNoteEditor from "../../../components/BlockNoteEditor"
import { sdk } from "../../../lib/sdk"
import * as z from "zod"
import slugify from "slugify"



// Define the Page type
type Page = {
    id: string
    language: string
    title: string
    slug: string
    content: string
    meta_title: string
    meta_description: string
    published: boolean
}

// Define form validation schema
const PageFormSchema = z.object({
    language: z.string().min(1, "Language is required"),
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    content: z.string().min(1, "Content is required"),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    published: z.boolean(),
})


const languages = [
    { label: "English", value: "en" },
    { label: "Tiếng Việt", value: "vi" },
] as const;

const CreatePagePage = () => {

    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [isCreate, setIsCreate] = useState(!id)
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        language: "en",
        title: "",
        slug: "",
        content: "",
        meta_title: "",
        meta_description: "",
        published: false,
    })

    // Fetch existing page if editing
    const { data: page, isLoading: isLoadingPage } = useQuery<Page>({
        queryFn: () => sdk.client.fetch<Page>(`/admin/pages/${id}`),
        queryKey: ["page", id],
        enabled: !!id && !isCreate,
    })

    // Set form data when page is loaded
    useMemo(() => {
        if (page && !isCreate) {
            setFormData({
                language: page.language || "en",
                title: page.title || "",
                slug: page.slug || "",
                content: page.content || "",
                meta_title: page.meta_title || "",
                meta_description: page.meta_description || "",
                published: page.published || false,
            })
        }
    }, [page, isCreate])

    // Mutation for creating pages
    const createMutation = useMutation({
        mutationFn: async (newPage: z.infer<typeof PageFormSchema>) => {
            return sdk.client.fetch("/admin/pages", {
                method: "POST",
                body: newPage,
            })
        },
        onSuccess: () => {
            toast.success("Page created successfully")
            navigate("/pages")
        },
        onError: () => {
            toast.error("Failed to create page")
        },
    })

    // Mutation for updating pages
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: z.infer<typeof PageFormSchema> }) => {
            return sdk.client.fetch(`/admin/pages/${id}`, {
                method: "PUT",
                body: data,
            })
        },
        onSuccess: () => {
            toast.success("Page updated successfully")
            navigate("/pages")
        },
        onError: () => {
            toast.error("Failed to update page")
        },
    })

    const handleContentChange = (value: string) => {
        setFormData(prev => ({ ...prev, content: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const validatedData = PageFormSchema.parse(formData)
            setIsLoading(true)

            if (!isCreate && id) {
                await updateMutation.mutateAsync({
                    id,
                    data: validatedData,
                })
            } else {
                await createMutation.mutateAsync(validatedData)
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                toast.error("Validation failed: " + (error.issues[0]?.message || (error as any).errors?.[0]?.message))
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => {
        navigate("/pages")
    }

    return (
        <Container className="divide-y p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-4">
                    <Button variant="transparent" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Pages
                    </Button>
                    <Heading level="h1">
                        {isCreate ? "Create New Page" : `Edit Page: ${formData.title || "Loading..."}`}
                    </Heading>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading || createMutation.isPending || updateMutation.isPending}
                >
                    {isLoading || createMutation.isPending || updateMutation.isPending
                        ? "Saving..."
                        : isCreate ? "Create Page" : "Update Page"
                    }
                </Button>
            </div>

            {/* Form Content */}
            <div className="p-6">
                {isLoadingPage ? (
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-12 w-64" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Language Field */}
                        <div>
                            <Label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                                Language *
                            </Label>
                            <Select value={formData.language} onValueChange={(value: string) => setFormData({ ...formData, language: value })}>
                                <Select.Trigger>
                                    <Select.Value placeholder="Select a language" />
                                </Select.Trigger>
                                <Select.Content>
                                    {languages.map((item) => (
                                        <Select.Item key={item.value} value={item.value}>
                                            {item.label}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select>
                        </div>

                        {/* Title Field */}
                        <div>
                            <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    if (isCreate) {
                                        setFormData({ ...formData, slug: slugify(e.target.value, { lower: true, strict: true }) })
                                    }
                                }}
                                placeholder="Enter page title"
                                required
                            />
                        </div>

                        {/* Slug Field */}
                        <div>
                            <Label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                                Slug *
                            </Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFormData({ ...formData, slug: e.target.value })
                                }
                                placeholder="enter-page-slug (e.g. faqs, docs, terms-of-service)"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                This will be used in the URL: /pages/{formData.slug || "your-slug"}
                            </p>
                        </div>

                        {/* Meta Title Field */}
                        <div>
                            <Label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Title (SEO)
                            </Label>
                            <Input
                                id="meta_title"
                                value={formData.meta_title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFormData({ ...formData, meta_title: e.target.value })
                                }
                                placeholder="SEO title for search engines"
                            />
                        </div>

                        {/* Meta Description Field */}
                        <div>
                            <Label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Description (SEO)
                            </Label>
                            <Textarea
                                id="meta_description"
                                value={formData.meta_description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setFormData({ ...formData, meta_description: e.target.value })
                                }
                                placeholder="SEO description for search engines"
                            />
                        </div>

                        {/* Content Field with WYSIWYG Editor */}
                        <div>
                            <Label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Content *
                            </Label>
                            <div className="space-y-3">
                                <BlockNoteEditor
                                    key="content-editor"
                                    initialHtml={formData.content}
                                    onChange={handleContentChange}
                                />
                            </div>
                        </div>

                        {/* Published Toggle */}
                        <div className="flex items-center space-x-3">
                            <Switch
                                id="published"
                                checked={formData.published}
                                onCheckedChange={(checked: boolean) =>
                                    setFormData({ ...formData, published: checked })
                                }
                            />
                            <Label htmlFor="published" className="text-sm font-medium text-gray-700">
                                Published
                            </Label>
                        </div>

                        {/* Tips */}
                        <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                            <p className="font-medium mb-1">Tips:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Common slugs: <code className="text-xs bg-gray-200 px-1 rounded">faqs</code>, <code className="text-xs bg-gray-200 px-1 rounded">docs</code>, <code className="text-xs bg-gray-200 px-1 rounded">terms-of-service</code></li>
                                <li>Pages will be accessible at <code className="text-xs bg-gray-200 px-1 rounded">/pages/your-slug</code> on the storefront</li>
                                <li>Use the toolbar to format your text, add images, and create lists</li>
                                <li>Toggle "Published" to make the page visible on the storefront</li>
                            </ul>
                        </div>
                    </form>
                )}
            </div>
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Create Page",
})

export default CreatePagePage
