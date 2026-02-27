"use client"

import React, { useState, createContext } from "react";

type LayoutContextType = {
    isDashboardMode: boolean;
    setIsDashboardMode: React.Dispatch<React.SetStateAction<boolean>>
}
export const LayoutContext = createContext<LayoutContextType>({
    isDashboardMode: false,
    setIsDashboardMode: () => false
});

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const [isDashboardMode, setIsDashboardMode] = useState(false);
    return (
        <LayoutContext.Provider value={{ isDashboardMode, setIsDashboardMode }}>
            {children}
        </LayoutContext.Provider>
    )
}