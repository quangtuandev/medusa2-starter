/// <reference types="react" />
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BookOpen } from "@medusajs/icons"
import {
    Heading,
    Container,
    Button,
    Skeleton,
    Table,
} from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { sdk } from "../../lib/sdk"
import { ColumnDef, createColumnHelper, PaginationState, useReactTable, getCoreRowModel } from "@tanstack/react-table"
type Post = {
    id: string
    title: string
    content: string
    slug: string
    thumbnail: string
    published: boolean
}
type PostsResponse = {
    posts: Post[]
    count: number
    limit: number
    offset: number
}
const columnHelper = createColumnHelper<Post>()

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
]

const PostsPage = () => {
    const limit = 15
    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: limit,
        pageIndex: 0,
    })
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
        queryKey: [["brands", limit, offset]],
    })

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


    return (
        <Container className="divide-y p-0">
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