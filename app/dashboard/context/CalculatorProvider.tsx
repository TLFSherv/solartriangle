'use client'
import React from "react";
import { type CalculatorData } from "@/app/types/types"

const initState: CalculatorData = {
    solarArrays: [],
    location: {
        country: "Bermuda",
        countryCode: "bm",
        countryCoords: { lat: 32.3078, lng: -64.7505 },
        timeZone: "GMT-4",
        address: "",
        addressCoords: { lat: 0, lng: 0 }
    }
}
export const CalculatorContext = React.createContext<CalculatorData>(initState);

export function CalculatorProvider({
    children,
    cachedCaclulatorData }:
    {
        children: React.ReactNode,
        cachedCaclulatorData: CalculatorData
    }) {
    return (
        <CalculatorContext.Provider value={cachedCaclulatorData}>
            {children}
        </CalculatorContext.Provider>
    )
}