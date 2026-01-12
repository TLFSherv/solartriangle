import getData from "./lib/getData";
import Chart from "./components/Chart";
import Map from "./components/Map";
import DataTable from "./components/DataTable";

export default async function Dashboard() {
    const data = await getData();
    return (
        <div className="space-y-12">
            <DataTable />
            <Map data={data} />
            <Chart data={data} />
            <br></br>
        </div>
    )
}





