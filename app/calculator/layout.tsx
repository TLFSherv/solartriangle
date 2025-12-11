import React from "react"

export default function CalculatorLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div
            className="font-[Inter] font-light m-8 mt-18 space-y-10">
            <h1 className="text-5xl text-center font-[Space_Grotesk] text-[#F0662A]">
                Solar Calculator
            </h1>
            <p className="sm:text-lg">
                Enter your address in the address field below to show your homes roof on the map.
                Add shapes on the map to represent your solar array.
                Select the name of the solar array below the map to enter additional details about your solar panels:
            </p>
            {children}
        </div>
    );
}