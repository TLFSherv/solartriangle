"use client"
import React, { useState, useRef } from "react"
import SearchableMap from "./components/SearchableMap";
import PlacesAutocomplete from './components/PlacesAutocomplete';
import DrawingTool from './components/DrawingTool';

type FormInputs = {
    address: string;
    location: { lat: number; lng: number } | null;
    area: number;
    azimuth: number;
    capacity: number;
    quantity: number
}
export default function Calculator() {
    const initInputs: FormInputs = {
        address: '',
        location: null,
        area: 0,
        azimuth: 0,
        capacity: 0,
        quantity: 0
    };
    const [inputs, setInputs] = useState<FormInputs>(initInputs);
    const mapRef = useRef<HTMLDivElement | null>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(inputs);
    }
    return (
        <form className="space-y-10" onSubmit={handleSubmit}>
            <SearchableMap>
                <PlacesAutocomplete
                    inputs={inputs}
                    setInputs={setInputs}
                    handleChange={handleChange} />
                <DrawingTool
                    inputs={inputs}
                    setInputs={setInputs} />
            </SearchableMap>
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