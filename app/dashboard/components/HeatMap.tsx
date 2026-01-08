'use client'
import React from "react";
import * as d3 from "d3";
import Axis from "./Axis"
import useChartDimensions from "../hooks/useChartDimensions"
import { url } from "inspector";

export default function HeatMap(props: { data: number[][], dataRanges: number[][] }) {
    const [ref, dms] = useChartDimensions({ width: 0, height: 0 });
    // capacity factors range from 10% to 25%
    const position = { x: 0, y: 0 } // origin position
    const margin = { x: 8, y: 40 };
    const boundedWidth = dms.width - position.x - margin.x;
    const boundedHeight = dms.height - position.y - margin.y;
    console.log(props.data, props.dataRanges);
    return (
        <div ref={ref as React.Ref<HTMLDivElement>} className="border-white border-1 w-[80%] h-[140px] mx-auto">
            <svg width={dms.width} height={dms.height} >
                <defs>
                    <linearGradient id="Gradient1">
                        <stop offset="0%" stopColor="#02020C" />
                        <stop offset="16%" stopColor="#41006A" />
                        <stop offset="32%" stopColor="#911A6B" />
                        <stop offset="48%" stopColor="#E7434C" />
                        <stop offset="54%" stopColor="#E4404E" />
                        <stop offset="70%" stopColor="#F05C4E" />
                        <stop offset="86%" stopColor="#FCC37E" />
                        <stop offset="100%" stopColor="#FBFFB2" />
                    </linearGradient>
                </defs>
                <g transform={`translate(${position.x},${position.y})`}>
                    <rect x="10" y="10" width={boundedWidth - 10} height={80} fill={"url(#Gradient1)"} />
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