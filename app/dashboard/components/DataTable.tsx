import { inputs } from "../test-data/data";
import { colors } from "../lib/dataTools"
import { FormInputs } from "@/app/types/types"

export default function DataTable() {
    const inputDataStr = localStorage.getItem("calculatorData");
    const inputs: FormInputs = JSON.parse(inputDataStr as string);

    return (
        <div className="flex flex-row justify-center">
            <table className="w-full sm:w-4/5 sm:text-lg text-left min-w-max text-gray-400 mx-4">
                <thead>
                    <tr>
                        <th className="border-b border-blue-gray-50">Name</th>
                        <th className="border-b border-blue-gray-50">Capacity</th>
                        <th className="border-b border-blue-gray-50">Quantity</th>
                        <th className="border-b border-blue-gray-50">Area</th>
                        <th className="border-b border-blue-gray-50">Azimuth</th>
                        <th className="border-b border-blue-gray-50">Color</th>
                    </tr>
                </thead>
                <tbody className="font-light">
                    {inputs.solarArrays.map((d, i) => {
                        let color = `bg-[${colors[i]}]`
                        return (<tr key={i}>
                            <td className="border-b border-blue-gray-50">Array {d.id}</td>
                            <td className="border-b border-blue-gray-50">{d.solarCapacity}</td>
                            <td className="border-b border-blue-gray-50">{d.numberOfPanels}</td>
                            <td className="border-b border-blue-gray-50">{d.area}</td>
                            <td className="border-b border-blue-gray-50">{d.azimuth}</td>
                            <td className={`border-b border-blue-gray-50 ${color}`}></td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>
    );
}