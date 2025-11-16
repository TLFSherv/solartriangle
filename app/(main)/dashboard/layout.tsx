import React from "react"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <h2>Dashboard layout</h2>
            {children}
        </div>
    )
}

export default DashboardLayout