/// <reference types="react" />
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BookOpen, Plus } from "@medusajs/icons"
import {
    Heading,
    Container,
    Button,
    Skeleton,
    Table,
    toast,
    Badge,
    FocusModal,
} from "@medusajs/ui"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../lib/sdk"
import { ColumnDef, createColumnHelper, PaginationState, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"

// Define the Post type
type Post = {
    id: string
    title: string
    slug: string
    thumbnail: string
    published: boolean
    language: string
    sub_title?: string
    description?: string
    created_at?: string
    updated_at?: string
}

// Define the response type
type PostsResponse = {
    posts: Post[]
    count: number
    limit: number
    offset: number
}

const columnHelper = createColumnHelper<Post>()

const PostsPage = () => {
    const limit = 15
    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: limit,
        pageIndex: 0,
    })
    const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const offset = useMemo(() => {
        return pagination.pageIndex * limit
    }, [pagination])

    const { data, isLoading } = useQuery<PostsResponse>({
        queryFn: () => {
            const query: Record<string, any> = { limit, offset }
            if (statusFilter === "published") {
                query.published = true
            } else if (statusFilter === "draft") {
                query.published = false
            }
            return sdk.client.fetch(`/admin/blog/posts`, { query })
        },
        queryKey: [["blog", "posts", limit, offset, statusFilter]],
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => sdk.client.fetch(`/admin/blog/posts/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [["blog", "posts"]] })
            toast.success("Post deleted successfully")
        },
        onError: (error: any) => {
            toast.error("Failed to delete post", { description: error?.message })
        },
    })

    const columns = [
        columnHelper.accessor("thumbnail", {
            header: "Thumbnail",
            cell: ({ getValue }) => {
                const src = getValue()
                return src ? (
                    <img src={src} alt="thumbnail" className="h-10 w-10 rounded object-cover border" />
                ) : (
                    <span className="text-xs text-gray-400">N/A</span>
                )
            },
        }),
        columnHelper.accessor("title", {
            header: "Title",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium text-gray-900">{row.original.title}</p>
                    {row.original.sub_title && (
                        <p className="text-xs text-gray-500 truncate max-w-xs">{row.original.sub_title}</p>
                    )}
                </div>
            ),
        }),
        columnHelper.accessor("slug", {
            header: "Slug",
            cell: ({ getValue }) => (
                <span className="text-xs font-mono text-gray-500">{getValue()}</span>
            ),
        }),
        columnHelper.accessor("language", {
            header: "Language",
            cell: ({ row }) => {
                return <Badge color="green">{row.original.language === "en" ? "English" : "Vietnamese"}</Badge>
            },
        }),
        columnHelper.accessor("published", {
            header: "Published",
            cell: ({ getValue }) =>
                getValue() ? (
                    <Badge color="green">Published</Badge>
                ) : (
                    <Badge color="orange">Draft</Badge>
                ),
        }),
        columnHelper.display({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const post = row.original
                return (
                    <div className="flex items-center space-x-2">
                        <Button
                            size="small"
                            variant="transparent"
                            onClick={() => handleViewPost(post)}
                        >
                            <span className="text-xs text-blue-600">View</span>
                        </Button>
                        <Button
                            size="small"
                            variant="transparent"
                            onClick={() => handleEditPost(post)}
                        >
                            <span className="text-xs text-gray-600">Edit</span>
                        </Button>
                        <Button
                            size="small"
                            variant="transparent"
                            onClick={() => handleDeletePost(post.id)}
                            disabled={deleteMutation.isPending}
                        >
                            <span className="text-xs text-red-600">
                                {deleteMutation.isPending ? "Deleting..." : "Delete"}
                            </span>
                        </Button>
                    </div>
                )
            },
        }),
    ]

    const table = useReactTable({
        columns: columns as ColumnDef<Post>[],
        data: data?.posts || [],
        getRowId: (row: Post) => row.id as string,
        pageCount: Math.ceil((data?.count || 0) / limit),
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
    })

    const handleCreatePost = () => {
        navigate("/posts/create")
    }

    const handleEditPost = (post: Post) => {
        navigate(`/posts/edit/${post.id}`)
    }

    const handleViewPost = (post: Post) => {
        setSelectedPost(post)
        setIsDialogOpen(true)
    }

    const handleDeletePost = (id: string) => {
        if (confirm("Are you sure you want to delete this post?")) {
            deleteMutation.mutate(id)
        }
    }

    const publishedCount = useMemo(() => data?.posts.filter((p) => p.published).length || 0, [data?.posts])
    const draftCount = useMemo(() => data?.posts.filter((p) => !p.published).length || 0, [data?.posts])

    return (
        <Container className="divide-y p-0">
            <div className="p-6 border-b space-y-4">
                <div className="flex justify-between items-center">
                    <Heading level="h1">Posts</Heading>
                    <Button onClick={handleCreatePost}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Post
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={statusFilter === "all" ? "primary" : "secondary"}
                        size="small"
                        onClick={() => setStatusFilter("all")}
                    >
                        All
                    </Button>
                    <Button
                        variant={statusFilter === "published" ? "primary" : "secondary"}
                        size="small"
                        onClick={() => setStatusFilter("published")}
                    >
                        Published ({publishedCount})
                    </Button>
                    <Button
                        variant={statusFilter === "draft" ? "primary" : "secondary"}
                        size="small"
                        onClick={() => setStatusFilter("draft")}
                    >
                        Draft ({draftCount})
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <Skeleton className="p-8 text-center">Loading...</Skeleton>
            ) : (
                <Container className="overflow-x-auto">
                    <Table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {table.getRowModel().rows.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                                        No posts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <div className="flex items-center justify-between px-4 py-4">
                        <button
                            className="px-3 py-1 border rounded disabled:opacity-50"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </button>
                        <span className="text-sm">
                            Page{" "}
                            <strong>
                                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </strong>
                        </span>
                        <Button
                            className="px-3 py-1 border rounded disabled:opacity-50"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </Container>
            )}

            {selectedPost && (
                <FocusModal open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <FocusModal.Content>
                        <FocusModal.Header>
                            <FocusModal.Title>Post Details</FocusModal.Title>
                        </FocusModal.Header>
                        <FocusModal.Body className="space-y-4 p-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-1">Title</h3>
                                <p className="text-sm text-gray-900">{selectedPost.title}</p>
                            </div>
                            {selectedPost.sub_title && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Sub Title</h3>
                                    <p className="text-sm text-gray-600">{selectedPost.sub_title}</p>
                                </div>
                            )}
                            {selectedPost.description && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedPost.description}</p>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                                <div>
                                    <span className="font-semibold">Slug:</span> {selectedPost.slug}
                                </div>
                                <div>
                                    <span className="font-semibold">Language:</span> {selectedPost.language?.toUpperCase()}
                                </div>
                                <div>
                                    <span className="font-semibold">Status:</span>{" "}
                                    {selectedPost.published ? "Published" : "Draft"}
                                </div>
                            </div>
                            {selectedPost.thumbnail && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Thumbnail</h3>
                                    <img
                                        src={selectedPost.thumbnail}
                                        alt="Thumbnail"
                                        className="rounded border w-40 h-40 object-cover"
                                    />
                                </div>
                            )}
                        </FocusModal.Body>
                        <FocusModal.Footer>
                            <Button variant="secondary" size="small" onClick={() => setIsDialogOpen(false)}>
                                Close
                            </Button>
                            <Button size="small" onClick={() => handleEditPost(selectedPost)}>
                                Edit Post
                            </Button>
                        </FocusModal.Footer>
                    </FocusModal.Content>
                </FocusModal>
            )}
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Posts",
    icon: BookOpen,
})

export default PostsPage