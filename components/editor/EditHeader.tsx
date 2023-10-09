import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import React, { useState, useEffect, useRef } from "react";
import editor_ from "./EditorComponent.module.css";
import { Project } from "@src/lib/utils/types";

import { TextareaAutosize } from "@mui/material";

type Props = {
    project: Project;
};

const EditorHeader = ({ project }: Props) => {
    const [title, setTitle] = useState<string>(project.title);
    const [author, setAuthor] = useState<string>(project.writtenBy);
    const [description, setDescription] = useState<string>(
        project.description ?? ""
    );

    const [show, setShow] = useState<boolean>(false);
    const [shown, setShown] = useState<boolean>(false);

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        if (shown) setOpen(true);
    };
    const handleClose = () => setOpen(false);

    return (
        <>
            {open ? (
                <ModalDescription
                    description={description}
                    close={handleClose}
                    setDescription={setDescription}
                />
            ) : null}

            <div
                id="fpage"
                className={editor_.pre_page}
                onMouseOver={() => setShow(true)}
                onMouseOut={() => setShow(false)}
                style={{
                    height: shown ? 800 / 0.8 : "80px",
                }}
            >
                <div className="flex flex-col max-w-lg w-full justify-center space-y-7">
                    <div className="w-full relative h-[28px]">
                        <h1 className="inline-block mx-auto text-lg sr-only">
                            {title}
                        </h1>
                        <input
                            style={{ color: "var(--secondary)" }}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            placeholder="UNTITLED"
                            className="absolute inset-0 px-2 text-center z-0 outline-none h-[inherit] placeholder-color"
                            value={title}
                        />
                    </div>
                    <div
                        style={{
                            height: !shown ? 0 : undefined,
                        }}
                        className="overflow-hidden"
                    >
                        <div>
                            <p
                                className="text-center"
                                style={{ color: "var(--secondary)" }}
                            >
                                Written By -
                            </p>
                            <div className="w-full relative h-[28px]">
                                <p className="inline-block mx-auto text-lg sr-only">
                                    {author}
                                </p>
                                <input
                                    style={{ color: "var(--secondary)" }}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    type="text"
                                    placeholder="Author"
                                    className="absolute inset-0 px-2 text-center z-0 outline-none h-[inherit] placeholder-color "
                                    value={author}
                                />
                            </div>
                        </div>

                        <div
                            className={`min-h-[250px] max-h-[820px] overflow-y-auto tra cursor-pointer border-2 border-transparent ${
                                open
                                    ? "border-dashed !border-[var(--secondary)]"
                                    : ""
                            }`}
                            onClick={handleOpen}
                        >
                            <p
                                className="text-center "
                                style={{
                                    color: "var(--secondary)",
                                    opacity:
                                        description == "" ? 0.7 : undefined,
                                }}
                            >
                                {description != ""
                                    ? description
                                    : "Based On..."}
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    className={editor_.fpage_scroll_btn_container}
                    onClick={() => setShown(!shown)}
                >
                    {shown ? (
                        <MdOutlineKeyboardArrowUp
                            size={30}
                            className={editor_.fpage_scroll_btn}
                            style={{
                                opacity: show ? 1 : 0,
                            }}
                        />
                    ) : (
                        <MdOutlineKeyboardArrowDown
                            size={30}
                            className={editor_.fpage_scroll_btn}
                            style={{
                                opacity: show ? 1 : 0,
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default EditorHeader;

function ModalDescription({
    description,
    setDescription,
    close,
}: {
    close: () => void;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
}) {
    const containerRef = useRef(null);

    const [hydrated, setHydrated] = useState<boolean>(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                // @ts-ignore
                !containerRef.current.contains(event.target as Node)
            ) {
                setHydrated(false);
                setTimeout(() => {
                    close();
                }, 300);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setHydrated(false);

                setTimeout(() => {
                    close();
                }, 300);
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
        <div className="fixed z-[99999] w-full h-auto  top-[84px] inset-x-0 ">
            <div
                ref={containerRef}
                className={`bg-white min-h-[200px] shadow-[0_0px_25px_-3px_rgba(0,0,0,0.3)] rounded-xl relative w-[750px] -translate-x-1/2 left-1/2 p-5 transition-all duration-300 ease-in-out  ${
                    hydrated ? "" : "-translate-y-[calc(100%_+_84px)]"
                }`}
            >
                <TextareaAutosize
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[140px] overflow-auto resize-none outline-none ring-[2px] ring-[var(--secondary)] rounded-lg p-2 bg-gray-100"
                    value={description}
                />
            </div>
        </div>
    );
}
