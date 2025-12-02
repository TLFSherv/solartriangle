"use client"
import React, { useState } from "react";
import TopicCard from "./components/TopicCard";

export default function Learn() {
    const [activeIndex, setActiveIndex] = useState(0);
    const isHidden = activeIndex !== 0;
    return (
        <div className="m-6 space-y-8">
            {
                !isHidden &&
                <div className="space-y-8">
                    <h1 className="text-[64px] tracking-wide font-[Lexend_Deca] text-center">
                        Learn
                        <span className="text-[#F0662A]">.</span>
                    </h1>
                    <p className="font-[Inter] font-light text-lg sm:text-xl text-center">
                        This is a distillation of the notes I’ve made during my journey to learn about solar panels.
                        I hope the way I’ve organised and explained the content helps you understand this fascinating topic like it did for me.
                        Welcome
                    </p>
                </div>
            }
            <div className="space-y-4">
                <div onClick={() => setActiveIndex(activeIndex === 1 ? 0 : 1)}>
                    <TopicCard
                        isActive={activeIndex === 1}
                        title={"Panel Tilt"}>
                        <section>
                            <h3>1. Latitude and longitude</h3>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum ipsam dignissimos quam! Praesentium harum itaque ut labore dicta et ea accusantium voluptatem, veritatis tenetur culpa? Impedit, natus? Odio, tempora unde.</p>
                        </section>
                        <section>
                            <h3>2. Earth</h3>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum ipsam dignissimos quam! Praesentium harum itaque ut labore dicta et ea accusantium voluptatem, veritatis tenetur culpa? Impedit, natus? Odio, tempora unde.</p>
                        </section>
                        <section>
                            <h3>3. Seasons</h3>
                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum ipsam dignissimos quam! Praesentium harum itaque ut labore dicta et ea accusantium voluptatem, veritatis tenetur culpa? Impedit, natus? Odio, tempora unde.</p>
                        </section>
                    </TopicCard>
                </div>
                <div onClick={() => setActiveIndex(activeIndex === 2 ? 0 : 2)}>
                    <TopicCard
                        isActive={activeIndex === 2}
                        title={"Azimuth"}>
                        <section>
                        </section>
                    </TopicCard>
                </div>
            </div>
        </div>
    )
}