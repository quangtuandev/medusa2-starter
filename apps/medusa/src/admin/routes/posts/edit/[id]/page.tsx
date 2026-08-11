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
import { useMemo, useState, useRef, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { sdk } from "../../../../lib/sdk"
import * as z from "zod"
import slugify from "slugify"
// @ts-ignore
import ImageResize from 'quill-image-resize-module-react';


// Import ReactQuill and CSS
import ReactQuill, { Quill } from "react-quill"
import "react-quill/dist/quill.snow.css"

// Define the Post type
type Post = {
    id: string
    language: string
    title: string
    content: string
    slug: string
    description: string
    sub_title: string
    thumbnail: string
    published: boolean
}

// Define form validation schema
const PostFormSchema = z.object({
    language: z.string().min(1, "Language is required"),
    title: z.string().min(1, "Title is required"),
    sub_title: z.string().min(1, "Sub Title is required"),
    description: z.string().min(1, "Description is required"),
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

const languages = [
    { label: "English", value: "en" },
    { label: "Tiếng Việt", value: "vi" },
] as const

const EditPostPage = () => {
    Quill.register('modules/imageResize', ImageResize);

    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const quillRef = useRef<ReactQuill>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const thumbnailInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        language: "en",
        title: "",
        sub_title: "",
        description: "",
        content: "",
        slug: "",
        thumbnail: "",
        published: false,
    })

    // Fetch existing post if editing
    const { data: post, isLoading: isLoadingPost } = useQuery<Post>({
        queryFn: () => sdk.client.fetch(`/admin/blog/posts/${id}`),
        queryKey: ["post", id],
        enabled: !!id,
    })

    // Set form data when post is loaded
    useMemo(() => {
        if (post) {
            setFormData({
                language: post.language,
                title: post.title,
                sub_title: post.sub_title || "",
                description: post.description || "",
                content: post.content,
                slug: post.slug,
                thumbnail: post.thumbnail,
                published: post.published,
            })
        }
    }, [post])

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
            navigate("/posts")
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
        formData.append("file", file)

        try {
            const response = await sdk.admin.upload.create({
                files: [file],
            })
            return response.files[0].url
        } catch (error) {
            console.error("Image upload failed:", error)
            throw new Error("Failed to upload image")
        }
    }

    const imageHandler = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    // Handler for content image upload
    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB")
            return
        }

        const quill = quillRef.current?.getEditor()
        if (!quill) return

        const range = quill.getSelection(true)
        if (!range) return

        try {
            quill.insertText(range.index, "Uploading image...", "user")
            quill.setSelection(range.index + 19, 0)

            const imageUrl = await handleImageUpload(file)

            quill.deleteText(range.index, 19)
            quill.insertEmbed(range.index, "image", imageUrl, "user")
            quill.setSelection(range.index + 1, 0)

            toast.success("Image uploaded successfully")
        } catch (error) {
            quill.deleteText(range.index, 19)
            toast.error("Failed to upload image. Please try again.")
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }, [])

    const handleThumbnailUpload = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (!file) return

            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file")
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB")
                return
            }

            try {
                const imageUrl = await handleImageUpload(file)
                setFormData((prev) => ({ ...prev, thumbnail: imageUrl }))
                toast.success("Thumbnail uploaded successfully")
            } catch (error) {
                toast.error("Failed to upload thumbnail. Please try again.")
            } finally {
                if (thumbnailInputRef.current) {
                    thumbnailInputRef.current.value = ""
                }
            }
        },
        [handleImageUpload]
    )

    // Configure Quill modules
    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ font: [] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    ["direction", { align: [] }],
                    ["link"],
                    ["image"],
                    ["clean"],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
            clipboard: {
                matchVisual: false
            },
            imageResize: {
                parchment: Quill.import('parchment'),
                modules: ['Resize', 'DisplaySize', 'Toolbar']
            }
        }),
        [imageHandler]
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const validatedData = PostFormSchema.parse(formData)
            setIsLoading(true)

            if (id) {
                await updateMutation.mutateAsync({
                    id,
                    data: validatedData,
                })
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
        navigate("/posts")
    }

    return (
        <Container className="divide-y p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-4">
                    <Button variant="transparent" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Posts
                    </Button>
                    <Heading level="h1">
                        Edit Post: {formData.title || "Loading..."}
                    </Heading>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading || updateMutation.isPending}
                >
                    {isLoading || updateMutation.isPending ? "Saving..." : "Update Post"}
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
                                    setFormData({ ...formData, slug: slugify(e.target.value, { lower: true, strict: true }) })
                                }}
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

                        {/* Sub Title Field */}
                        <div>
                            <Label htmlFor="sub_title" className="block text-sm font-medium text-gray-700 mb-2">
                                Sub Title *
                            </Label>
                            <Input
                                id="sub_title"
                                value={formData.sub_title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFormData({ ...formData, sub_title: e.target.value })
                                }
                                placeholder="Enter post sub title"
                                required
                            />
                        </div>

                        {/* Description Field */}
                        <div>
                            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="Enter post description"
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
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                    />
                                    <ReactQuill
                                        ref={quillRef}
                                        id="content"
                                        value={formData.content}
                                        onChange={handleContentChange}
                                        modules={modules}
                                        formats={formats}
                                        theme="snow"
                                        placeholder="Write your post content here..."
                                        style={{ height: "600px" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Field */}
                        <div>
                            <Label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                                Thumbnail URL
                            </Label>
                            <input
                                ref={thumbnailInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailUpload}
                                style={{ display: "none" }}
                            />
                            <div className="flex gap-3">
                                <Input
                                    id="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setFormData({ ...formData, thumbnail: e.target.value })
                                    }
                                    placeholder="https://example.com/image.jpg"
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => thumbnailInputRef.current?.click()}
                                >
                                    Upload
                                </Button>
                            </div>
                            {formData.thumbnail && (
                                <div className="mt-3">
                                    <span className="block text-xs text-gray-500 mb-1">Preview:</span>
                                    <img
                                        src={formData.thumbnail}
                                        alt="Thumbnail Preview"
                                        className="rounded border w-32 h-32 object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = "none"
                                        }}
                                    />
                                </div>
                            )}
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
    label: "Edit Post",
})

export default EditPostPage