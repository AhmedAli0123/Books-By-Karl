"use client"

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { PortableTextBlock } from "@portabletext/types";

interface RichTextEditorProps {
  value: PortableTextBlock[];
  onChange: (value: PortableTextBlock[]) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }: { editor: Editor }) => {
      const content = editor.getJSON();
      // Convert the editor content to Portable Text format
      const portableText: PortableTextBlock[] = content.content?.map((block: any) => ({
        _type: 'block',
        style: block.type === 'heading' ? `h${block.attrs.level}` : 'normal',
        children: block.content?.map((node: any) => ({
          _type: 'span',
          text: node.text,
          marks: node.marks || []
        })) || []
      })) || [];
      onChange(portableText);
    },
  });

  return (
    <div className="prose prose-invert max-w-none">
      <div className="border-b border-gray-600 p-2 flex gap-2">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${
            editor?.isActive("bold") ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${
            editor?.isActive("italic") ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${
            editor?.isActive("heading", { level: 2 })
              ? "bg-blue-500"
              : "hover:bg-gray-700"
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded ${
            editor?.isActive("heading", { level: 3 })
              ? "bg-blue-500"
              : "hover:bg-gray-700"
          }`}
        >
          H3
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded ${
            editor?.isActive("blockquote") ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
        >
          Quote
        </button>
      </div>
      <EditorContent editor={editor} className="p-4 min-h-[200px]" />
    </div>
  );
} 