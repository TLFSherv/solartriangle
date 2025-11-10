import Image from "next/image"
import circles from "../../../public/circles.png"
import circles_sm from "../../../public/circles-sm.png"

export default function ContentList() {
    const img: any = circles;
    return (
        <div className="flex justify-content gap-8 bg-[#D9D9D9] m-8 w-sm sm:w-lg border rounded-md pt-5 pb-8 px-12">
            <div className="flex flex-col justify-content text-black">
                <h2 className="text-2xl mb-4 font-[Lexend_Deca]">Topics</h2>
                <ol className="list-decimal space-y-2 font-[Space_Grotesk]">
                    <li>Latitude and Longitude</li>
                    <li>Earth</li>
                    <li>Seasons</li>
                    <li>Panel tilt</li>
                </ol>
            </div>
            <picture>
                <source media="(min-width:650px)" srcSet={img} />
                <Image src={circles_sm} alt="abstract circles" />
            </picture>
        </div>
    )
}