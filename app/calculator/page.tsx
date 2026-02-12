"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import SearchableMap from "./components/SearchableMap";
import PlacesAutocomplete from './components/PlacesAutocomplete';
import DrawingTool from './components/DrawingTool';
import SolarArrayForm from "./components/SolarArrayForm";
import { storeInputsInCache, readInputsFromDb, storeInputsInDb } from "@/actions/data";
import { type FormInputs } from "@/app/types/types";
import toast, { Toaster } from "react-hot-toast";
import { string } from "zod";

export default function Calculator() {
    const initInputs: FormInputs = {
        address: '',
        location: null,
        solarArrays: [],
    };
    enum FormStatus { Success, Error, Pending };
    const [inputs, setInputs] = useState<FormInputs>(initInputs);
    const [status, setStatus] = useState<{ value: FormStatus; details: any; }>();
    const [activeId, setActiveId] = useState(1);
    const [isAuth, setIsAuth] = useState(false);
    const router = useRouter();
    useEffect(() => {
        // check cache or database for data and populate the form
        const initForm = async () => {
            const { isAuth, data } = await readInputsFromDb();

            setIsAuth(isAuth);
            if (!data) return
            const storedInputs: FormInputs = {
                address: data.address,
                location: { lat: parseFloat(data.lat), lng: parseFloat(data.lng) },
                solarArrays: data.solarArrays,
            }
            setInputs(storedInputs);
        }
        initForm();
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
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus({ value: FormStatus.Pending, details: 'Form submission started' });
        const formData = {
            address: inputs.address,
            lat: String(inputs.location?.lat || ""),
            lng: String(inputs.location?.lng || ""),
            solarArrays: inputs.solarArrays
        };
        const cacheResult = await storeInputsInCache(formData)

        if (cacheResult.success) {
            // navigate to dashboard
            router.push('/dashboard');
        } else {
            toast.error('Error')
            // let user know there was an error
            setStatus({
                value: cacheResult.success ? FormStatus.Success : FormStatus.Error,
                details: cacheResult.details
            })
        }
    }

    const handleSave = async () => {
        const lat = inputs.location?.lat.toString() || "";
        const lng = inputs.location?.lng.toString() || "";
        setStatus({ value: FormStatus.Pending, details: 'Started saving changes' });
        const result = await storeInputsInDb(inputs.address, lat, lng, inputs.solarArrays);

        if (!result.success) toast.error('Failed to save');
        else toast.success('Save successful');
        setStatus({
            value: result.success ? FormStatus.Success : FormStatus.Error,
            details: result.details
        });
    }

    return (
        <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <div><Toaster /></div>
                {(status?.value === FormStatus.Error) &&
                    <p className="text-red-500 text-sm text-center">
                        {(status?.details?.fieldErrors?.lat || status?.details?.fieldErrors?.lng) ?
                            'Enter an address and select an option from the dropdown.' :
                            status?.details}
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
            <div className="flex flex-col items-center justify-center sm:text-lg space-y-3 sm:text-xl">
                {(status?.value === FormStatus.Error) &&
                    (status?.details?.fieldErrors?.address || status?.details?.fieldErrors?.solarArrays)
                    && <p className="text-red-500 text-sm">
                        Enter an address at the top and add one or more polygons as solar arrays.
                    </p>
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
