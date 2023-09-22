import { EditorContent, Editor, BubbleMenu } from "@tiptap/react";
import { useEffect, useState } from "react";

import editor_ from "./EditorComponent.module.css";
import { join } from "@src/lib/utils/misc";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { BlockNoteEditor, Block } from "@blocknote/core";

import BubbleButton from "./menu/BubbleButton";

import {
  RxFontBold,
  RxFontItalic,
  RxStrikethrough,
  RxCode,
  RxChevronDown,
  RxChatBubble,
} from "react-icons/rx";

type Props = {
  editor: Editor | null;
};

const EditorComponent = ({ editor }: Props) => {
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  // const [editor1, setEditor1] = useState<BlockNoteEditor>();
  // const editor1: BlockNoteEditor = useBlockNote();
  const editor1 = useBlockNote({
    // Listens for when the editor's contents change.
    // initialContent: blocks,
    onEditorContentChange: (editor) =>
      // Converts the editor's contents to an array of Block objects.
      setBlocks(editor.topLevelBlocks),
  });

  const [pages, setPages] = useState<number>(0);

  console.log("Editor:", editor?.options.content?.content);

  const initializeData = () => {
    var items = [];
    for (var idx = 0; idx < editor?.options.content?.content.length; idx++) {
      const texts = editor?.options.content?.content[idx].content.map(
        (item) => item.text
      );
      // console.log("first", editor?.options.content?.content[idx].attrs.class);
      items.push({
        // attrs: editor?.options.content?.content[idx].attrs.class,
        type: "paragraph",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [
          {
            type: "text",
            text: texts[0],
            styles: {},
          },
        ],
        children: [],
      });
    }
    setBlocks(items);
  };
  useEffect(() => {
    initializeData();
    const target = document.getElementById("editor")!;
    const callback = (entries: ResizeObserverEntry[]) => {
      const height = entries[0].contentRect.height;
      const nbPages = +((height || 0) / 860).toFixed(0);
      setPages(nbPages);
    };
    const observer = new ResizeObserver(callback);
    observer.observe(target);
  }, []);

  return (
    <div id="editor" className={editor_.container}>
      <div className={editor_.page_counter}>
        {Array.from({ length: pages }, (_, page) => (
          <p key={page} className={join(editor_.page_count, "unselectable")}>
            p.{page + 1}
          </p>
        ))}
      </div>
      <EditorContent editor={editor} />
      {/* {editor && (
        <BubbleMenu
          className="bg-white shadow-xl border border-zinc-200 shadow-black/20 rounded-lg overflow-hidden flex flex-col"
          editor={editor}
        >
          <BubbleButton>
            Text
            <RxChevronDown className="w-4 h-4" />
          </BubbleButton>
          <BubbleButton>
            Comment
            <RxChatBubble className="w-4 h-4" />
          </BubbleButton>

          <div className="flex items-center">
            <BubbleButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              data-active={editor.isActive("bold")}
            >
              <RxFontBold className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              data-active={editor.isActive("italic")}
            >
              <RxFontItalic className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              data-active={editor.isActive("strike")}
            >
              <RxStrikethrough className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              data-active={editor.isActive("code")}
            >
              <RxCode className="w-4 h-4" />
            </BubbleButton>
          </div>
        </BubbleMenu>
      )} */}
      {/* <BlockNoteView editor={editor1} /> */}
    </div>
  );
};

export default EditorComponent;
