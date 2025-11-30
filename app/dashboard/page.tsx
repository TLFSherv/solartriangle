"use client"
import React from "react";
import useFetchData from "./hooks/useFetchData";

export default function Dashboard() {
    const data = useFetchData();
    console.log(data);
    return (
        <>
            <h1>Anonymous users dashboard</h1>
            {/* <h1>{formData.address}</h1> */}
        </>
    )
}



