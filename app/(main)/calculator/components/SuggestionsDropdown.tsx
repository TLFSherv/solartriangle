import React from "react";

type Suggestion = {
    placePrediction: {
        placeId: string;
        text: { text: string };
    };
};

type Location = { lat: number; lng: number; };

export default function SuggestionsDropdown(props:
    {
        suggestions: Suggestion[],
        setAddress: React.Dispatch<React.SetStateAction<string>>,
        setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
        setLocation: React.Dispatch<React.SetStateAction<Location | null>>,
        setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
    }) {
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY as string;
    const { suggestions, setAddress, setSuggestions, setLocation, setIsActive } = props;

    async function selectPlace(placeId: string, text: string) {
        setAddress(text);
        setSuggestions([]);
        setIsActive(false);
        const response = await fetch(
            `https://places.googleapis.com/v1/places/${placeId}?fields=location&key=${apiKey}`
        );

        const data = await response.json();
        if (!data.location) return;

        const newLoc = {
            lat: data.location.latitude,
            lng: data.location.longitude
        };
        setLocation(newLoc);
    }

    return (
        <div className="w-4/5 mt-1">
            <ul className="text-sm divide-y divide-[#444444] mx-4 w-full">
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
                                )
                            }>{name}</li>
                    );
                })}
            </ul>
        </div>
    )
}