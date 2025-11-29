"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MainNavbar() {
    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Calculator", href: "/calculator" },
        { name: "Learn", href: "/learn" },
        { name: "Research", href: "/research" },
    ]
    const pathname = usePathname();
    return (
        <div className='border border-2 border-[#444444] rounded-3xl py-2 mt-2 mx-4 max-w-6xl'>
            <ul className='flex justify-evenly font-[Darker_Grotesque] text-2xl tracking-wider'>
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