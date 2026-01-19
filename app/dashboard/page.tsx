import { fetchData, getCachedData } from "@/actions/data";
import Chart from "./components/Chart";
import Map from "./components/Map";
import DataTable from "./components/DataTable";
import { MapProvider } from "./context/MapProvider";

export default async function Dashboard() {
    const data = await fetchData();
    const cacheResult = await getCachedData('calculatorData');

    return (
        <div className="space-y-12">
            <DataTable />
            <MapProvider cacheData={cacheResult.data}>
                <Map data={data} />
            </MapProvider>
            <Chart data={data} />
            <br></br>
        </div>
    )
}





