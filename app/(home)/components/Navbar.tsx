"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Navbar() {
    const [isVisible, setIsVisible] = useState(true)
    const [screenY, setScreenY] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
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
                    <Link href={"/"} onClick={() => setCurrentPage(0)}>
                        <li className={currentPage === 0 ? 'text-[#F0662A]' : ''}>
                            Home
                        </li>
                    </Link>
                    <Link href={"/calculator"} onClick={() => setCurrentPage(1)}>
                        <li className={currentPage === 1 ? 'text-[#F0662A]' : ''}>
                            Calculator
                        </li>
                    </Link>
                    <Link href={"/learn"} onClick={() => setCurrentPage(2)}>
                        <li className={currentPage === 2 ? 'text-[#F0662A]' : ''}>
                            Learn
                        </li>
                    </Link>
                    <Link href={""} onClick={() => setCurrentPage(3)}>
                        <li className={currentPage === 3 ? 'text-[#F0662A]' : ''}>
                            Research
                        </li>
                    </Link>
                </ul>
            }
        </div>
    )
}