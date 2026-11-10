import { useEffect, useRef } from "react"
import { toast } from "@medusajs/ui"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"
import { sdk } from "../lib/sdk"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

interface BlockNoteEditorProps {
  /** HTML used to seed the editor. Read once on mount, so mount it after the data has loaded. */
  initialHtml?: string
  /** Called with the document serialized as HTML ("" when empty). */
  onChange: (html: string) => void
  minHeight?: number
}

const uploadFile = async (file: File): Promise<string> => {
  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file")
    throw new Error("Not an image")
  }

  if (file.size > MAX_IMAGE_SIZE) {
    toast.error("Image size must be less than 5MB")
    throw new Error("Image too large")
  }

  try {
    const response = await sdk.admin.upload.create({ files: [file] })
    return response.files[0].url
  } catch (error) {
    toast.error("Failed to upload image. Please try again.")
    throw error
  }
}

/**
 * Block-based (drag & drop) editor that stores its content as HTML, so the
 * existing `content` columns and storefront rendering keep working.
 */
const BlockNoteEditor = ({ initialHtml = "", onChange, minHeight = 400 }: BlockNoteEditorProps) => {
  const editor = useCreateBlockNote({ uploadFile })
  const seeded = useRef(false)

  useEffect(() => {
    if (seeded.current) return
    seeded.current = true

    if (initialHtml.trim()) {
      editor.replaceBlocks(editor.document, editor.tryParseHTMLToBlocks(initialHtml))
    }
  }, [editor, initialHtml])

  const handleChange = () => {
    const isEmpty = editor.document.every(
      (block) => block.type === "paragraph" && (!block.content || block.content.length === 0)
    )
    onChange(isEmpty ? "" : editor.blocksToHTMLLossy())
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-ui-bg-base" style={{ minHeight }}>
      <BlockNoteView editor={editor} onChange={handleChange} theme="light" />
    </div>
  )
}

export default BlockNoteEditor
