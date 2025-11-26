"use client"
import { useSearchParams } from "next/navigation"
import React, { useEffect } from "react";

export default function Dashboard() {
    const searchParams = useSearchParams();

    // const params = {
    //     address: searchParams.get("address"),
    //     lat: searchParams.get("lat"),
    //     lng: searchParams.get("lng"),
    //     area: searchParams.get("area"),
    //     azimuth: searchParams.get("azimuth"),
    //     capacity: searchParams.get("capacity"),
    //     quantity: searchParams.get("quantity")
    // };

    const params = {
        address: "8 Link Ln",
        lat: "32.3452828",
        lng: "-64.7250711",
        area: "42",
        azimuth: "16",
        capacity: "400",
        quantity: "4",
        tilt: "30"
    };
    const api_key = process.env.NEXT_PUBLIC_NREL_API_KEY;
    const url = `https://developer.nrel.gov/api/pvwatts/v8.json?api_key=${api_key}&azimuth=${params.azimuth}&system_capacity=${params.capacity}&module_type=0&losses=14&array_type=1&tilt=${params.tilt}&lat=${params.lat}&lon=${params.lng}`;
    useEffect(() => {
        const fetchSolarData = async () => {
            const resp = await fetch(url)
            const json = await resp.json();
            console.log(json);
        }
        fetchSolarData();

    }, [params])

    return (
        <h1>Anonymous users dashboard</h1>
    )
}

