# Quill.js Integration Guide

This document provides a complete guide to using Quill.js (via react-quill) for rich text editing in both the Medusa admin panel and the Remix storefront.

## Overview

Quill.js is integrated as a WYSIWYG (What You See Is What You Get) editor throughout the application:

- **Admin Panel**: Full-featured Quill editor for content creation
- **Storefront**: Lightweight Quill editor for customer reviews and messages
- **Reusable Components**: Customizable editor components for consistent implementation

## Installation

Quill.js is already installed as a dependency via `react-quill`. If needed, install manually:

```bash
yarn add react-quill quill
```

## Components

### 1. Admin Panel: QuillEditor Component

**Location**: [apps/medusa/src/admin/components/QuillEditor.tsx](apps/medusa/src/admin/components/QuillEditor.tsx)

A fully-featured, reusable Quill editor component for the Medusa admin panel.

#### Features
- Toolbar with headers, text formatting, lists, links, and images
- Optional image upload support
- Customizable height and placeholder
- Error display
- Read-only mode support
- Required field indicator

#### Props

```typescript
interface QuillEditorProps {
  id?: string              // Element ID (default: 'quill-editor')
  label?: string           // Field label
  value: string            // Editor content
  onChange: (value: string) => void  // Change handler
  placeholder?: string     // Placeholder text
  height?: string          // Editor height (default: '300px')
  readOnly?: boolean       // Read-only mode (default: false)
  enableImage?: boolean    // Image upload support (default: false)
  error?: string           // Error message
  required?: boolean       // Required field indicator (default: false)
}
```

#### Usage Example

```typescript
import { QuillEditor } from '../components/QuillEditor'

export const MyForm = () => {
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  return (
    <QuillEditor
      id="description"
      label="Product Description"
      value={content}
      onChange={setContent}
      placeholder="Enter product details..."
      height="400px"
      enableImage={true}
      required={true}
      error={error}
    />
  )
}
```

### 2. Admin Panel: Posts and Reviews

The following pages use QuillEditor:

#### Posts Module
- **Create Post**: [apps/medusa/src/admin/routes/posts/create/page.tsx](apps/medusa/src/admin/routes/posts/create/page.tsx)
- **Edit Post**: [apps/medusa/src/admin/routes/posts/edit/page.tsx](apps/medusa/src/admin/routes/posts/edit/page.tsx)

Features:
- Full rich text editing with headers, lists, links
- Image upload support
- Automatic image placeholder during upload
- Validation with Zod schema

#### Reviews Module
- **Review Detail**: [apps/medusa/src/admin/routes/reviews/[id]/page.tsx](apps/medusa/src/admin/routes/reviews/[id]/page.tsx)

Features:
- Edit review content with Quill editor
- Minimal toolbar (bold, italic, underline, lists, links)
- 250px editor height

### 3. Admin Widgets: Product Metadata

**Location**: [apps/medusa/src/admin/widgets/product-widget.tsx](apps/medusa/src/admin/widgets/product-widget.tsx)

Enhanced product metadata widget with three Quill editors:

- **Ingredients**: Product ingredients with formatting
- **Precautions of use**: Safety precautions and warnings
- **Application tips**: Usage instructions and tips

Each field is 200px in height and supports basic formatting.

#### Usage in Custom Widgets

```typescript
import QuillEditor from '../components/QuillEditor'

const MyWidget = ({ data }) => {
  const [metadata, setMetadata] = useState(data.metadata)

  const handleSave = async () => {
    await sdk.admin.product.update(data.id, {
      metadata: metadata,
    })
  }

  return (
    <QuillEditor
      label="Instructions"
      value={metadata.instructions || ''}
      onChange={(value) => setMetadata({ ...metadata, instructions: value })}
      height="250px"
    />
  )
}
```

## Storefront Components

### 1. RichTextarea Component

**Location**: [apps/storefront/app/components/common/forms/inputs/RichTextarea.tsx](apps/storefront/app/components/common/forms/inputs/RichTextarea.tsx)

A lightweight Quill editor component optimized for customer-facing forms.

#### Features
- Minimal toolbar (bold, italic, underline, lists, links)
- Lightweight and fast
- Error handling
- Read-only mode support
- Customizable height (default: 250px)

#### Props

```typescript
interface RichTextareaProps {
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
```

#### Usage Example

```typescript
import { RichTextarea } from '@/components/common/forms/inputs/RichTextarea'

export const ContactForm = () => {
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  return (
    <form onSubmit={handleSubmit}>
      <RichTextarea
        id="message"
        label="Your Message"
        value={message}
        onChange={setMessage}
        placeholder="Write your message..."
        error={errors.message}
        required={true}
        height="300px"
      />
    </form>
  )
}
```

### 2. Basic Textarea Component

**Location**: [apps/storefront/app/components/common/forms/inputs/Textarea.tsx](apps/storefront/app/components/common/forms/inputs/Textarea.tsx)

The standard HTML textarea component with enhanced styling. Use this when you don't need rich text editing.

```typescript
import { Textarea } from '@/components/common/forms/inputs/Textarea'

<Textarea
  placeholder="Enter your comment..."
  rows={5}
  error={error}
/>
```

## Toolbar Customization

### Admin Toolbar (Full Featured)

```javascript
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    ['link'],
    ['image'],
    ['clean']
  ]
}
```

### Storefront Toolbar (Minimal)

```javascript
const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ]
}
```

### Custom Toolbar

Create your own toolbar configuration:

```javascript
const customToolbar = {
  toolbar: [
    ['bold', 'italic'],                    // Basic formatting
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // Lists
    ['link'],                              // Links
    ['clean']                              // Clear formatting
  ]
}
```

## Image Upload

### Admin Panel Image Upload

Images are uploaded to `/admin/uploads` endpoint:

```typescript
const handleImageUpload = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL || '/'}/admin/uploads`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) throw new Error('Upload failed')

  const data = await response.json()
  return data.url || `/uploads/${data.fileName}`
}
```

To enable image uploads in QuillEditor:

```typescript
<QuillEditor
  enableImage={true}
  // ... other props
/>
```

## Styling

### Quill CSS Classes

The Quill editor uses standard CSS classes that can be customized:

```css
/* Editor container */
.ql-container {
  font-size: 16px;
  line-height: 1.6;
}

/* Editor toolbar */
.ql-toolbar {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
}

/* Editor content area */
.ql-editor {
  min-height: 200px;
}

/* Editor theme */
.ql-snow.ql-toolbar {
  background-color: #f5f5f5;
}
```

### Tailwind Integration

The components use Tailwind CSS for styling. Ensure your Tailwind config includes the Quill styles:

```css
@import 'react-quill/dist/quill.snow.css';
```

This is already imported in each component file.

## Content Storage and Retrieval

### HTML Content

Quill stores content as HTML. When storing in the database, you can:

1. **Store as HTML** (recommended):
   ```typescript
   const content = '<h2>Title</h2><p>Content here</p>'
   await sdk.client.post('/admin/posts', { content })
   ```

2. **Sanitize HTML** before storage (security):
   ```typescript
   import DOMPurify from 'dompurify'

   const sanitized = DOMPurify.sanitize(content)
   await sdk.client.post('/admin/posts', { content: sanitized })
   ```

3. **Display content**:
   ```typescript
   <div dangerouslySetInnerHTML={{ __html: post.content }} />
   ```

## Validation

### Zod Schema Example

```typescript
import * as z from 'zod'

const PostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  slug: z.string().min(1, 'Slug is required'),
})

// Validate
try {
  const validated = PostSchema.parse(formData)
  // Save to database
} catch (error) {
  if (error instanceof z.ZodError) {
    error.errors.forEach(err => {
      setError(err.path[0], err.message)
    })
  }
}
```

## Best Practices

### 1. Content Security
- Always sanitize HTML content using DOMPurify or similar
- Validate content length and format on the server
- Use `dangerouslySetInnerHTML` only for trusted content

### 2. User Experience
- Set appropriate editor heights (300-400px for main content, 200px for metadata)
- Use placeholder text to guide users
- Show error messages clearly
- Provide toolbar instructions for complex content

### 3. Performance
- Lazy load Quill editor only when needed
- Use the minimal toolbar for storefront forms
- Debounce onChange handlers for large forms

### 4. Accessibility
- Always include `label` prop for form fields
- Use `id` prop to link labels to editors
- Ensure keyboard navigation works properly
- Test with screen readers

## Migration Guide

### From Plain Textarea to Quill

**Before:**
```typescript
<Textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  rows={6}
/>
```

**After:**
```typescript
<QuillEditor
  value={content}
  onChange={setContent}
  height="300px"
/>
```

### Handling Existing Plain Text

If migrating from plain text to HTML:

```typescript
// Convert plain text to HTML for display
const plainTextToHtml = (text: string): string => {
  return text
    .split('\n')
    .map(line => `<p>${line}</p>`)
    .join('')
}

// When loading existing content
const content = plainTextToHtml(existingPlainText)
```

## Troubleshooting

### Issue: Toolbar not appearing

**Solution**: Ensure Quill CSS is imported:
```typescript
import 'react-quill/dist/quill.snow.css'
```

### Issue: Image upload not working

**Solution**:
1. Check that `/admin/uploads` endpoint exists
2. Verify `enableImage={true}` prop is set
3. Check browser console for CORS errors

### Issue: Content not persisting

**Solution**:
1. Verify onChange handler is updating state
2. Check that content is being sent to server
3. Validate server is storing HTML content correctly

### Issue: Editor not responsive

**Solution**:
1. Set explicit height: `height="300px"`
2. Wrap editor in container with defined width
3. Check z-index conflicts with other elements

## References

- [Quill.js Documentation](https://quilljs.com/docs/guide)
- [React-Quill GitHub](https://github.com/zenoamaro/react-quill)
- [Quill Formats](https://quilljs.com/docs/formats)
- [Quill Modules](https://quilljs.com/docs/modules)

## Support

For issues or questions about Quill integration:

1. Check the Quill documentation
2. Review component prop definitions
3. Check browser console for errors
4. Verify content format is valid HTML

---

**Last Updated**: November 2025
