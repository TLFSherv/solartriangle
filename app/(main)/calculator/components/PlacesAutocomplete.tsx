import React, { useState, useEffect, useCallback } from 'react';
import { AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import SuggestionsDropdown from './SuggestionsDropdown';

type Suggestion = {
    placePrediction: {
        placeId: string;
        text: { text: string };
    };
};
const PlacesAutocomplete = () => {
    const [address, setAddress] = useState<string>('');
    const [debouncedString, setDebouncedString] = useState<string | undefined>();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isActive, setIsActive] = useState(false);
    const map = useMap();
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY as string;

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
            <AdvancedMarker key={address} position={location} />
            <div className="mb-14 flex flex-col justify-center items-center max-w-xl mx-auto">
                <label className='space-x-2 w-full'>
                    <span className='text-sm'>Address:</span>
                    <input
                        value={address}
                        placeholder='5 Paget ...'
                        onChange={e => setAddress(e.target.value)}
                        onFocus={() => setIsActive(true)}
                        name="address"
                        className="py-1 px-2 bg-[#444444] rounded-md w-4/5"
                        type="text"
                        autoComplete="off" />
                </label>
                {isActive && suggestions.length > 0 && (
                    <SuggestionsDropdown
                        suggestions={suggestions}
                        setAddress={setAddress}
                        setSuggestions={setSuggestions}
                        setLocation={setLocation}
                        setIsActive={setIsActive}
                    />
                )}
            </div>
        </>
    )

};

export default PlacesAutocomplete