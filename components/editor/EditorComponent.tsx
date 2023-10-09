import { EditorContent, Editor } from "@tiptap/react";
import { useEffect, useState } from "react";

import editor_ from "./EditorComponent.module.css";
import { Project } from "@src/lib/utils/types";
import { join } from "@src/lib/utils/misc";

import TextBubbleMenu from "./menu/TextBubbleMenu";
import SceneBubbleMenu from "./menu/SceneBubbleMenu/SceneBubbleMenu";
import HypenBubbleMenu from "./menu/HypenBubbleMenu/HypenBubbleMenu";
import TransitionBubbleMenu from "./menu/TransitionBubbleMenu/TransitionBubbleMenu";
import SearchModal from "./SearchModal";
import { CommentContextProvider } from "@src/context/CommentContext";
import EditorHeader from "./EditHeader";

type Props = {
    editor: Editor | null;
    project: Project;
};

const EditorComponent = ({ editor, project }: Props) => {
    const [pages, setPages] = useState<number>(0);

    useEffect(() => {
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
        <CommentContextProvider>
            <EditorHeader project={project} />
            <div id="editor" className={editor_.container}>
                <div className={editor_.page_counter}>
                    {Array.from({ length: pages }, (_, page) => (
                        <p
                            key={page}
                            className={join(editor_.page_count, "unselectable")}
                        >
                            p.{page + 1}
                        </p>
                    ))}
                </div>
                <SearchModal editor={editor} />
                <TextBubbleMenu editor={editor} />
                <SceneBubbleMenu editor={editor} />
                <HypenBubbleMenu editor={editor} />
                <TransitionBubbleMenu editor={editor} />
                <EditorContent editor={editor} />
            </div>
        </CommentContextProvider>
    );
};

export default EditorComponent;
