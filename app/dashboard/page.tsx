import { getDashboardData, getCachedCalculatorData } from "@/actions/data";
import Chart from "./components/Chart";
import Map from "./components/Map";
import SolarArrayTable from "./components/SolarArrayTable";
import { CalculatorProvider } from "./context/CalculatorProvider";

export default async function Dashboard() {
    const cacheResult = await getCachedCalculatorData();
    if (cacheResult.error) throw new Error("Data error");

    const { data, error } = await getDashboardData(cacheResult.data);
    if (error) throw new Error("Data error");

    return (
        <div className="space-y-12">
            <CalculatorProvider cachedCaclulatorData={cacheResult.data}>
                <SolarArrayTable />
                <Map data={data} />
                <Chart data={data} />
            </CalculatorProvider>
            <br></br>
        </div>
    )
}





