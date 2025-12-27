import Axis from "./Axis"
import TimeAxis from "./TimeAxis";
import DataPoints from "./DataPoints";
import useChartDimensions from "../hooks/useChartDimensions"

type Dataset = {
    x: string[];
    y: number[];
    type: 'months' | 'hrs' | 'days';
}
export default function Chart({ dataset }: { dataset: Dataset }) {
    const chartSettings = { width: 0, height: 0 }
    const [ref, dms] = useChartDimensions(chartSettings);

    const xDomain: [number, number] = [0, dataset.x.length - 1];
    const yDomain: [number, number] = [Math.min(...dataset.y), Math.max(...dataset.y)];

    const position = { x: 38, y: 0 } // origin position
    const margin = { x: 8, y: 40 };
    const boundedWidth = dms.width - position.x - margin.x;
    const boundedHeight = dms.height - position.y - margin.y;
    const unit = dataset.type === 'months' ? 'kWh/m2' : 'Wh/m2';
    return (
        <div ref={ref as React.Ref<HTMLDivElement>} className="w-[90%] sm:w-3/4 h-[320px] mx-auto">
            <svg width={dms.width} height={dms.height}>
                <g transform={`translate(${position.x},${position.y})`}>
                    <g transform={`translate(0,${boundedHeight})`}>
                        <TimeAxis
                            x={dataset.x}
                            unit={dataset.type}
                            domain={xDomain}
                            range={[10, boundedWidth]} />
                    </g>
                    <Axis
                        type={"y"}
                        name={`poa ${unit}`}
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