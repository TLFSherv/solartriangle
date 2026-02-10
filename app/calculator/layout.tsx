import React from "react"

export default function CalculatorLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div
            className="font-[Inter] font-light m-2 mt-10 sm:m-8 sm:mt-18 space-y-8 sm:space-y-10">
            <h1 className="text-4xl sm:text-5xl text-center font-[Space_Grotesk] text-[#F0662A]">
                Solar Calculator
            </h1>
            <p className="text-sm sm:text-lg">
                Enter your address in the address field below and select from the dropdown to show your home's roof on the map.
            </p>
            {children}
        </div>
    );
}
