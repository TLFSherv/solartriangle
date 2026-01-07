import { useState } from "react";
import * as d3 from "d3";

type DataPoints =
    {
        dataset: Dataset;
        id: number;
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
    const [selectedPoint, setSelectedPoint] = useState('');
    const { dataset, id, settings, domain, range } = props;
    const colors = ['#2A5751', '#397ADB', '#4F6E9C', '#33312D', '#233331'];
    let yCoord = 0, points = "";
    const xScale = d3.scaleLinear()
        .domain(domain.x)
        .range(range.x);
    const yScale = d3.scaleLinear()
        .domain(domain.y)
        .range(range.y);
    return (
        <g key={id}>
            {dataset.y.map((y, i) => {
                yCoord = settings.height - yScale(y) + range.y[0];
                points += `${xScale(i)}, ${yCoord} `;
                let pointId = [domain.y[1], i].join('-');
                return (
                    <g key={i}>
                        <circle
                            cx={xScale(i)}
                            cy={yCoord.toFixed(2)}
                            r="4"
                            fill={colors[id]}
                            onClick={() => setSelectedPoint(pointId)}
                            className="cursor-pointer"
                        />
                        {(pointId === selectedPoint) && <text
                            key={pointId} fill="white"
                            className="text-xs"
                            x={xScale(i) - 20}
                            y={yCoord - 10}>
                            {y.toFixed(2)}
                        </text>}
                    </g>
                )
            })}
            <polyline points={points} fill="none" strokeWidth={2} stroke={colors[id]} />
        </g>
    )
}

