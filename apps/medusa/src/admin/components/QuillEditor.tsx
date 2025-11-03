import React, { useMemo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Label, Button, toast } from '@medusajs/ui'

interface QuillEditorProps {
  id?: string
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
  readOnly?: boolean
  enableImage?: boolean
  error?: string
  required?: boolean
}

/**
 * Reusable Quill Editor Component
 * Provides WYSIWYG editing with customizable features
 */
const QuillEditor: React.FC<QuillEditorProps> = ({
  id = 'quill-editor',
  label,
  value,
  onChange,
  placeholder = 'Write your content here...',
  height = '300px',
  readOnly = false,
  enableImage = false,
  error,
  required = false,
}) => {
  const editorId = `${id}-editor`

  // Toolbar configuration
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['link'],
        ...(enableImage ? [['image']] : []),
        ['clean'],
      ],
    }),
    [enableImage]
  )

  // Formats that are allowed in the editor
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'link',
    ...(enableImage ? ['image'] : []),
  ]

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || '/'}/admin/uploads`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.url || `/uploads/${data.fileName}`
    } catch (error) {
      console.error('Image upload failed:', error)
      toast.error('Failed to upload image')
      throw error
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={editorId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div
        className={`border rounded-lg overflow-hidden ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <ReactQuill
          id={editorId}
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          theme={readOnly ? 'bubble' : 'snow'}
          placeholder={placeholder}
          readOnly={readOnly}
          style={{ height }}
        />
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      {enableImage && (
        <div className="flex items-center gap-3 mt-3">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return

              try {
                const imageUrl = await handleImageUpload(file)
                const quill = ReactQuill.Quill.getInstance(
                  document.getElementById(editorId) as HTMLDivElement
                )

                if (quill) {
                  const range = quill.getSelection()
                  const index = range?.index || quill.getLength() - 1
                  quill.insertEmbed(index, 'image', imageUrl)
                  quill.setSelection(index + 1, 0)
                }

                e.target.value = ''
              } catch (error) {
                console.error('Failed to upload image:', error)
              }
            }}
            className="hidden"
            id={`${editorId}-upload`}
          />
          <Button
            variant="ghost"
            size="small"
            onClick={() =>
              document.getElementById(`${editorId}-upload`)?.click()
            }
          >
            Upload Image
          </Button>
          <span className="text-sm text-gray-500">
            Click to add images from your computer
          </span>
        </div>
      )}
    </div>
  )
}

export default QuillEditor
