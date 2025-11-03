/// <reference types="react" />
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ArrowLeft, CheckCircleSolid, XCircle, Trash } from "@medusajs/icons"
import {
    Heading,
    Container,
    Badge,
    Skeleton,
    toast,
    Button,
    Label,
    Input,
    Select,
} from "@medusajs/ui"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { sdk } from "../../../lib/sdk"
import QuillEditor from "../../../components/QuillEditor"

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

const ReviewDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        content: "",
        stars: 5,
        status: "pending" as Review["status"],
    })

    const { data: reviewData, isLoading } = useQuery({
        queryKey: ["review", id],
        queryFn: () => sdk.client.fetch(`/admin/reviews/${id}`),
        enabled: !!id,
    })

    const review = reviewData?.review as Review | undefined

    // Initialize form data when review loads
    useState(() => {
        if (review) {
            setFormData({
                name: review.name,
                content: review.content,
                stars: review.stars,
                status: review.status,
            })
        }
    })

    const updateMutation = useMutation({
        mutationFn: (data: Partial<Review>) =>
            sdk.client.fetch(`/admin/reviews/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review", id] })
            queryClient.invalidateQueries({ queryKey: ["reviews"] })
            toast.success("Review updated", {
                description: "The review has been updated successfully",
            })
            setIsEditing(false)
        },
        onError: (error: any) => {
            toast.error("Error", {
                description: error.message || "Failed to update review",
            })
        },
    })

    const approveMutation = useMutation({
        mutationFn: () =>
            sdk.client.fetch(`/admin/reviews/${id}/approve`, { method: "POST" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review", id] })
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
        mutationFn: () =>
            sdk.client.fetch(`/admin/reviews/${id}/reject`, { method: "POST" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review", id] })
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
        mutationFn: () =>
            sdk.client.fetch(`/admin/reviews/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            toast.success("Review deleted", {
                description: "The review has been deleted successfully",
            })
            navigate("/app/reviews")
        },
        onError: (error: any) => {
            toast.error("Error", {
                description: error.message || "Failed to delete review",
            })
        },
    })

    const handleApprove = () => {
        approveMutation.mutate()
    }

    const handleReject = () => {
        rejectMutation.mutate()
    }

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
            deleteMutation.mutate()
        }
    }

    const handleSave = () => {
        updateMutation.mutate(formData)
    }

    const handleCancel = () => {
        if (review) {
            setFormData({
                name: review.name,
                content: review.content,
                stars: review.stars,
                status: review.status,
            })
        }
        setIsEditing(false)
    }

    const renderStars = (stars: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span
                        key={i}
                        className={i < stars ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}
                    >
                        ★
                    </span>
                ))}
                <span className="ml-2 text-lg text-gray-600">({stars}/5)</span>
            </div>
        )
    }

    const getStatusBadge = (status: Review["status"]) => {
        switch (status) {
            case "approved":
                return <Badge color="green" size="large">Approved</Badge>
            case "rejected":
                return <Badge color="red" size="large">Rejected</Badge>
            case "pending":
                return <Badge color="orange" size="large">Pending</Badge>
            default:
                return <Badge size="large">{status}</Badge>
        }
    }

    if (isLoading) {
        return (
            <Container className="p-8">
                <Skeleton className="h-64">Loading review...</Skeleton>
            </Container>
        )
    }

    if (!review) {
        return (
            <Container className="p-8">
                <div className="text-center text-gray-500">Review not found</div>
            </Container>
        )
    }

    return (
        <Container className="divide-y p-0">
            {/* Header */}
            <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => navigate("/app/reviews")}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Heading level="h1">Review Details</Heading>
                    </div>
                    <div className="flex gap-2">
                        {review.status === "pending" && !isEditing && (
                            <>
                                <Button
                                    variant="primary"
                                    onClick={handleApprove}
                                    disabled={approveMutation.isPending}
                                >
                                    <CheckCircleSolid className="h-4 w-4 mr-2" />
                                    Approve
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleReject}
                                    disabled={rejectMutation.isPending}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                </Button>
                            </>
                        )}
                        {!isEditing && (
                            <>
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={handleDelete}
                                    disabled={deleteMutation.isPending}
                                >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {isEditing ? (
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="name">Reviewer Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="stars">Rating</Label>
                            <Select
                                value={formData.stars.toString()}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, stars: parseInt(value) })
                                }
                            >
                                <Select.Trigger>
                                    <Select.Value />
                                </Select.Trigger>
                                <Select.Content>
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <Select.Item key={star} value={star.toString()}>
                                            {star} Star{star !== 1 ? "s" : ""}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select>
                        </div>

                        <div>
                            <QuillEditor
                                id="content"
                                label="Review Content"
                                value={formData.content}
                                onChange={(value: string) =>
                                    setFormData({ ...formData, content: value })
                                }
                                placeholder="Write the review content here..."
                                height="250px"
                            />
                        </div>

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, status: value as Review["status"] })
                                }
                            >
                                <Select.Trigger>
                                    <Select.Value />
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Item value="pending">Pending</Select.Item>
                                    <Select.Item value="approved">Approved</Select.Item>
                                    <Select.Item value="rejected">Rejected</Select.Item>
                                </Select.Content>
                            </Select>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                disabled={updateMutation.isPending}
                            >
                                Save Changes
                            </Button>
                            <Button variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Status</div>
                                {getStatusBadge(review.status)}
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500 mb-1">Rating</div>
                                {renderStars(review.stars)}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm text-gray-500 mb-1">Reviewer</div>
                            <div className="text-lg font-semibold">{review.name}</div>
                        </div>

                        <div>
                            <div className="text-sm text-gray-500 mb-1">Product ID</div>
                            <div className="font-mono text-sm text-gray-700">
                                {review.product_id}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm text-gray-500 mb-1">Review</div>
                            <div className="text-gray-700 whitespace-pre-wrap">
                                {review.content}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Created</div>
                                <div className="text-sm">
                                    {new Date(review.created_at).toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Updated</div>
                                <div className="text-sm">
                                    {new Date(review.updated_at).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Review Details",
})

export default ReviewDetailPage
