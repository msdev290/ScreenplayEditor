import React, { useState, useRef } from "react";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import { Editor, mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import {
    NodeViewContent,
    NodeViewProps,
    NodeViewWrapper,
    ReactNodeViewRenderer,
} from "@tiptap/react";

// Material UI Component
import { Popover, IconButton, Typography } from "@mui/material";
// Material UI Icons
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import PersonIcon from "@mui/icons-material/Person";
import DataObjectIcon from "@mui/icons-material/DataObject";
import ChatIcon from "@mui/icons-material/Chat";
import SmartButtonIcon from "@mui/icons-material/SmartButton";
import EmergencyRecordingIcon from "@mui/icons-material/EmergencyRecording";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";

import { BsSendPlus } from "react-icons/bs";
import { BsFillChatFill, BsChat } from "react-icons/bs";
import { Tab, tabs } from "@components/editor/EditorAndSidebar";
import { useEffect } from "react";
import {
    PopoverR,
    PopoverContent,
    PopoverTrigger,
} from "@components/ui/popover";

import { useComment } from "./context/CommentContext";

type AttrAlign = "left" | "center" | "right";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        Screenplay: {
            setMyNode: (attr: { class: Tab }) => ReturnType;
            setAlign: (attr: { align: AttrAlign | null }) => ReturnType;
            toggleAlign: (attr: { align: AttrAlign }) => ReturnType;
            toggleCase: () => ReturnType;
            toggleRevision: () => ReturnType;
            decreaseExpand: () => ReturnType;
            increaseExpand: () => ReturnType;
            openComment: () => ReturnType;
        };
    }
}

const pushid = () => {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
};

export const popupTypePluginKey = new PluginKey("ScreenPlay-Plugin");

const newTabs = [
    {
        label: "Scene Heading",
        className: "scene",
        icon: PhotoSizeSelectActualIcon,
    },
    {
        label: "Actions",
        className: "action",
        icon: DirectionsRunIcon,
    },
    {
        label: "Character",
        className: "character",
        icon: PersonIcon,
    },
    {
        label: "Parenthetical",
        className: "parenthetical",
        icon: DataObjectIcon,
    },
    {
        label: "Dialogue",
        className: "dialogue",
        icon: ChatIcon,
    },
    {
        label: "Transition",
        className: "transition",
        icon: SmartButtonIcon,
    },
    {
        label: "Shot",
        className: "shot",
        icon: EmergencyRecordingIcon,
    },
    {
        label: "Text",
        className: "text",
        icon: PostAddIcon,
    },
    {
        label: "Note",
        className: "note",
        icon: ChecklistRtlIcon,
    },
] as const;

const SideActions = ({
    editor,
    getPos,
    node,
}: {
    editor: Editor;
    getPos: any;
    node: any;
}) => {
    const { icon: NodeIcon } = newTabs.find(
        ({ className }) => className == node.attrs.class
    )!;

    const anchorPosition = editor.state.selection.$anchor.pos;
    const pos = getPos();
    const endPos = getPos() + node.nodeSize;

    const pressedKeyEvent = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
        }
    };
    useEffect(() => {
        addEventListener("keydown", pressedKeyEvent);
        return () => {
            removeEventListener("keydown", pressedKeyEvent);
        };
    });

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
                onClick={handleClick}
                size="medium"
                style={{
                    display:
                        anchorPosition > pos && anchorPosition < endPos
                            ? "flex"
                            : "none",
                    position: "absolute",
                    top: "center",
                    left: 50,
                    zIndex: 999,
                    alignItems: "center",
                    opacity: 0.5,
                }}
            >
                <NodeIcon fontSize="small" />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <div className="tippy-sideMenu">
                    {newTabs.map(({ className, icon: Icon, label }, index) => (
                        <div
                            key={label}
                            onClick={() => {
                                editor.chain().setNodeSelection(pos).run();
                                editor
                                    .chain()
                                    .focus()
                                    .setNode("Screenplay", { class: className })
                                    .run();
                                setAnchorEl(null);
                            }}
                            style={{
                                padding: "0px 10px",
                                borderRadius: "2px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor:
                                    className == node.attrs.class
                                        ? "var(--secondary)"
                                        : undefined,
                                color:
                                    className == node.attrs.class
                                        ? "var(--primary)"
                                        : "#adb5bd",
                                fontWeight: "500",
                            }}
                            className="tippy-sideMenu-item"
                        >
                            <div style={{ width: "28%", color: "inherit" }}>
                                Ctrl + {index + 1}
                            </div>
                            <div
                                style={{
                                    width: "60%",
                                    color: "inherit",
                                    fontSize: "15px",
                                }}
                            >
                                {label}
                            </div>
                            <Icon fontSize="small" />
                        </div>
                    ))}
                </div>
            </Popover>
        </div>
    );
};

const AddComment = ({ node, editor }: { node: any; editor: Editor }) => {
    // const { isOpen, setIsOpen } = useComment();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [commented, setCommented] = useState<boolean>(false);


    console.log(editor);

    const handleClick = (e) => {
        e.preventDefault();
        setIsOpen(true);
        console.log("CLICKED", isOpen);
    };

    const close = () => {
        setIsOpen(false);
    };


    const comments = node.content.content.filter((item: any) => {
        return item.marks?.length !== 0;
    });
    const [commentLength, setCommentLength] = useState<Number>(comments.length);


    useEffect(() => {
        if (comments.length) setCommented(true);
    }, [comments])

    useEffect(() => {
        if (comments.length > commentLength) {
            setIsOpen(true)
            setCommentLength(comments.length);
        }
    }, [comments.length])

    return (
        <React.Fragment>
            <PopoverR open={isOpen}>
                <PopoverTrigger asChild>
                    <button
                        className="add-comment"
                        onClick={handleClick}
                        style={{
                            opacity: isOpen ? 100 : undefined,
                            position: "relative",
                            right: "-10px",
                            borderRadius: "20px",
                            backgroundColor: "#ffffff",
                            padding: "5px",
                            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        {commented ? (
                            <BsFillChatFill
                                size={17}
                                color="var(--secondary)"
                            />
                        ) : (
                            <BsChat size={17} color="var(--secondary)" />
                        )}
                    </button>
                </PopoverTrigger>
                {isOpen ? (
                    <ContentAddComment
                        close={close}
                        isOpen={isOpen}
                        comments={comments}

                    />
                ) : null}
            </PopoverR>
        </React.Fragment>
    );
};

const ContentAddComment = ({
    close,
    comments,
    isOpen,
}: {
    close: () => void;
    isOpen: boolean;
    comments: any[];
}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                // @ts-ignore
                !containerRef.current.contains(event.target as Node)
            ) {
                close();
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                close();
            }
        };

        // Add event listeners when component mounts
        window.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("keydown", handleEscapeKey);

        // Remove event listeners when component unmounts
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("keydown", handleEscapeKey);
        };
    }, [containerRef]);

    return (
        <PopoverContent
            ref={containerRef}
            forceMount={isOpen ? true : undefined}
            side="right"
            style={{
                transition: "all 400ms",
                backgroundColor: "var(--primary)",
                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
                borderRadius: "5px"
            }}
        >
            <div className="overflow-hidden">
                <div
                    className="px-3 py-2 font-light"
                    style={{
                        color: "var(--secondary)",
                        boxShadow: "0 2px 4px -2px rgba(0, 0, 0, 0.2)",
                        borderRadius: "5px",
                        borderBottomLeftRadius: "0",
                        borderBottomRightRadius: "0"
                    }}
                >
                    {comments.length} COMMENT{comments.length > 1 ? "S" : ""}
                </div>
                {comments.length !== 0
                    ? comments.map((comment, index) => {
                        const [input, setInput] = useState<string>("");
                        const [addcomment, setAddComment] = useState<string>('');

                        return (
                            <div
                                key={index}
                                style={{
                                    borderRadius: "8px",
                                    padding: "0px 0px 10px 0px",
                                    transition: "all 200ms",

                                }}
                            >
                                <div
                                    style={{
                                        borderBottomLeftRadius: "0",
                                        borderBottomRightRadius: "0",
                                        padding: "5px 10px 3px 10px",
                                    }}
                                >
                                    <p
                                        style={{
                                            color: "var(--secondary)",
                                            fontWeight: "bolder",
                                        }}
                                    >
                                        Rakeshi

                                        <i
                                            style={{
                                                color: "var(--secondary-hover)",
                                                fontFamily: "sans-serif",
                                                fontSize: "0.8rem",
                                                paddingLeft: "40px"
                                            }}
                                        >
                                            {comment?.text ?? ""}
                                        </i>
                                    </p>

                                </div>
                                <div
                                    style={{
                                        borderBottomLeftRadius: "0",
                                        borderBottomRightRadius: "0",
                                        padding: "5px 10px 3px 10px",
                                    }}
                                >

                                    <i
                                        style={{
                                            color: "var(--secondary-hover)",
                                            fontFamily: "sans-serif",
                                            fontSize: "0.8rem",
                                            paddingLeft: "10px"
                                        }}
                                    >
                                        {addcomment}
                                    </i>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                        gap: "20px",
                                        padding: "2px 10px",
                                    }}
                                >
                                    <input
                                        type="text"
                                        value={input}
                                        placeholder="Type Comment here"
                                        className="input input-ghost input-sm "
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        autoFocus
                                    />

                                    <button
                                        className="sendBtn"
                                        style={{
                                            boxShadow:
                                                "0 0 10px 0 rgba(0, 0, 0, 0.2)",
                                            backgroundColor:
                                                "var(--secondary)",
                                            color: "var(--primary)",
                                            borderRadius: "20px",
                                            padding: "3px 8px 3px 4px",
                                            textAlign: "center",
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setAddComment(input);
                                        }}
                                    >
                                        <BsSendPlus size={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                    : null}
            </div>
        </PopoverContent>
    );
};

const NodeView: React.FC<NodeViewProps> = ({
    node,
    getPos,
    editor,
    ...props
}) => {
    return (
        <NodeViewWrapper
            as="div"
            style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 0,
                width: "100%",
            }}
        >
            <SideActions editor={editor} getPos={getPos} node={node} />
            <NodeViewContent
                className={node.attrs.class}
                data-align={node.attrs.align}
                data-case={node.attrs.case}
                data-revision={node.attrs.revision}
                data-expand={node.attrs.expand}
                data-open={node.attrs.open}
            />
            <AddComment
                // @ts-ignore
                content={node.content?.content[0]?.text ?? ""}
                editor={editor}
                node={node}
            />
        </NodeViewWrapper>
    );
};

export const Screenplay = Node.create({
    name: "Screenplay",
    group: "block",
    content: "text*",
    priority: 1000,
    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: ["div"],
                attributes: {
                    blockId: {
                        default: null,
                        rendered: false,
                        keepOnSplit: false,
                    },
                },
                parseHTML: (element: HTMLElement) => {
                    return {
                        blockId: element.getAttribute("blockId"),
                    };
                },
                renderHTML: (attributes: { blockId: string }) => {
                    return {
                        blockId: attributes?.blockId,
                    };
                },
            },
        ];
    },
    addAttributes() {
        return {
            class: {
                default: "action",
                parseHTML: (element) => element.getAttribute("class"),
            },
            align: {
                default: null,
                parseHTML: (element) => element.getAttribute("align"),
            },
            case: {
                default: null,
                parseHTML: (element) => element.getAttribute("case"),
            },
            revision: {
                default: null,
                parseHTML: (element) => element.getAttribute("revision"),
            },
            expand: {
                default: null,
                parseHTML: (element) => element.getAttribute("expand"),
            },
            blockId: {
                parseHTML: (element) => element.getAttribute("blockId"),
            },
        };
    },
    parseHTML() {
        return [{ tag: "p" }];
    },
    renderHTML({ HTMLAttributes }) {
        return [
            "p",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
            0,
        ];
    },
    // @ts-ignore
    addCommands() {
        return {
            setMyNode:
                (attributes) =>
                    ({ commands }) => {
                        return commands.setNode(this.name, {
                            ...this.editor.getAttributes(this.name),
                            class: attributes.class,
                        });
                    },
            setAlign: (attributes) => (prop) =>
                this.editor
                    .chain()
                    .focus()
                    .setNode(this.name, {
                        ...this.editor.getAttributes(this.name),
                        align: attributes.align,
                    })
                    .run(),
            toggleAlign:
                (attributes) =>
                    ({ commands }) => {
                        const { align } = this.editor.getAttributes(this.name) as {
                            align: AttrAlign;
                        };

                        return commands.setAlign({
                            align:
                                align == attributes.align ? null : attributes.align,
                        });
                    },
            toggleCase:
                () =>
                    ({ commands }) => {
                        const node = this.editor.getAttributes(this.name);

                        return node.class == "dialogue" || node.class == "action"
                            ? this.editor
                                .chain()
                                .focus()
                                .setNode(this.name, {
                                    ...this.editor.getAttributes(this.name),
                                    case: node.case ? null : "upper",
                                })
                                .run()
                            : false;
                    },
            toggleRevision:
                () =>
                    ({ commands }) => {
                        const node = this.editor.getAttributes(this.name);

                        return this.editor
                            .chain()
                            .focus()
                            .setNode(this.name, {
                                ...this.editor.getAttributes(this.name),
                                revision: node.revision ? null : true,
                            })
                            .run();
                    },
            decreaseExpand:
                () =>
                    ({ commands }) => {
                        const node = this.editor.getAttributes(this.name);
                        if (!node.expand) return;

                        return this.editor
                            .chain()
                            .focus()
                            .setNode(this.name, {
                                ...this.editor.getAttributes(this.name),
                                expand:
                                    node.expand == "2"
                                        ? "1"
                                        : node.expand == "1"
                                            ? null
                                            : "1",
                            })
                            .run();
                    },
            increaseExpand:
                () =>
                    ({ commands }) => {
                        const node = this.editor.getAttributes(this.name);
                        if (node.expand == "2") return;

                        return this.editor
                            .chain()
                            .focus()
                            .setNode(this.name, {
                                ...this.editor.getAttributes(this.name),
                                expand:
                                    node.expand == "1"
                                        ? "2"
                                        : node.expand == "2"
                                            ? null
                                            : "1",
                            })
                            .run();
                    },
        };
    },
    // @ts-ignore
    addKeyboardShortcuts() {
        return {
            Enter: () => {
                // const anchorPosition = this.editor.state.selection.$anchor.pos;
                // const node = selection.$anchor.parent;
                // const nodeSize = node.content.size;
                const selection = this.editor.state.selection;
                const nodeSize = selection.$anchor.parent.content.size;
                const nodePos = selection.$head.parentOffset;
                const pos = selection.anchor;
                const currentNode = selection.$anchor.parent.attrs.class;
                const cursorAtTheLast = nodePos == nodeSize;

                const endPos = pos + nodeSize;

                if (currentNode == "scene" || currentNode == "transition") {
                    return true;
                }

                if (!cursorAtTheLast) {
                    // default
                    return false;
                }

                if (currentNode == "dialogue") {
                    if (nodeSize == 0) {
                        this.editor
                            .chain()
                            .insertContentAt(
                                endPos + 1,
                                '<p class="character"></p>',
                                { updateSelection: true }
                            )
                            .focus(endPos + 1)
                            .run();

                        return true;
                    }

                    this.editor
                        .chain()
                        .insertContentAt(pos, `<p class="character"></p>`, {
                            updateSelection: true,
                        })
                        .focus(pos)
                        .run();
                    return true;
                } else if (
                    currentNode == "character" ||
                    currentNode == "parenthetical"
                ) {
                    if (nodeSize == 0) {
                        this.editor
                            .chain()
                            .insertContentAt(
                                endPos + 1,
                                '<p class="dialogue"></p>',
                                { updateSelection: true }
                            )
                            .focus(endPos + 1)
                            .run();

                        return true;
                    }
                    this.editor
                        .chain()
                        .insertContentAt(pos, `<p class="dialogue"></p>`, {
                            updateSelection: true,
                        })
                        .focus(pos)
                        .run();
                    return true;
                }

                // Default
                return false;
            },
            "Mod-1": () => this.editor.commands.setMyNode({ class: tabs[0] }),
            "Mod-2": () => this.editor.commands.setMyNode({ class: tabs[1] }),
            "Mod-3": () => this.editor.commands.setMyNode({ class: tabs[2] }),
            "Mod-4": () => this.editor.commands.setMyNode({ class: tabs[3] }),
            "Mod-5": () => this.editor.commands.setMyNode({ class: tabs[4] }),
            "Mod-6": () => this.editor.commands.setMyNode({ class: tabs[5] }),
            "Mod-7": () => this.editor.commands.setMyNode({ class: tabs[7] }),
            "Mod-8": () => this.editor.commands.setMyNode({ class: tabs[8] }),
            "Mod-9": () => this.editor.commands.setMyNode({ class: tabs[6] }),
            "Alt-c": () => this.editor.commands.setMyNode({ class: tabs[2] }),
            "Alt-d": () => this.editor.commands.setMyNode({ class: tabs[4] }),
            "Alt-p": () => this.editor.commands.setMyNode({ class: tabs[3] }),
            "Alt-a": () => this.editor.commands.setMyNode({ class: tabs[1] }),
            "Alt-s": () => this.editor.commands.setMyNode({ class: tabs[0] }),
            "Alt-h": () => this.editor.commands.setMyNode({ class: tabs[7] }),
            "Alt-t": () => this.editor.commands.setMyNode({ class: tabs[5] }),
            "Alt-x": () => this.editor.commands.setMyNode({ class: tabs[8] }),
            "Alt-o": () => this.editor.commands.setMyNode({ class: tabs[6] }),
            "Mod-/": () => this.editor.chain().focus().toggleCase(),
            "Mod-e": () =>
                this.editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: "#ffcc00" }),
            "Mod-l": () => this.editor.chain().focus().setColor("#ffcc00"),
            "Mod-]": () => this.editor.chain().toggleRevision(),
            "Mod-[": () => this.editor.chain().toggleRevision(),
            "Mod-Alt-[": () => this.editor.chain().decreaseExpand(),
            "Mod-Alt-]": () => this.editor.chain().increaseExpand(),
        };
    },
    addNodeView() {
        return ReactNodeViewRenderer(NodeView);
    },
    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: popupTypePluginKey,
                appendTransaction: (_transactions, oldState, newState) => {
                    if (newState.doc === oldState.doc) {
                        return;
                    }
                    const tr = newState.tr;

                    newState.doc.descendants((node: any, pos, parent) => {
                        if (
                            node.isBlock &&
                            parent === newState.doc &&
                            !node.attrs.blockId
                        ) {
                            tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                blockId: pushid(),
                            });
                        }
                    });

                    return tr;
                },
            }),
        ];
    },
});

export const CustomBold = Bold.extend({
    addAttributes() {
        return {
            class: {
                default: "bold",
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "span",
                preserveWhitespace: "full",
                getAttrs: (e: any) => {
                    return e.getAttribute("class") === "bold" && null;
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }: any) {
        return ["span", HTMLAttributes, 0];
    },
});

export const CustomItalic = Italic.extend({
    addAttributes() {
        return {
            class: {
                default: "italic",
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "span",
                preserveWhitespace: "full",
                getAttrs: (e: any) => {
                    return e.getAttribute("class") === "italic" && null;
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }: any) {
        return ["span", HTMLAttributes, 0];
    },
});

export const CustomUnderline = Underline.extend({
    addAttributes() {
        return {
            class: {
                default: "underline",
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "span",
                preserveWhitespace: "full",
                getAttrs: (e: any) => {
                    return e.getAttribute("class") === "underline" && null;
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }: any) {
        return ["span", HTMLAttributes, 0];
    },
});
