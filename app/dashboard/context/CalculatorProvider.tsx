'use client'
import React from "react";
import { type CalculatorData } from "@/app/types/types"

const initialState = { address: '', lat: '', lng: '', solarArrays: [] };
export const CalculatorContext = React.createContext<CalculatorData>(initialState);

export function CalculatorProvider({
    children,
    cacheData }:
    {
        children: React.ReactNode,
        cacheData: CalculatorData
    }) {
    return (
        <CalculatorContext.Provider value={cacheData}>
            {children}
        </CalculatorContext.Provider>
    )
}