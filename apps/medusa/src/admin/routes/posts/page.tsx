/// <reference types="react" />
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BookOpen, Plus, Pencil, X } from "@medusajs/icons"
import {
    Heading,
    Container,
    Button,
    Skeleton,
    Table,
    toast,
} from "@medusajs/ui"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../lib/sdk"
import { ColumnDef, createColumnHelper, PaginationState, useReactTable, getCoreRowModel } from "@tanstack/react-table"

// Define the Post type
type Post = {
    id: string
    title: string
    content: string
    slug: string
    thumbnail: string
    published: boolean
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
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const offset = useMemo(() => {
        return pagination.pageIndex * limit
    }, [pagination])

    const { data, isLoading } = useQuery<PostsResponse>({
        queryFn: () => sdk.client.fetch(`/admin/blog/posts`, {
            query: {
                limit,
                offset,
            },
        }),
        queryKey: [["blog", "posts", limit, offset]],
    })

    const columns = [
        columnHelper.accessor("title", {
            header: "Name",
        }),
        columnHelper.accessor("slug", {
            header: "Slug",
        }),
        columnHelper.accessor("published", {
            header: "Published",
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
                            onClick={() => handleEditPost(post)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            size="small"
                            variant="transparent"
                            onClick={() => handleDeletePost(post.id)}
                        >
                            <X className="h-4 w-4" />
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
        navigate("/app/posts/create")
    }

    const handleEditPost = (post: Post) => {
        navigate(`/app/posts/edit/${post.id}`)
    }

    const handleDeletePost = (id: string) => {
        if (confirm(`Are you sure you want to delete this post? This action cannot be undone.`)) {
            // Implement delete functionality if needed
            console.log("Delete post:", id)
        }
    }

    return (
        <Container className="divide-y p-0">
            <div className="flex justify-between items-center p-6 border-b">
                <Heading level="h1">Posts</Heading>
                <Button onClick={handleCreatePost}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Post
                </Button>
            </div>

            {isLoading ? (
                <Skeleton className="p-8 text-center">Loading...</Skeleton>
            ) : (
                <Container className="overflow-x-auto">
                    <Table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {header.isPlaceholder ? null : header.column.columnDef.header as React.ReactNode}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                            {cell.renderValue() as React.ReactNode}
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
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Posts",
    icon: BookOpen,
})

export default PostsPage