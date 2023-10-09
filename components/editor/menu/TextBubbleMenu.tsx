"use client";

import React, { useRef, useState, useCallback } from "react";
import { BubbleMenu, Editor } from "@tiptap/react";
import { TextSelection } from "prosemirror-state";

// this is for BubbleMenu
import "tippy.js/animations/scale-subtle.css";
import bubbleMenu_ from "./TextBubbleMenu.module.css";
import { v4 } from "uuid";

import {
    RxFontBold,
    RxFontItalic,
    RxUnderline,
    RxStrikethrough,
} from "react-icons/rx";
import { BiSolidCommentDetail } from "react-icons/bi";
import {
    MdFormatIndentIncrease,
    MdOutlineFormatIndentDecrease,
    MdOutlineLink,
    MdRemoveCircle,
    MdOutlineFormatColorText,
} from "react-icons/md";
import { PiTextAUnderlineFill } from "react-icons/pi";

import { RxLetterCaseCapitalize } from "react-icons/rx";
import { CgAsterisk } from "react-icons/cg";

import { LuPlusCircle } from "react-icons/lu";

import { BiUndo, BiRedo } from "react-icons/bi";
import { Popover } from "@mui/material";
import { useComment } from "@src/context/CommentContext";

interface MenuItemProps {
    editor: Editor;
}

const marks = [
    { type: "bold", toggleKeyword: "toggleBold", icon: RxFontBold },
    { type: "italic", toggleKeyword: "toggleItalic", icon: RxFontItalic },
    { type: "underline", toggleKeyword: "toggleUnderline", icon: RxUnderline },
    { type: "strike", toggleKeyword: "toggleStrike", icon: RxStrikethrough },
] as const;

const nodes = [
    {
        label: "Scene Heading",
        className: "scene",
    },
    {
        label: "Actions",
        className: "action",
    },
    {
        label: "Character",
        className: "character",
    },
    {
        label: "Dialogue",
        className: "dialogue",
    },
    {
        label: "Parenthetical",
        className: "parenthetical",
    },
    {
        label: "Transition",
        className: "transition",
    },
    {
        label: "Section",
        className: "section",
    },
    {
        label: "Note",
        className: "note",
    },
    {
        label: "Shot",
        className: "shot",
    },
    {
        label: "Text",
        className: "text",
    },
] as const;

export const colors = [
    { label: "Gray", value: "#6b7280" },
    { label: "Brown", value: "#7c2d12" },
    { label: "Orange", value: "#f97316" },
    { label: "Yellow", value: "#eab308" },
    { label: "Green", value: "#22c55e" },
    { label: "Blue", value: "#3b82f6" },
    { label: "Purple", value: "#a855f7" },
    { label: "Pink", value: "#ec4899" },
    { label: "Red", value: "#ef4444" },
] as const;

export const aligns = [
    { label: "left" },
    { label: "center" },
    { label: "right" },
] as const;

const Marks: React.FC<MenuItemProps> = ({ editor }) => {
    return (
        <React.Fragment>
            {marks.map(({ type, icon: Icon, toggleKeyword }, idx) => (
                <button
                    key={idx}
                    type="button"
                    // @ts-ignore
                    onClick={() =>
                        editor.chain().focus()[toggleKeyword]().run()
                    }
                    style={{
                        padding: "2px",
                        borderRadius: "2px",
                        backgroundColor: editor.isActive(type)
                            ? "var(--primary)"
                            : undefined,
                        color: editor.isActive(type)
                            ? "var(--secondary)"
                            : "var(--primary)",
                        transition: "all 100ms",
                    }}
                >
                    <Icon size={16} />
                </button>
            ))}
        </React.Fragment>
    );
};

const Nodes: React.FC<MenuItemProps> = ({ editor }) => {
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

    const currentNode = editor.view.state.selection.$head.parent.attrs.class;

    return (
        <React.Fragment>
            <button onClick={handleClick}>{currentNode}</button>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {nodes.map(({ className, label }, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .setNode("Screenplay", { class: className })
                                .run()
                        }
                    >
                        <span
                            style={{
                                color:
                                    editor.getAttributes("Screenplay").class ==
                                        className
                                        ? "blue"
                                        : undefined,
                            }}
                        >
                            {label}
                        </span>
                    </button>
                ))}
            </Popover>
        </React.Fragment>
    );
};

// fix this section

const Colors: React.FC<MenuItemProps> = ({ editor }) => {
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
        <React.Fragment>
            <button
                onClick={handleClick}
                style={{
                    color:
                        editor.getAttributes("textStyle").color ??
                        "var(--primary)",
                    backgroundColor: editor.getAttributes("textStyle").color
                        ? "white"
                        : undefined,
                    transition: "all 100ms",
                    padding: "2px",
                    borderRadius: "2px",
                }}
            >
                <MdOutlineFormatColorText size={16} />
            </button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <div
                    style={{
                        padding: "5px 10px",
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        gap: "5px",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            editor.chain().focus().unsetColor().run();
                            editor.chain().focus().unsetHighlight().run();
                        }}
                    >
                        <MdOutlineFormatColorText size={16} />
                    </button>
                    {colors.map(({ label, value }, idx) => (
                        <button
                            key={`color-${idx}`}
                            type="button"
                            onClick={() => {
                                editor.chain().focus().setColor(value).run();
                                editor.chain().focus().unsetHighlight().run();
                                setAnchorEl(null);
                            }}
                        >
                            <MdOutlineFormatColorText color={value} size={16} />
                        </button>
                    ))}
                </div>
            </Popover>
        </React.Fragment>
    );
};
const BGColors: React.FC<MenuItemProps> = ({ editor }) => {
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
        <React.Fragment>
            <button
                onClick={handleClick}
                style={{
                    color:
                        editor.getAttributes("highlight").color ??
                        "var(--primary)",
                    backgroundColor: editor.getAttributes("highlight").color
                        ? "white"
                        : undefined,
                    transition: "all 100ms",
                    padding: "2px",
                    borderRadius: "2px",
                }}
            >
                <PiTextAUnderlineFill size={17} />
            </button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <div
                    style={{
                        padding: "5px 10px",
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        gap: "5px",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            editor.chain().focus().unsetHighlight().run();
                            editor.chain().focus().unsetColor().run();
                        }}
                    >
                        <PiTextAUnderlineFill size={17} />
                    </button>
                    {colors.map(({ label, value }, idx) => (
                        <button
                            key={`background-${idx}`}
                            type="button"
                            onClick={() => {
                                editor.commands.setHighlight({ color: value });
                                editor.chain().focus().unsetColor().run();
                                setAnchorEl(null);
                            }}
                        >
                            <PiTextAUnderlineFill size={17} color={value} />
                        </button>
                    ))}
                </div>
            </Popover>
        </React.Fragment>
    );
};

const Aligns: React.FC<MenuItemProps> = ({ editor }) => {
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
        <React.Fragment>
            <button onClick={handleClick}>Align</button>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {aligns.map(({ label }, idx) => {
                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleAlign({ align: label })
                            }
                        >
                            <span
                                style={{
                                    color:
                                        editor.getAttributes("Screenplay")
                                            .align == label
                                            ? "blue"
                                            : undefined,
                                }}
                            >
                                {label}
                            </span>
                        </button>
                    );
                })}
            </Popover>
        </React.Fragment>
    );
};

const LinkInput: React.FC<MenuItemProps> = ({ editor }) => {
    const [input, setInput] = useState<string>("");

    const setLink = () => {
        editor.commands.setLink({ href: input, target: "_blank" });
        setInput("");
    };

    const unsetLink = () => {
        editor.chain().focus().unsetLink().run();
    };

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
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRight: "1px solid var(--primary)",
                paddingRight: "5px",
            }}
        >
            <button
                className={
                    editor.can().undo()
                        ? bubbleMenu_.active
                        : bubbleMenu_.inactive
                }
                onClick={handleClick}
            >
                <MdOutlineLink size={20} />
            </button>
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
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <div
                    style={{
                        padding: "0 10px",
                        display: "flex",
                        justifyContent: "space-evenly",
                        gap: "10px",
                        alignItems: "center",
                        margin: "5px",
                    }}
                >
                    <input
                        type="text"
                        className="input input-bordered input-xs"
                        onChange={(e) => setInput(e.target.value)}
                        value={editor.getAttributes("link").href ?? input}
                        placeholder="http://www.example.com"
                        style={{
                            color: "var(--secondary-hover)",
                        }}
                    />
                    {editor.isActive("link") ? (
                        <button type="button" onClick={unsetLink}>
                            <MdRemoveCircle color="var(--secondary-hover)" />
                        </button>
                    ) : (
                        <button type="button" onClick={setLink}>
                            <LuPlusCircle color="var(--secondary-hover)" />
                        </button>
                    )}
                </div>
            </Popover>
        </div>
    );
};

const HistoryButtons: React.FC<MenuItemProps> = ({ editor }) => {
    return (
        <div
            style={{
                borderRight: "1px solid var(--primary)",
                display: "flex",
                paddingRight: "8px",
                gap: "4px",
            }}
        >
            <button
                className={
                    editor.can().undo()
                        ? bubbleMenu_.active
                        : bubbleMenu_.inactive
                }
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
            >
                <BiUndo size={20} />
            </button>
            <button
                className={
                    editor.can().redo()
                        ? bubbleMenu_.active
                        : bubbleMenu_.inactive
                }
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
            >
                <BiRedo size={20} />
            </button>
        </div>
    );
};

const SwitchCase: React.FC<MenuItemProps> = ({ editor }) => {
    const disabled = !(
        editor.getAttributes("Screenplay").class == "action" ||
        editor.getAttributes("Screenplay").class == "dialogue"
    );

    return (
        <button
            onClick={() => editor.chain().focus().toggleCase()}
            disabled={disabled}
            style={{
                color:
                    editor.getAttributes("Screenplay").case == "upper"
                        ? "var(--secondary)"
                        : "var(--primary)",
                backgroundColor:
                    editor.getAttributes("Screenplay").case == "upper"
                        ? "var(--primary)"
                        : "var(--secondary)",
                padding: "2px",
                borderRadius: "2px",
                transition: "all 100ms",
            }}
        >
            <RxLetterCaseCapitalize size={16} />
        </button>
    );
};
const RevisionMark: React.FC<MenuItemProps> = ({ editor }) => {
    return (
        <button
            onClick={() => editor.chain().focus().toggleRevision()}
            style={{
                color: "var(--primary)",
            }}
        >
            <CgAsterisk size={17} />
        </button>
    );
};

const Indentation: React.FC<MenuItemProps> = ({ editor }) => {
    const canDecrease = editor.getAttributes("Screenplay").expand != null;
    const canIncrease = editor.getAttributes("Screenplay").expand != "2";

    return (
        <React.Fragment>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    borderLeft: "1px solid #ffffff",
                    borderRight: "1px solid #ffffff",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                }}
            >
                <button
                    style={{
                        color: "var(--primary)",
                        opacity: !canDecrease ? 0.5 : undefined,
                    }}
                    onClick={() => {
                        if (canDecrease)
                            editor.chain().focus().decreaseExpand();
                    }}
                >
                    <MdOutlineFormatIndentDecrease size={17} />
                </button>
                <button
                    style={{
                        color: "var(--primary)",
                        opacity: !canIncrease ? 0.5 : undefined,
                    }}
                    onClick={() => {
                        if (canIncrease)
                            editor.chain().focus().increaseExpand();
                    }}
                >
                    <MdFormatIndentIncrease size={17} />
                </button>
            </div>
        </React.Fragment>
    );
};

interface Comment {
    id: string;
    content: string;
    replies: Comment[];
    createdAt: Date;
}

const Comment = ({ editor }: { editor: Editor }) => {
    const { setIsOpen } = useComment();

    const getNewComment = (content: string): Comment => {
        return {
            id: `a${v4()}a`,
            content,
            replies: [],
            createdAt: new Date(),
        };
    };

    const setComment = () => {
        const newComment = getNewComment("");

        let currentCommentId = newComment.id;

        editor?.commands.setComment(currentCommentId);

        setIsOpen(true);
    };
    return (
        <button
            onClick={setComment}
            style={{
                marginLeft: "3px",
                marginRight: "8px",
                color: "var(--primary)",
            }}
        >
            <BiSolidCommentDetail size={17} />
        </button>
    );
};

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;
    return (
        <React.Fragment>
            <BubbleMenu
                editor={editor}
                tippyOptions={{
                    popperOptions: {
                        modifiers: [
                            {
                                name: "eventListeners",
                                options: { scroll: true },
                            },
                        ],
                    },
                    duration: 100,
                    animation: "scale-subtle",
                }}
                pluginKey={"TextMenu"}
                // eslint-disable-next-line no-unused-vars
                shouldShow={({ editor, view, state, oldState, from, to }) => {
                    // return true or false to decide show BubbleMenu or not

                    const selection = editor.state.selection;
                    const isTextSelection = selection instanceof TextSelection;

                    if (
                        isTextSelection &&
                        selection.ranges[0].$from.pos ==
                        selection.ranges[0].$to.pos
                    ) {
                        return false;
                    }

                    if (isTextSelection) {
                        return selection.$head.parent.type.name == "Screenplay";
                    } else {
                        return false;
                    }
                }}
            >
                <div>
                    <div className={bubbleMenu_.container}>
                        <HistoryButtons editor={editor} />
                        <Marks editor={editor} />
                        <SwitchCase editor={editor} />
                        <Colors editor={editor} />
                        <BGColors editor={editor} />
                        <Indentation editor={editor} />
                        <RevisionMark editor={editor} />
                        <LinkInput editor={editor} />
                        <Comment editor={editor} />
                    </div>
                </div>
            </BubbleMenu>
        </React.Fragment>
    );
};

export default MenuBar;
