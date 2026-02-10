import Link from "next/link";
import TopicCard from "./components/TopicCard";

export default function Learn() {
    return (
        <div className="mt-18 mx-2 sm:mx-6 space-y-16">
            <div className="space-y-8 font-[Space_Grotesk] text-center">
                <h1 className="text-5xl md:text-6xl tracking-wide text-[#F0662A]">
                    Learn
                </h1>
                <p className="font-light text-lg/7">
                    This is a distillation of the notes I’ve made during my journey to learn about solar panels.
                    I hope the way I’ve organised and explained the content helps you understand this fascinating topic like it did for me.
                    Welcome
                </p>
            </div>
            <div className="space-y-2">
                <TopicCard title={"Panel Tilt"}>
                    <p>
                        <span className="font-medium">What you will learn: </span>
                        You'll learn why the recommended tilt for most solar panels
                        is the same as the latitude of the location of the panels.
                    </p>
                    <Link href={"/learn/topics/panel-tilt"} className="text-blue-400">Learn more</Link>
                </TopicCard>
                <TopicCard title={"Azimuth"}>
                    <p>
                        <span className="font-medium">What you will learn: </span>
                        What azimuth is, and how to use Principal Component Analysis
                        to find the azimuth of a polygon.
                    </p>
                    <Link href={"/learn/topics/azimuth"} className="text-blue-400">Learn more</Link>
                </TopicCard>
            </div>
        </div>
    )
}