import React from "react"
export default function ChapterCard({ topicChapters }: { topicChapters: string[] }) {
    return (
        <div className="w-[280px] border-2 rounded-lg border-[#FF8D28] p-3 space-y-1">
            <h3 className="text-lg">Chapters</h3>
            <ol className="text-sm/7 list-decimal list-inside">
                {
                    topicChapters.map((chapter, i) => {
                        return <li key={i}>{chapter}</li>
                    })
                }
            </ol>
        </div>
    )
}