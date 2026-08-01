"use client";

import { Bold, Italic, List, ListOrdered, Redo, Strikethrough, Undo } from "lucide-react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";

import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
  placeholder?: string;
};

function RichTextEditor({ value, onChange, dir = "rtl" }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        dir,
        class: cn(
          "prose prose-sm max-w-none min-h-50 rounded-b-[14px] bg-primary/4 px-4 py-3 text-sm text-dark-gray outline-none focus:bg-primary/8 [&_p]:my-2",
          dir === "ltr" ? "text-left" : "text-right",
        ),
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-[14px] border border-primary" dir={dir}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const buttons = [
    {
      label: "غامق",
      icon: Bold,
      isActive: editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "مائل",
      icon: Italic,
      isActive: editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "يتوسطه خط",
      icon: Strikethrough,
      isActive: editor.isActive("strike"),
      onClick: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: "قائمة نقطية",
      icon: List,
      isActive: editor.isActive("bulletList"),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "قائمة مرقمة",
      icon: ListOrdered,
      isActive: editor.isActive("orderedList"),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "تراجع",
      icon: Undo,
      isActive: false,
      onClick: () => editor.chain().focus().undo().run(),
    },
    {
      label: "إعادة",
      icon: Redo,
      isActive: false,
      onClick: () => editor.chain().focus().redo().run(),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-primary bg-primary/8 px-2 py-1.5">
      {buttons.map(({ label, icon: Icon, isActive, onClick }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          aria-pressed={isActive}
          onClick={onClick}
          className={cn(
            "grid size-8 place-items-center rounded-lg text-dark-gray transition hover:bg-primary/20",
            isActive && "bg-primary/30 text-secondary",
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}

export default RichTextEditor;
