'use client'
import React from "react";
import * as d3 from "d3";
import Axis from "./Axis"
import useChartDimensions from "../hooks/useChartDimensions"

export default function HeatMap(props: { data: number[][] }) {
    const chartSettings = { width: 0, height: 0 }
    const [ref, dms] = useChartDimensions(chartSettings);

    const position = { x: 0, y: 0 } // origin position
    const margin = { x: 8, y: 40 };
    const boundedWidth = dms.width - position.x - margin.x;
    const boundedHeight = dms.height - position.y - margin.y;
    console.log(boundedHeight);
    return (
        <div ref={ref as React.Ref<HTMLDivElement>} className="border-white border-1 w-[80%] h-[140px] mx-auto">
            <svg width={dms.width} height={dms.height} >
                <defs>
                    <linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stop-color="red" />
                        <stop offset="50%" stop-color="black" stopOpacity="0" />
                        <stop offset="100%" stop-color="blue" />
                    </linearGradient>
                </defs>
                <g transform={`translate(${position.x},${position.y})`}>
                    <rect x="10" y="10" rx="15" ry="15" width={boundedWidth - 10} height={80} fill="blue" />
                    <g transform={`translate(0,${90})`}>
                        <Axis
                            type="x"
                            name="test"
                            domain={[10, 100]}
                            range={[10, boundedWidth]}
                        />
                    </g>
                </g>
            </svg>
        </div>
    )
}