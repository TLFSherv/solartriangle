import Axis from "./Axis"
import TimeAxis from "./TimeAxis";
import Points from "./Points";
import useChartDimensions from "../hooks/useChartDimensions"

type Dataset = {
    x: number[];
    y: number[];
    type: 'monthly' | 'hourly' | 'daily';
}
export default function Chart({ dataset }: { dataset: Dataset }) {
    const chartSettings = { width: 0, height: 0 }
    const [ref, dms] = useChartDimensions(chartSettings);

    const xDomain: [number, number] = [Math.min(...dataset.x), Math.max(...dataset.x)];
    const yDomain: [number, number] = [Math.min(...dataset.y), Math.max(...dataset.y)];

    const position = { x: 38, y: 0 } // origin position
    const margin = { x: 8, y: 40 };
    const boundedWidth = dms.width - position.x - margin.x;
    const boundedHeight = dms.height - position.y - margin.y;


    return (
        <div ref={ref as React.Ref<HTMLDivElement>} className="w-[90%] sm:w-3/4 h-[320px] mx-auto">
            <svg width={dms.width} height={dms.height}>
                <g transform={`translate(${position.x},${position.y})`}>
                    <g transform={`translate(0,${boundedHeight})`}>
                        <TimeAxis
                            unit="months"
                            domain={[new Date("2025-02-01T00:00:00.000Z"),
                            new Date("2026-01-01T23:00:00.000Z")]}
                            range={[10, boundedWidth]} />
                    </g>
                    <Axis
                        type={"y"}
                        name="poa"
                        domain={yDomain}
                        range={[10, boundedHeight]}
                    />
                    <Points
                        dataset={dataset}
                        settings={{ height: boundedHeight, width: boundedWidth }}
                        domain={{ x: xDomain, y: yDomain }}
                        range={{ x: [10, boundedWidth], y: [10, boundedHeight] }}
                    />
                </g>
            </svg >
        </div >
    )
}