/// <reference types="react" />
import React, { useMemo, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight, CheckCircleSolid, XCircle } from "@medusajs/icons"
import {
    Heading,
    Container,
    Badge,
    Skeleton,
    Table,
    toast,
    Button,
    FocusModal,
} from "@medusajs/ui"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../lib/sdk"
import { ColumnDef, createColumnHelper, PaginationState, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"

// Define the Review type
type Review = {
    id: string
    product_id: string
    name: string
    content: string
    stars: number
    status: "pending" | "approved" | "rejected"
    created_at: string
    updated_at: string
}

// Define the response type
type ReviewsResponse = {
    reviews: Review[]
    count: number
    limit: number
    offset: number
}

const columnHelper = createColumnHelper<Review>()

const ReviewsPage = () => {
    const limit = 15
    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: limit,
        pageIndex: 0,
    })
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedReview, setSelectedReview] = useState<Review | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const offset = useMemo(() => {
        return pagination.pageIndex * limit
    }, [pagination])

    const { data, isLoading } = useQuery<ReviewsResponse>({
        queryFn: () => {
            const query: any = { limit, offset }
            if (statusFilter !== "all") {
                query.status = statusFilter
            }
            return sdk.client.fetch(`/admin/reviews`, { query })
        },
        queryKey: ["reviews", limit, offset, statusFilter],
    })

    const approveMutation = useMutation({
        mutationFn: (id: string) =>
            sdk.client.fetch(`/admin/reviews/${id}/approve`, { method: "POST" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] })
            toast.success("Review approved", {
                description: "The review has been approved successfully",
            })
        },
        onError: (error: any) => {
            toast.error("Error", {
                description: error.message || "Failed to approve review",
            })
        },
    })

    const rejectMutation = useMutation({
        mutationFn: (id: string) =>
            sdk.client.fetch(`/admin/reviews/${id}/reject`, { method: "POST" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] })
            toast.success("Review rejected", {
                description: "The review has been rejected successfully",
            })
        },
        onError: (error: any) => {
            toast.error("Error", {
                description: error.message || "Failed to reject review",
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            sdk.client.fetch(`/admin/reviews/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] })
            toast.success("Review deleted", {
                description: "The review has been deleted successfully",
            })
        },
        onError: (error: any) => {
            toast.error("Error", {
                description: error.message || "Failed to delete review",
            })
        },
    })

    const renderStars = (stars: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span
                        key={i}
                        className={i < stars ? "text-yellow-400" : "text-gray-300"}
                    >
                        ★
                    </span>
                ))}
                <span className="ml-1 text-xs text-gray-500">({stars})</span>
            </div>
        )
    }

    const getStatusBadge = (status: Review["status"]) => {
        switch (status) {
            case "approved":
                return <Badge color="green">Approved</Badge>
            case "rejected":
                return <Badge color="red">Rejected</Badge>
            case "pending":
                return <Badge color="orange">Pending</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    const columns = [
        columnHelper.accessor("product_id", {
            header: "Product ID",
            cell: ({ getValue }) => (
                <span className="text-xs text-gray-500 font-mono">
                    {getValue().substring(0, 12)}...
                </span>
            ),
        }),
        columnHelper.accessor("name", {
            header: "Name",
        }),
        columnHelper.accessor("content", {
            header: "Review",
            cell: ({ getValue }) => {
                const content = getValue()
                return (
                    <div className="max-w-xs truncate" title={content}>
                        {content}
                    </div>
                )
            },
        }),
        columnHelper.accessor("stars", {
            header: "Rating",
            cell: ({ getValue }) => renderStars(getValue()),
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: ({ getValue }) => getStatusBadge(getValue()),
        }),
        columnHelper.accessor("created_at", {
            header: "Created",
            cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
        }),
        columnHelper.display({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const review = row.original
                return (
                    <div className="flex items-center gap-2">
                        {review.status === "pending" && (
                            <>
                                <Button
                                    size="small"
                                    variant="transparent"
                                    onClick={() => approveMutation.mutate(review.id)}
                                    disabled={approveMutation.isPending}
                                    title="Approve"
                                >
                                    <CheckCircleSolid className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                    size="small"
                                    variant="transparent"
                                    onClick={() => rejectMutation.mutate(review.id)}
                                    disabled={rejectMutation.isPending}
                                    title="Reject"
                                >
                                    <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                            </>
                        )}
                        <Button
                            size="small"
                            variant="transparent"
                            onClick={() => handleViewReview(review)}
                            title="View Details"
                        >
                            <span className="text-xs text-blue-600">View</span>
                        </Button>
                        <Button
                            size="small"
                            variant="transparent"
                            onClick={() => handleDeleteReview(review.id)}
                            title="Delete"
                        >
                            <span className="text-xs text-red-600">Delete</span>
                        </Button>
                    </div>
                )
            },
        }),
    ]

    const table = useReactTable({
        columns: columns as ColumnDef<Review>[],
        data: data?.reviews || [],
        getRowId: (row: Review) => row.id as string,
        pageCount: Math.ceil((data?.count || 0) / limit),
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
    })

    const handleViewReview = (review: Review) => {
        setSelectedReview(review)
        setIsDialogOpen(true)
    }

    const handleDeleteReview = (id: string) => {
        if (confirm(`Are you sure you want to delete this review? This action cannot be undone.`)) {
            deleteMutation.mutate(id)
        }
    }

    const pendingCount = useMemo(() => {
        return data?.reviews?.filter((r) => r.status === "pending").length || 0
    }, [data?.reviews])

    return (
        <Container className="divide-y p-0">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center mb-4">
                    <Heading level="h1">Product Reviews</Heading>
                    {pendingCount > 0 && (
                        <Badge color="orange" className="text-sm">
                            {pendingCount} pending review{pendingCount !== 1 ? "s" : ""}
                        </Badge>
                    )}
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
                        variant={statusFilter === "pending" ? "primary" : "secondary"}
                        size="small"
                        onClick={() => setStatusFilter("pending")}
                    >
                        Pending
                    </Button>
                    <Button
                        variant={statusFilter === "approved" ? "primary" : "secondary"}
                        size="small"
                        onClick={() => setStatusFilter("approved")}
                    >
                        Approved
                    </Button>
                    <Button
                        variant={statusFilter === "rejected" ? "primary" : "secondary"}
                        size="small"
                        onClick={() => setStatusFilter("rejected")}
                    >
                        Rejected
                    </Button>
                </div>
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
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {table.getRowModel().rows.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                                        No reviews found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <div className="flex items-center justify-between px-4 py-4">
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <span className="text-sm">
                            Page{" "}
                            <strong>
                                {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                            </strong>
                        </span>
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </Container>
            )}

            {selectedReview && (
                <FocusModal open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <FocusModal.Content>
                        <FocusModal.Header>
                            <FocusModal.Title>Review Details</FocusModal.Title>
                        </FocusModal.Header>
                        <FocusModal.Body className="p-6 space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-1">Product ID</h3>
                                <p className="text-sm text-gray-500 font-mono">{selectedReview.product_id}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-1">Reviewer Name</h3>
                                <p className="text-sm text-gray-600">{selectedReview.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-1">Rating</h3>
                                <div className="flex items-center gap-2">
                                    {renderStars(selectedReview.stars)}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-1">Status</h3>
                                <div>{getStatusBadge(selectedReview.status)}</div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-1">Review Content</h3>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedReview.content}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                                <div>
                                    <span className="font-semibold">Created:</span> {new Date(selectedReview.created_at).toLocaleString()}
                                </div>
                                <div>
                                    <span className="font-semibold">Updated:</span> {new Date(selectedReview.updated_at).toLocaleString()}
                                </div>
                            </div>
                        </FocusModal.Body>
                        <FocusModal.Footer>
                            <FocusModal.Close asChild>
                                <Button variant="secondary" size="small">
                                    Close
                                </Button>
                            </FocusModal.Close>
                        </FocusModal.Footer>
                    </FocusModal.Content>
                </FocusModal>
            )}
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Product Reviews",
    icon: ChatBubbleLeftRight,
})

export default ReviewsPage
