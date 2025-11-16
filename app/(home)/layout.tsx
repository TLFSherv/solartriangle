import React from "react"
import Navbar from "./components/Navbar"

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <Navbar />
            <div>{children}</div>
        </div>
    )
}