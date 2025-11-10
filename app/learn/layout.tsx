import React from "react"
import ContentList from "./components/ContentList"

const LearnLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <ContentList />
            {children}
        </div>
    )
}

export default LearnLayout