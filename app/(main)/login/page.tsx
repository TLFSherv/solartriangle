import Button from "@/app/components/Button"
export default function Login() {
    return (
        <div className="mx-auto sm:text-xl font-[Inter] font-light space-y-16">
            <h2 className="mt-16 max-w-4xl mx-4 sm:mx-8">
                Enter your credentials below to login to your account. If you are experiencing issues logging into your account select the forgot password option.
            </h2>
            <form className="flex flex-col gap-8 justify-center items-center">
                <label>
                    username
                    <input
                        name="username"
                        className="ml-8 py-1 px-2 border-2 border-[#444444] rounded-md w-2xs sm:w-xs"
                        type="text"
                        autoComplete="false" />
                </label>
                <label>
                    password
                    <input
                        name="password"
                        className="ml-8 py-1 px-2 border-2 border-[#444444] rounded-md w-2xs sm:w-xs"
                        type="password"
                        autoComplete="false" />
                </label>
            </form>
            <div className="flex flex-col items-center gap-8">
                <Button
                    text="Login"
                    style="bg-linear-[#DD6B19,#F0662A] w-sm" />
                <Button
                    text="Forgot password"
                    style="bg-[#444444] w-sm" />
            </div>
        </div>
    )
}