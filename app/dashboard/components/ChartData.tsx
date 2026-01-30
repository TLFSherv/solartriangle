import Axis from "./Axis"
import TimeAxis from "./TimeAxis";
import DataPoints from "./DataPoints";
import useChartDimensions from "../hooks/useChartDimensions"
import { Dataset } from "../../types/types";

export default function ChartData({ dataset }: { dataset: Dataset[] }) {
    const chartSettings = { width: 0, height: 0 }
    const [ref, dms] = useChartDimensions(chartSettings);
    let minY = 1000, maxY = 0, value = [0, 0];
    for (let d of dataset) {
        value = [Math.min(...d.y), Math.max(...d.y)];
        if (value[0] < minY) minY = value[0];
        if (value[1] > maxY) maxY = value[1];
    }
    const xDomain: [number, number] = [0, dataset[0].x.length - 1];
    const yDomain: [number, number] = [minY, maxY];

    const position = { x: 38, y: 10 } // origin position
    const margin = { x: 8, y: 40 };
    const boundedWidth = dms.width - position.x - margin.x;
    const boundedHeight = dms.height - position.y - margin.y;
    return (
        <div ref={ref as React.Ref<HTMLDivElement>} className="w-[90%] sm:w-3/4 h-[400px] mx-auto">
            <svg width={dms.width} height={dms.height}>
                <g transform={`translate(${position.x},${position.y})`}>
                    <g transform={`translate(0,${boundedHeight})`}>
                        <TimeAxis
                            x={dataset[0].x}
                            unit={dataset[0].type}
                            domain={xDomain}
                            range={[10, boundedWidth]} />
                    </g>
                    <Axis
                        type={"y"}
                        name={dataset[0].name}
                        domain={yDomain}
                        range={[10, boundedHeight]}
                    />
                    {dataset.map((data, i) => <DataPoints
                        key={i}
                        dataset={data}
                        id={i}
                        settings={{ height: boundedHeight, width: boundedWidth }}
                        domain={{ x: xDomain, y: yDomain }}
                        range={{ x: [10, boundedWidth], y: [10, boundedHeight] }}
                    />)}
                </g>
            </svg >
        </div >
    )
}