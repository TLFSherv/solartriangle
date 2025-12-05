import Button from "@/app/components/Button"
export default function Login() {
    return (
        <div className="mt-16 mx-8 space-y-10">
            <h1 className="font-[Inter] text-[#F0662A] text-5xl sm:text-6xl text-center tracking-wide">
                Account Login
            </h1>
            <h2 className="font-[Darker_Grotesque] text-center tracking-wide text-xl sm:text-2xl">
                Enter your credentials below to login to your account.
                If you cannot remember your password select the forgot password option.
            </h2>
            <form className="flex flex-col gap-8 justify-center items-center font-[Inter] font-light text-md">
                <div className="space-x-4">
                    <label htmlFor="username">
                        username
                    </label>
                    <input
                        name="username"
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-2xs sm:w-xs"
                        type="text"
                        autoComplete="false" />
                </div>
                <div className="space-x-4">
                    <label htmlFor="password">
                        password
                    </label>
                    <input
                        name="password"
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-2xs sm:w-xs"
                        type="password"
                        autoComplete="false" />
                </div>
            </form>
            <div className="flex flex-col items-center gap-8 font-[Inter] font-light">
                <Button
                    text="Login"
                    style="bg-linear-[88deg,#F0662A,#F2C521] w-sm" />
                <Button
                    text="Forgot password"
                    style="bg-[#444444] w-sm" />
            </div>
        </div>
    )
}