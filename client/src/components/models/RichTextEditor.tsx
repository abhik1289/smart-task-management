import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";

import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

function ToolbarButton({
  active,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md text-[#374151] transition-colors hover:bg-[#f5f5f5] hover:text-[#111111]",
        active && "bg-[#111111] text-white hover:bg-[#111111] hover:text-white",
      )}>
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  return (
    <div className="flex items-center gap-0.5 border-b border-[#e5e7eb] bg-[#f8f9fa] px-2 py-1.5">
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolbarButton>
      <div className="mx-1 h-4 w-px bg-[#e5e7eb]" />
      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Ordered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Add a more detailed description…",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[120px] max-h-[260px] overflow-y-auto px-3 py-2.5 text-[14px] leading-relaxed text-[#111111] focus:outline-none [&_p]:my-1 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p.is-editor-empty:first-child]:before:text-[#898989] [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_p.is-editor-empty:first-child]:before:float-left [&_p.is-editor-empty:first-child]:before:h-0 [&_p.is-editor-empty:first-child]:before:pointer-events-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-[#e5e7eb] bg-white focus-within:border-[#111111] focus-within:ring-1 focus-within:ring-[#111111]",
        className,
      )}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
