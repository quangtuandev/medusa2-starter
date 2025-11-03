import { forwardRef, useMemo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import clsx from 'clsx'

export interface RichTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string | null
  readOnly?: boolean
  height?: string
  className?: string
  id?: string
  label?: string
  required?: boolean
}

/**
 * Rich Textarea component with Quill.js integration
 * Provides WYSIWYG editing for storefront forms
 */
export const RichTextarea = forwardRef<HTMLDivElement, RichTextareaProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Write your message here...',
      error,
      readOnly = false,
      height = '250px',
      className,
      id = 'rich-textarea',
      label,
      required = false,
    },
    ref
  ) => {
    // Toolbar configuration - minimal set of tools for storefront
    const modules = useMemo(
      () => ({
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['clean'],
        ],
      }),
      []
    )

    const formats = ['bold', 'italic', 'underline', 'list', 'bullet', 'link']

    return (
      <div className={clsx('space-y-2', className)}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div
          ref={ref}
          id={id}
          className={clsx('border rounded-lg overflow-hidden', {
            'border-red-500 ring-1 ring-red-500': !!error,
            'border-gray-300': !error,
          })}
        >
          <ReactQuill
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            theme={readOnly ? 'bubble' : 'snow'}
            placeholder={placeholder}
            readOnly={readOnly}
            style={{ height, backgroundColor: readOnly ? '#f9fafb' : 'white' }}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

RichTextarea.displayName = 'RichTextarea'

export default RichTextarea
