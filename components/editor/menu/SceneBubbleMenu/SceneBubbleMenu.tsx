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
    const arrays = ["INT.", "EXT.", "I/E."];
    const filteredArrays = arrays.filter(
        (item) => item.toLowerCase().indexOf(currentText.toLowerCase()) === 0
    );

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (editor && e.key === "Enter") {
                let selection = editor.state.selection;
                let { $from, to, anchor } = selection;
                let text = editor.state.doc.textBetween(anchor - 1, anchor, "");

                let nodeSize = selection.$anchor.parent.content.size;
                let nodePos = selection.$head.parentOffset;
                let cursorAtTheLast = nodePos == nodeSize;
                let from = $from.pos - $from.parentOffset;

                if (
                    editor.state.selection.$head.parent.attrs.class !=
                        "scene" ||
                    text == "-"
                ) {
                    return false;
                }

                const suggestions = arrays.filter(
                    (item) =>
                        item
                            .toLowerCase()
                            .indexOf(currentText.toLowerCase()) === 0
                );

                if (suggestions.length == 0 && cursorAtTheLast) {
                    // console.log("test 1");
                    editor
                        .chain()
                        .insertContentAt($from.pos, `<p class="action"></p>`)
                        .focus($from.pos)
                        .run();
                    return false;
                }

                if (typeof filteredArrays[selectedIndex] == "undefined") {
                    // console.log("test 2");
                    // jika filteredArrays[selectedIndex] undefined
                    editor.commands.splitBlock();
                    return false;
                }

                if (
                    filteredArrays[selectedIndex].toLowerCase() ==
                        currentText.toLowerCase() &&
                    cursorAtTheLast
                ) {
                    // jika filteredArrays saat ini sama dengan cuurent text dan berada di paling akhir
                    // console.log("test 3");
                    editor
                        .chain()
                        .insertContentAt($from.pos, `<p class="action"></p>`)
                        .focus($from.pos)
                        .run();
                    return false;
                }

                if (nodeSize != 0 && !cursorAtTheLast) {
                    // console.log("test 4");
                    editor.commands.splitBlock();
                    return false;
                }

                if (nodeSize != 0 && cursorAtTheLast) {
                    // jika berada paling terakhir dan setidak nya da 1 nilai
                    if (
                        arrays.find(
                            (array) =>
                                array
                                    .toLowerCase()
                                    .slice(0, currentText.length) ==
                                currentText.toLowerCase()
                        )
                    ) {
                        // console.log("test 5");

                        editor
                            .chain()
                            .focus()
                            .insertContentAt(
                                { from, to },
                                filteredArrays[selectedIndex]
                            )
                            .run();
                        return false;
                    } else {
                        // console.log("test 6");
                        editor
                            .chain()
                            .insertContentAt(
                                $from.pos,
                                `<p class="action"></p>`
                            )
                            .focus($from.pos)
                            .run();
                    }

                    return false;
                }

                return false;
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [selectedIndex, editor, currentText]);

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
                        placement: "bottom-start",
                    },
                    duration: 100,
                }}
                pluginKey={"SceneBubbleMenu"}
                // eslint-disable-next-line no-unused-vars
                shouldShow={({ editor, view, state, oldState, from, to }) => {
                    // prettier-ignore
                    // @ts-ignore
                    const currentText = state.selection.$head.parent.content?.content[0]?.text ?? "";
                    if (currentText.length > 3) {
                        return false;
                    }

                    if (
                        editor.state.selection.$head.parent.attrs.class ==
                            "scene" &&
                        editor.state.selection.empty
                    ) {
                        if (
                            arrays[0]
                                .toLowerCase()
                                .includes(currentText.toLowerCase())
                        ) {
                            return true;
                        } else if (
                            arrays[1]
                                .toLowerCase()
                                .includes(currentText.toLowerCase())
                        ) {
                            return true;
                        } else if (
                            arrays[2]
                                .toLowerCase()
                                .includes(currentText.toLowerCase())
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return false;
                }}
            >
                {isOpen ? (
                    <Content
                        arrays={arrays}
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
