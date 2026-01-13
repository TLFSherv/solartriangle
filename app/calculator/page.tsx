"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation";
import SearchableMap from "./components/SearchableMap";
import PlacesAutocomplete from './components/PlacesAutocomplete';
import DrawingTool from './components/DrawingTool';
import SolarArrayForm from "./components/SolarArrayForm";
import { FormInputs } from "./types/types";

export default function Calculator() {
    const initInputs: FormInputs = {
        address: '',
        location: null,
        polygons: [],
        solarArrays: []
    };
    const [inputs, setInputs] = useState<FormInputs>(initInputs);
    const [activeId, setActiveId] = useState(1);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputs.polygons) return

        const formData = {
            address: inputs.address,
            lat: String(inputs.location?.lat),
            lng: String(inputs.location?.lng),
            solarArrays: inputs.solarArrays
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
                        setInputs={setInputs}
                        activeId={activeId}
                        setActiveId={setActiveId} />
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