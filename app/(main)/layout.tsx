import React from "react"
import MainNavbar from "./components/MainNavbar"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <MainNavbar />
            <div>{children}</div>
        </div>
    )
}