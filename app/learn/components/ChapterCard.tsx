import React from "react"
export default function ChapterCard({ topicChapters }:
    { topicChapters: { title: string; id: string; level: number }[] }) {
    return (
        <div className="w-[280px] border-2 rounded-lg border-[#FF8D28] p-3 space-y-1">
            <h3 className="text-lg">Chapters</h3>
            <ol className="text-sm/7 list-inside">
                {
                    topicChapters.map((chapter) => {
                        return (
                            <li key={chapter.title} className={`${chapter.level === 1 ? "pl-4" : ""} ${chapter.level === 2 ? "pl-8" : ""}`} >
                                <a href={chapter.id} className="hover:text-[#FF8D28]">
                                    {chapter.title}
                                </a>
                            </li>
                        )
                    })
                }
            </ol>
        </div>
    )
}