import { fetchWeatherApi } from "openmeteo";
import { type SolarAPIParams } from "@/app/types/types";

export const getPVWattsData = async (input: SolarAPIParams) => {
    const { lat, lng, tilt, azimuth, capacity } = input;
    const api_key = process.env.NEXT_PUBLIC_NREL_API_KEY;
    const url = `https://developer.nrel.gov/api/pvwatts/v8.json?api_key=${api_key}&azimuth=${azimuth}&system_capacity=${capacity}&module_type=0&losses=14&array_type=1&tilt=${tilt}&lat=${lat}&lon=${lng}&timeframe=hourly`;
    try {
        const result = await fetch(url, { next: { revalidate: 600 } });
        return await result.json();
    } catch (err) {
        throw err;
    }
}

export const getOpenMetoData = async (input: SolarAPIParams) => {
    const { lat: latitude, lng: longitude, tilt, azimuth, timeZone } = input;
    const apiParams = {
        latitude,
        longitude,
        hourly: ["temperature_2m", "global_tilted_irradiance", "wind_speed_10m"],
        timezone: timeZone,
        tilt,
        azimuth: azimuth > 180 ? azimuth - 360 : azimuth, // convert to range -180 to 180 degrees
        past_days: 3,
        forecast_minutely_15: 96 // the number of 15min time steps the data is controlled
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    try {
        const result = await fetchWeatherApi(url, apiParams);
        const utcOffsetSeconds = result[0].utcOffsetSeconds();
        const hourly = result[0].hourly()!;

        // Note: The order of weather variables in the URL query and the indices below need to match!
        return {
            hourly: {
                time: Array.from(
                    { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
                    (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
                ),
                temperature_2m: hourly.variables(0)!.valuesArray(),
                global_tilted_irradiance: hourly.variables(1)!.valuesArray(),
                wind_speed_10m: hourly.variables(2)!.valuesArray(),
            },
        };
    } catch (err) {
        throw err;
    }
}