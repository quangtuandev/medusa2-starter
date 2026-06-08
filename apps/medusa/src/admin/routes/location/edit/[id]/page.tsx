/// <reference types="react" />
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ArrowLeft, Plus, Trash } from "@medusajs/icons"
import {
    Heading,
    Container,
    Button,
    Input,
    Label,
    toast,
    Textarea,
    Select,
    Skeleton,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { sdk } from "../../../../lib/sdk.js"
import * as z from "zod"

// Define option item type
type OptionItem = {
    type: string
    name: string
    value: string
}

// Define Country type
type Country = {
    iso_2: string
    display_name: string
    name: string
}

// Define Location type
type Location = {
    id: string
    iso_country_code: string
    name: string
    address_lines: string
    options: OptionItem[]
    created_at: string
    updated_at: string
}

// Define form validation schema
const LocationFormSchema = z.object({
    iso_country_code: z.string().min(2).max(2, "Country code must be 2 characters"),
    name: z.string().min(1, "Name is required"),
    address_lines: z.string().min(1, "Address is required"),
})

const EditLocationPage = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { id } = useParams<{ id: string }>()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        iso_country_code: "",
        name: "",
        address_lines: "",
    })

    const [options, setOptions] = useState<OptionItem[]>([
        { name: "", value: "", type: "" }
    ])

    // Fetch existing location
    const { data: locationData, isLoading: isLoadingLocation } = useQuery<{ location: Location }>({
        queryKey: ["location", id],
        queryFn: () => sdk.client.fetch(`/admin/location/${id}`),
        enabled: !!id,
    })

    // Fetch countries from Medusa
    const { data: countriesData, isLoading: isLoadingCountries } = useQuery({
        queryKey: ["countries"],
        queryFn: async () => {
            const response = await sdk.client.fetch(`/admin/location/countries`)
            return response.countries as Country[]
        },
    })

    // Populate form when location data is loaded
    useEffect(() => {
        if (locationData?.location) {
            const loc = locationData.location
            setFormData({
                iso_country_code: loc.iso_country_code || "",
                name: loc.name || "",
                address_lines: loc.address_lines || "",
            })

            // Handle options — could be an array or an old-format object
            if (Array.isArray(loc.options) && loc.options.length > 0) {
                setOptions(loc.options.map((opt: any) => ({
                    type: opt.type || "",
                    name: opt.name || "",
                    value: opt.value || "",
                })))
            } else {
                setOptions([{ name: "", value: "", type: "" }])
            }
        }
    }, [locationData])

    // Handlers for options array
    const handleAddOption = () => {
        setOptions([...options, { name: "", value: "", type: "" }])
    }

    const handleRemoveOption = (index: number) => {
        const newOptions = options.filter((_, i) => i !== index)
        setOptions(newOptions.length > 0 ? newOptions : [{ name: "", value: "", type: "" }])
    }

    const handleOptionChange = (index: number, field: "name" | "value" | "type", value: string) => {
        const newOptions = [...options]
        newOptions[index][field] = value
        setOptions(newOptions)
    }

    // Mutation for updating location
    const updateMutation = useMutation({
        mutationFn: async (data: z.infer<typeof LocationFormSchema>) => {
            return sdk.client.fetch(`/admin/location/${id}`, {
                method: "PUT",
                body: {
                    iso_country_code: data.iso_country_code.toUpperCase(),
                    name: data.name,
                    address_lines: data.address_lines,
                    options: options.filter(opt => opt.name.trim() !== "" && opt.value.trim() !== "").map(opt => ({
                        type: opt.type,
                        name: opt.name,
                        value: opt.value,
                    })),
                },
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["locations"] })
            queryClient.invalidateQueries({ queryKey: ["location", id] })
            toast.success("Location updated successfully")
            navigate("/location")
        },
        onError: (error: any) => {
            toast.error("Failed to update location", {
                description: error.message || "An error occurred",
            })
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const validatedData = LocationFormSchema.parse(formData)
            setIsSubmitting(true)
            await updateMutation.mutateAsync(validatedData)
        } catch (error) {
            if (error instanceof z.ZodError) {
                toast.error("Validation failed: " + error.errors[0]?.message)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBack = () => {
        navigate("/location")
    }

    const types = [
        {
            value: "phone",
            label: "Phone",
        },
        {
            value: "email",
            label: "Email",
        },
        {
            value: "sms",
            label: "SMS",
        },
        {
            value: "text",
            label: "Text",
        },
        {
            value: "url",
            label: "URL",
        }
    ]

    if (isLoadingLocation) {
        return (
            <Container className="divide-y p-0">
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" onClick={handleBack}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Locations
                        </Button>
                        <Heading level="h1">Edit Location</Heading>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </Container>
        )
    }

    return (
        <Container className="divide-y p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Locations
                    </Button>
                    <Heading level="h1">Edit Location</Heading>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || updateMutation.isPending}
                >
                    {isSubmitting || updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            {/* Form Content */}
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Country Code */}
                    <div>
                        <Label htmlFor="iso_country_code" className="block text-sm font-medium text-gray-700 mb-2">
                            Country *
                        </Label>
                        <Select
                            value={formData.iso_country_code}
                            onValueChange={(value: string) =>
                                setFormData({ ...formData, iso_country_code: value })
                            }
                            required
                        >
                            <Select.Trigger>
                                <Select.Value placeholder="Select a country" />
                            </Select.Trigger>
                            <Select.Content>
                                {isLoadingCountries ? (
                                    <Select.Item value="unassigned" disabled>
                                        Loading countries...
                                    </Select.Item>
                                ) : (
                                    countriesData?.map((country) => (
                                        <Select.Item key={country.iso_2} value={country.iso_2}>
                                            {country.display_name} ({country.iso_2})
                                        </Select.Item>
                                    ))
                                )}
                            </Select.Content>
                        </Select>
                        <p className="text-sm text-gray-500 mt-1">
                            Select the country for this location
                        </p>
                    </div>

                    {/* Address Lines */}
                    <div>
                        <Label htmlFor="address_lines" className="block text-sm font-medium text-gray-700 mb-2">
                            Address *
                        </Label>
                        <Textarea
                            id="address_lines"
                            value={formData.address_lines}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                setFormData({ ...formData, address_lines: e.target.value })
                            }
                            placeholder="Enter full address"
                            rows={4}
                            required
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Name *
                        </Label>
                        <Textarea
                            id="name"
                            value={formData.name}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Enter name"
                            rows={4}
                            required
                        />
                    </div>

                    {/* Options (Key-Value Pairs) */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label className="block text-sm font-medium text-gray-700">
                                Options
                            </Label>
                            <Button
                                type="button"
                                size="small"
                                variant="secondary"
                                onClick={handleAddOption}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Option
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {options.map((option, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <div className="w-[256px]">
                                        <Select
                                            value={option.type}
                                            onValueChange={(value: string) =>
                                                handleOptionChange(index, "type", value)
                                            }
                                            required>
                                            <Select.Trigger>
                                                <Select.Value placeholder="Select a type" />
                                            </Select.Trigger>
                                            <Select.Content>
                                                {types.map((item) => (
                                                    <Select.Item key={item.value} value={item.value}>
                                                        {item.label}
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select>
                                    </div>

                                    <div className="flex-1">
                                        <Input
                                            placeholder="Name (e.g., Phone, Email)"
                                            value={option.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleOptionChange(index, "name", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Value (e.g., tel:+0909090909)"
                                            value={option.value}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleOptionChange(index, "value", e.target.value)
                                            }
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        size="small"
                                        variant="transparent"
                                        onClick={() => handleRemoveOption(index)}
                                        disabled={options.length === 1}
                                    >
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Add key-value pairs for additional metadata. Empty entries will be ignored.
                        </p>
                    </div>
                </form>
            </div>
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Edit Location",
})

export default EditLocationPage
