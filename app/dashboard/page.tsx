import { fetchDashboardData, getInputsFromCache } from "@/actions/data";
import Chart from "./components/Chart";
import Map from "./components/Map";
import DataTable from "./components/DataTable";
import { CalculatorProvider } from "./context/CalculatorProvider";

export default async function Dashboard() {
    const inputsResult = await getInputsFromCache();
    const { success, data: dashboardData, error } = await fetchDashboardData(inputsResult.data);
    // display error page
    if (!dashboardData) {
        return
    }
    return (
        <div className="space-y-12">
            <CalculatorProvider cacheData={inputsResult.data}>
                <DataTable />
                <Map data={dashboardData} />
                <Chart data={dashboardData} />
            </CalculatorProvider>
            <br></br>
        </div>
    )
}





