"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation";
import SearchableMap from "./components/SearchableMap";
import PlacesAutocomplete from './components/PlacesAutocomplete';
import DrawingTool from './components/DrawingTool';
import SolarArrayForm from "./components/SolarArrayForm";
import { getPolygonArea, getPolygonAzimuth } from "./lib/geometryTool";

type FormInputs = {
    address: string;
    location: { lat: number; lng: number } | null;
    polygons: { id: number; polygon: google.maps.Polygon }[];
    solarArrays: SolarArray[];
}
type SolarArray = {
    id: number;
    solarCapacity: number;
    numberOfPanels: number;
    area: number;
    azimuth: number;
    shape: google.maps.LatLng[];
}

export default function Calculator() {
    const initInputs: FormInputs = {
        address: '',
        location: null,
        polygons: [],
        solarArrays: [{
            id: 0,
            area: 0,
            azimuth: 0,
            solarCapacity: 0,
            numberOfPanels: 0,
            shape: []
        }]
    };
    const [inputs, setInputs] = useState<FormInputs>(initInputs);
    const [activeId, setActiveId] = useState(0);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputs.polygons) return

        const result = inputs.solarArrays.map((item, i) => {
            const { id, polygon } = inputs.polygons[i];
            if (id !== item.id) return;
            return {
                id: id,
                area: Number(getPolygonArea(polygon).toFixed(2)),
                azimuth: Number(getPolygonAzimuth(polygon).toFixed(2)),
                solarCapacity: item.solarCapacity,
                numberOfPanels: item.numberOfPanels,
                shape: polygon.getPath().getArray(),
            }
        });

        const data = {
            address: inputs.address,
            lat: String(inputs.location?.lat),
            lng: String(inputs.location?.lng),
            solarArrays: result
        };

        localStorage.setItem("calculatorData", JSON.stringify(data));
        // navigate to dashboard
        router.push('/dashboard');
    }

    return (
        <form className="space-y-10" onSubmit={handleSubmit}>
            <div>
                <SearchableMap>
                    <PlacesAutocomplete
                        inputs={inputs}
                        setInputs={setInputs}
                        handleChange={handleChange} />
                    <DrawingTool
                        inputs={inputs}
                        setInputs={setInputs} />
                </SearchableMap>
            </div>
            <SolarArrayForm
                inputs={inputs}
                setInputs={setInputs}
                activeId={activeId}
                setActiveId={setActiveId}
            />
            <div className="flex justify-center text-lg sm:text-xl">
                <button
                    type="submit"
                    className="py-4 px-6 rounded-2xl cursor-pointer tracking-wider bg-linear-[#DD6B19,#F0662A] w-xs">
                    Go to Dashboard
                </button>
            </div>
        </form>
    )
}