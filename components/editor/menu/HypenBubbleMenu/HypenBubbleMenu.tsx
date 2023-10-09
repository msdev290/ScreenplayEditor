import React, { useEffect, useState, useRef, useCallback } from "react";
import { BubbleMenu, Editor } from "@tiptap/react";

// this is for BubbleMenu
import "tippy.js/animations/scale-subtle.css";
import Content from "./Content";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // prettier-ignore
    // @ts-ignore
    const currentText = !editor ? "" : editor.state.selection.$head.parent.content?.content[0]?.text ?? "";
    const arrays = [
        "DAY",
        "NIGHT",
        "AFTERNOON",
        "MORNING",
        "EVENING",
        "LATER",
        "MOMENTS LATER",
        "CONTINUOUS",
        "SAME TIME",
    ];

    const [filteredArrays, setFilteredArrays] = useState<string[]>(arrays);

    useEffect(() => {
        if (editor) {
            let state = editor.state;
            let anchor = state.selection.anchor;

            let selection = state.selection;
            let nodePos = selection.$head.parentOffset;

            let nodeSize = selection.$anchor.parent.content.size;
            let start = selection.$anchor.pos - selection.$anchor.parentOffset;
            let end = start + nodeSize;

            let temporaryText = state.doc.textBetween(start, end, "");
            let result: number[] = [];
            for (let i = 0; i < temporaryText.length; i++) {
                if (temporaryText[i] === "-") result.push(i);
            }

            let findStart: number | undefined = result
                .reverse()
                .find((res) => res <= nodePos);

            let text =
                typeof findStart == "undefined"
                    ? ""
                    : state.doc.textBetween(start + findStart, anchor, "");

            const filteredArrays = arrays.filter((item) => {
                if (text == "") return false;

                return (
                    item.toLowerCase().indexOf(text.toLowerCase().slice(1)) ===
                    0
                );
            });

            setFilteredArrays(filteredArrays);
        }
    }, [editor, currentText]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (editor && e.key === "Enter") {
                let { $from } = editor.view.state.selection;

                if (
                    editor.state.selection.$head.parent.attrs.class !=
                    "scene" ||
                    filteredArrays.length == 0
                ) {
                    return false;
                }

                editor
                    .chain()
                    .focus()
                    .insertContentAt($from.pos, " " + arrays[selectedIndex])
                    .run();

                return false;
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [selectedIndex, editor, currentText, arrays]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [currentText]);

    if (!editor) return null;

    return (
        <React.Fragment>
            <BubbleMenu
                editor={editor}
                tippyOptions={{
                    onShow: () => {
                        setIsOpen(true);
                    },
                    onHide: () => {
                        setIsOpen(false);
                    },
                    popperOptions: {
                        modifiers: [
                            {
                                name: "eventListeners",
                                options: { scroll: true },
                            },
                        ],
                        placement: "top-start",
                    },
                    duration: 100,
                }}
                pluginKey={"LocationBubbleMenu"}
                // eslint-disable-next-line no-unused-vars
                shouldShow={({ editor, view, state, oldState, from, to }) => {
                    if (
                        editor.state.selection.$head.parent.attrs.class !=
                        "scene"
                    ) {
                        return false;
                    }

                    let anchor = state.selection.anchor;

                    let selection = state.selection;
                    let nodePos = selection.$head.parentOffset;

                    let nodeSize = selection.$anchor.parent.content.size;
                    let start =
                        selection.$anchor.pos - selection.$anchor.parentOffset;
                    let end = start + nodeSize;

                    let MyTest = state.doc.textBetween(start, end, "");

                    let result: number[] = [];

                    for (let i = 0; i < MyTest.length; i++) {
                        if (MyTest[i] === "-") result.push(i);
                    }

                    let findStart: number | undefined = result
                        .reverse()
                        .find((res) => res <= nodePos);

                    let text =
                        typeof findStart == "undefined"
                            ? ""
                            : state.doc.textBetween(
                                start + findStart,
                                anchor,
                                ""
                            );

                    const myArray = arrays.filter((item) => {
                        if (text == "") return false;

                        return (
                            item
                                .toLowerCase()
                                .indexOf(text.toLowerCase().slice(1)) === 0
                        );
                    });

                    return myArray.length > 0 ? true : false;
                }}
            >
                {isOpen ? (
                    <Content
                        currentText={currentText}
                        filteredArrays={filteredArrays}
                        editor={editor}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                    />
                ) : null}
            </BubbleMenu>
        </React.Fragment>
    );
};

export default MenuBar;
