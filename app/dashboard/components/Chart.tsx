import Axis from "./Axis"
import useChartDimensions from "../hooks/useChartDimensions"
import Points from "./Points";
type PointsParams =
    {
        settings: { height: number; width: number };
        domain: { x: [number, number]; y: [number, number] };
        range: { x: [number, number]; y: [number, number] };
    }

export default function Chart() {
    const chartSettings = { width: 0, height: 0 }
    const [ref, dms] = useChartDimensions(chartSettings);
    const position = { x: 15, y: 0 } // origin position
    const margin_x = 8;
    const margin_y = 30;
    const boundedWidth = dms.width - position.x - margin_x; // margin-x = 10
    const boundedHeight = dms.height - position.y - margin_y; // margin-y = 30

    return (
        <div ref={ref as React.Ref<HTMLDivElement>} className="w-3/4 h-[300px] mx-auto">
            <svg width={dms.width} height={dms.height}>
                <g transform={`translate(${position.x},${position.y})`}>
                    <Axis
                        type={"x"}
                        domain={[0, 100]}
                        range={[10, boundedWidth]}
                    />
                    <Axis
                        type={"y"}
                        domain={[0, 100]}
                        range={[10, boundedHeight]}
                    />
                    <Points
                        settings={{ height: boundedHeight, width: boundedWidth }}
                        domain={{ x: [0, 100], y: [0, 100] }}
                        range={{ x: [10, boundedWidth], y: [10, boundedHeight] }}
                    />
                </g>
            </svg>
        </div>
    )
}