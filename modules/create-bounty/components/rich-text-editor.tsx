"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo2,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

export function RichTextEditor({
  value,
  onChange,
}: {
  value: JSONContent;
  onChange: (value: JSONContent) => void;
}) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder:
          "Describe the context, task, constraints, and what great work looks like…",
      }),
    ],
    content: value,
    onUpdate: ({ editor: current }) => onChange(current.getJSON()),
    editorProps: { attributes: { class: "max-w-none" } },
  });

  useEffect(() => {
    if (!editor || JSON.stringify(editor.getJSON()) === JSON.stringify(value))
      return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  if (!editor)
    return (
      <div className="h-72 animate-pulse rounded-2xl bg-background-secondary-default" />
    );

  const tools = [
    {
      label: "Heading 2",
      icon: Heading2,
      active: editor.isActive("heading", { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Heading 3",
      icon: Heading3,
      active: editor.isActive("heading", { level: 3 }),
      run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "Bold",
      icon: Bold,
      active: editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: Italic,
      active: editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Bullet list",
      icon: List,
      active: editor.isActive("bulletList"),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Numbered list",
      icon: ListOrdered,
      active: editor.isActive("orderedList"),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Code block",
      icon: Code2,
      active: editor.isActive("codeBlock"),
      run: () => editor.chain().focus().toggleCodeBlock().run(),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border-button-default bg-background-primary-default">
      <div
        role="toolbar"
        aria-label="Description formatting"
        className="flex flex-wrap items-center gap-1 border-b border-separator-border bg-background-secondary-default p-2"
      >
        {tools.map(({ label, icon, active, run }) => (
          <Button
            key={label}
            type="button"
            size="xs"
            iconOnly
            variant={active ? "ghost" : "secondary"}
            leadingIcon={icon}
            aria-label={label}
            aria-pressed={active}
            onClick={run}
            className={cx(active && "ring-1 ring-accent-400")}
          />
        ))}
        <Button
          type="button"
          size="xs"
          iconOnly
          variant="secondary"
          leadingIcon={Link2}
          aria-label="Add link"
          onClick={() => { setLinkUrl(editor.getAttributes("link").href || "https://"); setLinkOpen(true); }}
        />
        <span className="mx-1 h-5 w-px bg-separator-border" />
        <Button
          type="button"
          size="xs"
          iconOnly
          variant="secondary"
          leadingIcon={Undo2}
          aria-label="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <Button
          type="button"
          size="xs"
          iconOnly
          variant="secondary"
          leadingIcon={Redo2}
          aria-label="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>
      <EditorContent editor={editor} className="editor-content" />
      {linkOpen && <div className="fixed inset-0 z-[90] grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setLinkOpen(false)}><section role="dialog" aria-modal="true" aria-labelledby="link-dialog-title" className="w-full max-w-md rounded-2xl border border-border-button-default bg-background-primary-default p-5 shadow-2xl"><div className="flex items-center justify-between"><h2 id="link-dialog-title" className="text-headline-semibold">Add link</h2><Button type="button" iconOnly size="small" variant="secondary" leadingIcon={Undo2} aria-label="Close" onClick={() => setLinkOpen(false)} /></div><label className="mt-5 grid gap-2 text-body-2-medium">Link URL<input autoFocus type="url" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="https://example.com" className="focus-ring h-10 rounded-xl border border-border-button-default bg-background-primary-default px-3 text-body-regular" /></label>{linkUrl.startsWith("http") && <a href={linkUrl} target="_blank" rel="noreferrer" className="mt-3 block truncate rounded-xl bg-background-secondary-default p-3 text-body-2-regular text-accent-600 hover:underline">Preview: {linkUrl}</a>}<div className="mt-5 flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setLinkOpen(false)}>Cancel</Button><Button type="button" disabled={!linkUrl.startsWith("http")} onClick={() => { editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run(); setLinkOpen(false); }}>Apply link</Button></div></section></div>}
    </div>
  );
}
