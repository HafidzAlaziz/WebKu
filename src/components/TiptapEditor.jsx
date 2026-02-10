import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link as LinkIcon,
    Image as ImageIcon,
    RotateCcw,
    RotateCw,
    Type
} from 'lucide-react'

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null
    }

    const addImage = () => {
        const url = window.prompt('Enter image URL')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('Enter URL', previousUrl)

        if (url === null) {
            return
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-t-xl sticky top-0 z-10 transition-colors duration-200">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive('bold') ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive('italic') ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Italic"
            >
                <Italic size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive('underline') ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Underline"
            >
                <UnderlineIcon size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive('strike') ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Strike"
            >
                <Strikethrough size={18} />
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 my-auto" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Heading 1"
            >
                <Heading1 size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Heading 2"
            >
                <Heading2 size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Heading 3"
            >
                <Heading3 size={18} />
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 my-auto" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Bullet List"
            >
                <List size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive('orderedList') ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Ordered List"
            >
                <ListOrdered size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive('blockquote') ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Blockquote"
            >
                <Quote size={18} />
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 my-auto" />

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Align Left"
            >
                <AlignLeft size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Align Center"
            >
                <AlignCenter size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Align Right"
            >
                <AlignRight size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Align Justify"
            >
                <AlignJustify size={18} />
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 my-auto" />

            <button
                type="button"
                onClick={setLink}
                className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${editor.isActive('link') ? 'bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400'}`}
                title="Link"
            >
                <LinkIcon size={18} />
            </button>
            <button
                type="button"
                onClick={addImage}
                className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-gray-400"
                title="Image"
            >
                <ImageIcon size={18} />
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 my-auto" />

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-slate-600 dark:text-gray-400"
                title="Undo"
            >
                <RotateCcw size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-slate-600 dark:text-gray-400"
                title="Redo"
            >
                <RotateCw size={18} />
            </button>
        </div>
    )
}

const TiptapEditor = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                link: { openOnClick: false, HTMLAttributes: { class: 'text-blue-600 dark:text-blue-400 underline cursor-pointer' } },
                // If underline is missing in StarterKit, we add it back. If it's there, we configure it.
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'listItem'],
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-xl my-4',
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert focus:outline-none max-w-none min-h-[300px] p-4 text-slate-800 dark:text-gray-200',
            },
        },
    })

    return (
        <div className="w-full border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 bg-white dark:bg-slate-900 shadow-sm">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />

            <style>{`
        .tiptap ul {
          list-style-type: disc !important;
          padding-left: 1.5em !important;
          margin: 1em 0 !important;
        }
        .tiptap ol {
          list-style-type: decimal !important;
          padding-left: 1.5em !important;
          margin: 1em 0 !important;
        }
        .tiptap li {
          margin-bottom: 0.5em !important;
        }
        .tiptap blockquote {
          border-left: 4px solid #3b82f6 !important;
          padding-left: 1em !important;
          font-style: italic !important;
          margin: 1em 0 !important;
          color: #4b5563 !important;
        }
        .dark .tiptap blockquote {
          color: #9ca3af !important;
        }
        .tiptap a {
          color: #2563eb !important;
          text-decoration: underline !important;
        }
        .dark .tiptap a {
          color: #60a5fa !important;
        }
        .tiptap p.ql-align-center { text-align: center !important; }
        .tiptap p.ql-align-right { text-align: right !important; }
        .tiptap p.ql-align-justify { text-align: justify !important; }
        
        .tiptap li.text-center, .tiptap li[style*="text-align: center"] { text-align: center !important; }
        .tiptap li.text-right, .tiptap li[style*="text-align: right"] { text-align: right !important; }
        .tiptap li.text-justify, .tiptap li[style*="text-align: justify"] { text-align: justify !important; }

        .tiptap li.text-center, .tiptap li.text-right, .tiptap li.text-justify,
        .tiptap li[style*="text-align"] {
          list-style-position: inside !important;
        }

        /* Essential for marker to move with text: make inner p inline */
        .tiptap li p {
          display: inline !important;
          margin: 0 !important;
        }

        /* Support for when alignment is on the paragraph inside the list item */
        .tiptap li:has(p.text-center), .tiptap li:has(p[style*="text-align: center"]) { text-align: center !important; }
        .tiptap li:has(p.text-right), .tiptap li:has(p[style*="text-align: right"]) { text-align: right !important; }
        .tiptap li:has(p.text-justify), .tiptap li:has(p[style*="text-align: justify"]) { text-align: justify !important; }
        
        .tiptap li:has(p.text-center), .tiptap li:has(p.text-right), .tiptap li:has(p.text-justify),
        .tiptap li:has(p[style*="text-align"]) {
          list-style-position: inside !important;
        }

        /* Text Alignment Support */
        .tiptap .text-left { text-align: left !important; }
        .tiptap .text-center { text-align: center !important; }
        .tiptap .text-right { text-align: right !important; }
        .tiptap .text-justify { text-align: justify !important; }
      `}</style>
        </div>
    )
}

export default TiptapEditor
