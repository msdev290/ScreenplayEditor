import React, { useEffect, useState, useRef, useCallback } from "react";
import { Editor } from "@tiptap/react";

const Content = ({
    currentText,
    filteredArrays,
    editor,
    arrays,
    selectedIndex,
    setSelectedIndex,
}: {
    currentText: string;
    filteredArrays: any[];
    arrays: any[];
    editor: Editor;
    selectedIndex: any;
    setSelectedIndex: any;
}) => {
    const commandListContainer = useRef<HTMLDivElement>(null);
    const selectedButtonRef = useRef<HTMLButtonElement>(null);

    const selectItem = useCallback(
        (editor: any) => {
            let { $from, to } = editor.view.state.selection;
            let from = $from.pos - $from.parentOffset;

            console.log("test 7");

            editor
                .chain()
                .focus()
                .insertContentAt({ from, to }, filteredArrays[selectedIndex])
                .run();
        },
        [filteredArrays, selectedIndex, currentText]
    );

    useEffect(() => {
        const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
        const onKeyDown = (e: KeyboardEvent) => {
            if (editor.state.selection.$head.parent.attrs.class != "scene") {
                return false;
            }

            if (navigationKeys.includes(e.key)) {
                e.preventDefault();
                if (e.key === "ArrowUp") {
                    setSelectedIndex(
                        (selectedIndex + filteredArrays.length - 1) %
                            filteredArrays.length
                    );
                    return true;
                }
                if (e.key === "ArrowDown") {
                    setSelectedIndex(
                        (selectedIndex + 1) % filteredArrays.length
                    );
                    return true;
                }
                if (e.key === "Enter") {
                    selectItem(editor);

                    return true;
                }

                return false;
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [selectedIndex, setSelectedIndex, selectItem, editor]);

    return (
        <div ref={commandListContainer} className="scene-menu">
            {filteredArrays.map((array, index) => (
                <button
                    onClick={() => {
                        let { $from, to } = editor.view.state.selection;
                        let from = $from.pos - $from.parentOffset;
                        editor
                            .chain()
                            .focus()
                            .insertContentAt(
                                { from, to },
                                filteredArrays[index]
                            )
                            .run();
                    }}
                    key={array}
                    ref={selectedIndex == index ? selectedButtonRef : null}
                    type="button"
                    className="tippy-sideMenu-item"
                    style={{
                        backgroundColor:
                            selectedIndex == index
                                ? "var(--secondary)"
                                : undefined,
                        color:
                            selectedIndex == index
                                ? "var(--primary)"
                                : "#adb5bd",
                        borderRadius: "4px",
                        padding: "0 10px",
                    }}
                >
                    {array}
                </button>
            ))}
        </div>
    );
};

export default Content;
