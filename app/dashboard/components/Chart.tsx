import Axis from "./Axis"
import TimeAxis from "./TimeAxis";
import DataPoints from "./DataPoints";
import useChartDimensions from "../hooks/useChartDimensions"
import { data } from "../test-data/data";

type Dataset = {
    x: string[] | number[];
    y: number[];
    type: 'months' | 'hrs' | 'days';
}
export default function Chart({ dataset }: { dataset: Dataset }) {
    const chartSettings = { width: 0, height: 0 }
    const [ref, dms] = useChartDimensions(chartSettings);

    let xDomain: [Date, Date] | [number, number];
    if (dataset.type === 'months') xDomain = [dataset.x[0] as number, dataset.x.at(-1) as number];
    else xDomain = [new Date(dataset.x[0]), new Date(dataset.x.at(-1) as string)];
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
                            unit={dataset.type}
                            domain={xDomain}
                            range={[10, boundedWidth]} />
                    </g>
                    <Axis
                        type={"y"}
                        name="poa"
                        domain={yDomain}
                        range={[10, boundedHeight]}
                    />
                    <DataPoints
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