import getData from "./lib/getData";
import Chart from "./components/Chart";
import Map from "./components/Map";

export default async function Dashboard() {
    const data = await getData();
    return (
        <div className="space-y-8">
            <Map data={data} />
            <Chart data={data} />
            <br></br>
        </div>
    )
}



