'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function AccountDropdown({ email }: { email: string | undefined }) {
    const [isVisible, setIsVisible] = useState(false);
    const mouseHandler = (value: boolean) => {
        setTimeout(() => {
            setIsVisible(value);
        }, 500)
    }

    return (
        <div
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => mouseHandler(false)}
            className='font-[Darker_Grotesque] text-lg'>
            {email || 'Account'}
            {isVisible && <ol className='fixed z-1 bg-black text-base/6'>
                <Link href={"/signin"}><li className='hover:underline decoration-[#F0662A]'>Sign in</li></Link>
                <Link href={"/signup"}><li className='hover:underline decoration-[#F0662A]'>Sign up</li></Link>
            </ol>}
        </div>
    )
}
