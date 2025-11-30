"use client"
import React, { useState } from "react"

export default function TopicCard({ children, title }: { children: React.ReactNode, title: string }) {
    const [isHidden, setIsHidden] = useState(true);
    const clickHandler = () => {
        setIsHidden(!isHidden);
    }
    return (
        <div className="border-2 border-[#DD6B19] rounded-lg font-[space_grotesk] font-light">
            <div className="p-4 cursor-pointer" onClick={clickHandler}>
                <h2 className="text-xl pb-1">
                    <span className="pr-2">{isHidden ? "+" : "-"}</span>
                    {title}
                </h2>
            </div>
            {!isHidden && <div className="bg-[#D9D9D9] text-black text-sm list-decimal list-inside space-y-6 p-4 rounded-b-md">
                {children}
            </div>
            }
        </div>
    )
}