/// <reference types="react" />
import React, { useMemo, useState, useCallback } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BookOpen, Plus, Pencil, X } from "@medusajs/icons"
import {
    Heading,
    Container,
    Button,
    Skeleton,
    Table,
    toast,
    Badge,
} from "@medusajs/ui"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../lib/sdk.js"
import { ColumnDef, createColumnHelper, PaginationState, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"

// Define the BankAccount type
type BankAccount = {
    id: string
    name: string
    account_holder: string
    account_number: string
    bank_code: string
    swift_code?: string | null
    qr_code_url?: string | null
    is_active: boolean
    display_order: number
    created_at: string
    updated_at: string
}

// Define the response type
type BankAccountsResponse = {
    bank_accounts: BankAccount[]
    count: number
    limit: number
    offset: number
}

const columnHelper = createColumnHelper<BankAccount>()

const BankAccountsPage = () => {
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

    const { data, isLoading } = useQuery<BankAccountsResponse>({
        queryFn: () => sdk.client.fetch(`/admin/bank-accounts`, {
            query: {
                limit,
                offset,
                order: "display_order:ASC,created_at:DESC",
            },
        }),
        queryKey: ["bank-accounts", limit, offset],
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            sdk.client.fetch(`/admin/bank-accounts/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bank-accounts"] })
            toast.success("Bank account deleted successfully")
        },
        onError: (error: any) => {
            toast.error("Error", {
                description: error.message || "Failed to delete bank account",
            })
        },
    })

    // Define handlers first using useCallback
    const handleCreateBankAccount = useCallback(() => {
        navigate("/bank-accounts/create")
    }, [navigate])

    const handleEditBankAccount = useCallback((bankAccount: BankAccount) => {
        navigate(`/bank-accounts/edit/${bankAccount.id}`)
    }, [navigate])

    const handleDeleteBankAccount = useCallback((id: string) => {
        if (confirm(`Are you sure you want to delete this bank account? This action cannot be undone.`)) {
            deleteMutation.mutate(id)
        }
    }, [deleteMutation])

    // Define columns using useMemo to avoid recreation on each render
    const columns = useMemo(() => [
        columnHelper.accessor("name", {
            header: "Bank Name",
        }),
        columnHelper.accessor("account_holder", {
            header: "Account Holder",
        }),
        columnHelper.accessor("account_number", {
            header: "Account Number",
            cell: ({ getValue }) => (
                <span className="font-mono text-sm">{getValue()}</span>
            ),
        }),
        columnHelper.accessor("bank_code", {
            header: "Bank Code",
            cell: ({ getValue }) => (
                <span className="font-mono text-sm">{getValue()}</span>
            ),
        }),
        columnHelper.accessor("is_active", {
            header: "Status",
            cell: ({ getValue }) => {
                const isActive = getValue()
                return (
                    <Badge color={isActive ? "green" : "gray"}>
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
                )
            },
        }),
        columnHelper.accessor("display_order", {
            header: "Order",
            cell: ({ getValue }) => (
                <span className="text-sm text-gray-500">{getValue()}</span>
            ),
        }),
        columnHelper.display({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const bankAccount = row.original
                return (
                    <div className="flex items-center space-x-2">
                        <Button
                            size="small"
                            variant="transparent"
                            onClick={() => handleEditBankAccount(bankAccount)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            size="small"
                            variant="transparent"
                            onClick={() => handleDeleteBankAccount(bankAccount.id)}
                            disabled={deleteMutation.isPending}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        }),
    ], [handleEditBankAccount, handleDeleteBankAccount, deleteMutation.isPending])

    const table = useReactTable({
        columns: columns as ColumnDef<BankAccount>[],
        data: data?.bank_accounts || [],
        getRowId: (row: BankAccount) => row.id as string,
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
                <Heading level="h1">Bank Accounts</Heading>
                <Button onClick={handleCreateBankAccount}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bank Account
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
                                        No bank accounts found.
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
    label: "Bank Accounts",
    icon: BookOpen,
})

export default BankAccountsPage

