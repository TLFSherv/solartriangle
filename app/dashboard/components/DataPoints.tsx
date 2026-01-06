import React, { useState, useEffect } from "react";
import * as d3 from "d3";

type DataPoints =
    {
        dataset: Dataset;
        colorId: number;
        settings: { height: number; width: number };
        domain: { x: [Date, Date] | [number, number]; y: [number, number] };
        range: { x: [number, number]; y: [number, number] };
    }
type Dataset = {
    x: string[];
    y: number[];
    type: 'months' | 'hrs' | 'days';
}
export default function DataPoints(props: DataPoints) {
    const [selectedPoint, setSelectedPoint] = useState(-1);
    const { dataset, colorId, settings, domain, range } = props;
    const colors = ['#F6513A', '#F2C521']
    let yCoord = 0, points = "";
    const xScale = d3.scaleLinear()
        .domain(domain.x)
        .range(range.x);
    const yScale = d3.scaleLinear()
        .domain(domain.y)
        .range(range.y);

    return (
        <g>
            <g>
                {dataset.y.map((y, i) => {
                    yCoord = settings.height - yScale(y) + range.y[0];
                    points += `${xScale(i)}, ${yCoord} `;
                    return (
                        <g>
                            <circle
                                key={i}
                                cx={xScale(i)}
                                cy={yCoord}
                                r="3"
                                fill="white"
                                onClick={() => setSelectedPoint(i)}
                                className="cursor-pointer"
                            />
                            {(i === selectedPoint) && <text
                                key={y} fill="white"
                                className="text-xs"
                                x={xScale(i) - 20}
                                y={yCoord - 10}>
                                {y}
                            </text>}
                        </g>
                    )
                })}
                <polyline points={points} fill="none" stroke={colors[colorId]} />
            </g>
        </g>


    )
}

