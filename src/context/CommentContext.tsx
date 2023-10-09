import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type CommentContext = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CommentContext = createContext<CommentContext | null>(null);

type CommentContextProviderProps = {
    children: ReactNode;
};

export function CommentContextProvider({
    children,
}: CommentContextProviderProps): JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const value = {
        isOpen,
        setIsOpen,
    };

    return (
        <CommentContext.Provider value={value}>
            {children}
        </CommentContext.Provider>
    );
}

export function useComment(): CommentContext {
    const context = useContext(CommentContext);

    if (!context)
        throw new Error(
            "useComment must be used within an CommentContextProvider"
        );

    return context;
}
