import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { useState } from "react";
import { Button, Container } from "@medusajs/ui";
import { sdk } from "../lib/sdk";
import QuillEditor from "../components/QuillEditor";
import { toast } from "@medusajs/ui";
import { ContentfulSyncButton } from "./contentful-sync-button";

const ProductMetadataWidget = ({ data }) => {
    const [customField, setCustomField] = useState({
        description: "",
        description_vi: "",
        notes: "",
        notes_vi: "",
        ingredients: "",
        ingredients_vi: "",
        precautions_of_use: "",
        precautions_of_use_vi: "",
        application_tips: "",
        application_tips_vi: "",
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
                id="description"
                label="Description"
                value={customField.description || data.metadata?.description || ""}
                onChange={(value: string) => {
                    setCustomField({
                        ...customField,
                        description: value,
                    });
                }}
                placeholder="Enter product description..."
                height="200px"
            />
            <QuillEditor
                id="description-vi"
                label="Description in Vietnamese"
                value={customField.description_vi || data.metadata?.description_vi || ""}
                onChange={(value: string) => {
                    setCustomField({
                        ...customField,
                        description_vi: value,
                    });
                }}
                placeholder="Enter product description in Vietnamese..."
                height="200px"
            />
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
                id="notes-vi"
                label="Notes in Vietnamese"
                value={customField.notes_vi || data.metadata?.notes_vi || ""}
                onChange={(value: string) => {
                    setCustomField({
                        ...customField,
                        notes_vi: value,
                    });
                }}
                placeholder="Enter product notes in Vietnamese..."
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
                id="ingredients-vi"
                label="Ingredients in Vietnamese"
                value={customField.ingredients_vi || data.metadata?.ingredients_vi || ""}
                onChange={(value: string) => {
                    setCustomField({
                        ...customField,
                        ingredients_vi: value,
                    });
                }}
                placeholder="Enter product ingredients in Vietnamese..."
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
                id="precautions-vi"
                label="Precautions of use in Vietnamese"
                value={customField.precautions_of_use_vi || data.metadata?.precautions_of_use_vi || ""}
                onChange={(value: string) => {
                    setCustomField({
                        ...customField,
                        precautions_of_use_vi: value,
                    });
                }}
                placeholder="Enter usage precautions in Vietnamese..."
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
            <QuillEditor
                id="application-tips-vi"
                label="Application tips in Vietnamese"
                value={customField.application_tips_vi || data.metadata?.application_tips_vi || ""}
                onChange={(value: string) => {
                    setCustomField({
                        ...customField,
                        application_tips_vi: value,
                    });
                }}
                placeholder="Enter application tips in Vietnamese..."
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