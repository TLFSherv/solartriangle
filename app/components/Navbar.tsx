"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const pathname = usePathname();
    const navbarLinks = [
        { name: "Home", href: "/" },
        { name: "Calculator", href: "/calculator" },
        { name: "Learn", href: "/learn" },
        { name: "Research", href: "/research" },
    ];
    const isHome = pathname === "/";
    if (isHome) return <DynamicNavbar navLinks={navbarLinks} />
    return <StaticNavbar navLinks={navbarLinks} pathname={pathname} />
}

function DynamicNavbar(props: { navLinks: { name: string, href: string }[] }) {
    const [isVisible, setIsVisible] = useState(true)
    const [screenY, setScreenY] = useState(0)
    const navLinks = props.navLinks;
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
                <ul className='flex justify-evenly font-[Darker_Grotesque] text-xl sm:text-2xl tracking-wider text-[#F2F2F0]'>
                    {navLinks.map((link) => {
                        const isHome = link.name === 'Home';
                        return <Link href={link.href}
                            key={link.name}
                            className={isHome ? "text-[#F0662A]" : ""}>
                            {link.name}
                        </Link>
                    })}
                </ul>
            }
        </div>
    )
}

function StaticNavbar(props: { navLinks: { name: string, href: string }[], pathname: string }) {
    const navLinks = props.navLinks;
    const pathname = props.pathname;
    return (
        <div className='border border-2 border-[#444444] rounded-3xl py-2 mt-2 mx-4 max-w-6xl'>
            <ul className='flex justify-evenly font-[Darker_Grotesque] text-xl sm:text-2xl tracking-wider text-[#F2F2F0]'>
                {navLinks.map((link) => {
                    const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");
                    return <Link href={link.href} key={link.name} >
                        <li className={isActive ? "text-[#F0662A]" : ""}>
                            {link.name}
                        </li>
                    </Link>
                })}
            </ul>
        </div>
    )
}