import React, { useState, useEffect, useRef } from 'react';
import { AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import SuggestionsDropdown from './SuggestionsDropdown';
import { LocationData, CalculatorData, Suggestion, WarningStatus } from "@/app/types/types";
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
    const [isDropdownActive, setIsDropdownActive] = useState({ countryDropdown: false, addressDropdown: false });
    const [countryRaw, setCountryRaw] = useState<string>(location.country);
    const [countryDropdown, setCountryDropdown] = useState<string[]>();
    const [changeWarning, setChangeWarning] = useState<WarningStatus>(WarningStatus.Inactive);
    const searchContainer = useRef<HTMLDivElement>(null);
    const { address, addressCoords } = location;
    const map = useMap();
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY as string;
    const countryMapRef = useRef<Map<string, Country>>(new Map<string, Country>());
    const intervalIdRef = useRef<NodeJS.Timeout>(null);

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
            // display warnings that changing country will reset the form 
            // after an address has been selected
            address && setChangeWarning(WarningStatus.Active);
        }
    }, [addressCoords])

    // hide suggestions when you click outside suggestions box
    useEffect(() => {
        const outsideClickHandler = (e: MouseEvent) => {
            if (searchContainer.current &&
                !searchContainer.current.contains(e.target as Node))
                setIsDropdownActive({ countryDropdown: false, addressDropdown: false });
        }
        document.addEventListener('click', outsideClickHandler);
        return () => document.removeEventListener('click', outsideClickHandler);
    }, [])

    // fetch auto-suggestion results
    useEffect(() => {
        if (!debouncedString || !isDropdownActive) return;
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
        if (changeWarning === WarningStatus.Execute) return

        let value = e.target.value.toLowerCase();
        value = value.split(" ").map(val => [val.charAt(0).toUpperCase() + val.slice(1)]).join(" ");
        const recommendedValues: string[] = [];
        for (let [key, _] of countryMapRef.current) {
            if (key.startsWith(value) || key.includes(value)) {
                recommendedValues.unshift(key);
            } else {
                recommendedValues.push(key);
            }
        }
        setCountryRaw(value);
        if (countryMapRef.current.has(value)) {
            handleCountrySelect(value);
            return
        }
        setCountryDropdown(recommendedValues);
        setIsDropdownActive({ countryDropdown: true, addressDropdown: false });
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
        setIsDropdownActive({ countryDropdown: false, addressDropdown: false });
        map?.setCenter(countryCoords);
    }

    function showChangeWarning() {
        if (changeWarning === WarningStatus.Active) {
            if (intervalIdRef.current) clearInterval(intervalIdRef.current);
            setChangeWarning(WarningStatus.Execute);
            intervalIdRef.current = setInterval(() => {
                setCountryRaw(location.country);
                setChangeWarning(WarningStatus.Active);
            }, 5000);
        }
        else if (changeWarning === WarningStatus.Execute) {
            if (intervalIdRef.current) clearInterval(intervalIdRef.current);
            setChangeWarning(WarningStatus.Inactive);
            setCountryRaw(location.country);
            setIsDropdownActive({ countryDropdown: true, addressDropdown: false });
            // reset form
            setInputs((prev) => ({
                solarArrays: [],
                location: {
                    ...prev.location,
                    address: "",
                    //addressCoords: { lat: 0, lng: 0 }
                }
            }));
            // erase all polygons

            map?.setZoom(13);
            map?.setCenter(location.countryCoords);
            return
        }
    }
    return (
        <>
            <AdvancedMarker key={address} position={addressCoords} />
            <div ref={searchContainer} className="mb-10 sm:mb-14 mx-auto max-w-xl space-y-4">
                <div className='w-full flex flex-col justify-center items-center'>
                    {changeWarning === WarningStatus.Execute && <p className='text-red-500 text-sm font-semi-bold py-1'>
                        Editing will reset the form, click again to continue.
                    </p>}
                    <label className='w-full space-x-2'>
                        <span className='hidden sm:inline'>Country</span>
                        <input
                            value={countryRaw}
                            onChange={handleCountryChange}
                            onClick={() => showChangeWarning()}
                            placeholder='Country'
                            onFocus={() => setIsDropdownActive({ countryDropdown: !(changeWarning === WarningStatus.Active), addressDropdown: false })}
                            name="country"
                            className={`py-1 text-base px-2 border-2 rounded-md h-9 sm:h-10 w-full sm:w-4/5 ${countryMapRef.current.has(countryRaw) && "border-[#FF8D28]"} ${(changeWarning === WarningStatus.Execute) && "border-[#FF2D55]"}`}
                            type="text"
                            autoComplete="off" />
                    </label>
                    {isDropdownActive.countryDropdown &&
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
                            onFocus={() => setIsDropdownActive({ countryDropdown: false, addressDropdown: true })}
                            name="address"
                            className="py-1 px-2 border-2 border-[#444444] rounded-md w-full sm:w-4/5 h-9 sm:h-10"
                            type="text"
                            autoComplete="off" />
                    </label>
                    {isDropdownActive.addressDropdown && suggestions.length > 0 && (
                        <SuggestionsDropdown
                            suggestions={suggestions}
                            location={location}
                            setInputs={setInputs}
                            setSuggestions={setSuggestions}
                            setIsDropdownActive={setIsDropdownActive}
                        />
                    )}
                </div>
            </div>
        </>
    )

};

export default PlacesAutocomplete