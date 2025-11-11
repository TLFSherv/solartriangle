import Link from "next/link"
import Button from "../components/Button"

export default function Calculator() {
    return (
        <div className="font-[Inter] font-light m-8 sm:m-12 space-y-16">
            <p className="text-lg">
                Welcome to the easiest calculator you’ll ever user, enter you address,
                the power rating of the panels and the number of panels in the system.
                The Google maps view will change to show the address of the location you enter.
            </p>
            <div></div>
            <div className="flex flex-col md:flex-row justify-center gap-8 text-center">
                <div className="flex-1">
                    <label htmlFor="address" className="block">
                        address
                    </label>
                    <input
                        name="address"
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-4/5"
                        type="text"
                        autoComplete="false" />
                </div>
                <div className="flex-1">
                    <label htmlFor="capacity" className="block">
                        solar capacity
                    </label>
                    <input
                        name="capacity"
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-4/5"
                        type="number"
                        autoComplete="false" />
                </div>
                <div className="flex-1">
                    <label htmlFor="quantity" className="block">
                        panel quantity
                    </label>
                    <input
                        name="quantity"
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-4/5"
                        type="number"
                        autoComplete="false" />
                </div>
            </div>

            <div className="flex justify-center text-lg sm:text-xl">
                <Button
                    text="Go to Dashboard"
                    style="bg-linear-[#DD6B19,#F0662A] w-xs" />
            </div>
        </div>
    )
}