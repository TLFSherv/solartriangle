import { useMemo } from "react";
import * as d3 from "d3";

type TimeAxis = {
    x: string[];
    unit: "hrs" | "days" | "months" | "weekdays";
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
        let numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));
        numberOfTicksTarget = unit === 'weekdays' ? Math.min(numberOfTicksTarget, 7) : numberOfTicksTarget;

        const getLabelValues = (value: string) => {
            const date = new Date(value);
            if (unit === 'hrs') {
                const hh = date.getUTCHours();
                return hh >= 10 ? `${hh}:00` : `0${hh}:00`
            }
            else if (unit === 'weekdays') {
                const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const dd = date.getUTCDate();
                const day = days[date.getUTCDay()];
                return dd >= 10 ? `${day} ${dd}` : `${day} 0${dd}`;
            } else if (unit === 'days') {
                const dd = '0' + value.split(" ")[1];
                const mm = '0' + value.split(" ")[0];
                return `${mm.substring(mm.length - 2)}/${dd.substring(dd.length - 2)}`;
            }
            return value
        }

        return axisScale.ticks(numberOfTicksTarget)
            .map((value) => ({
                value: getLabelValues(x[value]),
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