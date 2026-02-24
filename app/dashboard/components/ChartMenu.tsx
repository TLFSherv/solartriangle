
export default function ChartMenu({ dataId, setDataId, timeId, setTimeId }:
    {
        dataId: number,
        setDataId: React.Dispatch<React.SetStateAction<number>>,
        timeId: number[];
        setTimeId: React.Dispatch<React.SetStateAction<number[]>>
    }) {

    const chartTitles = ['Irradiation', 'AC Output', 'Losses'];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct", "Nov", "Dec"];

    const timeMenu = [
        days.map((day, i) => (
            <li key={i}
                className={`px-3 cursor-pointer ${timeId[1] === i ? "text-[#F0662A]" : ""}`}
                onClick={() => setTimeId([0, i])}>{day}</li>)),
        months.map((month, i) => (
            <li key={i}
                className={`px-3 cursor-pointer ${timeId[1] === i ? "text-[#F0662A]" : ""}`}
                onClick={() => setTimeId([1, i])}>{month}</li>))
    ];
    return (
        <div className="space-y-5">
            <p className="font-[Darker_Grotesque] px-4 text-lg sm:text-xl md:text-2xl text-gray-300 tracking-wider">
                Change the data displayed with the buttons below:
            </p>
            <div className="flex justify-center gap-4">
                <input className="accent-orange-400 bg-[#B7B7B7]" type='radio' name="data" onClick={() => setDataId(0)} defaultChecked />
                <input className="accent-orange-400" type='radio' name="data" onClick={() => setDataId(1)} />
                <input className="accent-orange-400" type='radio' name="data" onClick={() => setDataId(2)} />
            </div>
            <h1 className="text-4xl font-[Darker_Grotesque] font-medium tracking-wider text-[#6E6E6E]">
                {chartTitles[dataId]}
            </h1>
            <div className="space-y-2 mb-4">
                <ol className="flex justify-center divide-x-2 divide-[#444444] text-gray-400">
                    <li className={`px-4 cursor-pointer ${timeId[0] === 0 ? "text-[#F0662A]" : ""}`}
                        onClick={() => setTimeId([0])}>d</li>
                    <li className={`px-4 cursor-pointer ${timeId[0] === 1 ? "text-[#F0662A]" : ""}`}
                        onClick={() => setTimeId([1])}>m</li>
                </ol>
                <ol className="flex mx-auto divide-x-1 divide-[#444444] text-sm text-gray-500 overflow-auto whitespace-nowrap h-[32px] w-[140px]">
                    {timeMenu[timeId[0]]}
                </ol>
            </div>
        </div>
    )
}