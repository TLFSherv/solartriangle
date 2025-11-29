import Image from "next/image"
import Link from "next/link"
import circles_md from "@/public/circles-md.png"
import circles_sm from "@/public/circles-sm.png"
import circles from "@/public/circles.png"

export default function ContentList() {
    return (
        <div className="flex justify-content gap-8 sm:gap-16 md:gap-24 bg-[#D9D9D9] m-8 w-sm sm:w-lg md:w-2xl border rounded-md pt-5 pb-8 px-12">
            <div className="flex flex-col justify-content text-black">
                <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 font-[Lexend_Deca]">Topics</h2>
                <ol className="sm:text-lg md:text-xl list-decimal space-y-2 md:space-y-4 font-[Space_Grotesk]">
                    <li><Link href={""}>Latitude and Longitude</Link></li>
                    <li><Link href={""}>Earth</Link></li>
                    <li><Link href={""}>Seasons</Link></li>
                    <li><Link href={""}>Panel tilt</Link></li>
                </ol>
            </div>
            <div>
                <Image
                    src={circles_sm}
                    alt="circles intersect to form a donut"
                    className="object-cover block sm:hidden"
                />
                <Image
                    src={circles_md}
                    alt="circles intersect to form a donut"
                    className="object-cover hidden sm:block md:hidden"
                />
                <Image
                    src={circles}
                    alt="circles intersect to form a donut"
                    className="object-cover hidden md:block"
                />
            </div>
        </div>
    )
}