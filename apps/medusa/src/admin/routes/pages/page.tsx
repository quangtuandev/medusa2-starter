/// <reference types="react" />
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentText, Plus } from "@medusajs/icons"
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

// Define the Page type
type Page = {
    id: string
    title: string
    slug: string
    content: string
    language: string
    meta_title?: string
    meta_description?: string
    published: boolean
    created_at?: string
    updated_at?: string
}

// Define the response type
type PagesResponse = {
    pages: Page[]
    count: number
    limit: number
    offset: number
}

const columnHelper = createColumnHelper<Page>()

const PagesPage = () => {
    const limit = 15
    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: limit,
        pageIndex: 0,
    })
    const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")
    const [selectedPage, setSelectedPage] = useState<Page | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const offset = useMemo(() => {
        return pagination.pageIndex * limit
    }, [pagination])

    const { data, isLoading } = useQuery<PagesResponse>({
        queryFn: () => {
            const query: Record<string, any> = { limit, offset }
            if (statusFilter === "published") {
                query.published = true
            } else if (statusFilter === "draft") {
                query.published = false
            }
            return sdk.client.fetch(`/admin/pages`, { query })
        },
        queryKey: [["pages", limit, offset, statusFilter]],
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => sdk.client.fetch(`/admin/pages/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [["pages"]] })
            toast.success("Page deleted successfully")
        },
        onError: (error: any) => {
            toast.error("Failed to delete page", { description: error?.message })
        },
    })

    const columns = [
        columnHelper.accessor("title", {
            header: "Title",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium text-gray-900">{row.original.title}</p>
                    <p className="text-xs text-gray-500 font-mono">/{row.original.slug}</p>
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
            header: "Status",
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
                const page = row.original
                return (
                    <div className="flex items-center space-x-2">
                        <Button
                            size="small"
                            variant="transparent"
                            onClick={() => handleViewPage(page)}
                        >
                            <span className="text-xs text-blue-600">View</span>
                        </Button>
                        <Button
                            size="small"
                            variant="transparent"
                            onClick={() => handleEditPage(page)}
                        >
                            <span className="text-xs text-gray-600">Edit</span>
                        </Button>
                        <Button
                            size="small"
                            variant="transparent"
                            onClick={() => handleDeletePage(page.id)}
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
        columns: columns as ColumnDef<Page>[],
        data: data?.pages || [],
        getRowId: (row: Page) => row.id as string,
        pageCount: Math.ceil((data?.count || 0) / limit),
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
    })

    const handleCreatePage = () => {
        navigate("/pages/create")
    }

    const handleEditPage = (page: Page) => {
        navigate(`/pages/edit/${page.id}`)
    }

    const handleViewPage = (page: Page) => {
        setSelectedPage(page)
        setIsDialogOpen(true)
    }

    const handleDeletePage = (id: string) => {
        if (confirm("Are you sure you want to delete this page?")) {
            deleteMutation.mutate(id)
        }
    }

    const publishedCount = useMemo(() => data?.pages.filter((p) => p.published).length || 0, [data?.pages])
    const draftCount = useMemo(() => data?.pages.filter((p) => !p.published).length || 0, [data?.pages])

    return (
        <Container className="divide-y p-0">
            <div className="p-6 border-b space-y-4">
                <div className="flex justify-between items-center">
                    <Heading level="h1">Pages</Heading>
                    <Button onClick={handleCreatePage}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Page
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
                                        No pages found. Create your first page to get started.
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

            {selectedPage && (
                <FocusModal open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <FocusModal.Content>
                        <FocusModal.Header>
                            <FocusModal.Title>Page Details</FocusModal.Title>
                        </FocusModal.Header>
                        <FocusModal.Body className="space-y-4 p-6 overflow-y-auto">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-1">Title</h3>
                                <p className="text-sm text-gray-900">{selectedPage.title}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-1">Slug</h3>
                                <p className="text-sm text-gray-600 font-mono">/{selectedPage.slug}</p>
                            </div>
                            {selectedPage.meta_title && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Meta Title</h3>
                                    <p className="text-sm text-gray-600">{selectedPage.meta_title}</p>
                                </div>
                            )}
                            {selectedPage.meta_description && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Meta Description</h3>
                                    <p className="text-sm text-gray-600">{selectedPage.meta_description}</p>
                                </div>
                            )}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-1">Content Preview</h3>
                                <div
                                    className="text-sm text-gray-600 border rounded p-4 max-h-80 overflow-y-auto prose prose-sm"
                                    dangerouslySetInnerHTML={{ __html: selectedPage.content }}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                                <div>
                                    <span className="font-semibold">Language:</span> {selectedPage.language?.toUpperCase()}
                                </div>
                                <div>
                                    <span className="font-semibold">Status:</span>{" "}
                                    {selectedPage.published ? "Published" : "Draft"}
                                </div>
                            </div>
                        </FocusModal.Body>
                        <FocusModal.Footer>
                            <Button variant="secondary" size="small" onClick={() => setIsDialogOpen(false)}>
                                Close
                            </Button>
                            <Button size="small" onClick={() => handleEditPage(selectedPage)}>
                                Edit Page
                            </Button>
                        </FocusModal.Footer>
                    </FocusModal.Content>
                </FocusModal>
            )}
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Pages",
    icon: DocumentText,
})

export default PagesPage
