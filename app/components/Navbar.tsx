"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Navbar() {
    const [isVisible, setIsVisible] = useState(true)
    const [screenY, setScreenY] = useState(0)

    useEffect(() => {
        const collapseNav = () => {
            const currentY = window.scrollY;
            if (!isVisible && currentY > 100) {
                setScreenY(currentY);
                return;
            }
            if (Math.abs(currentY - screenY) > 10) {
                setScreenY(currentY);
                setIsVisible(currentY < 100);
                return;
            }
        }
        window.addEventListener("scroll", collapseNav);
        return () => window.removeEventListener("scroll", collapseNav);
    }, [screenY, isVisible])

    return (
        <div
            onClick={() => setIsVisible(true)}
            className={`sticky top-4 border border-2 border-[#444444] rounded-3xl py-2 mt-2 mx-4 max-w-6xl  ${isVisible ? "" : "size-[48px] border-4 cursor-pointer border-[#F0662A]"}`}>
            {isVisible &&
                <ul className='flex justify-evenly font-[Darker_Grotesque] text-2xl tracking-wider'>
                    <Link href={"/"}><li>Home</li></Link>
                    <Link href={""}><li>Calculator</li></Link>
                    <Link href={""}><li>Learn</li></Link>
                    <Link href={""}><li>Research</li></Link>
                </ul>
            }
        </div>
    )
}