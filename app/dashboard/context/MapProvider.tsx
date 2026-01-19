'use client'
import React from "react";

export const MapContext = React.createContext<Promise<any> | null>(null);

export function MapProvider({
    children,
    cacheData }:
    {
        children: React.ReactNode,
        cacheData: Promise<any>
    }) {
    return (
        <MapContext.Provider value={cacheData}>
            {children}
        </MapContext.Provider>
    )
}