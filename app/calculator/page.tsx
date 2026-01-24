"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import SearchableMap from "./components/SearchableMap";
import PlacesAutocomplete from './components/PlacesAutocomplete';
import DrawingTool from './components/DrawingTool';
import SolarArrayForm from "./components/SolarArrayForm";
import { FormInputs, SolarArray } from "@/app/types/types";
import { cacheData, cacheExists, getCachedData } from "@/actions/data";

export default function Calculator() {
    const initInputs: FormInputs = {
        address: '',
        location: null,
        polygons: [],
        solarArrays: []
    };

    const [inputs, setInputs] = useState<FormInputs>(initInputs);
    const [error, setError] = useState<{ success: boolean; details: any; }>();
    const [activeId, setActiveId] = useState(1);
    const router = useRouter();

    useEffect(() => {
        const populateForm = async () => {
            const exists = await cacheExists('calculatorData');
            if (!exists) return

            const cacheResult = await getCachedData('calculatorData');
            const data = cacheResult.data;
            let inputs: FormInputs = {
                address: data.address,
                location: new google.maps.LatLng(data.lat, data.lng),
                polygons: data.solarArrays.map(({ shape, id }: SolarArray) => {
                    return {
                        id,
                        polygon: new google.maps.Polygon({
                            paths: shape,
                            strokeColor: id === 1 ? "#F0662A" : "#1E1E1E",
                            fillColor: "#444444",
                            fillOpacity: 0.25,
                            draggable: true,
                            editable: true,
                        })
                    }
                }),
                solarArrays: data.solarArrays
            }

            setInputs(inputs);
        }
        populateForm();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = {
            address: inputs.address,
            lat: String(inputs.location?.lat() || ""),
            lng: String(inputs.location?.lng() || ""),
            solarArrays: inputs.solarArrays
        };
        const cacheResult = await cacheData("calculatorData", formData)
        console.log(formData);
        if (cacheResult.success) {
            // navigate to dashboard
            router.push('/dashboard');
        } else {
            // let user know there was an error
            setError(cacheResult);
        }
    }

    return (
        <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-2">
                {!error?.success &&
                    (error?.details.fieldErrors.lat || error?.details.fieldErrors.lng)
                    && <p className="text-red-500 text-sm text-center">
                        Enter an address and select an option from the dropdown.
                    </p>
                }
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
            <div className="flex flex-col items-center justify-center text-lg space-y-2 sm:text-xl">
                {!error?.success &&
                    (error?.details.fieldErrors.address || error?.details.fieldErrors.solarArrays)
                    && <p className="text-red-500 text-sm">
                        Enter an address at the top and add one or more polygons as solar arrays.
                    </p>
                }
                <button
                    type="submit"
                    className="py-4 px-6 rounded-2xl cursor-pointer tracking-wider bg-linear-[#DD6B19,#F0662A] w-xs">
                    Go to Dashboard
                </button>
            </div>
        </form>
    )
}