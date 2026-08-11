/// <reference types="react" />
import React, { useMemo, useState, useCallback } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { MapPin, Plus, Trash } from "@medusajs/icons"
import {
    Heading,
    Container,
    Button,
    Skeleton,
    Table,
    toast,
} from "@medusajs/ui"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../lib/sdk.js"
import { ColumnDef, createColumnHelper, PaginationState, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"

// Define the Location type
type Location = {
    id: string
    name?: string
    iso_country_code: string
    address_lines: string
    options: Record<string, any>
    created_at: string
    updated_at: string
}

// Define the response type
type LocationsResponse = {
    locations: Location[]
    count: number
    limit: number
    offset: number
}

const columnHelper = createColumnHelper<Location>()

const LocationsPage = () => {
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

    const { data, isLoading } = useQuery<LocationsResponse>({
        queryFn: () => sdk.client.fetch(`/admin/location`, {
            query: {
                limit,
                offset,
                order: "created_at:DESC",
            },
        }),
        queryKey: ["locations", limit, offset],
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            sdk.client.fetch(`/admin/location/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["locations"] })
            toast.success("Location deleted successfully")
        },
        onError: (error: any) => {
            toast.error("Error", {
                description: error.message || "Failed to delete location",
            })
        },
    })

    // Define handlers first using useCallback
    const handleCreateLocation = useCallback(() => {
        navigate("/location/create")
    }, [navigate])


    const handleDeleteLocation = useCallback((id: string) => {
        if (confirm(`Are you sure you want to delete this location? This action cannot be undone.`)) {
            deleteMutation.mutate(id)
        }
    }, [deleteMutation])

    // Define columns using useMemo to avoid recreation on each render
    const columns = useMemo(() => [
        columnHelper.accessor("iso_country_code", {
            header: "Country Code",
            cell: ({ getValue }) => (
                <span className="font-mono text-sm font-semibold">{getValue()}</span>
            ),
        }),
        columnHelper.accessor("name", {
            header: "Name",
            cell: ({ getValue }) => (
                <span className="font-mono text-sm font-semibold">{getValue()}</span>
            ),
        }),
        columnHelper.accessor("address_lines", {
            header: "Address",
            cell: ({ getValue }) => (
                <span className="text-sm">{getValue()}</span>
            ),
        }),
        columnHelper.accessor("options", {
            header: "Options",
            cell: ({ getValue }) => {
                const options = getValue()
                const optionsCount = Object.keys(options || {}).length
                return (
                    <span className="text-sm text-gray-500">
                        {optionsCount > 0 ? `${optionsCount} option(s)` : "No options"}
                    </span>
                )
            },
        }),
        columnHelper.display({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const location = row.original
                return (
                    <div className="flex items-center space-x-2">
                        <Button
                            size="small"
                            variant="transparent"
                            onClick={() => handleDeleteLocation(location.id)}
                            disabled={deleteMutation.isPending}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        }),
    ], [handleDeleteLocation, deleteMutation.isPending])

    const table = useReactTable({
        columns: columns as ColumnDef<Location>[],
        data: data?.locations || [],
        getRowId: (row: Location) => row.id as string,
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
            <div className="flex justify-between items-center p-6 border-b">
                <Heading level="h1">Locations</Heading>
                <Button onClick={handleCreateLocation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Location
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
                                        No locations found.
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
                                {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
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
    label: "Locations",
    icon: MapPin,
})

export default LocationsPage

