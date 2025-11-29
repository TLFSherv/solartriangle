import React from "react"

export default function CalculatorLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div
            className="font-[Inter] font-light m-8 sm:m-8 space-y-10">
            <p className="text-lg">
                Enter your address in the address field below to show your homes roof on the map.
                Then add shapes on the map, and select the shape to show the area of your roof.
                Finally enter the power rating of the panels, and specify the number of panels.
            </p>
            {children}
        </div>
    );
}