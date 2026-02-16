'use client'
import Link from 'next/link'
import { useState } from 'react'
import { signOut } from '@/actions/auth';

export default function AccountMenu({ email }: { email: string | undefined }) {
    const [isVisible, setIsVisible] = useState(false);
    const mouseHandler = (value: boolean) => {
        setTimeout(() => {
            setIsVisible(value);
        }, 500)
    }
    const clickHandler = async () => {
        setIsVisible(false);
        await signOut();
    }
    const isLoggedIn = email !== undefined;

    return (
        <div
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => mouseHandler(false)}
            className='font-[Darker_Grotesque] text-lg text-[#F2F2F0]'>
            {email || 'Account'}
            {isVisible &&
                <ol className='absolute z-1 bg-black text-base/6'>
                    {isLoggedIn ?
                        <li onClick={clickHandler}
                            className='cursor-pointer hover:underline decoration-[#F0662A]'>
                            Sign out
                        </li>
                        :
                        <ol>
                            <Link href="/signin">
                                <li className='cursor-pointer hover:underline decoration-[#F0662A]'>
                                    Sign in
                                </li>
                            </Link>
                            <Link href="/signup">
                                <li className='cursor-pointer hover:underline decoration-[#F0662A]'>
                                    Sign up
                                </li>
                            </Link>

                        </ol>
                    }
                </ol>}
        </div>
    )
}
