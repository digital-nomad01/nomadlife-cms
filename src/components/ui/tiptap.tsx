"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect } from "react";
import {Underline} from "@tiptap/extension-underline";
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import {TextAlign} from "@tiptap/extension-text-align";
import { Bold,Italic,UnderlineIcon,List,ListOrdered,SquareSplitVertical } from "lucide-react";

type TiptapProps = {
  value?: string;
  onChange?: (html: string) => void;
};

const TiptapEditor = ({ value, onChange }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList,
      OrderedList,
      ListItem,
      Underline,
      TextAlign.configure({
        types: ["paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    content: value ?? "<p></p>",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  // Keep editor content in sync if value changes externally
  useEffect(() => {
    if (editor && typeof value === "string" && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleHeading = useCallback(
    (level: any) => {
      editor?.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );
  const toggleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run();
  }, [editor]);
  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);
  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-md p-4">
      <div className="mb-4 flex gap-2">
        <Button onClick={toggleBold} size='sm' variant={editor.isActive("bold") ? "default" : "outline"}>
          <Bold/>
        </Button>
        <Button onClick={toggleItalic} size='sm' variant={editor.isActive("italic") ? "default" : "outline"}>
          <Italic/>
        </Button>
        <Button onClick={toggleUnderline} size='sm' variant={editor.isActive("underline") ? "default" : "outline"}>
          <UnderlineIcon/>
        </Button>
        <Button onClick={toggleBulletList} size='sm' variant={editor.isActive("bulletList") ? 'default' : 'outline'}>
         <List/>
        </Button>
        <Button onClick={toggleOrderedList} size='sm' variant={editor.isActive("orderedList") ? 'default' : 'outline'}>
         <ListOrdered/>
        </Button>
        <Button onClick={() => editor.chain().focus().splitListItem('listItem').run()} size='sm' variant={editor.isActive("splitListItem") ? 'default' : 'outline'}>
            <SquareSplitVertical/>
        </Button>
        <Button onClick={() => toggleHeading(1)} size='sm' variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}>
          H1
        </Button>
        <Button onClick={() => toggleHeading(2)} size='sm' variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}>
          H2
        </Button>
      </div>
      <EditorContent editor={editor} className="min-h-[200px]" />
    </div>
  );
};

export default TiptapEditor;