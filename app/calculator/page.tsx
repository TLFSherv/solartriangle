"use client"
import React, { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Button from "../components/Button"
import SearchableMap from "./components/SearchableMap"
import SuggestionsBox from "./components/SuggestionsBox"

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
        <div className="font-[Inter] font-light m-8 sm:m-12 space-y-16">
            <p className="text-lg">
                Welcome to the easiest calculator you’ll ever use, enter you address,
                the power rating of the panels and the number of panels in the system.
                The Google maps view will change to show the address of the location you enter.
            </p>
            <div>
                <SearchableMap />
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-8 text-center">
                <div className="flex-1">
                    <label htmlFor="capacity" className="block">
                        solar capacity
                    </label>
                    <input
                        name="capacity"
                        value={inputs.capacity}
                        onChange={e => onChange(e)}
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
                        value={inputs.quantity}
                        onChange={e => onChange(e)}
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