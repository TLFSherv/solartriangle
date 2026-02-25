import React from "react";
import {
    WarningStatus,
    type CalculatorData,
    type Suggestion,
    type LocationData
} from "@/app/types/types";

export default function SuggestionsDropdown({
    setInputs,
    suggestions,
    setSuggestions,
    setIsDropdownActive }:
    {
        suggestions: Suggestion[],
        location: LocationData,
        setInputs: React.Dispatch<React.SetStateAction<CalculatorData>>,
        setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
        setIsDropdownActive: React.Dispatch<React.SetStateAction<{ countryDropdown: boolean; addressDropdown: boolean }>>,
    }) {

    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY as string;

    async function selectPlace(placeId: string, addressName: string) {
        setSuggestions([]);
        setIsDropdownActive({ countryDropdown: false, addressDropdown: false });
        const response = await fetch(
            `https://places.googleapis.com/v1/places/${placeId}?fields=location&key=${apiKey}`
        );

        const data = await response.json();
        if (!data.location) return;

        setInputs((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                address: addressName,
                addressCoords: {
                    lat: data.location.latitude,
                    lng: data.location.longitude
                }
            }
        }));
    }

    return (
        <div className="w-full sm:w-4/5 mt-1">
            <ul className="text-sm divide-y divide-[#444444] sm:mx-4 w-full text-[#F2F2F0]">
                {suggestions.map((s, i) => {
                    const name = s.placePrediction.text.text;
                    return (
                        <li
                            className="cursor-pointer p-2 hover:bg-[#131314]"
                            key={i}
                            onClick={() =>
                                selectPlace(
                                    s.placePrediction.placeId,
                                    s.placePrediction.text.text
                                )}
                        >{name}</li>
                    );
                })}
            </ul>
        </div>
    )
}