"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation";
import SearchableMap from "./components/SearchableMap";
import PlacesAutocomplete from './components/PlacesAutocomplete';
import DrawingTool from './components/DrawingTool';
import { getPolygonArea, getPolygonAzimuth } from "./lib/geometryTool";

type FormInputs = {
    address: string;
    location: { lat: number; lng: number } | null;
    area: number;
    azimuth: number;
    capacity: number;
    quantity: number;
    polygons: google.maps.Polygon[] | null;
}
type Panel = {
    polygon: google.maps.LatLng[];
    area: number;
    azimuth: number
}

export default function Calculator() {
    const initInputs: FormInputs = {
        address: '',
        location: null,
        area: 0,
        azimuth: 0,
        capacity: 0,
        quantity: 0,
        polygons: null
    };
    const [inputs, setInputs] = useState<FormInputs>(initInputs);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputs.polygons) return

        // check that polygon is at the same location as the address
        const panels: Panel[] = inputs.polygons.map((poly) => {
            return {
                polygon: poly.getPath().getArray(),
                area: Number(getPolygonArea(poly).toFixed(2)),
                azimuth: Number(getPolygonAzimuth(poly).toFixed(2))
            }
        });

        const formData = {
            address: inputs.address,
            lat: String(inputs.location?.lat),
            lng: String(inputs.location?.lng),
            area: String(inputs.area),
            azimuth: String(inputs.azimuth),
            capacity: String(inputs.capacity),
            quantity: String(inputs.quantity),
            panels: panels
        };

        localStorage.setItem("calculatorData", JSON.stringify(formData));
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
            <div className="flex flex-col justify-center gap-8 text-center max-w-xl mx-auto">
                <div className="flex-1">
                    <label htmlFor="capacity" className="block text-sm">
                        Solar capacity
                    </label>
                    <input
                        name="capacity"
                        value={inputs.capacity}
                        onChange={handleChange}
                        className="py-1 px-2 bg-[#444444] rounded-md w-4/5"
                        type="number"
                        autoComplete="false" />
                </div>
                <div className="flex-1">
                    <label htmlFor="quantity" className="block text-sm">
                        Panel quantity
                    </label>
                    <input
                        name="quantity"
                        value={inputs.quantity}
                        onChange={handleChange}
                        className="py-1 px-2 bg-[#444444] rounded-md w-4/5"
                        type="number"
                        autoComplete="false" />
                </div>
            </div>
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