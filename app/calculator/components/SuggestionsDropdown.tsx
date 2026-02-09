import React from "react";
import { FormInputs, Suggestion } from "@/app/types/types";

export default function SuggestionsDropdown(props:
    {
        suggestions: Suggestion[],
        inputs: FormInputs,
        setInputs: React.Dispatch<React.SetStateAction<FormInputs>>,
        setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
        setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
    }) {
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY as string;
    const { inputs, setInputs, suggestions, setSuggestions, setIsActive } = props;

    async function selectPlace(placeId: string, text: string) {
        setSuggestions([]);
        setIsActive(false);
        const response = await fetch(
            `https://places.googleapis.com/v1/places/${placeId}?fields=location&key=${apiKey}`
        );

        const data = await response.json();
        if (!data.location) return;

        setInputs({
            ...inputs,
            ['address']: text,
            ['location']: { lat: data.location.latitude, lng: data.location.longitude }
        });
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