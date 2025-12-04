import Link from "next/link";
import TopicCard from "./components/TopicCard";

export default function Learn() {
    return (
        <div className="m-6 mt-18 space-y-16">
            <div className="space-y-8 font-[Space_Grotesk] text-center mx-8">
                <h1 className="text-5xl md:text-6xl tracking-wide bg-linear-[60deg,#E420B3,#FF2D55,#F0662A,#F2C521] bg-clip-text text-transparent">
                    Learn
                </h1>
                <p className="font-light text-lg/7">
                    This is a distillation of the notes I’ve made during my journey to learn about solar panels.
                    I hope the way I’ve organised and explained the content helps you understand this fascinating topic like it did for me.
                    Welcome
                </p>
            </div>
            <div className="space-y-4">
                <TopicCard title={"Panel Tilt"}>
                    <h3>What you will learn</h3>
                    <p>
                        You'll learn why the recommended tilt for most solar panels
                        is the same as the latitude of the location of the panels.
                    </p>
                    <Link href={"/learn/topics/panel-tilt"}>Learn more</Link>
                </TopicCard>
                <TopicCard title={"Azimuth"}>
                    <h3>What you will learn</h3>
                    <p>
                        What azimuth is, and how to use Principal Component Analysis
                        to find the azimuth of a polygon.
                    </p>
                    <Link href={"/learn/topics/azimuth"}>Learn more</Link>
                </TopicCard>
            </div>
        </div>
    )
}