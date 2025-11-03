import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { useState } from "react";
import { Button, Container } from "@medusajs/ui";
import { sdk } from "../lib/sdk";
import QuillEditor from "../components/QuillEditor";
import { toast } from "@medusajs/ui";

const ProductMetadataWidget = ({ data }) => {
    const [customField, setCustomField] = useState({
        notes: "",
        ingredients: "",
        precautions_of_use: "",
        application_tips: "",
    });

    const handleSave = async () => {
        sdk.admin.product.update(data.id, {
            metadata: {
                ...data.metadata,
                ...customField,
            },
        });
        toast.success("Product metadata saved successfully");
    };

    return (
        <Container className="bg-white p-4 rounded-lg space-y-6">
            <QuillEditor
                id="notes"
                label="Notes"
                value={customField.notes || data.metadata?.notes || ""}
                onChange={(value: string) => {
                    setCustomField({
                        ...customField,
                        notes: value,
                    });
                }}
                placeholder="Enter product notes..."
                height="200px"
            />
            <QuillEditor
                id="ingredients"
                label="Ingredients"
                value={customField.ingredients || data.metadata?.ingredients || ""}
                onChange={(value: string) => {
                    setCustomField({
                        ...customField,
                        ingredients: value,
                    });
                }}
                placeholder="Enter product ingredients..."
                height="200px"
            />
            <QuillEditor
                id="ingredients"
                label="Ingredients"
                value={customField.ingredients || data.metadata?.ingredients || ""}
                onChange={(value: string) => {
                    setCustomField({
                        ...customField,
                        ingredients: value,
                    });
                }}
                placeholder="Enter product ingredients..."
                height="200px"
            />
            <QuillEditor
                id="precautions"
                label="Precautions of use"
                value={customField.precautions_of_use || data.metadata?.precautions_of_use || ""}
                onChange={(value: string) => {
                    setCustomField({
                        ...customField,
                        precautions_of_use: value,
                    });
                }}
                placeholder="Enter usage precautions..."
                height="200px"
            />
            <QuillEditor
                id="application-tips"
                label="Application tips"
                value={customField.application_tips || data.metadata?.application_tips || ""}
                onChange={(value: string) => {
                    setCustomField({
                        ...customField,
                        application_tips: value,
                    });
                }}
                placeholder="Enter application tips..."
                height="200px"
            />
            <Button onClick={handleSave}>Save</Button>
        </Container>
    );
};

export const config = defineWidgetConfig({
    zone: "product.details.after",
});

export default ProductMetadataWidget;