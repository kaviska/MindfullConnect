import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Italic,
    List,
    ListOrdered,
    Strikethrough,
  } from "lucide-react";
  import { Toggle } from "@/components/ui/toggle";
  import { Editor } from "@tiptap/react";
  
  export default function MenuBar({ editor }: { editor: Editor | null }) {
    if (!editor) {
      return null;
    }
  
    const Options = [
      {
        icon: <Heading1 className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        pressed: editor.isActive("heading", { level: 1 }),
      },
      {
        icon: <Heading2 className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        pressed: editor.isActive("heading", { level: 2 }),
      },
      {
        icon: <Heading3 className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        pressed: editor.isActive("heading", { level: 3 }),
      },
      {
        icon: <Bold className="size-4" />,
        onClick: () => editor.chain().focus().toggleBold().run(),
        pressed: editor.isActive("bold"),
      },
      {
        icon: <Italic className="size-4" />,
        onClick: () => editor.chain().focus().toggleItalic().run(),
        pressed: editor.isActive("italic"),
      },
      {
        icon: <Strikethrough className="size-4" />,
        onClick: () => editor.chain().focus().toggleStrike().run(),
        pressed: editor.isActive("strike"),
      },
      {
        icon: <List className="size-4" />,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        pressed: editor.isActive("bulletList"),
      },
      {
        icon: <ListOrdered className="size-4" />,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        pressed: editor.isActive("orderedList"),
      },
    ];
  
    return (
<div className="sticky top-0 z-50 border rounded-md p-1 mb-1 bg-slate-50 space-x-2 border-amber-300">
    {Options.map((option, index) => (
          <Toggle
            key={index}
            pressed={option.pressed}
            onPressedChange={option.onClick}
          >
            {option.icon}
          </Toggle>
        ))}
      </div>
    );
  }