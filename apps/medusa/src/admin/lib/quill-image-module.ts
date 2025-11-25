import Quill from 'quill'

// Custom Image Blot with attributes support
const Image = Quill.import('formats/image')

class CustomImage extends Image {
    static blotName = 'image'
    static tagName = 'img'

    static create(value: string | { src: string; width?: string; height?: string; align?: string; alt?: string; class?: string }) {
        const node = super.create()

        if (typeof value === 'string') {
            node.setAttribute('src', value)
        } else {
            node.setAttribute('src', value.src)
            if (value.width) node.setAttribute('width', value.width)
            if (value.height) node.setAttribute('height', value.height)
            if (value.align) {
                node.style.float = value.align === 'left' ? 'left' : value.align === 'right' ? 'right' : 'none'
                node.style.display = value.align === 'center' ? 'block' : 'inline-block'
                node.style.margin = value.align === 'center' ? '0 auto' : '0'
            }
            if (value.alt) node.setAttribute('alt', value.alt)
            if (value.class) node.setAttribute('class', value.class)
        }

        // Make image resizable
        node.style.maxWidth = '100%'
        node.style.height = 'auto'
        node.style.cursor = 'pointer'

        return node
    }

    static value(node: HTMLImageElement) {
        return {
            src: node.getAttribute('src') || '',
            width: node.getAttribute('width') || '',
            height: node.getAttribute('height') || '',
            align: node.style.float || (node.style.display === 'block' && node.style.margin === '0 auto' ? 'center' : ''),
            alt: node.getAttribute('alt') || '',
            class: node.getAttribute('class') || '',
        }
    }

    format(name: string, value: string) {
        if (name === 'width' || name === 'height') {
            if (value) {
                this.domNode.setAttribute(name, value)
                this.domNode.style[name] = value
            } else {
                this.domNode.removeAttribute(name)
                this.domNode.style[name] = ''
            }
        } else if (name === 'align') {
            if (value === 'left') {
                this.domNode.style.float = 'left'
                this.domNode.style.display = 'inline-block'
                this.domNode.style.margin = '0'
            } else if (value === 'right') {
                this.domNode.style.float = 'right'
                this.domNode.style.display = 'inline-block'
                this.domNode.style.margin = '0'
            } else if (value === 'center') {
                this.domNode.style.float = 'none'
                this.domNode.style.display = 'block'
                this.domNode.style.margin = '0 auto'
            } else {
                this.domNode.style.float = 'none'
                this.domNode.style.display = 'inline-block'
                this.domNode.style.margin = '0'
            }
        } else if (name === 'alt') {
            if (value) {
                this.domNode.setAttribute('alt', value)
            } else {
                this.domNode.removeAttribute('alt')
            }
        } else {
            super.format(name, value)
        }
    }
}

// Register custom image format
Quill.register(CustomImage, true)

// Image resize module
export class ImageResize {
    private quill: Quill
    private img: HTMLImageElement | null = null
    private startX = 0
    private startY = 0
    private startWidth = 0
    private startHeight = 0
    private isResizing = false
    private resizeHandle: HTMLDivElement | null = null

    constructor(quill: Quill) {
        this.quill = quill
        this.init()
    }

    private init() {
        // Add click handler to images
        this.quill.root.addEventListener('click', this.handleImageClick.bind(this))
        document.addEventListener('mousedown', this.handleMouseDown.bind(this))
        document.addEventListener('mousemove', this.handleMouseMove.bind(this))
        document.addEventListener('mouseup', this.handleMouseUp.bind(this))
    }

    private handleImageClick(e: MouseEvent) {
        const target = e.target as HTMLElement
        if (target.tagName === 'IMG' && target.closest('.ql-editor')) {
            this.selectImage(target as HTMLImageElement)
        } else {
            this.deselectImage()
        }
    }

    private selectImage(img: HTMLImageElement) {
        this.deselectImage()
        this.img = img

        // Add selection border
        img.style.outline = '2px solid #4A90E2'
        img.style.outlineOffset = '2px'

        // Create resize handles
        this.createResizeHandles(img)
    }

    private deselectImage() {
        if (this.img) {
            this.img.style.outline = ''
            this.img.style.outlineOffset = ''
            this.img = null
        }
        if (this.resizeHandle) {
            this.resizeHandle.remove()
            this.resizeHandle = null
        }
    }

    private createResizeHandles(img: HTMLImageElement) {
        // Remove existing handles
        if (this.resizeHandle) {
            this.resizeHandle.remove()
        }

        // Create bottom-right resize handle
        const handle = document.createElement('div')
        handle.style.position = 'absolute'
        handle.style.width = '12px'
        handle.style.height = '12px'
        handle.style.backgroundColor = '#4A90E2'
        handle.style.border = '2px solid white'
        handle.style.borderRadius = '2px'
        handle.style.cursor = 'nwse-resize'
        handle.style.zIndex = '1000'
        handle.style.boxSizing = 'border-box'

        const updateHandlePosition = () => {
            const rect = img.getBoundingClientRect()
            const editorRect = this.quill.root.getBoundingClientRect()
            handle.style.left = `${rect.right - editorRect.left - 6}px`
            handle.style.top = `${rect.bottom - editorRect.top - 6}px`
        }

        updateHandlePosition()
        this.quill.root.parentElement?.appendChild(handle)
        this.resizeHandle = handle

        // Update position on scroll
        const observer = new MutationObserver(updateHandlePosition)
        observer.observe(this.quill.root, { attributes: true, childList: true, subtree: true })
    }

    private handleMouseDown(e: MouseEvent) {
        if (e.target === this.resizeHandle) {
            e.preventDefault()
            this.isResizing = true
            if (this.img) {
                this.startX = e.clientX
                this.startY = e.clientY
                this.startWidth = this.img.offsetWidth
                this.startHeight = this.img.offsetHeight
            }
        }
    }

    private handleMouseMove(e: MouseEvent) {
        if (this.isResizing && this.img) {
            e.preventDefault()
            const deltaX = e.clientX - this.startX
            const deltaY = e.clientY - this.startY

            const newWidth = Math.max(50, this.startWidth + deltaX)
            const newHeight = Math.max(50, this.startHeight + deltaY)

            // Maintain aspect ratio
            const aspectRatio = this.startWidth / this.startHeight
            const finalWidth = newWidth
            const finalHeight = newWidth / aspectRatio

            this.img.style.width = `${finalWidth}px`
            this.img.style.height = `${finalHeight}px`
            this.img.setAttribute('width', finalWidth.toString())
            this.img.setAttribute('height', finalHeight.toString())

            // Update resize handle position
            if (this.resizeHandle) {
                const rect = this.img.getBoundingClientRect()
                const editorRect = this.quill.root.getBoundingClientRect()
                this.resizeHandle.style.left = `${rect.right - editorRect.left - 6}px`
                this.resizeHandle.style.top = `${rect.bottom - editorRect.top - 6}px`
            }
        }
    }

    private handleMouseUp() {
        if (this.isResizing) {
            this.isResizing = false
            // Trigger change event
            const range = this.quill.getSelection(true)
            if (range) {
                this.quill.setSelection(range.index, 0, 'user')
            }
        }
    }
}

export default CustomImage

