import React, { useState, useEffect, useRef, ReactEventHandler } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import SuggestionsDropdown from './SuggestionsDropdown';
import { FormInputs, Suggestion } from "@/app/types/types";

const PlacesAutocomplete = (props:
    {
        inputs: FormInputs,
        setInputs: React.Dispatch<React.SetStateAction<FormInputs>>,
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    }) => {
    const [debouncedString, setDebouncedString] = useState<string | undefined>();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isActive, setIsActive] = useState(false);
    const searchContainer = useRef<HTMLDivElement>(null);
    const { address, location } = props.inputs;
    const map = useMap();
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY as string;
    console.log(location)
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

    // hide suggestions when you click outside suggestions boc
    useEffect(() => {
        const outsideClickHandler = (e: MouseEvent) => {
            if (searchContainer.current &&
                !searchContainer.current.contains(e.target as Node))
                setIsActive(false);
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
                `https://places.googleapis.com/v1/places:autocomplete`,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "X-Goog-Api-Key": apiKey
                    },
                    body: JSON.stringify({
                        input,
                        regionCode: "bm",
                        locationRestriction: {
                            circle: {
                                center: { latitude: 32.3078, longitude: -64.7505 },
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
    return (
        <>
            <div
                ref={searchContainer}
                className="mb-14 flex flex-col justify-center items-center max-w-xl mx-auto">
                <label className='space-x-2 w-full'>
                    <span>Address:</span>
                    <input
                        value={address}
                        placeholder='5 Paget ...'
                        onChange={props.handleChange}
                        onFocus={() => setIsActive(true)}
                        name="address"
                        className="py-1 px-2 bg-[#444444] rounded-md w-4/5 h-[40px]"
                        type="text"
                        autoComplete="off" />
                </label>
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