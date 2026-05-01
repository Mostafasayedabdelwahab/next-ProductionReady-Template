"use client";

import { createContext, useContext } from "react";
import type { getDictionary } from "./get-dictionary";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

type TranslationContextType = {
    dict: Dictionary;
    locale: string;
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({
    children,
    dict,
    locale,
}: {
    children: React.ReactNode;
    dict: Dictionary;
    locale: string;
}) {
    return (
        <TranslationContext.Provider value={{ dict, locale }}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(TranslationContext);

    if (!context) {
        throw new Error("useTranslation must be used inside TranslationProvider");
    }

    return context;
}