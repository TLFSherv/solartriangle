import React, { useState, useEffect, useRef, ReactEventHandler } from 'react';
import { AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import SuggestionsDropdown from './SuggestionsDropdown';
import { FormInputs, Suggestion } from "@/app/types/types";

type Countries = "Bermuda" | "Nigeria" | "United Kingdom";
type CountryCodes = "bm" | "ng" | "uk";
const PlacesAutocomplete = (props:
    {
        inputs: FormInputs,
        setInputs: React.Dispatch<React.SetStateAction<FormInputs>>,
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    }) => {
    const [debouncedString, setDebouncedString] = useState<string | undefined>();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isActive, setIsActive] = useState({ countryInput: false, addressInput: false });
    const [country, setCountry] = useState<string>();
    const [availableCountries, setAvailableCountries] = useState<Countries[]>(["Bermuda", "Nigeria", "United Kingdom"]);
    const searchContainer = useRef<HTMLDivElement>(null);
    const { address, location } = props.inputs;
    const map = useMap();
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY as string;
    const countryMap = new Map<Countries, CountryCodes>()
    countryMap.set("Bermuda", "bm");
    countryMap.set("Nigeria", "ng");
    countryMap.set("United Kingdom", "uk");

    useEffect(() => {
        // debouce search string
        if (!address || address.trim().length === 0
            || address === debouncedString) return;

        const timeoutId = setTimeout(() => {
            setDebouncedString(address);
        }, 300);

        return () => { clearTimeout(timeoutId); }
    }, [address]);

    useEffect(() => {
        // Pan map using the map instance
        if (location) {
            map?.panTo(location);
            map?.setZoom(18);
        }
    }, [location])

    // hide suggestions when you click outside suggestions box
    useEffect(() => {
        const outsideClickHandler = (e: MouseEvent) => {
            if (searchContainer.current &&
                !searchContainer.current.contains(e.target as Node))
                setIsActive({ countryInput: false, addressInput: false });
        }
        document.addEventListener('click', outsideClickHandler);
        return () => document.removeEventListener('click', outsideClickHandler);
    }, [])

    // fetch auto-suggestion results
    useEffect(() => {
        if (!debouncedString || !isActive) return;
        async function getAutocompleteResults(input: string) {
            if (!input) return setSuggestions([]);
            const countryCenters: { [key: string]: { latitude: number; longitude: number } } = {
                bm: { latitude: 32.3078, longitude: -64.7505 },
                ng: { latitude: 9.05785, longitude: 7.49508 }
            };
            let regionCode = "bm";
            if (country && countryMap.has(country as Countries)) {
                regionCode = countryMap.get(country as Countries) as string;
            }
            const response = await fetch(
                `https://places.googleapis.com/v1/places:autocomplete`,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "X-Goog-Api-Key": apiKey
                    },
                    body: JSON.stringify({
                        input,
                        regionCode,
                        locationRestriction: {
                            circle: {
                                center: countryCenters[regionCode],
                                radius: 20000
                            }
                        },
                        includedPrimaryTypes: ["geocode", "locality", "street_address"]
                    })
                }
            );

            const data = await response.json();
            setSuggestions(data.suggestions || []);
        }
        getAutocompleteResults(debouncedString);
    }, [debouncedString]);

    function handleCountryChange(e: React.ChangeEvent<HTMLInputElement>) {
        let value = e.target.value.toLowerCase();
        value = value.split(" ").map(val => [val.charAt(0).toUpperCase() + val.slice(1)]).join(" ");
        const closeValues: Countries[] = [];
        const diffValues: Countries[] = [];
        for (let [country, _] of countryMap) {
            if (country.startsWith(value) || country.includes(value)) {
                closeValues.push(country);
            } else {
                diffValues.push(country);
            }
        }
        setAvailableCountries(closeValues.concat(diffValues));
        setCountry(value);
        setIsActive({ countryInput: true, addressInput: false });
    }

    function handleCountrySelect(country: Countries) {
        setCountry(country);
        setIsActive({ countryInput: false, addressInput: false });
    }
    return (
        <>
            <AdvancedMarker key={address} position={location} />
            <div
                ref={searchContainer}
                className="mb-10 sm:mb-14 flex flex-col justify-center items-center mx-auto max-w-xl space-y-4">
                <div className='space-x-2 w-full'>
                    <label className='hidden sm:inline'>
                        Country
                    </label>
                    <input
                        value={country}
                        onChange={handleCountryChange}
                        placeholder='Country'
                        onFocus={() => setIsActive({ countryInput: true, addressInput: false })}
                        name="address"
                        className={`py-1 px-2 border-2 border-[#444444] rounded-md w-full sm:w-4/5 h-9 sm:h-10 ${countryMap.has(country as Countries) && "border-[#FF8D28]"}`}
                        type="text"
                        autoComplete="off" />
                    {isActive.countryInput &&
                        <ul className="text-sm divide-y divide-[#444444] sm:mx-4 w-full text-[#F2F2F0]">
                            {availableCountries.map((country) =>
                                <li className="cursor-pointer p-2 hover:bg-[#131314]"
                                    onClick={() => handleCountrySelect(country)}>{country}</li>
                            )}
                        </ul>
                    }
                </div>
                <div className='space-x-2 w-full'>
                    <label className='hidden sm:inline'>
                        Address
                    </label>
                    <input
                        value={address}
                        placeholder='Address'
                        onChange={props.handleChange}
                        onFocus={() => setIsActive({ countryInput: false, addressInput: true })}
                        name="address"
                        className="py-1 px-2 border-2 border-[#444444] rounded-md w-full sm:w-4/5 h-9 sm:h-10"
                        type="text"
                        autoComplete="off" />
                </div>
                {isActive && suggestions.length > 0 && (
                    <SuggestionsDropdown
                        suggestions={suggestions}
                        inputs={props.inputs}
                        setInputs={props.setInputs}
                        setSuggestions={setSuggestions}
                        setIsActive={setIsActive}
                    />
                )}
            </div>
        </>
    )

};

export default PlacesAutocomplete