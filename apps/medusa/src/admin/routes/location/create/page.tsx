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
} from "@medusajs/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../lib/sdk.js"
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

// Define form validation schema
const LocationFormSchema = z.object({
    iso_country_code: z.string().min(2).max(2, "Country code must be 2 characters"),
    name: z.string().min(1, "Name is required"),
    address_lines: z.string().min(1, "Address is required"),
})

const CreateLocationPage = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        iso_country_code: "",
        name: "",
        address_lines: "",
    })

    const [options, setOptions] = useState<OptionItem[]>([
        { name: "", value: "", type: "" }
    ])

    // Fetch countries from Medusa
    const { data: countriesData, isLoading: isLoadingCountries } = useQuery({
        queryKey: ["countries"],
        queryFn: async () => {
            const response = await sdk.client.fetch(`/admin/location/countries`)
            console.error(response.countries)
            return response.countries as Country[]
        },
    })

    // Handlers for options array
    const handleAddOption = () => {
        setOptions([...options, { name: "", value: "" }])
    }

    const handleRemoveOption = (index: number) => {
        const newOptions = options.filter((_, i) => i !== index)
        setOptions(newOptions.length > 0 ? newOptions : [{ name: "", value: "" }])
    }

    const handleOptionChange = (index: number, field: "name" | "value" | "type", value: string) => {
        const newOptions = [...options]
        newOptions[index][field] = value
        setOptions(newOptions)
    }

    // Mutation for creating location
    const createMutation = useMutation({
        mutationFn: async (data: z.infer<typeof LocationFormSchema>) => {
            // Convert options array to object, filtering out empty entries


            return sdk.client.fetch("/admin/location", {
                method: "POST",
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
            toast.success("Location created successfully")
            navigate("/location")
        },
        onError: (error: any) => {
            toast.error("Failed to create location", {
                description: error.message || "An error occurred",
            })
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const validatedData = LocationFormSchema.parse(formData)
            setIsLoading(true)
            await createMutation.mutateAsync(validatedData)
        } catch (error) {
            if (error instanceof z.ZodError) {
                toast.error("Validation failed: " + error.errors[0]?.message)
            }
        } finally {
            setIsLoading(false)
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

    return (
        <Container className="divide-y p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Locations
                    </Button>
                    <Heading level="h1">Create New Location</Heading>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading || createMutation.isPending}
                >
                    {isLoading || createMutation.isPending ? "Creating..." : "Create Location"}
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
    label: "Create Location",
})

export default CreateLocationPage

