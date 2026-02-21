"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import SearchableMap from "./components/SearchableMap";
import PlacesAutocomplete from './components/PlacesAutocomplete';
import DrawingTool from './components/DrawingTool';
import SolarArrayForm from "./components/SolarArrayForm";
import { isLoggedIn, cacheCalculatorData, getCalculatorData, setCalculatorData } from "@/actions/data";
import { type FormInputs } from "@/app/types/types";
import toast, { Toaster } from "react-hot-toast";

export default function Calculator() {
    enum FormStatus { Success, Error, Pending };
    const [inputs, setInputs] = useState<FormInputs>({ address: '', location: null, solarArrays: [] });
    const [status, setStatus] = useState<{ value: FormStatus; details: any; }>();
    const [activeId, setActiveId] = useState(1);
    const [isAuth, setIsAuth] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // check cache or database for data and pre-populate the form
        const initForm = async () => {
            const authResult = await isLoggedIn();
            if (authResult.data) setIsAuth(authResult.data);

            const { data } = await getCalculatorData();
            if (!data) return;

            const intputData: FormInputs = {
                address: data.address,
                solarArrays: data.solarArrays,
                location: {
                    lat: parseFloat(data.lat),
                    lng: parseFloat(data.lng)
                }
            }
            setInputs(intputData);
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
        const { address, location, solarArrays } = inputs;
        const latLng = {
            lat: String(location?.lat),
            lng: String(location?.lng),
        };
        const result = await cacheCalculatorData({ address, solarArrays, ...latLng });

        // display error
        if (result.error) {
            toast.error('Error');
            setStatus({
                value: result.error ? FormStatus.Success : FormStatus.Error,
                details: result.error.message
            });
        }
        else router.push('/dashboard');  // navigate to dashboard 
    }

    const handleSave = async () => {
        const { location, address, solarArrays } = inputs;
        const lat = location?.lat.toString() as string;
        const lng = location?.lng.toString() as string;
        setStatus({ value: FormStatus.Pending, details: 'Started saving changes' });
        const result = await setCalculatorData({ address, lat, lng, solarArrays });

        if (result.error) toast.error('Failed to save');
        else toast.success('Save successful');
        setStatus({
            value: result.data ? FormStatus.Success : FormStatus.Error,
            details: result.error?.message
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
