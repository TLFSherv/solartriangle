'use client'
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/app/components/Button"
import Link from "next/link"
import { signIn } from "@/actions/auth"
import { type ActionResponse, signUp } from "@/actions/auth"
import toast, { Toaster } from "react-hot-toast"

export default function Sigin() {
    const initialState: ActionResponse = {
        success: false,
        message: '',
        error: ''
    }
    const router = useRouter();
    const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(
        async (prevState: ActionResponse, formData: FormData) => {
            try {
                const result = await signIn(formData);

                if (result.success) {
                    toast.success('user signed in successfully');
                    router.push('/calculator');
                }

                return result
            } catch (e) {
                return {
                    success: false,
                    message: (e as Error).message || 'An error occured',
                    errors: undefined
                };
            }
        }, initialState)
    return (
        <div className="mt-16 mx-8 space-y-10">
            <h1 className="font-[Inter] text-[#F0662A] text-5xl sm:text-6xl text-center tracking-wide">
                Account Login
            </h1>
            <h2 className="font-[Darker_Grotesque] text-center tracking-wide text-xl sm:text-2xl">
                Enter your credentials below to sign in to your account.
                If you do not have an account please select sign up.
            </h2>
            <form id="siginForm"
                action={formAction}
                className="flex flex-col gap-8 justify-center items-center font-[Inter] font-light text-md">
                {state?.message && !state.success &&
                    <p className="text-sm text-red-500">{state?.message}</p>
                }
                <div className="grid grid-cols-[1fr_3fr] grid-rows-2 gap-4">
                    <div className="my-auto">
                        <label htmlFor="email">
                            Email
                        </label>
                    </div>
                    <div>
                        <input
                            name="email"
                            className={`py-1 px-2 border-2 border-[#444444] rounded-md w-2xs sm:w-xs
                                 ${state?.errors?.email ? 'border-red' : ''}`}
                            type="email"
                            autoComplete="false"
                            required
                            minLength={1} />
                        {state?.errors?.email &&
                            <p className="text-sm text-red-500">
                                {state?.errors?.email[0]}
                            </p>
                        }
                    </div>
                    <div className="my-auto">
                        <label htmlFor="password">
                            Password
                        </label>
                    </div>
                    <div>
                        <input
                            name="password"
                            className={`py-1 px-2 border-2 border-[#444444] rounded-md w-2xs sm:w-xs
                                 ${state?.errors?.password ? 'border-red' : ''}`} type="password"
                            autoComplete="false"
                            minLength={6}
                            required />
                        {state?.errors?.password &&
                            <p className="text-sm text-red-500">
                                {state?.errors?.password[0]}
                            </p>
                        }
                    </div>
                </div>
            </form >
            <div className="flex flex-col items-center gap-8 font-[Inter] font-light">
                <Button
                    form="siginForm"
                    type="submit"
                    text="Sign in"
                    style="bg-linear-[88deg,#F0662A,#F2C521] w-sm" />
                <Link href={"/signup"}>
                    <Button
                        text="Sign up"
                        style="bg-[#444444] w-sm" />
                </Link>
            </div>
        </div >
    )
}