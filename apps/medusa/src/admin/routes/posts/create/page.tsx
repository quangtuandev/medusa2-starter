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
} from "@medusajs/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { sdk } from "../../../lib/sdk"
import * as z from "zod"
import type { ZodError } from "zod"

// Import ReactQuill and CSS
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Define the Post type
type Post = {
    id: string
    title: string
    content: string
    slug: string
    thumbnail: string
    published: boolean
}

// Define form validation schema
const PostFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    slug: z.string().min(1, "Slug is required"),
    thumbnail: z.string().optional(),
    published: z.boolean(),
})


// Define formats for ReactQuill
const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'indent',
    'link',
    'image'
]

const CreateEditPostPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [isCreate, setIsCreate] = useState(!id)
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        slug: "",
        thumbnail: "",
        published: false,
    })

    // Fetch existing post if editing
    const { data: post, isLoading: isLoadingPost } = useQuery<Post>({
        queryFn: () => sdk.client.get(`/admin/blog/posts/${id}`),
        queryKey: ["post", id],
        enabled: !!id && !isCreate,
    })

    // Set form data when post is loaded
    useMemo(() => {
        if (post && !isCreate) {
            setFormData({
                title: post.title,
                content: post.content,
                slug: post.slug,
                thumbnail: post.thumbnail,
                published: post.published,
            })
        }
    }, [post, isCreate])

    // Mutation for creating posts
    const createMutation = useMutation({
        mutationFn: async (newPost: z.infer<typeof PostFormSchema>) => {
            return sdk.client.fetch("/admin/blog/posts", {
                method: "POST",
                body: newPost,
            })
        },
        onSuccess: () => {
            toast.success("Post created successfully")
            navigate("/app/posts")
        },
        onError: () => {
            toast.error("Failed to create post")
        },
    })

    // Mutation for updating posts
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: z.infer<typeof PostFormSchema> }) => {
            return sdk.client.fetch(`/admin/blog/posts/${id}`, {
                method: "PUT",
                body: data,
            })
        },
        onSuccess: () => {
            toast.success("Post updated successfully")
            navigate("/app/posts")
        },
        onError: () => {
            toast.error("Failed to update post")
        },
    })

    const handleContentChange = (value: string) => {
        setFormData(prev => ({ ...prev, content: value }))
    }

    // Custom image handler for ReactQuill
    const handleImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || '/'}/admin/uploads`, {
                method: 'POST',
                body: formData,
                headers: {
                    // Don't set Content-Type header, let the browser set it with the correct boundary
                }
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const data = await response.json()
            // Return the uploaded file URL
            return data.url || `/uploads/${data.fileName}`
        } catch (error) {
            console.error('Image upload failed:', error)
            throw new Error('Failed to upload image')
        }
    }

    // Configure Quill with basic toolbar
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link'],
            [{ 'image': () => { /* Image will be handled by custom button */ } }],
            ['clean']
        ],
    }

    // Handle image upload via file input
    const handleImageUploadViaFileInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Insert a placeholder while uploading
        const placeholder = `![Uploading ${file.name}...]`
        const quill = ReactQuill.Quill.getInstance(document.getElementById('content') as HTMLDivElement)
        if (quill) {
            const range = quill.getSelection()
            quill.insertText(range?.index || quill.getLength() - 1, placeholder)
        }

        try {
            const imageUrl = await handleImageUpload(file)

            // Replace placeholder with actual image
            if (quill) {
                const range = quill.getSelection()
                const index = range?.index || quill.getLength() - 1
                quill.deleteText(index, placeholder.length)
                quill.insertEmbed(index, 'image', imageUrl)
                quill.setSelection(index + imageUrl.length + 2, 0) // 2 for the image syntax
            }

            // Clear the file input
            event.target.value = ''
        } catch (error) {
            // Remove placeholder on error
            if (quill) {
                const range = quill.getSelection()
                const index = range?.index || quill.getLength() - 1
                quill.deleteText(index, placeholder.length)
            }
            toast.error('Failed to upload image')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const validatedData = PostFormSchema.parse(formData)
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
                toast.error("Validation failed: " + error.errors[0]?.message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => {
        navigate("/app/posts")
    }

    return (
        <Container className="divide-y p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Posts
                    </Button>
                    <Heading level="h1">
                        {isCreate ? "Create New Post" : `Edit Post: ${formData.title || "Loading..."}`}
                    </Heading>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading || createMutation.isPending || updateMutation.isPending}
                >
                    {isLoading || createMutation.isPending || updateMutation.isPending
                        ? "Saving..."
                        : isCreate ? "Create Post" : "Update Post"
                    }
                </Button>
            </div>

            {/* Form Content */}
            <div className="p-6">
                {isLoadingPost ? (
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-12 w-64" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                placeholder="Enter post title"
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
                                placeholder="enter-post-slug"
                                required
                            />
                        </div>

                        {/* Content Field with WYSIWYG Editor */}
                        <div>
                            <Label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Content *
                            </Label>
                            <div className="space-y-3">
                                <div className="border rounded-lg overflow-hidden">
                                    <ReactQuill
                                        id="content"
                                        value={formData.content}
                                        onChange={handleContentChange}
                                        modules={modules}
                                        formats={formats}
                                        theme="snow"
                                        placeholder="Write your post content here..."
                                        style={{ height: '400px' }}
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUploadViaFileInput}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <Button
                                        variant="ghost"
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                        className="text-sm"
                                    >
                                        Upload Image
                                    </Button>
                                    <span className="text-sm text-gray-500">
                                        Click "Upload Image" to add images from your computer
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Field */}
                        <div>
                            <Label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                                Thumbnail URL
                            </Label>
                            <Input
                                id="thumbnail"
                                value={formData.thumbnail}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFormData({ ...formData, thumbnail: e.target.value })
                                }
                                placeholder="https://example.com/image.jpg"
                            />
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

                        {/* Additional Info */}
                        <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                            <p className="font-medium mb-1">Tips:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Use the toolbar to format your text, add images, and create lists</li>
                                <li>Header levels help organize your content structure</li>
                                <li>Links can be added using the link button in the toolbar</li>
                                <li>Save your work frequently using the "Save Post" button</li>
                            </ul>
                        </div>
                    </form>
                )}
            </div>
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Create Post",
})

export default CreateEditPostPage