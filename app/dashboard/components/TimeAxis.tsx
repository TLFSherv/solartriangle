import { useMemo } from "react";
import * as d3 from "d3";

type TimeAxis = {
    x: string[];
    unit: "hrs" | "days" | "months";
    domain: [Date, Date] | [number, number];
    range: [number, number];
}

export default function TimeAxis({ x, unit, domain, range }: TimeAxis) {
    const ticks = useMemo(() => {
        const axisScale = d3.scaleLinear()
            .domain(domain)
            .range(range);

        const width = range[1] - range[0];
        const pixelsPerTick = 50;
        const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));

        const getUtcTime = (value: Date) => {
            let result;
            const hh = value.getUTCHours();
            const mm = value.getUTCMinutes();
            result = hh >= 10 ? `${hh}:` : `0${hh}:`
            return result += mm > 10 ? `${mm}` : `0${mm}`;
        }

        const getValue = (value: string) => {
            if (unit === 'hrs')
                return getUtcTime(new Date(value))
            return value
        }

        return axisScale.ticks(numberOfTicksTarget)
            .map((value, i) => ({
                value: getValue(x[i]),
                offset: axisScale(value)
            }))
    }, [domain.join("-"), range.join("-")]);

    return (
        <g>
            <path
                d={`M ${range[0]} 6 v -6 H ${range[1]} v 6`}
                fill="none"
                stroke="#444444"
                strokeWidth="2"
            />
            {ticks.map(({ value, offset }, index) => (
                <g key={index}
                    transform={`translate(${offset}, 0)`}>
                    <line y2="6" stroke="#6E6E6E" />
                    <text
                        key={index}
                        stroke="currentColor"
                        style={{
                            fontSize: "10px",
                            color: "#FFFFFF",
                            textAnchor: "middle",
                            transform: "translateY(20px)"
                        }}>
                        {value}
                    </text>
                </g>
            ))
            }
            <g transform={`translate(${(range[0] + range[1]) / 2}, 39)`}>
                <text
                    stroke="currentColor"
                    style={{
                        fontSize: "11px",
                        color: "#FFFFFF",
                        textAnchor: "middle",
                        letterSpacing: "0.05em",
                    }}>
                    Time ({unit})
                </text>
            </g>
        </g >
    );
}