import React, { useEffect, useState, useRef, useCallback } from "react";
import { JSONContent } from "@tiptap/react";
import { Editor } from "@tiptap/core";

export default function SearchModal({ editor }: { editor: Editor | null }) {
    const [searchResult, setSearchResult] = useState<JSONContent | undefined>(
        []
    );
    const divRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState<string>("");

    const handleClose = () => {
        setQuery("");
        setOpen(false);
        if (editor) {
            editor.commands.setSearchTerm("");
        }
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key == "f") {
                e.preventDefault();
                setOpen((prev) => !prev);
            } else if (e.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open, inputRef]);

    useEffect(() => {
        if (editor) {
            setSearchResult(
                editor.getJSON().content?.filter((item) => {
                    if (!item.content?.[0]?.text) return false;
                    return item.content[0].text
                        .toLowerCase()
                        .includes(query.toLowerCase());
                })
            );
        }
    }, [editor, query]);

    const arrayText = !editor
        ? []
        : (editor
              .getJSON()
              .content?.filter(
                  (item: any) =>
                      typeof item.content?.[0]?.text !== "undefined" &&
                      item.content?.[0]?.text
                          ?.toLowerCase()
                          .includes(query.toLowerCase())
              )
              .map((item) => item.content?.[0]?.text) as string[]);

    const updateSearchReplace = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            if (editor) {
                editor.commands.setSearchTerm(e.target.value);
            }
        },
        [arrayText]
    );

    function splitArrayWithQuery(arr: string[], query: string): string[][] {
        const result: string[][] = [];

        arr.forEach((item) => {
            const splitWords = item.split(query);
            const nestedArray: string[] = [];
            splitWords.forEach((word, index) => {
                nestedArray.push(word);
                if (index < splitWords.length - 1) {
                    nestedArray.push(query);
                }
            });
            result.push(nestedArray);
        });

        return result;
    }

    function createParagraphWithSpans(data: string[][]): HTMLParagraphElement {
        const div = document.createElement("div");

        data.forEach((innerArray, index) => {
            const paragraph = document.createElement("p");
            paragraph.classList.add("item-result");
            innerArray.forEach((text, innerIndex) => {
                const span = document.createElement("span");
                span.textContent = text;
                if (query == text) {
                    span.classList.add("search-result");
                }

                paragraph.appendChild(span);
            });

            if (index < data.length) {
                div.appendChild(paragraph);
            }
        });

        return div;
    }

    useEffect(() => {
        const splitArray = splitArrayWithQuery(arrayText, query);
        const html = createParagraphWithSpans(splitArray);

        if (divRef.current && html instanceof HTMLDivElement) {
            if (!divRef.current?.hasChildNodes()) {
                divRef.current.appendChild(html);
            } else {
                divRef.current?.removeChild(divRef.current.children[0]);
                divRef.current.appendChild(html);
            }
        }
    }, [editor, query, arrayText]);

    return (
        <div>
            {open ? (
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        width: 620,
                        height: "40%",
                        bottom: 50,
                        position: "fixed",
                        left: "50%",
                        transform: "translate(-50%, 0)",
                        boxShadow: "0 0px 4px 4px rgb(0 0 0 / 0.1)",
                        zIndex: 9999,
                        borderRadius: "8px",
                        transition: "all 400ms",
                    }}
                    className="overflow-auto"
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            boxShadow: "0 0px 4px 0px rgb(0 0 0 / 0.1)",
                            padding: "20px 10px",
                            position: "sticky",
                            top: 0,
                            backgroundColor: "var(--primary)",
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={updateSearchReplace}
                            style={{
                                width: "80%",
                                fontWeight: "700",
                            }}
                            placeholder="Find in text..."
                            className="input input-ghost input-sm"
                        />
                        <button
                            onClick={handleClose}
                            className="btn btn-sm"
                            style={{}}
                        >
                            Close
                        </button>
                    </div>
                    <div style={{}}>
                        {searchResult && query ? (
                            searchResult.length == 0 ? (
                                <div
                                    style={{
                                        borderTop: "1px solid #e2e2e2",
                                        borderBottom: "1px solid #e2e2e2",
                                        padding: "10px 20px",
                                    }}
                                >
                                    Not Found
                                </div>
                            ) : (
                                <div
                                    ref={divRef}
                                    className="search-div"
                                    style={{
                                        borderTop: "1px solid #e2e2e2",
                                        borderBottom: "1px solid #e2e2e2",
                                    }}
                                />
                            )
                        ) : null}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
