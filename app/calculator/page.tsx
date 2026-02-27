"use client"
import React, { useEffect, useState, useContext } from "react"
import { useRouter } from "next/navigation";
import SearchableMap from "./components/SearchableMap";
import PlacesAutocomplete from './components/PlacesAutocomplete';
import DrawingTool from './components/DrawingTool';
import SolarArrayForm from "./components/SolarArrayForm";
import { isLoggedIn, cacheCalculatorData, getCalculatorData, setCalculatorData, getCountryData } from "@/actions/data";
import { type CalculatorData } from "@/app/types/types";
import { type Country } from "@/src/db/schema";
import toast, { Toaster } from "react-hot-toast";
import { LayoutContext } from "../context/LayoutProvider";

export default function Calculator() {
    enum FormStatus { Success, Error, Pending };
    const initInputData: CalculatorData = {
        solarArrays: [],
        location: {
            country: "Bermuda",
            countryCode: "bm",
            countryCoords: { lat: 32.3078, lng: -64.7505 },
            timeZone: "GMT-4",
            address: "",
            addressCoords: { lat: 0, lng: 0 }
        }
    }
    const [inputs, setInputs] = useState<CalculatorData>(initInputData);
    const [status, setStatus] = useState<{ value: FormStatus; details: any; }>();
    const [activeId, setActiveId] = useState(1);
    const [isAuth, setIsAuth] = useState(false);
    const [countryData, setCountryData] = useState<Country[]>([]);
    const router = useRouter();
    const { setIsDashboardMode } = useContext(LayoutContext);

    useEffect(() => {
        const initPage = async () => {
            // change page if user is logged in
            const authResult = await isLoggedIn();
            if (authResult.data) setIsAuth(authResult.data);

            // get country data for country dropdown
            const countryResult = await getCountryData();
            if (countryResult.data) setCountryData(countryResult.data);
            else toast.error("Error with country dropdown");

            // check cache or database for data and pre-populate the form
            const dataResult = await getCalculatorData();

            if (!dataResult.data) {
                setIsDashboardMode(false);
                return;
            }
            setInputs(dataResult.data);
        }
        initPage();
    }, []);

    useEffect(() => {
        // reset status on input change
        if (status?.value !== FormStatus.Pending) {
            setStatus(undefined);
        }
    }, [inputs]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus({ value: FormStatus.Pending, details: 'Form submission started' });
        const result = await cacheCalculatorData(inputs);
        // display error
        if (result.error) {
            toast.error('Error generating dashboard');
            const { location, solarArrays } = result.error.message.fieldErrors;
            setStatus({
                value: result.error ? FormStatus.Error : FormStatus.Success,
                details: solarArrays.concat(location)
            });
        }
        else {
            setIsDashboardMode(true);
            router.push('/dashboard');  // navigate to dashboard 
        }
    }

    const handleSave = async () => {
        setStatus({ value: FormStatus.Pending, details: 'Started saving changes' });
        const result = await setCalculatorData(inputs);

        if (result.error) {
            toast.error('Failed to save');
            if (result.error.zodError) {
                const { location, solarArrays } = result.error.zodError;
                setStatus({
                    value: result.error ? FormStatus.Error : FormStatus.Success,
                    details: (solarArrays ?? []).concat(location ?? [])
                });
            }
        }
        else {
            toast.success('Save successful');
            setStatus({
                value: result.data ? FormStatus.Success : FormStatus.Error,
                details: null
            });
        }
    }
    return (
        <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <div><Toaster /></div>
                <SearchableMap>
                    <PlacesAutocomplete
                        location={inputs.location}
                        setInputs={setInputs}
                        handleChange={handleChange}
                        countryData={countryData} />
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
                setActiveId={setActiveId} />
            <div className="flex flex-col items-center justify-center sm:text-lg space-y-3 sm:text-xl">
                {status && status.value === FormStatus.Error &&
                    <ul>
                        {status.details.map((error: string, i: number) => (
                            <li key={i} className="text-red-500 text-sm">
                                * {error}
                            </li>)
                        )}
                    </ul>
                }
                {isAuth && <button
                    type="button"
                    className="py-3 px-6 border-2 rounded-2xl border-[#F0662A] cursor-pointer tracking-wider w-xs"
                    onClick={handleSave}
                    disabled={status?.value === FormStatus.Pending || status?.value === FormStatus.Success}>
                    {status?.value === FormStatus.Success ? "Changes saved!" : "Save changes"}
                </button>}
                <button
                    type="submit"
                    className="py-4 px-6 rounded-2xl cursor-pointer tracking-wider bg-linear-[#DD6B19,#F0662A] w-xs"
                    disabled={status?.value === FormStatus.Pending}>
                    Go to Dashboard
                </button>
            </div>
        </form>
    )
}
