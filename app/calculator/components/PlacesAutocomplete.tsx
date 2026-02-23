import React, { useState, useEffect, useRef } from 'react';
import { AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import SuggestionsDropdown from './SuggestionsDropdown';
import { LocationData, CalculatorData, Suggestion } from "@/app/types/types";
import { Country } from '@/src/db/schema';

const PlacesAutocomplete = ({ location, setInputs, handleChange, countryData }:
    {
        location: LocationData,
        setInputs: React.Dispatch<React.SetStateAction<CalculatorData>>,
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        countryData: Country[]
    }) => {
    const [debouncedString, setDebouncedString] = useState<string | undefined>();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isActive, setIsActive] = useState({ countryInput: false, addressInput: false });
    const [countryRaw, setCountryRaw] = useState<string>(location.country);
    const [countryDropdown, setCountryDropdown] = useState<string[]>();
    const searchContainer = useRef<HTMLDivElement>(null);
    const { address, addressCoords } = location;
    const map = useMap();
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY as string;
    const countryMapRef = useRef<Map<string, Country>>(new Map<string, Country>());

    useEffect(() => {
        countryData.forEach(data => countryMapRef.current.set(data.name, data));
        setCountryDropdown(countryMapRef.current.keys().toArray());
    }, [countryData.join(",")])

    useEffect(() => {
        setCountryRaw(location.country);
    }, [location.country])

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
        if (addressCoords) {
            map?.panTo(addressCoords);
            map?.setZoom(18);
        }
    }, [addressCoords])

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

            const response = await fetch(
                "https://places.googleapis.com/v1/places:autocomplete",
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "X-Goog-Api-Key": apiKey
                    },
                    body: JSON.stringify({
                        input,
                        regionCode: location.countryCode,
                        locationRestriction: {
                            circle: {
                                center: {
                                    latitude: location.countryCoords.lat,
                                    longitude: location.countryCoords.lng
                                },
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
        const simillarValues: string[] = [];
        const diffValues: string[] = [];
        for (let [key, _] of countryMapRef.current) {
            if (key.startsWith(value) || key.includes(value)) {
                simillarValues.push(key);
            } else {
                diffValues.push(key);
            }
        }
        setCountryRaw(value);
        if (countryMapRef.current.has(value)) {
            handleCountrySelect(value);
            return
        }
        setCountryDropdown(simillarValues.concat(diffValues));
        setIsActive({ countryInput: true, addressInput: false });
    }
    function handleCountrySelect(name: string) {
        const selectedCountry = countryMapRef.current.get(name);
        if (!selectedCountry) return
        setCountryRaw(name);
        const countryCoords = {
            lat: parseFloat(selectedCountry.latitude),
            lng: parseFloat(selectedCountry.longitude)
        };
        setInputs((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                countryCode: selectedCountry.code,
                country: selectedCountry.name,
                countryCoords,
                timeZone: selectedCountry.timeZone
            }
        }));
        setIsActive({ countryInput: false, addressInput: false });
        map?.setCenter(countryCoords);
    }

    return (
        <>
            <AdvancedMarker key={address} position={addressCoords} />
            <div ref={searchContainer} className="mb-10 sm:mb-14 mx-auto max-w-xl space-y-4">
                <div className='w-full flex flex-col justify-center items-center'>
                    <label className='w-full space-x-2'>
                        <span className='hidden sm:inline'>Country</span>
                        <input
                            value={countryRaw}
                            onChange={handleCountryChange}
                            placeholder='Country'
                            onFocus={() => setIsActive({ countryInput: true, addressInput: false })}
                            name="country"
                            className={`py-1 px-2 border-2 border-[#444444] rounded-md h-9 sm:h-10 w-full sm:w-4/5 ${countryMapRef.current.has(countryRaw) && "border-[#FF8D28]"}`}
                            type="text"
                            autoComplete="off" />
                    </label>
                    {isActive.countryInput &&
                        <ul className="col-start-2 text-sm mx-4 divide-y divide-[#444444] text-[#F2F2F0] w-full sm:w-4/5">
                            {countryDropdown?.map((name) =>
                                <li key={name}
                                    className="cursor-pointer p-2 hover:bg-[#131314]"
                                    onClick={() => handleCountrySelect(name)}>{name}</li>
                            )}
                        </ul>
                    }
                </div>
                <div className='w-full flex flex-col justify-center items-center'>
                    <label className='w-full space-x-2'>
                        <span className='hidden sm:inline'>Address</span>
                        <input
                            value={address}
                            placeholder='Address'
                            onChange={handleChange}
                            onFocus={() => setIsActive({ countryInput: false, addressInput: true })}
                            name="address"
                            className="py-1 px-2 border-2 border-[#444444] rounded-md w-full sm:w-4/5 h-9 sm:h-10"
                            type="text"
                            autoComplete="off" />
                    </label>
                    {isActive.addressInput && suggestions.length > 0 && (
                        <SuggestionsDropdown
                            suggestions={suggestions}
                            location={location}
                            setInputs={setInputs}
                            setSuggestions={setSuggestions}
                            setIsActive={setIsActive}
                        />
                    )}
                </div>
            </div>
        </>
    )

};

export default PlacesAutocomplete