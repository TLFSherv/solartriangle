import { fetchData, getCachedData } from "@/actions/data";
import Chart from "./components/Chart";
import Map from "./components/Map";
import DataTable from "./components/DataTable";
import { CalculatorProvider } from "./context/CalculatorProvider";

export default async function Dashboard() {
    const cacheResult = await getCachedData('calculatorData');
    const fetchResult = await fetchData(cacheResult.data);

    return (
        <div className="space-y-12">
            <CalculatorProvider cacheData={cacheResult.data}>
                <DataTable />
                <Map data={fetchResult.data} />
            </CalculatorProvider>
            <Chart data={fetchResult.data} />
            <br></br>
        </div>
    )
}





