'use client'
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/app/components/Button"
import Link from "next/link"
import { type ActionResponse, signUp } from "@/actions/auth"
import toast, { Toaster } from "react-hot-toast"
import { success } from "zod"

const initialState: ActionResponse = {
    success: false,
    message: '',
    error: undefined
}
export default function Sigup() {
    const router = useRouter();
    const [state, formAction, isPending] =
        useActionState<ActionResponse, FormData>(
            async (prevState: ActionResponse, formData: FormData) => {
                try {
                    const result = await signUp(formData);

                    if (result.success) {
                        toast.success('Account created successfully');
                        router.push('/calculator');
                    }

                    return result;
                } catch (e) {
                    return {
                        success: false,
                        message: (e as Error).message || 'An error occured',
                        errors: undefined
                    };
                }
            }, initialState
        );

    return (
        <div className="mt-16 mx-8 space-y-10">
            <h1 className="font-[Inter] text-[#F0662A] text-5xl sm:text-6xl text-center tracking-wide">
                Create Account
            </h1>
            <h2 className="font-[Darker_Grotesque] text-center tracking-wide text-xl sm:text-2xl">
                Please enter a valid email and password to create an account. If you already have an account please select sign in.
            </h2>
            <form action={formAction}
                id="signupForm"
                className="flex flex-col gap-8 justify-center items-center font-[Inter] font-light text-md">
                {state?.message && !state.success && (
                    <p className="text-sm text-red">{state.message}</p>
                )}
                <div className="grid grid-cols-[1fr_2fr] grid-rows-2 gap-4">
                    <div className="my-auto text-sm sm:text-base">
                        <label htmlFor="email">
                            Email
                        </label>
                    </div>
                    <div>
                        <input
                            name="email"
                            className={`py-1 px-2 border-2 border-[#444444] rounded-md w-2xs sm:w-xs 
                            ${state?.errors?.email ? "border-red-500" : ""}`}
                            type="email"
                            autoComplete="false"
                            required
                            disabled={isPending} />
                        {state?.errors?.email && (
                            <p className="text-sm text-red">
                                {state.errors.email[0]}
                            </p>
                        )}
                    </div>
                    <div className="my-auto text-sm sm:text-base">
                        <label htmlFor="password">
                            Password
                        </label>
                    </div>
                    <div>
                        <input
                            name="password"
                            className={`py-1 px-2 border-2 border-[#444444] rounded-md w-2xs sm:w-xs 
                            ${state?.errors?.password ? "border-red-500" : ""}`}
                            type="password"
                            autoComplete="false"
                            minLength={6}
                            required
                            disabled={isPending} />
                        {state?.errors?.password && (
                            <p className="text-sm text-red">
                                {state.errors.password[0]}
                            </p>
                        )}
                    </div>
                    <div className="my-auto text-sm sm:text-base">
                        <label htmlFor="password">
                            Confirm Password
                        </label>
                    </div>
                    <div>
                        <input
                            name="confirmPassword"
                            className={`py-1 px-2 border-2 border-[#444444] rounded-md w-2xs sm:w-xs 
                            ${state?.errors?.confirmPassword ? "border-red-500" : ""}`}
                            type="password"
                            autoComplete="false"
                            minLength={6}
                            required
                            disabled={isPending}
                        />
                        {state?.errors?.confirmPassword && (
                            <p className="text-sm text-red">
                                {state.errors.confirmPassword[0]}
                            </p>
                        )}
                    </div>
                </div>
            </form>
            <div className="flex flex-col items-center gap-8 font-[Inter] font-light">
                <Button
                    type="submit"
                    form="signupForm"
                    text="Sign up"
                    style="bg-linear-[88deg,#F0662A,#F2C521] w-sm" />
                <Link href={"/signin"}>
                    <Button
                        text="Sign in"
                        style="bg-[#444444] w-sm" />
                </Link>
            </div>
        </div>
    )
}