"use client"
import React, { useState } from "react"
import Button from "@/app/components/Button"
import SearchableMap from "./components/SearchableMap"

export default function Calculator() {
    const [inputs, setInputs] = useState({
        address: '',
        capacity: 0,
        quantity: 0
    });
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs({ ...inputs, [name]: value });
    };

    return (
        <div className="font-[Inter] font-light m-8 sm:m-8 space-y-10">
            <p className="text-lg">
                Enter your address in the address field below to show your homes roof on the map.
                Then add shapes on the map, and select the shape to show the area of your roof.
                Finally enter the power rating of the panels, and specify the number of panels.
            </p>
            <div>
                <SearchableMap />
            </div>
            <div className="flex flex-col justify-center gap-8 text-center max-w-xl mx-auto">
                <div className="flex-1">
                    <label htmlFor="capacity" className="block text-sm">
                        Solar capacity
                    </label>
                    <input
                        name="capacity"
                        value={inputs.capacity}
                        onChange={e => onChange(e)}
                        className="py-1 px-2 bg-[#444444] rounded-md w-4/5"
                        type="number"
                        autoComplete="false" />
                </div>
                <div className="flex-1">
                    <label htmlFor="quantity" className="block text-sm">
                        Panel quantity
                    </label>
                    <input
                        name="quantity"
                        value={inputs.quantity}
                        onChange={e => onChange(e)}
                        className="py-1 px-2 bg-[#444444] rounded-md w-4/5"
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