import Image from "next/image"
import graph from "../../public/graph-sm.png"

export default function Benefits() {
    return (
        <div className='flex flex-col-reverse sm:flex-row mx-4 gap-8 justify-center items-center'>
            <ul className="space-y-2 text-md sm:text-lg font-[Inter] font-light list-disc list-inside">
                <li>Accurately predict future power generation</li>
                <li>Optimise your solar system</li>
                <li>Keep a history of past performance</li>
                <li>Analyse future performance</li>
            </ul>
            <Image
                src={graph}
                alt="graph"
                width={250}
                height={306}
            />
        </div>
    )
}