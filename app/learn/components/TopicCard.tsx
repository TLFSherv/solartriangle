"use client"
import React, { useState } from "react";

export default function TopicCard({ children, title }: { children: React.ReactNode, title: string }) {
    const [isActive, setIsActive] = useState(false);
    return (
        <div className="border-2 border-[#FF8D28] rounded-lg font-[space_grotesk] font-light">
            <div className="p-4 cursor-pointer">
                <h2 className="text-lg pb-1" onClick={() => setIsActive(!isActive)}>
                    <span className="pr-2">{isActive ? "-" : "+"}</span>
                    {title}
                </h2>
            </div>
            {isActive && <div className="bg-[#D9D9D9] text-black text-sm list-decimal list-inside space-y-6 p-4 rounded-b-md">
                {children}
            </div>
            }
        </div>
    )
}