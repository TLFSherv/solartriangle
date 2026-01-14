'use client'
import Button from "@/app/components/Button"
import Link from "next/link"
// import { user1 } from "@/actions/auth"

export default function Sigin() {
    // let user = user1;
    return (
        <div className="mt-16 mx-8 space-y-10">
            <h1 className="font-[Inter] text-[#F0662A] text-5xl sm:text-6xl text-center tracking-wide">
                Account Login
            </h1>
            <h2 className="font-[Darker_Grotesque] text-center tracking-wide text-xl sm:text-2xl">
                Enter your credentials below to sign in to your account.
                If you do not have an account please select sign up.
            </h2>
            <form className="flex flex-col gap-8 justify-center items-center font-[Inter] font-light text-md">
                <div className="grid grid-cols-[1fr_3fr] grid-rows-2 gap-4">
                    <div className="my-auto">
                        <label htmlFor="email">
                            Email
                        </label>
                    </div>
                    <input
                        name="username"
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-2xs sm:w-xs"
                        type="text"
                        autoComplete="false" />
                    <div className="my-auto">
                        <label htmlFor="password">
                            Password
                        </label>
                    </div>
                    <input
                        name="password"
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-2xs sm:w-xs"
                        type="password"
                        autoComplete="false" />
                </div>
            </form>
            <div className="flex flex-col items-center gap-8 font-[Inter] font-light">
                <Button
                    text="Sign in"
                    style="bg-linear-[88deg,#F0662A,#F2C521] w-sm" />
                <Link href={"/signup"}>
                    <Button
                        text="Sign up"
                        style="bg-[#444444] w-sm" />
                </Link>
            </div>
        </div>
    )
}