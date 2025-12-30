import react from "react";

export default function ChartMenu({ timeId, setTimeId }:
    {
        timeId: number[];
        setTimeId: React.Dispatch<React.SetStateAction<number[]>>
    }) {

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct", "Nov", "Dec"];
    const subMenu = [
        days.map((day, i) => (
            <li key={i}
                className={`px-3 cursor-pointer ${timeId[1] === i ? "text-[#0BAFF5]" : ""}`}
                onClick={() => setTimeId([0, i])}>{day}</li>)),
        months.map((month, i) => (
            <li key={i}
                className={`px-3 cursor-pointer ${timeId[1] === i ? "text-[#0BAFF5]" : ""}`}
                onClick={() => setTimeId([1, i])}>{month}</li>))
    ];
    return (
        <div className="space-y-2 mb-4">
            <ol className="flex justify-center divide-x-2 divide-[#444444]">
                <li className={`px-4 cursor-pointer ${timeId[0] === 0 ? "text-[#0BAFF5]" : ""}`}
                    onClick={() => setTimeId([0])}>d</li>
                <li className={`px-4 cursor-pointer ${timeId[0] === 1 ? "text-[#0BAFF5]" : ""}`}
                    onClick={() => setTimeId([1])}>m</li>
            </ol>
            <ol className="flex mx-auto divide-x-1 divide-[#444444] text-sm overflow-auto whitespace-nowrap h-[32px] w-[140px]">
                {subMenu[timeId[0]]}
            </ol>
        </div>
    )
}