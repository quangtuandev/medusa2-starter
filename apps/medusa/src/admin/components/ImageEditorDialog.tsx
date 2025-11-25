import React, { useState, useEffect } from 'react'
import {
    FocusModal,
    Button,
    Input,
    Label,
    Select,
} from '@medusajs/ui'

interface ImageEditorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    imageData: {
        src: string
        width?: string
        height?: string
        align?: string
        alt?: string
        class?: string
    } | null
    onSave: (data: {
        width?: string
        height?: string
        align?: string
        alt?: string
        class?: string
    }) => void
}

export const ImageEditorDialog: React.FC<ImageEditorDialogProps> = ({
    open,
    onOpenChange,
    imageData,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        width: '',
        height: '',
        align: '',
        alt: '',
        class: '',
    })

    useEffect(() => {
        if (imageData) {
            setFormData({
                width: imageData.width || '',
                height: imageData.height || '',
                align: imageData.align || '',
                alt: imageData.alt || '',
                class: imageData.class || '',
            })
        }
    }, [imageData])

    const handleSave = () => {
        onSave(formData)
        onOpenChange(false)
    }

    const handleReset = () => {
        setFormData({
            width: '',
            height: '',
            align: '',
            alt: '',
            class: '',
        })
    }

    return (
        <FocusModal open={open} onOpenChange={onOpenChange}>
            <FocusModal.Content className="max-w-md">
                <FocusModal.Header>
                    <FocusModal.Title>Chỉnh sửa hình ảnh</FocusModal.Title>
                </FocusModal.Header>
                
                <FocusModal.Body className="space-y-4 mt-4">
                    {/* Image Preview */}
                    {imageData?.src && (
                        <div className="flex justify-center mb-4">
                            <img
                                src={imageData.src}
                                alt={formData.alt || 'Preview'}
                                className="max-w-full max-h-48 object-contain rounded border"
                                style={{
                                    width: formData.width ? `${formData.width}px` : 'auto',
                                    height: formData.height ? `${formData.height}px` : 'auto',
                                }}
                            />
                        </div>
                    )}

                    {/* Width */}
                    <div>
                        <Label htmlFor="width" className="block text-sm font-medium mb-2">
                            Chiều rộng (px)
                        </Label>
                        <Input
                            id="width"
                            type="number"
                            value={formData.width}
                            onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                            placeholder="Tự động"
                        />
                    </div>

                    {/* Height */}
                    <div>
                        <Label htmlFor="height" className="block text-sm font-medium mb-2">
                            Chiều cao (px)
                        </Label>
                        <Input
                            id="height"
                            type="number"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            placeholder="Tự động"
                        />
                    </div>

                    {/* Align */}
                    <div>
                        <Label htmlFor="align" className="block text-sm font-medium mb-2">
                            Căn chỉnh
                        </Label>
                        <Select value={formData.align} onValueChange={(value: string) => setFormData({ ...formData, align: value })}>
                            <Select.Trigger>
                                <Select.Value placeholder="Chọn căn chỉnh" />
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item value="">Mặc định</Select.Item>
                                <Select.Item value="left">Trái</Select.Item>
                                <Select.Item value="center">Giữa</Select.Item>
                                <Select.Item value="right">Phải</Select.Item>
                            </Select.Content>
                        </Select>
                    </div>

                    {/* Alt Text */}
                    <div>
                        <Label htmlFor="alt" className="block text-sm font-medium mb-2">
                            Alt Text (Mô tả)
                        </Label>
                        <Input
                            id="alt"
                            value={formData.alt}
                            onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                            placeholder="Mô tả hình ảnh"
                        />
                    </div>

                    {/* CSS Class */}
                    <div>
                        <Label htmlFor="class" className="block text-sm font-medium mb-2">
                            CSS Class
                        </Label>
                        <Input
                            id="class"
                            value={formData.class}
                            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                            placeholder="custom-class"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="secondary" onClick={handleReset}>
                            Đặt lại
                        </Button>
                        <Button variant="secondary" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSave}>
                            Lưu
                        </Button>
                    </div>
                </FocusModal.Body>
            </FocusModal.Content>
        </FocusModal>
    )
}

